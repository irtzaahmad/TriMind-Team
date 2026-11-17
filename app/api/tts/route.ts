import { NextRequest, NextResponse } from 'next/server';
import { getGeminiClient, getGeminiTtsModel } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const { text, language = 'en' } = await req.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Text is required for TTS' }, { status: 400 });
    }

    const ttsModel = getGeminiTtsModel();

    // If an experimental or dedicated Gemini TTS model is defined in env, attempt generation
    if (ttsModel) {
      try {
        const ai = getGeminiClient();
        const response = await ai.models.generateContent({
          model: ttsModel,
          contents: `Read this healthcare text naturally in ${language}: "${text}"`,
          config: {
            responseModalities: ['AUDIO'],
          },
        });

        // If audio parts are returned
        const candidate = response.candidates?.[0];
        const audioPart = candidate?.content?.parts?.find(
          (p: { inlineData?: { mimeType?: string } }) => p.inlineData?.mimeType?.startsWith('audio/')
        );

        if (audioPart && audioPart.inlineData) {
          return NextResponse.json({
            audioBase64: audioPart.inlineData.data,
            mimeType: audioPart.inlineData.mimeType,
          });
        }
      } catch (geminiTtsErr) {
        console.warn('Gemini server TTS not available, signaling client fallback:', geminiTtsErr);
      }
    }

    // Default signal: Seamlessly tell client to use browser speech synthesis with selected language
    return NextResponse.json({
      fallbackToClient: true,
      text,
      language,
    });
  } catch (error: unknown) {
    console.error('TTS API error:', error);
    return NextResponse.json({ fallbackToClient: true }, { status: 200 });
  }
}
