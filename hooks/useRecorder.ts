'use client';

import { useState, useRef, useCallback } from 'react';
import { Language } from '@/types';

// SpeechRecognition type declarations for fallback
interface SpeechRecognitionEventLike {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
    };
  };
}

interface SpeechRecognitionLike {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: () => void;
  onresult: (event: SpeechRecognitionEventLike) => void;
  onerror: (error: unknown) => void;
  onend: () => void;
  start: () => void;
  stop: () => void;
}

interface CustomWindow extends Window {
  SpeechRecognition?: new () => SpeechRecognitionLike;
  webkitSpeechRecognition?: new () => SpeechRecognitionLike;
}

export interface RecordingResult {
  audioBase64?: string;
  mimeType?: string;
  fallbackText?: string;
}

export function useRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);
  const [recorderError, setRecorderError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  };

  const startRecording = useCallback(async (): Promise<boolean> => {
    setRecorderError(null);
    audioChunksRef.current = [];
    setRecordingDuration(0);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Microphone access is not supported on this browser.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Setup audio analyzer for visual pulse
      try {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const audioCtx = new AudioCtx();
        audioContextRef.current = audioCtx;
        const source = audioCtx.createMediaStreamSource(stream);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 64;
        source.connect(analyser);

        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        const checkAudioLevel = () => {
          analyser.getByteFrequencyData(dataArray);
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i];
          }
          const avg = sum / dataArray.length;
          setAudioLevel(Math.min(100, Math.round((avg / 128) * 100)));
          animationFrameRef.current = requestAnimationFrame(checkAudioLevel);
        };
        checkAudioLevel();
      } catch (err) {
        console.warn('Audio analyzer failed:', err);
      }

      // Check supported MIME type
      let mimeType = 'audio/webm';
      if (typeof MediaRecorder.isTypeSupported === 'function') {
        if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
          mimeType = 'audio/webm;codecs=opus';
        } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
          mimeType = 'audio/mp4';
        } else if (MediaRecorder.isTypeSupported('audio/ogg')) {
          mimeType = 'audio/ogg';
        }
      }

      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.start(250); // collect 250ms chunks
      setIsRecording(true);

      timerRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);

      return true;
    } catch (err) {
      console.warn('Microphone recording failed:', err);
      setRecorderError(err instanceof Error ? err.message : 'Could not access microphone.');
      setIsRecording(false);
      return false;
    }
  }, []);

  const stopRecording = useCallback((): Promise<RecordingResult> => {
    return new Promise((resolve) => {
      stopTimer();
      setIsRecording(false);
      setAudioLevel(0);

      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
        audioContextRef.current = null;
      }

      const mediaRecorder = mediaRecorderRef.current;
      if (!mediaRecorder || mediaRecorder.state === 'inactive') {
        // Clean stream
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }
        resolve({});
        return;
      }

      mediaRecorder.onstop = async () => {
        try {
          const rawMime = mediaRecorder.mimeType || 'audio/webm';
          const audioBlob = new Blob(audioChunksRef.current, { type: rawMime });

          // Browser-safe conversion using standard FileReader (no Node Buffer required)
          const base64 = await new Promise<string>((resolveBase64, rejectBase64) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              const res = (reader.result as string) || '';
              const base64Data = res.includes(',') ? res.split(',')[1] : res;
              resolveBase64(base64Data);
            };
            reader.onerror = rejectBase64;
            reader.readAsDataURL(audioBlob);
          });

          // Clean stream tracks
          if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
            streamRef.current = null;
          }

          // Strip codecs so Gemini inlineData accepts it cleanly
          const cleanMimeType = rawMime.split(';')[0].trim() || 'audio/webm';

          resolve({
            audioBase64: base64,
            mimeType: cleanMimeType,
          });
        } catch (err) {
          console.error('Error encoding recorded audio:', err);
          resolve({});
        }
      };

      mediaRecorder.stop();
    });
  }, []);

  /**
   * Fallback using Web Speech API if MediaRecorder fails
   */
  const startSpeechRecognitionFallback = useCallback((language: Language): Promise<string> => {
    return new Promise((resolve, reject) => {
      const customWin = window as CustomWindow;
      const SpeechRecognition = customWin.SpeechRecognition || customWin.webkitSpeechRecognition;

      if (!SpeechRecognition) {
        reject(new Error('Speech recognition is not supported in this browser.'));
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = language === 'ur' ? 'ur-PK' : language === 'roman' ? 'ur-PK' : 'en-US';

      recognition.onresult = (event) => {
        const text = event.results[0]?.[0]?.transcript || '';
        resolve(text);
      };

      recognition.onerror = (e) => {
        reject(e);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      setIsRecording(true);
      recognition.start();
    });
  }, []);

  return {
    isRecording,
    recordingDuration,
    audioLevel,
    recorderError,
    startRecording,
    stopRecording,
    startSpeechRecognitionFallback,
  };
}
