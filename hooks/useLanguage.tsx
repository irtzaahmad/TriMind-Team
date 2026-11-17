'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, ActiveContext, HistoryItem } from '@/types';
import { translations, TranslationDictionary } from '@/lib/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  direction: 'ltr' | 'rtl';
  isEasyMode: boolean;
  toggleEasyMode: () => void;
  t: TranslationDictionary;
  activeContext: ActiveContext | null;
  setActiveContext: (ctx: ActiveContext | null) => void;
  history: HistoryItem[];
  addToHistory: (item: Omit<HistoryItem, 'id' | 'date'>) => void;
  clearHistory: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('ur');
  const [isEasyMode, setIsEasyMode] = useState<boolean>(false);
  const [activeContext, setActiveContext] = useState<ActiveContext | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Load persisted preferences from localStorage safely
  useEffect(() => {
    try {
      const savedLang = localStorage.getItem('sehat_saathi_lang') as Language;
      if (savedLang && (savedLang === 'en' || savedLang === 'ur' || savedLang === 'roman')) {
        setLanguageState(savedLang);
      }

      const savedEasyMode = localStorage.getItem('sehat_saathi_easymode');
      if (savedEasyMode) {
        setIsEasyMode(savedEasyMode === 'true');
      }

      const savedHistory = localStorage.getItem('sehat_saathi_history');
      if (savedHistory) {
        const parsed = JSON.parse(savedHistory);
        if (Array.isArray(parsed)) {
          setHistory(parsed.slice(0, 5));
        }
      }
    } catch (err) {
      console.warn('localStorage not accessible for reading preferences:', err);
    }
  }, []);

  const setLanguage = (newLang: Language) => {
    setLanguageState(newLang);
    try {
      localStorage.setItem('sehat_saathi_lang', newLang);
    } catch (err) {
      console.warn('Could not persist language to localStorage:', err);
    }
  };

  const toggleEasyMode = () => {
    setIsEasyMode((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('sehat_saathi_easymode', String(next));
      } catch (err) {
        console.warn('Could not persist easy mode to localStorage:', err);
      }
      return next;
    });
  };

  const addToHistory = (item: Omit<HistoryItem, 'id' | 'date'>) => {
    const newItem: HistoryItem = {
      ...item,
      id: Math.random().toString(36).substring(2, 9),
      date: new Date().toLocaleDateString(language === 'ur' ? 'ur-PK' : 'en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    setHistory((prev) => {
      const updated = [newItem, ...prev.filter((i) => i.title !== item.title)].slice(0, 5);
      try {
        localStorage.setItem('sehat_saathi_history', JSON.stringify(updated));
      } catch (err) {
        console.warn('Could not persist history to localStorage:', err);
      }
      return updated;
    });
  };

  const clearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem('sehat_saathi_history');
    } catch (err) {
      console.warn('Could not clear history from localStorage:', err);
    }
  };

  const direction = language === 'ur' ? 'rtl' : 'ltr';
  const t = translations[language];

  // Update HTML dir and lang tags
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.dir = direction;
      document.documentElement.lang = language === 'ur' ? 'ur' : 'en';
      if (language === 'ur') {
        document.documentElement.classList.add('font-urdu');
      } else {
        document.documentElement.classList.remove('font-urdu');
      }

      if (isEasyMode) {
        document.documentElement.classList.add('easy-mode');
      } else {
        document.documentElement.classList.remove('easy-mode');
      }
    }
  }, [direction, language, isEasyMode]);

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        direction,
        isEasyMode,
        toggleEasyMode,
        t,
        activeContext,
        setActiveContext,
        history,
        addToHistory,
        clearHistory,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
