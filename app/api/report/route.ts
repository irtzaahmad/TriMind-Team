import { NextRequest, NextResponse } from 'next/server';
import { executeWithFailover } from '@/lib/gemini';
import { checkRateLimit } from '@/lib/rate-limit';
import { getReportExtractionPrompt } from '@/lib/prompts/report';
import { MedicalReportSchema } from '@/lib/schemas/report';
import { Language } from '@/types';

// PDF up to 8MB, Images up to 4MB
const MAX_PDF_SIZE = 8 * 1024 * 1024;
const MAX_IMAGE_SIZE = 4 * 1024 * 1024;
const ALLOWED_MIME_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const rateCheck = checkRateLimit(ip, 25, 60 * 1000);
    if (!rateCheck.success) {
      return NextResponse.json(
        { error: 'Too many report requests. Please wait a minute.' },
        { status: 429 }
      );
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const language = (formData.get('language') as Language) || 'ur';

    if (!file) {
      return NextResponse.json({ error: 'No report document or image provided.' }, { status: 400 });
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Unsupported file type. Please upload a PDF, PNG, JPG, or WebP document.' },
        { status: 400 }
      );
    }

    const maxSize = file.type === 'application/pdf' ? MAX_PDF_SIZE : MAX_IMAGE_SIZE;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: `File exceeds maximum allowed size (${file.type === 'application/pdf' ? '8MB' : '4MB'}).` },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const base64Data = buffer.toString('base64');
    const extractionPrompt = getReportExtractionPrompt(language);

    // Fast Single-Pass Strict Clinical Verification with Multi-Key Failover
    const response = await executeWithFailover(async (ai, model) => {
      return await ai.models.generateContent({
        model,
        contents: [
          {
            role: 'user',
            parts: [
              { text: extractionPrompt },
              {
                inlineData: {
                  data: base64Data,
                  mimeType: file.type,
                },
              },
            ],
          },
        ],
        config: {
          responseMimeType: 'application/json',
        },
      });
    }, 55000);

    const rawText = response.text || '{}';
    let parsedJson: unknown;
    try {
      parsedJson = JSON.parse(rawText);
    } catch {
      // Safe retry on parse failure
      const retryResponse = await executeWithFailover(async (ai, model) => {
        return await ai.models.generateContent({
          model,
          contents: `${extractionPrompt}\nCRITICAL: Output strictly parseable JSON only.`,
          config: { responseMimeType: 'application/json' },
        });
      }, 20000);
      parsedJson = JSON.parse(retryResponse.text || '{}');
    }

    const validated = MedicalReportSchema.safeParse(parsedJson);
    if (!validated.success) {
      return NextResponse.json(
        { error: 'Failed to extract valid report structure.', details: validated.error.format() },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      data: validated.data,
      verified: true,
    });
  } catch (error: unknown) {
    console.error('Report API Error:', error);

    let friendlyError = 'An error occurred during report processing. Please try again.';
    if (error instanceof Error) {
      if (error.message.includes('503') || error.message.includes('high demand') || error.message.includes('UNAVAILABLE')) {
        friendlyError = 'Google AI servers are experiencing temporary high traffic. Please tap Try Again in a few seconds.';
      } else if (error.message.includes('timed out')) {
        friendlyError = 'The document took too long to read. Please upload a clear, focused photo.';
      } else {
        friendlyError = error.message;
      }
    }

    return NextResponse.json({ error: friendlyError }, { status: 500 });
  }
}
