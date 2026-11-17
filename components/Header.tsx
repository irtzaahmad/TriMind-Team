'use client';

import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { Language } from '@/types';
import { Activity, Eye, Pill, FileText, Mic, History } from 'lucide-react';

interface HeaderProps {
  activeTab: 'medicine' | 'report' | 'assistant' | 'history';
  setActiveTab: (tab: 'medicine' | 'report' | 'assistant' | 'history') => void;
}

export default function Header({ activeTab, setActiveTab }: HeaderProps) {
  const { language, setLanguage, isEasyMode, toggleEasyMode, t } = useLanguage();

  const handleLangChange = (lang: Language) => {
    setLanguage(lang);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-teal-100 shadow-xs transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3 sm:gap-4">
        {/* Brand / Logo - Single sleek horizontal line */}
        <div
          onClick={() => setActiveTab('medicine')}
          className="flex items-center gap-2 sm:gap-2.5 cursor-pointer group shrink-0"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && setActiveTab('medicine')}
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-teal-600 to-sky-500 flex items-center justify-center text-white shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform shrink-0">
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
          <div className="flex items-center gap-2">
            <span className={`font-bold tracking-tight text-teal-950 whitespace-nowrap ${isEasyMode ? 'text-2xl' : 'text-lg sm:text-xl'}`}>
              {t.appTitle}
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-teal-100 text-teal-800 tracking-wide uppercase shrink-0">
              SDG 3
            </span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-100/90 p-1 rounded-2xl border border-slate-200/60" aria-label="Main Navigation">
          <button
            type="button"
            onClick={() => setActiveTab('medicine')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'medicine'
                ? 'bg-white text-teal-800 shadow-xs'
                : 'text-slate-600 hover:text-teal-700 hover:bg-white/50'
            }`}
          >
            <Pill className="w-4 h-4 text-teal-600" />
            <span>{t.nav.medicine}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('report')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'report'
                ? 'bg-white text-teal-800 shadow-xs'
                : 'text-slate-600 hover:text-teal-700 hover:bg-white/50'
            }`}
          >
            <FileText className="w-4 h-4 text-sky-600" />
            <span>{t.nav.report}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('assistant')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'assistant'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-teal-700 hover:bg-white/50'
            }`}
          >
            <Mic className="w-4 h-4" />
            <span>{t.nav.assistant}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'history'
                ? 'bg-white text-teal-800 shadow-xs'
                : 'text-slate-600 hover:text-teal-700 hover:bg-white/50'
            }`}
          >
            <History className="w-4 h-4 text-slate-500" />
            <span>{t.nav.history}</span>
          </button>
        </nav>

        {/* Global Controls: Language Selector + Easy Mode Toggle */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Easy Mode Toggle Button */}
          <button
            type="button"
            onClick={toggleEasyMode}
            title={isEasyMode ? t.standardMode : t.easyMode}
            aria-label={isEasyMode ? t.standardMode : t.easyMode}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs sm:text-sm font-medium transition-all ${
              isEasyMode
                ? 'bg-amber-500 border-amber-600 text-white shadow-xs font-bold'
                : 'bg-white border-slate-200 text-slate-700 hover:border-teal-300 hover:bg-teal-50/50'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span className="hidden sm:inline">
              {isEasyMode ? t.easyModeActive : t.easyMode}
            </span>
          </button>

          {/* Language Selector: English, اردو, Roman Urdu */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200/80">
            <span className="sr-only">Language</span>
            {(['ur', 'roman', 'en'] as Language[]).map((lng) => (
              <button
                key={lng}
                type="button"
                onClick={() => handleLangChange(lng)}
                aria-pressed={language === lng}
                className={`px-2 sm:px-2.5 py-1 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                  language === lng
                    ? 'bg-teal-700 text-white shadow-xs font-bold'
                    : 'text-slate-600 hover:text-teal-900'
                }`}
              >
                {t.languages[lng]}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
