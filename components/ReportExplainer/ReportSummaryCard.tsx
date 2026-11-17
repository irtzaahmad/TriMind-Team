'use client';

import React from 'react';
import { MedicalReportAnalysis } from '@/types';
import { useLanguage } from '@/hooks/useLanguage';
import ListenButton from '@/components/ListenButton';
import {
  FileText,
  AlertTriangle,
  HelpCircle,
  Siren,
  ShieldCheck,
  CheckCircle
} from 'lucide-react';

interface ReportSummaryCardProps {
  data: MedicalReportAnalysis;
}

export default function ReportSummaryCard({ data }: ReportSummaryCardProps) {
  const { t, isEasyMode, language } = useLanguage();

  // Concise doctor summary highlighting key findings without long boring enumeration
  const abnormalHighlights = data.abnormalFindingsExplanation.slice(0, 2).map((f) => `${f.testName}`).join(', ');
  let doctorVoiceSummary = '';

  if (language === 'ur') {
    doctorVoiceSummary = `آپ کی لیب رپورٹ کا خلاصہ: ${data.patientNeutralSummary}۔ ${abnormalHighlights ? `اہم ٹیسٹ: ${abnormalHighlights}۔ ` : ''}شدید تکلیف یا ایمرجنسی میں فوراً ۱۱۲۲ یا ڈاکٹر سے رجوع کریں۔`;
  } else if (language === 'roman') {
    doctorVoiceSummary = `Aapki report ka khulasa: ${data.patientNeutralSummary}. ${abnormalHighlights ? `Khaas tests: ${abnormalHighlights}. ` : ''}Kisi bhi emergency alamaat par foran doctor ya 1122 se rabta karein.`;
  } else {
    doctorVoiceSummary = `Your lab report summary: ${data.patientNeutralSummary}. ${abnormalHighlights ? `Key findings in: ${abnormalHighlights}. ` : ''}In case of severe symptoms, seek urgent medical care.`;
  }

  return (
    <div className="w-full space-y-6 animate-fade-in">
      {/* Main Plain Language Summary Card */}
      <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-sky-100 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-sky-600 text-white flex items-center justify-center shadow-lg shadow-sky-500/20 shrink-0">
              <FileText className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className={`font-extrabold text-slate-900 tracking-tight ${isEasyMode ? 'text-3xl' : 'text-2xl'}`}>
                  {t.report.summaryTitle}
                </h2>
              </div>
              <p className="text-xs text-sky-700 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>{t.report.validationBadge}</span>
              </p>
            </div>
          </div>

          <div className="self-start sm:self-center">
            <ListenButton textToRead={doctorVoiceSummary} size={isEasyMode ? 'large' : 'normal'} />
          </div>
        </div>

        {/* Patient-Neutral Summary Text */}
        <div className="mt-6 space-y-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-sky-50/60 border border-sky-100">
            <p className={`text-slate-800 leading-relaxed ${isEasyMode ? 'text-xl font-medium' : 'text-base sm:text-lg'}`}>
              {data.patientNeutralSummary}
            </p>
          </div>

          {data.overallHealthStatusSimple && (
            <p className="text-slate-600 text-sm leading-relaxed">
              <span className="font-semibold text-slate-800">{t.common.overview}: </span>
              {data.overallHealthStatusSimple}
            </p>
          )}
        </div>
      </div>

      {/* Plain Language Meaning of Abnormal Tests */}
      {data.abnormalFindingsExplanation.length > 0 && (
        <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-amber-100 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className={`font-bold text-slate-900 ${isEasyMode ? 'text-2xl' : 'text-xl'}`}>
              {t.report.plainMeaningTitle}
            </h3>
          </div>

          <div className="space-y-4">
            {data.abnormalFindingsExplanation.map((item, index) => (
              <div
                key={index}
                className="p-4 sm:p-5 rounded-2xl bg-amber-50/40 border border-amber-200/80"
              >
                <h4 className="font-bold text-amber-950 text-base mb-1">
                  {item.testName}
                </h4>
                <p className={`text-slate-700 leading-relaxed ${isEasyMode ? 'text-lg font-medium' : 'text-sm'}`}>
                  {item.meaningInPlainLanguage}
                </p>
                {item.whatItMeansForBody && (
                  <p className="text-slate-600 text-xs sm:text-sm mt-2 pt-2 border-t border-amber-200/50">
                    <span className="font-semibold text-amber-900">{t.common.whatThisMeans}: </span>
                    {item.whatItMeansForBody}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Questions for Doctor */}
      {data.whatToAskYourDoctor.length > 0 && (
        <div className="bg-gradient-to-br from-teal-50 to-sky-50 rounded-3xl p-6 sm:p-8 border border-teal-200/80 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-2xl bg-teal-600 text-white flex items-center justify-center">
              <HelpCircle className="w-5 h-5" />
            </div>
            <h3 className={`font-bold text-slate-900 ${isEasyMode ? 'text-2xl' : 'text-xl'}`}>
              {t.report.questionsTitle}
            </h3>
          </div>

          <div className="space-y-3">
            {data.whatToAskYourDoctor.map((question, i) => (
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
      )}

      {/* Urgent Care / Emergency Symptoms Card */}
      {data.whenToSeekUrgentCare.length > 0 && (
        <div className="bg-red-50/90 rounded-3xl p-6 sm:p-8 border-2 border-red-200 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-2xl bg-red-600 text-white flex items-center justify-center shadow-md shadow-red-500/20">
              <Siren className="w-6 h-6 animate-bounce" />
            </div>
            <div>
              <h3 className={`font-bold text-red-950 ${isEasyMode ? 'text-2xl' : 'text-xl'}`}>
                {t.report.urgentCareTitle}
              </h3>
              <p className="text-red-700 text-xs sm:text-sm">
                {t.report.urgentCareSubtitle}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
            {data.whenToSeekUrgentCare.map((symptom, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-red-200 text-red-900 font-medium text-sm"
              >
                <span className="w-2 h-2 rounded-full bg-red-600 mt-2 shrink-0" />
                <span>{symptom}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
