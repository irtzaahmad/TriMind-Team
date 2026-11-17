import { NextRequest, NextResponse } from 'next/server';
import { executeWithFailover } from '@/lib/gemini';
import { checkRateLimit } from '@/lib/rate-limit';
import { getMedicineOcrPrompt, getMedicineExplanationPrompt } from '@/lib/prompts/medicine';
import { MedicineOcrSchema, MedicineExplanationSchema } from '@/lib/schemas/medicine';
import { Language } from '@/types';

// Max 4MB for medicine images
const MAX_IMAGE_SIZE = 4 * 1024 * 1024;
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const rateCheck = checkRateLimit(ip, 35, 60 * 1000);
    if (!rateCheck.success) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait a minute before trying again.' },
        { status: 429 }
      );
    }

    const contentType = req.headers.get('content-type') || '';

    // Mode 1: Confirmation step or Direct name explanation
    if (contentType.includes('application/json')) {
      const body = await req.json();
      const { names, language = 'ur' } = body;

      if (!names || (Array.isArray(names) && names.length === 0)) {
        return NextResponse.json(
          { error: 'Please provide at least one medicine name.' },
          { status: 400 }
        );
      }

      const medicineList = Array.isArray(names) ? names : [String(names)];
      const prompt = getMedicineExplanationPrompt(language as Language, medicineList);

      const response = await executeWithFailover(async (ai, model) => {
        return await ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });
      }, 25000);

      const rawText = response.text || '{}';
      let parsedJson: unknown;
      try {
        parsedJson = JSON.parse(rawText);
      } catch {
        const retryResponse = await executeWithFailover(async (ai, model) => {
          return await ai.models.generateContent({
            model,
            contents: `${prompt}\nCRITICAL: Output valid parseable JSON only.`,
            config: { responseMimeType: 'application/json' },
          });
        }, 18000);
        parsedJson = JSON.parse(retryResponse.text || '{}');
      }

      const validated = MedicineExplanationSchema.safeParse(parsedJson);
      if (!validated.success) {
        return NextResponse.json(
          { error: 'Validation failed on AI response', details: validated.error.format() },
          { status: 502 }
        );
      }

      return NextResponse.json({
        success: true,
        step: 'explanation',
        data: {
          ...validated.data,
          detectedNames: medicineList,
        },
      });
    }

    // Mode 2: Multipart Image Upload (OCR Detection Step)
    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file') as File | null;
      const language = (formData.get('language') as Language) || 'ur';

      if (!file) {
        return NextResponse.json({ error: 'No image file uploaded.' }, { status: 400 });
      }

      if (!ALLOWED_MIME_TYPES.includes(file.type)) {
        return NextResponse.json(
          { error: 'Unsupported file format. Please upload a JPG, PNG, or WebP image.' },
          { status: 400 }
        );
      }

      if (file.size > MAX_IMAGE_SIZE) {
        return NextResponse.json(
          { error: 'Image exceeds 4MB limit. Please upload a smaller image.' },
          { status: 400 }
        );
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      const base64Data = buffer.toString('base64');
      const ocrPrompt = getMedicineOcrPrompt(language);

      const ocrResponse = await executeWithFailover(async (ai, model) => {
        return await ai.models.generateContent({
          model,
          contents: [
            {
              role: 'user',
              parts: [
                { text: ocrPrompt },
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
      }, 30000);

      const ocrJson = JSON.parse(ocrResponse.text || '{}');
      const validatedOcr = MedicineOcrSchema.safeParse(ocrJson);

      if (!validatedOcr.success || validatedOcr.data.isUnreadable || validatedOcr.data.detectedNames.length === 0) {
        return NextResponse.json({
          success: true,
          step: 'ocr',
          isUnreadable: true,
          unreadableReason: validatedOcr.success ? validatedOcr.data.unreadableReason : 'Could not detect medicine names.',
          detectedNames: [],
        });
      }

      return NextResponse.json({
        success: true,
        step: 'ocr',
        isUnreadable: false,
        detectedNames: validatedOcr.data.detectedNames,
        confidenceNote: validatedOcr.data.confidenceNote,
      });
    }

    return NextResponse.json({ error: 'Unsupported Content-Type' }, { status: 415 });
  } catch (error: unknown) {
    console.error('Medicine API Error:', error);
    let friendlyError = 'An unexpected issue occurred. Please try again.';
    if (error instanceof Error) {
      if (error.message.includes('503') || error.message.includes('high demand') || error.message.includes('UNAVAILABLE')) {
        friendlyError = 'Google AI servers are experiencing temporary high traffic. Please retry in a few seconds.';
      } else {
        friendlyError = error.message;
      }
    }
    return NextResponse.json({ error: friendlyError }, { status: 500 });
  }
}
