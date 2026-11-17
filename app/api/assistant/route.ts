import { NextRequest } from 'next/server';
import { executeStreamWithFailover, executeWithFailover } from '@/lib/gemini';
import { checkRateLimit } from '@/lib/rate-limit';
import { getAssistantSystemInstruction, getTranslationPrompt } from '@/lib/prompts/assistant';
import { Language } from '@/types';

// Emergency detection keywords for safety flag
const EMERGENCY_KEYWORDS = [
  'chest pain', 'heart attack', 'dil ka dora', 'seenay mein dard', 'seene me dard', 'سینے میں درد',
  'difficulty breathing', 'saans nahi aa rahi', 'saans phool rahi', 'سانس بند',
  'stroke', 'faliq', 'faalij', 'falij', 'فالج',
  'heavy bleeding', 'severe bleeding', 'khoon beh raha', 'خون بہہ رہا',
  'suicide', 'self harm', 'khudkushi', 'خودکشی'
];

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const rateCheck = checkRateLimit(ip, 40, 60 * 1000);
    if (!rateCheck.success) {
      return new Response(
        JSON.stringify({ error: 'Too many voice requests. Please wait a moment.' }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const body = await req.json();

    // Instant translation of assistant responses when user switches language
    if (body.action === 'translate') {
      const { text, targetLanguage = 'ur' } = body;
      if (!text) {
        return new Response(JSON.stringify({ error: 'Text required for translation' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const prompt = getTranslationPrompt(targetLanguage as Language, text);
      const res = await executeWithFailover(async (ai, model) => {
        return await ai.models.generateContent({
          model,
          contents: prompt,
        });
      }, 15000);

      const translatedText = res.text?.trim() || text;
      return new Response(JSON.stringify({ success: true, translatedText }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const {
      message,
      audioBase64,
      audioMimeType = 'audio/webm',
      language = 'ur',
      contextData,
      history = [],
    } = body;

    if (!message && !audioBase64) {
      return new Response(
        JSON.stringify({ error: 'Please provide either a voice recording or a text message.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const systemPrompt = getAssistantSystemInstruction(language as Language, contextData);

    // Build multimodal contents
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const contents: any[] = [];

    // Prior history turns (if any)
    if (Array.isArray(history) && history.length > 0) {
      for (const item of history.slice(-6)) {
        contents.push({
          role: item.role === 'user' ? 'user' : 'model',
          parts: [{ text: item.content }],
        });
      }
    }

    // Current user message parts
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const currentParts: any[] = [];

    if (audioBase64) {
      const cleanAudioMime = (audioMimeType || 'audio/webm').split(';')[0].trim() || 'audio/webm';
      currentParts.push({
        inlineData: {
          mimeType: cleanAudioMime,
          data: audioBase64,
        },
      });
      currentParts.push({
        text: `The user spoke this voice audio message:
1. Listen carefully to what the user said in the audio.
2. If they spoke in Urdu or Roman Urdu, reply in natural everyday Roman Urdu (or Urdu script if language is 'ur').
3. If they spoke in English, reply in simple, helpful English.
4. If they ask about any medicine (e.g. Panadol, Augmentin, Brufen, Disprin, Risek, Flagyl, etc.), clearly explain what it is used for and general guidance on how it is taken.
5. Provide a direct, reassuring doctor-style response. Selected language is: ${language}.`,
      });
    }

    if (message) {
      currentParts.push({ text: message });
    }

    contents.push({
      role: 'user',
      parts: currentParts,
    });

    // Check emergency trigger
    const queryText = (message || '').toLowerCase();
    const isEmergency = EMERGENCY_KEYWORDS.some((kw) => queryText.includes(kw));

    const responseStream = await executeStreamWithFailover(async (ai, model) => {
      return await ai.models.generateContentStream({
        model,
        contents,
        config: {
          systemInstruction: systemPrompt,
        },
      });
    }, 25000);
    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        // Send initial emergency status event
        if (isEmergency) {
          controller.enqueue(
            encoder.encode(`event: emergency\ndata: ${JSON.stringify({ alert: true, emergencyNumber: '1122' })}\n\n`)
          );
        }

        try {
          for await (const chunk of responseStream) {
            const text = chunk.text;
            if (text) {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ text })}\n\n`)
              );
            }
          }
          controller.enqueue(encoder.encode('event: done\ndata: {}\n\n'));
          controller.close();
        } catch (streamError) {
          console.error('Streaming error:', streamError);
          controller.enqueue(
            encoder.encode(`event: error\ndata: ${JSON.stringify({ error: 'Streaming interrupted' })}\n\n`)
          );
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
      },
    });
  } catch (error: unknown) {
    console.error('Assistant API error:', error);
    const message = error instanceof Error ? error.message : 'Assistant service error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
