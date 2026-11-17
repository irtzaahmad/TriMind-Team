'use client';

import React from 'react';
import { MedicineAnalysis } from '@/types';
import { useLanguage } from '@/hooks/useLanguage';
import ListenButton from '@/components/ListenButton';
import {
  Pill,
  CheckCircle,
  AlertTriangle,
  Clock,
  HelpCircle,
  ShieldAlert,
  Car,
  Baby,
  Beer,
  Sparkles,
  Info
} from 'lucide-react';

interface MedicineCardProps {
  data: MedicineAnalysis;
}

export default function MedicineCard({ data }: MedicineCardProps) {
  const { t, isEasyMode, language } = useLanguage();

  // Concise, friendly young doctor voice audio summary highlighting MAIN key points
  const primaryUsesShort = data.primaryUses.slice(0, 2).join(', ');
  let doctorVoiceSummary = '';

  if (language === 'ur') {
    doctorVoiceSummary = `یہ ${data.brandName || data.detectedNames[0]} ہے۔ اس کا فارمولا ${data.genericName} ہے۔ یہ خاص طور پر ${primaryUsesShort} کے علاج میں مددگار ہے۔ لینے کا وقت: ${data.howAndWhenToTake.timing}۔ ہمیشہ ڈاکٹر کے تجویز کردہ نسخے کے مطابق لیں۔`;
  } else if (language === 'roman') {
    doctorVoiceSummary = `Yeh ${data.brandName || data.detectedNames[0]} hai, iska formula ${data.genericName} hai. Yeh khaaskar ${primaryUsesShort} ke liye istemal hoti hai. Lene ka waqt: ${data.howAndWhenToTake.timing}. Kisi bhi maslay par doctor se zaroor rabta karein.`;
  } else {
    doctorVoiceSummary = `This is ${data.brandName || data.detectedNames[0]}, generic ${data.genericName}. It is primarily used for ${primaryUsesShort}. Take it ${data.howAndWhenToTake.timing}. Always follow your doctor's exact prescribed dose.`;
  }

  return (
    <div className="w-full space-y-6 animate-fade-in">
      {/* Top Header Card */}
      <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-teal-100 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-lg shadow-teal-500/20 shrink-0">
              <Pill className="w-7 h-7" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h2 className={`font-extrabold text-slate-900 tracking-tight ${isEasyMode ? 'text-3xl' : 'text-2xl'}`}>
                  {data.brandName || data.detectedNames[0]}
                </h2>
                <span className="px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-bold uppercase tracking-wider">
                  {data.category}
                </span>
              </div>
              <p className={`text-slate-600 font-medium ${isEasyMode ? 'text-lg' : 'text-sm sm:text-base'}`}>
                <span className="text-slate-400 font-normal">{t.medicine.genericName}: </span>
                {data.genericName}
              </p>
            </div>
          </div>

          {/* Top Audio Player */}
          <div className="self-start sm:self-center">
            <ListenButton textToRead={doctorVoiceSummary} size={isEasyMode ? 'large' : 'normal'} />
          </div>
        </div>

        {/* Antibiotic Alert Notice if applicable */}
        {data.safetyWarnings.antibioticCaution && (
          <div className="mt-6 p-4 rounded-2xl bg-amber-50 border border-amber-200/90 text-amber-900 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-sm font-semibold leading-relaxed">
              {data.safetyWarnings.antibioticCaution}
            </p>
          </div>
        )}
      </div>

      {/* Grid: Uses & Benefits */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Uses */}
        <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-4 text-teal-800">
              <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className={`font-bold text-slate-900 ${isEasyMode ? 'text-xl' : 'text-lg'}`}>
                {t.medicine.uses}
              </h3>
            </div>
            <ul className="space-y-2.5">
              {data.primaryUses.map((use, i) => (
                <li key={i} className="flex items-start gap-2.5 text-slate-700">
                  <CheckCircle className="w-4 h-4 text-teal-500 mt-1 shrink-0" />
                  <span className={isEasyMode ? 'text-lg font-medium' : 'text-sm'}>{use}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Benefits */}
        <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-4 text-sky-800">
              <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                <CheckCircle className="w-4 h-4" />
              </div>
              <h3 className={`font-bold text-slate-900 ${isEasyMode ? 'text-xl' : 'text-lg'}`}>
                {t.medicine.benefits}
              </h3>
            </div>
            <ul className="space-y-2.5">
              {data.benefits.map((benefit, i) => (
                <li key={i} className="flex items-start gap-2.5 text-slate-700">
                  <span className="w-2 h-2 rounded-full bg-sky-400 mt-2 shrink-0" />
                  <span className={isEasyMode ? 'text-lg font-medium' : 'text-sm'}>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* How and When to Take */}
      <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-teal-100 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <h3 className={`font-bold text-slate-900 ${isEasyMode ? 'text-2xl' : 'text-xl'}`}>
            {t.medicine.howToTake}
          </h3>
        </div>

        <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-100 mb-4">
          <p className={`font-semibold text-teal-900 ${isEasyMode ? 'text-lg' : 'text-base'}`}>
            {data.howAndWhenToTake.timing}
          </p>
          <p className="text-slate-600 text-sm mt-1">
            {data.howAndWhenToTake.instructions}
          </p>
        </div>

        {data.howAndWhenToTake.dosAndDonts.length > 0 && (
          <div className="space-y-2 mb-4">
            {data.howAndWhenToTake.dosAndDonts.map((tip, idx) => (
              <div key={idx} className="flex items-center gap-2 text-slate-700 text-sm">
                <span className="text-teal-600 font-bold">•</span>
                <span>{tip}</span>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2 text-xs text-slate-500 pt-2 border-t border-slate-100">
          <Info className="w-4 h-4 shrink-0 text-slate-400" />
          <span>{t.medicine.noPersonalDoseNote}</span>
        </div>
      </div>

      {/* Side Effects: Common vs Serious */}
      <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <h3 className={`font-bold text-slate-900 ${isEasyMode ? 'text-2xl' : 'text-xl'}`}>
            {t.medicine.sideEffects}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Common (Mild) */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60">
            <h4 className="font-semibold text-slate-800 text-sm mb-3 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              {t.medicine.commonSideEffects}
            </h4>
            <ul className="space-y-2 text-slate-600 text-sm">
              {data.sideEffects.common.map((effect, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span>-</span>
                  <span>{effect}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Serious (Red flag) */}
          <div className="p-4 rounded-2xl bg-red-50/70 border border-red-200/70">
            <h4 className="font-semibold text-red-900 text-sm mb-3 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
              {t.medicine.seriousSideEffects}
            </h4>
            <ul className="space-y-2 text-red-800 text-sm">
              {data.sideEffects.serious.map((effect, i) => (
                <li key={i} className="flex items-start gap-2 font-medium">
                  <span>!</span>
                  <span>{effect}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* When to see doctor */}
        <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-900 text-sm flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p>
            <span className="font-semibold">{t.medicine.whenToSeeDoctor}: </span>
            {data.sideEffects.whenToSeeDoctor}
          </p>
        </div>
      </div>

      {/* Safety Warnings Strip */}
      <div className="bg-slate-50/90 rounded-3xl p-6 border border-slate-200/80 shadow-sm">
        <h4 className="font-bold text-slate-900 text-base mb-4">
          {t.medicine.safetyWarnings}
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-start gap-3 p-3 rounded-2xl bg-white border border-slate-200/60 text-xs">
            <Baby className="w-4 h-4 text-pink-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-800">{t.common.pregnancyTitle}</p>
              <p className="text-slate-600 mt-0.5">{data.safetyWarnings.pregnancyLactationCaution}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-2xl bg-white border border-slate-200/60 text-xs">
            <Car className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-800">{t.common.drivingTitle}</p>
              <p className="text-slate-600 mt-0.5">{data.safetyWarnings.drivingMachineryCaution}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-2xl bg-white border border-slate-200/60 text-xs">
            <Beer className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-800">{t.common.alcoholTitle}</p>
              <p className="text-slate-600 mt-0.5">{data.safetyWarnings.alcoholCaution}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Questions for Doctor / Pharmacist */}
      <div className="bg-gradient-to-br from-teal-50 to-sky-50 rounded-3xl p-6 sm:p-8 border border-teal-200/80 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-sm">
            <HelpCircle className="w-5 h-5" />
          </div>
          <h3 className={`font-bold text-slate-900 ${isEasyMode ? 'text-2xl' : 'text-xl'}`}>
            {t.medicine.questionsForDoctor}
          </h3>
        </div>

        <div className="space-y-3">
          {data.questionsForDoctor.map((question, i) => (
            <div
              key={i}
              className="flex items-start gap-3 p-3.5 rounded-2xl bg-white border border-teal-100 shadow-xs"
            >
              <div className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                {i + 1}
              </div>
              <p className={`font-semibold text-slate-800 ${isEasyMode ? 'text-lg' : 'text-sm'}`}>
                {question}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
