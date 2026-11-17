'use client';

import React, { useState, useRef } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { MedicalReportAnalysis } from '@/types';
import { compressImage } from '@/lib/image-compress';
import ReportSummaryCard from './ReportSummaryCard';
import ReportTable from './ReportTable';
import {
  Upload,
  FileText,
  RefreshCw,
  AlertCircle,
  ShieldCheck,
  ArrowRight,
  FileUp
} from 'lucide-react';

export default function ReportTab() {
  const { t, language, isEasyMode, setActiveContext, addToHistory } = useLanguage();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewName, setPreviewName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [progressStep, setProgressStep] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [reportResult, setReportResult] = useState<MedicalReportAnalysis | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg(null);
    setReportResult(null);

    const isPdf = file.type === 'application/pdf';
    const isImage = ['image/jpeg', 'image/png', 'image/webp'].includes(file.type);

    if (!isPdf && !isImage) {
      setErrorMsg(t.errors.invalidType);
      return;
    }

    // Size checks
    if (isPdf && file.size > 8 * 1024 * 1024) {
      setErrorMsg(t.errors.fileTooLarge);
      return;
    }

    // Optimize images client-side for lightning-fast analysis
    if (isImage) {
      try {
        const compressed = await compressImage(file, 1200, 0.8);
        setSelectedFile(compressed);
        setPreviewName(compressed.name);
        return;
      } catch (err) {
        console.warn('Compression fallback to original file:', err);
      }
    }

    setSelectedFile(file);
    setPreviewName(file.name);
  };

  const handleAnalyzeReport = async () => {
    if (!selectedFile) return;

    setIsLoading(true);
    setErrorMsg(null);
    setProgressStep(t.report.stepReading);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('language', language);

      // Transition step visual feedback
      setTimeout(() => {
        setProgressStep(t.report.stepValidating);
      }, 3500);

      const res = await fetch('/api/report', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || t.errors.generic);
      }

      const reportData: MedicalReportAnalysis = data.data;

      if (reportData.isUnreadable || reportData.testResults.length === 0) {
        setErrorMsg(t.medicine.unreadableDesc);
        setIsLoading(false);
        return;
      }

      setReportResult(reportData);

      // Save to localStorage history
      addToHistory({
        type: 'report',
        title: `Lab Report (${reportData.testResults.length} Tests)`,
        data: reportData,
      });

      // Update active assistant context
      setActiveContext({
        type: 'report',
        title: 'Lab Report Results',
        summary: `Lab Report: ${reportData.patientNeutralSummary}. Found ${reportData.testResults.length} tests. Abnormal findings: ${reportData.abnormalFindingsExplanation.map((f) => f.testName).join(', ')}`,
        data: reportData,
      });
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : t.errors.generic);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewName(null);
    setReportResult(null);
    setErrorMsg(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Tab Header */}
      <div className="text-center max-w-2xl mx-auto mb-4">
        <h2 className={`font-extrabold text-slate-900 tracking-tight ${isEasyMode ? 'text-3xl' : 'text-2xl sm:text-3xl'}`}>
          {t.report.title}
        </h2>
        <p className={`text-slate-600 mt-2 ${isEasyMode ? 'text-lg font-medium' : 'text-sm sm:text-base'}`}>
          {t.report.subtitle}
        </p>
      </div>

      {/* Upload Box */}
      {!reportResult && (
        <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-sky-100 shadow-md">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="application/pdf,image/jpeg,image/png,image/webp"
            className="hidden"
            id="report-file-input"
          />

          {!previewName ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
              className="border-2 border-dashed border-sky-300 hover:border-sky-500 rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition-all bg-sky-50/40 hover:bg-sky-50/70 group"
            >
              <div className="w-16 h-16 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <FileUp className="w-8 h-8" />
              </div>
              <h3 className={`font-bold text-slate-900 mb-1 ${isEasyMode ? 'text-2xl' : 'text-lg'}`}>
                {t.report.uploadPrompt}
              </h3>
              <p className="text-slate-500 text-xs sm:text-sm max-w-md mx-auto">
                {t.report.uploadSub}
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-sky-50 border border-sky-200 w-full max-w-md mb-6">
                <FileText className="w-8 h-8 text-sky-600 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-800 text-sm truncate">{previewName}</p>
                  <p className="text-xs text-slate-500">
                    {selectedFile ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB` : ''}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-3 py-1 text-xs text-slate-600 hover:text-red-600 font-medium"
                >
                  {t.common.change}
                </button>
              </div>

              <button
                type="button"
                onClick={handleAnalyzeReport}
                disabled={isLoading}
                className={`w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-bold shadow-lg shadow-sky-500/20 flex items-center justify-center gap-2 transition-all ${
                  isLoading ? 'opacity-60 cursor-not-allowed' : ''
                } ${isEasyMode ? 'text-xl py-4' : 'text-base'}`}
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>{progressStep || t.report.analyzing}</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-5 h-5" />
                    <span>{t.common.analyzeReportBtn}</span>
                    <ArrowRight className={`w-5 h-5 ${language === 'ur' ? 'rotate-180' : ''}`} />
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Error State with Retry */}
      {errorMsg && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-900 flex items-start justify-between gap-3 animate-fade-in">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold text-sm">{errorMsg}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="px-3 py-1 rounded-xl bg-white text-red-700 font-bold text-xs border border-red-200 hover:bg-red-100/50"
          >
            {t.errors.retry}
          </button>
        </div>
      )}

      {/* Report Analysis Results */}
      {reportResult && (
        <div className="space-y-6">
          <div className="flex justify-end mb-2">
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm font-semibold shadow-xs"
            >
              <RefreshCw className="w-4 h-4 text-sky-600" />
              <span>{t.common.uploadAnotherReport}</span>
            </button>
          </div>

          <ReportSummaryCard data={reportResult} />
          <ReportTable testResults={reportResult.testResults} />
        </div>
      )}
    </div>
  );
}
