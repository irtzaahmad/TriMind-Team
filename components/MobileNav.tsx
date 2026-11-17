'use client';

import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { Pill, FileText, Mic, History } from 'lucide-react';

interface MobileNavProps {
  activeTab: 'medicine' | 'report' | 'assistant' | 'history';
  setActiveTab: (tab: 'medicine' | 'report' | 'assistant' | 'history') => void;
}

export default function MobileNav({ activeTab, setActiveTab }: MobileNavProps) {
  const { t, isEasyMode } = useLanguage();

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-2 shadow-lg"
      aria-label="Mobile Bottom Navigation"
    >
      <div className="flex items-center justify-around gap-1">
        <button
          type="button"
          onClick={() => setActiveTab('medicine')}
          className={`flex flex-col items-center justify-center flex-1 py-1.5 px-1 rounded-xl transition-all ${
            activeTab === 'medicine'
              ? 'text-teal-700 bg-teal-50 font-bold'
              : 'text-slate-500 hover:text-teal-600'
          }`}
        >
          <Pill className={isEasyMode ? 'w-6 h-6' : 'w-5 h-5'} />
          <span className={`leading-none mt-1 ${isEasyMode ? 'text-xs font-bold' : 'text-[11px]'}`}>
            {t.nav.medicine}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('report')}
          className={`flex flex-col items-center justify-center flex-1 py-1.5 px-1 rounded-xl transition-all ${
            activeTab === 'report'
              ? 'text-sky-700 bg-sky-50 font-bold'
              : 'text-slate-500 hover:text-sky-600'
          }`}
        >
          <FileText className={isEasyMode ? 'w-6 h-6' : 'w-5 h-5'} />
          <span className={`leading-none mt-1 ${isEasyMode ? 'text-xs font-bold' : 'text-[11px]'}`}>
            {t.nav.report}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('assistant')}
          className={`flex flex-col items-center justify-center flex-1 py-1.5 px-1 rounded-xl transition-all ${
            activeTab === 'assistant'
              ? 'text-white bg-teal-600 font-bold shadow-md shadow-teal-500/30'
              : 'text-slate-500 hover:text-teal-600'
          }`}
        >
          <Mic className={isEasyMode ? 'w-6 h-6 animate-pulse' : 'w-5 h-5'} />
          <span className={`leading-none mt-1 ${isEasyMode ? 'text-xs font-bold' : 'text-[11px]'}`}>
            {t.nav.assistant}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('history')}
          className={`flex flex-col items-center justify-center flex-1 py-1.5 px-1 rounded-xl transition-all ${
            activeTab === 'history'
              ? 'text-teal-700 bg-teal-50 font-bold'
              : 'text-slate-500 hover:text-teal-600'
          }`}
        >
          <History className={isEasyMode ? 'w-6 h-6' : 'w-5 h-5'} />
          <span className={`leading-none mt-1 ${isEasyMode ? 'text-xs font-bold' : 'text-[11px]'}`}>
            {t.nav.history}
          </span>
        </button>
      </div>
    </nav>
  );
}
