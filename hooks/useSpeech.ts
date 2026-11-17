'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Language } from '@/types';

export function useSpeech() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentText, setCurrentText] = useState<string>('');
  const [speed, setSpeed] = useState<number>(1.0);
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);

  const availableVoicesRef = useRef<SpeechSynthesisVoice[]>([]);

  // Load available voices on mount and keep updated
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const updateVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      availableVoicesRef.current = voices;
    };

    updateVoices();
    window.speechSynthesis.onvoiceschanged = updateVoices;

    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const stop = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentText('');
  }, []);

  const pause = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
        window.speechSynthesis.pause();
        setIsPaused(true);
      }
    }
  }, []);

  const resume = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
        setIsPaused(false);
      }
    }
  }, []);

  /**
   * Finds the most natural, human-sounding voice available
   */
  const getBestHumanVoice = useCallback((lang: Language): SpeechSynthesisVoice | null => {
    const voices = availableVoicesRef.current.length > 0
      ? availableVoicesRef.current
      : typeof window !== 'undefined' && 'speechSynthesis' in window
      ? window.speechSynthesis.getVoices()
      : [];

    if (voices.length === 0) return null;

    const isHighQuality = (v: SpeechSynthesisVoice) => {
      const name = v.name.toLowerCase();
      return (
        name.includes('natural') ||
        name.includes('online') ||
        name.includes('neural') ||
        name.includes('google') ||
        name.includes('premium') ||
        name.includes('enhanced')
      );
    };

    if (lang === 'ur') {
      // 1. Dedicated Urdu natural voices (Microsoft Asif / Heera / Gul or Google اردو)
      const urNatural = voices.find((v) => v.lang.startsWith('ur') && isHighQuality(v));
      if (urNatural) return urNatural;

      const urGeneral = voices.find((v) => v.lang.startsWith('ur'));
      if (urGeneral) return urGeneral;

      // 2. High-quality Hindi natural voice (phonetically identical phonemes for Urdu text)
      const hiNatural = voices.find((v) => v.lang.startsWith('hi') && isHighQuality(v));
      if (hiNatural) return hiNatural;

      const hiGeneral = voices.find((v) => v.lang.startsWith('hi'));
      if (hiGeneral) return hiGeneral;

      return null;
    }

    if (lang === 'roman') {
      const pakEng = voices.find((v) => (v.lang === 'en-PK' || v.lang === 'en-IN') && isHighQuality(v));
      if (pakEng) return pakEng;

      const hiNatural = voices.find((v) => v.lang.startsWith('hi') && isHighQuality(v));
      if (hiNatural) return hiNatural;

      const urVoice = voices.find((v) => v.lang.startsWith('ur'));
      if (urVoice) return urVoice;

      const enNatural = voices.find((v) => v.lang.startsWith('en') && isHighQuality(v));
      if (enNatural) return enNatural;

      return voices.find((v) => v.lang.startsWith('en')) || null;
    }

    // English
    const enDoctorVoice =
      voices.find((v) => (v.name.includes('Guy') || v.name.includes('Jenny') || v.name.includes('Ryan') || v.name.includes('Google US')) && isHighQuality(v)) ||
      voices.find((v) => v.lang.startsWith('en-US') && isHighQuality(v)) ||
      voices.find((v) => v.lang.startsWith('en') && isHighQuality(v)) ||
      voices.find((v) => v.lang.startsWith('en')) ||
      null;

    return enDoctorVoice;
  }, []);

  /**
   * Prepares human-friendly Urdu speech by converting digits to Urdu words
   * and adding breathing pauses for natural doctor cadence.
   */
  const humanizeUrduText = (text: string): string => {
    return text
      .replace(/1122|۱۱۲۲/g, 'گیارہ بائیس')
      .replace(/500|۵۰۰/g, 'پانچ سو')
      .replace(/625/g, 'چھ سو پچیس')
      .replace(/([۔!?])\s*/g, '$1 , ')
      .trim();
  };

  const speak = useCallback(
    (text: string, lang: Language = 'en', customRate?: number) => {
      if (!text || text.trim() === '') return;
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        setVoiceNotice('Your browser does not support voice playback.');
        return;
      }

      // Auto-detect script language so Urdu script is never read with an English voice
      const hasUrduChars = /[\u0600-\u06FF]/.test(text);
      let effectiveLang: Language;
      if (hasUrduChars) {
        effectiveLang = 'ur';
      } else if (lang === 'ur') {
        // Text is in Latin letters (Roman Urdu or English)
        effectiveLang = 'roman';
      } else {
        effectiveLang = lang;
      }

      const activeRate = customRate ?? speed;
      let cleanText = text
        .replace(/[*#_~`]/g, '')
        .replace(/\s+/g, ' ')
        .trim();

      if (effectiveLang === 'ur') {
        cleanText = humanizeUrduText(cleanText);
      }

      // If already playing this text, toggle pause/resume instantly
      if (isPlaying && currentText === cleanText) {
        if (isPaused) {
          resume();
        } else {
          pause();
        }
        return;
      }

      // Stop previous audio immediately
      window.speechSynthesis.cancel();
      setCurrentText(cleanText);

      const utterance = new SpeechSynthesisUtterance(cleanText);

      // Friendly, empathetic doctor tone adjustments:
      if (effectiveLang === 'ur') {
        utterance.pitch = 1.0;
        utterance.rate = 0.88 * activeRate; // Calmer, natural pace for Urdu
      } else if (effectiveLang === 'roman') {
        utterance.pitch = 1.02;
        utterance.rate = 0.92 * activeRate; // Natural South Asian conversational pace
      } else {
        utterance.pitch = 1.05;
        utterance.rate = 0.95 * activeRate;
      }

      const bestVoice = getBestHumanVoice(effectiveLang);
      if (bestVoice) {
        utterance.voice = bestVoice;
        utterance.lang = bestVoice.lang;
        setVoiceNotice(null);
      } else {
        utterance.lang = effectiveLang === 'ur' ? 'ur-PK' : effectiveLang === 'roman' ? 'en-PK' : 'en-US';
      }

      utterance.onstart = () => {
        setIsPlaying(true);
        setIsPaused(false);
      };

      utterance.onend = () => {
        setIsPlaying(false);
        setIsPaused(false);
        setCurrentText('');
      };

      utterance.onerror = (e) => {
        if (e.error !== 'interrupted' && e.error !== 'canceled') {
          console.warn('Speech synthesis error:', e);
        }
        setIsPlaying(false);
        setIsPaused(false);
      };

      window.speechSynthesis.speak(utterance);
    },
    [currentText, getBestHumanVoice, isPaused, isPlaying, pause, resume, speed]
  );

  const changeSpeed = (newSpeed: number) => {
    setSpeed(newSpeed);
    if (isPlaying && currentText) {
      speak(currentText, 'en', newSpeed);
    }
  };

  return {
    speak,
    pause,
    resume,
    stop,
    isPlaying,
    isPaused,
    currentText,
    speed,
    changeSpeed,
    voiceNotice,
  };
}
