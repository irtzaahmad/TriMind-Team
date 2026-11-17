'use client';

import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { HeartPulse, Award } from 'lucide-react';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="mt-auto border-t border-teal-100 bg-white/80 backdrop-blur-md py-8 text-slate-600 text-xs sm:text-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div className="flex items-center gap-2">
          <HeartPulse className="w-5 h-5 text-teal-600" />
          <span className="font-bold text-slate-900">{t.appTitle}</span>
          <span>·</span>
          <span>{t.footer.tagline}</span>
        </div>

        <div className="flex items-center gap-2 text-teal-800 font-semibold bg-teal-50 px-3 py-1.5 rounded-full border border-teal-200">
          <Award className="w-4 h-4 text-teal-600" />
          <span>{t.footer.hackathon}</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-4 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left text-xs text-slate-500">
        <p>
          <span className="font-semibold text-teal-800">{t.safetyBannerTitle}:</span> {t.safetyBannerText}
        </p>
        <p className="shrink-0">{t.footer.disclaimer}</p>
      </div>
    </footer>
  );
}
