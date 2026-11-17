'use client';

import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { ShieldAlert, Info } from 'lucide-react';

export default function SafetyBanner() {
  const { t, isEasyMode } = useLanguage();

  return (
    <div
      role="region"
      aria-label="Medical Disclaimer"
      className={`w-full bg-amber-50/90 border-b border-amber-200/80 px-4 py-2.5 text-amber-900 transition-all ${
        isEasyMode ? 'py-4 text-base font-semibold' : 'text-xs sm:text-sm'
      }`}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 flex-1">
          <div className="p-1 rounded-full bg-amber-100 text-amber-700 shrink-0">
            {isEasyMode ? <ShieldAlert className="w-5 h-5" /> : <Info className="w-4 h-4" />}
          </div>
          <p className="leading-snug">
            <span className="font-semibold underline decoration-amber-300 mr-1.5">
              {t.safetyBannerTitle}:
            </span>
            {t.safetyBannerText}
          </p>
        </div>
      </div>
    </div>
  );
}
