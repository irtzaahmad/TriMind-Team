'use client';

import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { Pill, FileText, Mic, Sparkles, HeartPulse, ArrowRight } from 'lucide-react';

interface HeroProps {
  onSelectFeature: (tab: 'medicine' | 'report' | 'assistant') => void;
}

export default function Hero({ onSelectFeature }: HeroProps) {
  const { t, isEasyMode, language } = useLanguage();

  return (
    <section className="relative pt-6 pb-8 sm:pt-10 sm:pb-12 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* SDG 3 Hackathon Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100/90 border border-teal-200 text-teal-800 text-xs sm:text-sm font-semibold mb-4 backdrop-blur-sm shadow-xs">
          <HeartPulse className="w-4 h-4 text-teal-600 animate-pulse" />
          <span>{t.hero.badge}</span>
          <span className="hidden sm:inline text-teal-400">·</span>
          <span className="hidden sm:inline text-teal-700">{t.hero.sdgBadge}</span>
        </div>

        {/* Hero Title & Value Proposition */}
        <div className="max-w-4xl mb-8 sm:mb-10">
          <h1 className={`font-extrabold tracking-tight text-slate-900 leading-snug sm:leading-tight ${
            isEasyMode ? 'text-3xl sm:text-5xl' : 'text-3xl sm:text-4xl lg:text-5xl'
          }`}>
            {t.hero.title}{' '}
            <span className="bg-gradient-to-r from-teal-600 via-teal-700 to-sky-600 bg-clip-text text-transparent">
              {t.hero.highlight}
            </span>
          </h1>
          <p className={`mt-3 sm:mt-4 text-slate-600 leading-relaxed max-w-3xl ${
            isEasyMode ? 'text-lg sm:text-2xl font-medium text-slate-800' : 'text-sm sm:text-base lg:text-lg'
          }`}>
            {t.hero.desc}
          </p>
        </div>

        {/* 3 Big Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-10">
          {/* Card 1: Medicine Explainer */}
          <div
            onClick={() => onSelectFeature('medicine')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onSelectFeature('medicine')}
            className={`group relative p-6 rounded-3xl bg-white/90 backdrop-blur-md border border-teal-100/80 shadow-sm hover:shadow-lg hover:border-teal-300 transition-all cursor-pointer flex flex-col justify-between ${
              isEasyMode ? 'border-2 border-teal-300' : ''
            }`}
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mb-4 group-hover:scale-105 group-hover:bg-teal-600 group-hover:text-white transition-all shadow-xs">
                <Pill className="w-6 h-6" />
              </div>
              <h3 className={`font-bold text-slate-900 mb-2 ${isEasyMode ? 'text-xl' : 'text-lg'}`}>
                {t.medicine.title}
              </h3>
              <p className={`text-slate-600 leading-relaxed ${isEasyMode ? 'text-base' : 'text-sm'}`}>
                {t.medicine.subtitle}
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-teal-700 font-semibold text-sm">
              <span>{t.hero.startMedicine}</span>
              <ArrowRight className={`w-4 h-4 group-hover:translate-x-1 transition-transform ${language === 'ur' ? 'rotate-180' : ''}`} />
            </div>
          </div>

          {/* Card 2: Medical Report Explainer */}
          <div
            onClick={() => onSelectFeature('report')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onSelectFeature('report')}
            className={`group relative p-6 rounded-3xl bg-white/90 backdrop-blur-md border border-sky-100/80 shadow-sm hover:shadow-lg hover:border-sky-300 transition-all cursor-pointer flex flex-col justify-between ${
              isEasyMode ? 'border-2 border-sky-300' : ''
            }`}
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mb-4 group-hover:scale-105 group-hover:bg-sky-600 group-hover:text-white transition-all shadow-xs">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className={`font-bold text-slate-900 mb-2 ${isEasyMode ? 'text-xl' : 'text-lg'}`}>
                {t.report.title}
              </h3>
              <p className={`text-slate-600 leading-relaxed ${isEasyMode ? 'text-base' : 'text-sm'}`}>
                {t.report.subtitle}
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-sky-700 font-semibold text-sm">
              <span>{t.hero.startReport}</span>
              <ArrowRight className={`w-4 h-4 group-hover:translate-x-1 transition-transform ${language === 'ur' ? 'rotate-180' : ''}`} />
            </div>
          </div>

          {/* Card 3: Voice Assistant "Sehat Dost" */}
          <div
            onClick={() => onSelectFeature('assistant')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onSelectFeature('assistant')}
            className={`group relative p-6 rounded-3xl bg-gradient-to-br from-teal-600 to-sky-700 text-white shadow-md hover:shadow-xl hover:scale-[1.01] transition-all cursor-pointer flex flex-col justify-between ${
              isEasyMode ? 'border-4 border-amber-300' : ''
            }`}
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-white/20 text-white flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Mic className="w-6 h-6 animate-pulse" />
              </div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white/25">
                  {t.assistant.badge}
                </span>
              </div>
              <h3 className={`font-bold text-white mb-2 ${isEasyMode ? 'text-xl' : 'text-lg'}`}>
                {t.assistant.title}
              </h3>
              <p className={`text-teal-50/90 leading-relaxed ${isEasyMode ? 'text-base' : 'text-sm'}`}>
                {t.assistant.subtitle}
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/20 flex items-center justify-between text-white font-semibold text-sm">
              <span>{t.hero.startAssistant}</span>
              <ArrowRight className={`w-4 h-4 group-hover:translate-x-1 transition-transform ${language === 'ur' ? 'rotate-180' : ''}`} />
            </div>
          </div>
        </div>

        {/* How It Works Strip */}
        <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-5 h-5 text-teal-600" />
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              {t.howItWorks.title}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-700 font-bold flex items-center justify-center shrink-0">
                1
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 text-sm sm:text-base mb-1">
                  {t.howItWorks.step1Title}
                </h4>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  {t.howItWorks.step1Desc}
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-700 font-bold flex items-center justify-center shrink-0">
                2
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 text-sm sm:text-base mb-1">
                  {t.howItWorks.step2Title}
                </h4>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  {t.howItWorks.step2Desc}
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center shrink-0">
                3
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 text-sm sm:text-base mb-1">
                  {t.howItWorks.step3Title}
                </h4>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  {t.howItWorks.step3Desc}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
