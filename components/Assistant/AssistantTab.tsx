'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { useRecorder } from '@/hooks/useRecorder';
import { useSpeech } from '@/hooks/useSpeech';
import { ChatMessage, Language } from '@/types';
import ListenButton from '@/components/ListenButton';
import {
  Mic,
  MicOff,
  Send,
  Volume2,
  VolumeX,
  Sparkles,
  Siren,
  HelpCircle,
  FileText,
  Pill,
  RefreshCw,
  PhoneCall,
  Languages
} from 'lucide-react';

export default function AssistantTab() {
  const { t, language, isEasyMode, activeContext } = useLanguage();
  const {
    isRecording,
    recordingDuration,
    audioLevel,
    recorderError,
    startRecording,
    stopRecording,
    startSpeechRecognitionFallback,
  } = useRecorder();

  const { speak, isPlaying, stop: stopSpeech } = useSpeech();

  // Chat states
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputVal, setInputVal] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamedText, setStreamedText] = useState('');
  const [isVoiceAutoSpeak, setIsVoiceAutoSpeak] = useState(true);
  const [emergencyAlert, setEmergencyAlert] = useState<boolean>(false);
  const [translatingId, setTranslatingId] = useState<string | null>(null);

  const handleTranslateMessage = async (msgId: string, currentText: string, targetLang: Language) => {
    setTranslatingId(msgId);
    try {
      const res = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'translate',
          text: currentText,
          targetLanguage: targetLang,
        }),
      });
      const data = await res.json();
      if (data.success && data.translatedText) {
        setMessages((prev) =>
          prev.map((m) => (m.id === msgId ? { ...m, content: data.translatedText } : m))
        );
        speak(data.translatedText, targetLang);
      }
    } catch (e) {
      console.error('Translation failed:', e);
    } finally {
      setTranslatingId(null);
    }
  };

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamedText]);

  // Initial welcome message based on language
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMap = {
        en: 'Hello! I am Sehat Dost, your health companion. Tap the microphone and ask me anything about your medicines, lab reports, or general health.',
        ur: 'السلام علیکم! میں ہوں صحت دوست۔ مائیک کا بڑا بٹن دبائیں اور مجھ سے اپنی دوائیوں، لیب رپورٹس یا صحت کے بارے میں جو چاہیں بلا جھجھک پوچھیں۔',
        roman: 'Assalam-o-Alaikum! Main hoon Sehat Dost. Mic ka button dabayein aur apni dawaiyon, reports ya sehat ke barey mein koi bhi sawal poochein.',
      };

      setMessages([
        {
          id: 'welcome',
          role: 'assistant',
          content: welcomeMap[language],
          timestamp: Date.now(),
        },
      ]);
    }
  }, [language, messages.length]);

  // Send message to streaming API
  const handleSend = async (messageText?: string, audioPayload?: { audioBase64: string; mimeType: string }) => {
    const textToSend = messageText || inputVal.trim();
    if (!textToSend && !audioPayload) return;

    // Add user message
    const userMsgId = Math.random().toString(36).substring(2, 9);
    const userMessage: ChatMessage = {
      id: userMsgId,
      role: 'user',
      content: textToSend || (language === 'ur' ? '🎤 صوتی پیغام' : language === 'roman' ? '🎤 Awaaz ka paigham' : '🎤 Voice message'),
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputVal('');
    setIsStreaming(true);
    setStreamedText('');
    setEmergencyAlert(false);

    try {
      const contextString = activeContext
        ? `[${activeContext.type.toUpperCase()}: ${activeContext.title}] ${activeContext.summary}`
        : undefined;

      const response = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          audioBase64: audioPayload?.audioBase64,
          audioMimeType: audioPayload?.mimeType,
          language,
          contextData: contextString,
          history: messages.slice(-6).map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error('Could not connect to Sehat Dost voice service.');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedText = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.substring(6));
              if (data.text) {
                accumulatedText += data.text;
                setStreamedText((prev) => prev + data.text);
              }
            } catch {
              // ignore partial lines
            }
          } else if (line.startsWith('event: emergency')) {
            setEmergencyAlert(true);
          }
        }
      }

      // Add assistant message to history
      const assistantMsg: ChatMessage = {
        id: Math.random().toString(36).substring(2, 9),
        role: 'assistant',
        content: accumulatedText,
        timestamp: Date.now(),
        emergencyAlert,
      };

      setMessages((prev) => [...prev, assistantMsg]);
      setStreamedText('');

      // Auto-speak reply if enabled
      if (isVoiceAutoSpeak && accumulatedText) {
        speak(accumulatedText, language);
      }
    } catch (err: unknown) {
      console.error('Error contacting assistant:', err);
      const errMsg = err instanceof Error ? err.message : t.errors.generic;
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(36).substring(2, 9),
          role: 'assistant',
          content: errMsg,
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setIsStreaming(false);
    }
  };

  // Toggle voice recording
  const handleMicClick = async () => {
    if (isPlaying) {
      stopSpeech();
    }

    if (isRecording) {
      // Stop and send audio
      const result = await stopRecording();
      if (result.audioBase64 && result.mimeType) {
        handleSend(undefined, {
          audioBase64: result.audioBase64,
          mimeType: result.mimeType,
        });
      }
    } else {
      const started = await startRecording();
      if (!started) {
        // Fall back to Web Speech API
        try {
          const fallbackText = await startSpeechRecognitionFallback(language);
          if (fallbackText) {
            handleSend(fallbackText);
          }
        } catch (speechErr) {
          console.warn('Speech recognition fallback failed:', speechErr);
        }
      }
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      {/* Active Context Banner if user recently scanned a medicine/report */}
      {activeContext ? (
        <div className="p-3.5 rounded-2xl bg-teal-50 border border-teal-200 text-teal-900 flex items-center justify-between gap-3 text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            {activeContext.type === 'medicine' ? (
              <Pill className="w-4 h-4 text-teal-600 shrink-0" />
            ) : (
              <FileText className="w-4 h-4 text-sky-600 shrink-0" />
            )}
            <span className="font-semibold">{t.assistant.contextActive}:</span>
            <span className="underline decoration-teal-300 font-bold">{activeContext.title}</span>
          </div>
          <span className="text-[11px] bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full font-medium">
            Active
          </span>
        </div>
      ) : (
        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-500 text-xs flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-teal-500" />
          <span>{t.assistant.noContext}</span>
        </div>
      )}

      {/* Emergency Alert Banner if triggered */}
      {emergencyAlert && (
        <div className="p-4 rounded-2xl bg-red-600 text-white shadow-lg animate-bounce flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Siren className="w-6 h-6 shrink-0" />
            <div>
              <p className="font-bold text-sm sm:text-base">{t.common.emergencyTitle}</p>
              <p className="text-xs text-red-100">{t.assistant.emergencyWarning}</p>
            </div>
          </div>
          <a
            href="tel:1122"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-red-700 font-bold text-sm shadow-md shrink-0 hover:bg-red-50"
          >
            <PhoneCall className="w-4 h-4" />
            <span>{t.common.callEmergency}</span>
          </a>
        </div>
      )}

      {/* Chat Messages Container */}
      <div className="bg-white/95 backdrop-blur-md rounded-3xl p-4 sm:p-6 border border-slate-200/80 shadow-md min-h-[420px] max-h-[580px] overflow-y-auto flex flex-col justify-between">
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.role === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-3xl p-4 sm:p-5 shadow-xs ${
                  msg.role === 'user'
                    ? 'bg-teal-600 text-white rounded-br-xs'
                    : 'bg-slate-100/90 text-slate-900 rounded-bl-xs border border-slate-200/70'
                } ${isEasyMode ? 'text-xl sm:text-2xl leading-relaxed' : 'text-base sm:text-lg leading-relaxed'}`}
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>
              </div>

              {/* Listen button & Translation option on assistant replies */}
              {msg.role === 'assistant' && (
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <ListenButton textToRead={msg.content} size={isEasyMode ? 'large' : 'normal'} />

                  {/* If user changed app language in header, allow 1-click translation into selected language */}
                  {(() => {
                    const hasUrdu = /[\u0600-\u06FF]/.test(msg.content);
                    const isDifferent =
                      (language === 'ur' && !hasUrdu) ||
                      (language !== 'ur' && hasUrdu);

                    if (!isDifferent) return null;

                    const label =
                      language === 'ur'
                        ? 'اردو میں سنیں اور دیکھیں'
                        : language === 'roman'
                        ? 'Roman Urdu mein sunein'
                        : 'Listen in English';

                    return (
                      <button
                        type="button"
                        disabled={translatingId === msg.id}
                        onClick={() => handleTranslateMessage(msg.id, msg.content, language)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-xs font-semibold transition-all shadow-xs disabled:opacity-50"
                        title="Switch to selected header language"
                      >
                        <Languages className="w-3.5 h-3.5 text-teal-600" />
                        <span>{translatingId === msg.id ? 'Translating...' : label}</span>
                      </button>
                    );
                  })()}
                </div>
              )}
            </div>
          ))}

          {/* Streaming Bubble */}
          {isStreaming && (
            <div className="flex flex-col items-start">
              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-3xl p-4 sm:p-5 bg-teal-50 text-slate-900 border border-teal-200 rounded-bl-xs ${
                  isEasyMode ? 'text-xl' : 'text-base'
                }`}
              >
                <p className="whitespace-pre-wrap">
                  {streamedText || t.assistant.thinking}
                </p>
                <span className="inline-block w-2 h-4 bg-teal-600 animate-pulse ml-1" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Pills */}
        {messages.length <= 2 && (
          <div className="mt-6 pt-4 border-t border-slate-100">
            <p className="text-xs text-slate-500 font-semibold mb-2">{t.common.suggestedQuestions}</p>
            <div className="flex flex-wrap gap-2">
              {t.assistant.quickPrompts.map((prompt, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSend(prompt)}
                  className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-teal-50 hover:text-teal-800 text-slate-700 text-xs sm:text-sm font-medium transition-colors border border-slate-200/60"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Voice-First Controls Section */}
      <div className="bg-white/95 backdrop-blur-md rounded-3xl p-4 sm:p-6 border border-teal-100 shadow-md">
        {/* Large Voice Microphone Button (Centerpiece for elderly & illiterate users) */}
        <div className="flex flex-col items-center justify-center my-2">
          <div className="relative flex items-center justify-center">
            {/* Pulsing ring when recording */}
            {isRecording && (
              <div
                className="absolute w-28 h-28 rounded-full bg-red-400/30 animate-ping"
                style={{
                  transform: `scale(${1 + (audioLevel / 100) * 0.5})`,
                }}
              />
            )}

            <button
              type="button"
              onClick={handleMicClick}
              disabled={isStreaming}
              aria-label={isRecording ? t.assistant.listening : t.assistant.micPrompt}
              className={`relative z-10 rounded-full flex items-center justify-center transition-all shadow-xl ${
                isEasyMode ? 'w-24 h-24' : 'w-20 h-20'
              } ${
                isRecording
                  ? 'bg-red-600 hover:bg-red-700 text-white shadow-red-500/30 scale-105'
                  : 'bg-gradient-to-tr from-teal-600 to-sky-600 hover:from-teal-700 hover:to-sky-700 text-white shadow-teal-500/30 hover:scale-105'
              } ${isStreaming ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isRecording ? (
                <MicOff className={isEasyMode ? 'w-10 h-10' : 'w-8 h-8'} />
              ) : (
                <Mic className={isEasyMode ? 'w-10 h-10' : 'w-8 h-8'} />
              )}
            </button>
          </div>

          <p className={`mt-3 font-bold text-center ${
            isRecording ? 'text-red-600 animate-pulse' : 'text-slate-700'
          } ${isEasyMode ? 'text-lg sm:text-xl' : 'text-sm sm:text-base'}`}>
            {isRecording
              ? `${t.assistant.listening} (${recordingDuration}s)`
              : t.assistant.micPrompt}
          </p>

          {recorderError && (
            <p className="text-xs text-red-500 mt-1">{recorderError}</p>
          )}
        </div>

        {/* Text Input & Controls Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-3 mt-4 pt-4 border-t border-slate-100">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2 w-full"
          >
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder={t.assistant.typePrompt}
              className={`flex-1 px-4 py-2.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800 ${
                isEasyMode ? 'text-lg py-3' : 'text-sm sm:text-base'
              }`}
            />
            <button
              type="submit"
              disabled={isStreaming || !inputVal.trim()}
              className="p-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white transition-colors disabled:opacity-50 shadow-sm"
              aria-label={t.assistant.send}
            >
              <Send className="w-5 h-5" />
            </button>
          </form>

          {/* Auto Speak Toggle */}
          <button
            type="button"
            onClick={() => setIsVoiceAutoSpeak(!isVoiceAutoSpeak)}
            title={isVoiceAutoSpeak ? t.assistant.muteVoice : t.assistant.unmuteVoice}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold shrink-0 transition-colors ${
              isVoiceAutoSpeak
                ? 'bg-teal-100 text-teal-800'
                : 'bg-slate-100 text-slate-500'
            }`}
          >
            {isVoiceAutoSpeak ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden sm:inline">
              {isVoiceAutoSpeak ? t.common.voiceOn : t.common.voiceMuted}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
