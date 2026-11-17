'use client';

import React, { useState, useRef } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { MedicineAnalysis } from '@/types';
import { compressImage } from '@/lib/image-compress';
import MedicineCard from './MedicineCard';
import OcrConfirmModal from './OcrConfirmModal';
import {
  Upload,
  Search,
  Camera,
  RefreshCw,
  AlertCircle,
  FileImage,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export default function MedicineTab() {
  const { t, language, isEasyMode, setActiveContext, addToHistory } = useLanguage();
  const [activeInputMode, setActiveInputMode] = useState<'upload' | 'search'>('upload');

  // Input states
  const [typedName, setTypedName] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Flow states
  const [isLoading, setIsLoading] = useState(false);
  const [progressStep, setProgressStep] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // OCR confirmation step
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [detectedNames, setDetectedNames] = useState<string[]>([]);

  // Final result
  const [analysisResult, setAnalysisResult] = useState<MedicineAnalysis | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg(null);
    setAnalysisResult(null);

    // Validate type
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setErrorMsg(t.errors.invalidType);
      return;
    }

    try {
      // Compress client side for instant upload & fast AI processing
      const compressed = await compressImage(file, 1200, 0.8);
      setSelectedFile(compressed);
      setPreviewUrl(URL.createObjectURL(compressed));
    } catch {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // Step 1: Submit image to OCR
  const handleUploadScan = async () => {
    if (!selectedFile) return;

    setIsLoading(true);
    setErrorMsg(null);
    setProgressStep(t.medicine.stepReading);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('language', language);

      const res = await fetch('/api/medicine', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || t.errors.generic);
      }

      if (data.isUnreadable || !data.detectedNames || data.detectedNames.length === 0) {
        setErrorMsg(data.unreadableReason || t.medicine.unreadableDesc);
        setIsLoading(false);
        return;
      }

      // Show confirmation dialog with detected names
      setDetectedNames(data.detectedNames);
      setShowConfirmModal(true);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : t.errors.generic);
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Confirm detected names (or typed name) and generate complete explanation
  const handleGenerateExplanation = async (confirmedNames: string[]) => {
    setIsLoading(true);
    setErrorMsg(null);
    setProgressStep(t.medicine.stepExtracting);

    try {
      const res = await fetch('/api/medicine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          names: confirmedNames,
          language,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || t.errors.generic);
      }

      const medicineData: MedicineAnalysis = result.data;
      setAnalysisResult(medicineData);
      setShowConfirmModal(false);

      // Save to localStorage history
      addToHistory({
        type: 'medicine',
        title: medicineData.brandName || confirmedNames[0],
        data: medicineData,
      });

      // Update active assistant context
      setActiveContext({
        type: 'medicine',
        title: medicineData.brandName || confirmedNames[0],
        summary: `${medicineData.brandName} (${medicineData.genericName}): ${medicineData.primaryUses.join(', ')}. Timing: ${medicineData.howAndWhenToTake.timing}`,
        data: medicineData,
      });
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : t.errors.generic);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedName.trim()) return;
    handleGenerateExplanation([typedName.trim()]);
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setTypedName('');
    setAnalysisResult(null);
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
          {t.medicine.title}
        </h2>
        <p className={`text-slate-600 mt-2 ${isEasyMode ? 'text-lg font-medium' : 'text-sm sm:text-base'}`}>
          {t.medicine.subtitle}
        </p>
      </div>

      {/* Input Mode Selector (Upload vs Search) */}
      {!analysisResult && (
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="bg-slate-100/90 p-1 rounded-2xl border border-slate-200/80 flex items-center shadow-xs">
            <button
              type="button"
              onClick={() => setActiveInputMode('upload')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeInputMode === 'upload'
                  ? 'bg-white text-teal-800 shadow-sm'
                  : 'text-slate-600 hover:text-teal-700'
              }`}
            >
              <Camera className="w-4 h-4" />
              <span>{t.medicine.uploadTab}</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveInputMode('search')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeInputMode === 'search'
                  ? 'bg-white text-teal-800 shadow-sm'
                  : 'text-slate-600 hover:text-teal-700'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>{t.medicine.searchTab}</span>
            </button>
          </div>
        </div>
      )}

      {/* Mode 1: Upload Photo */}
      {activeInputMode === 'upload' && !analysisResult && (
        <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-teal-100 shadow-md">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            id="medicine-file-input"
          />

          {!previewUrl ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
              className="border-2 border-dashed border-teal-300 hover:border-teal-500 rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition-all bg-teal-50/40 hover:bg-teal-50/70 group"
            >
              <div className="w-16 h-16 rounded-2xl bg-teal-100 text-teal-600 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Upload className="w-8 h-8" />
              </div>
              <h3 className={`font-bold text-slate-900 mb-1 ${isEasyMode ? 'text-2xl' : 'text-lg'}`}>
                {t.medicine.uploadPrompt}
              </h3>
              <p className="text-slate-500 text-xs sm:text-sm max-w-md mx-auto">
                {t.medicine.uploadSub}
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="relative max-h-72 w-full max-w-sm rounded-2xl overflow-hidden border border-slate-200 shadow-sm mb-6">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewUrl}
                  alt="Scanned medicine strip or packaging"
                  className="w-full h-full object-contain bg-slate-50"
                />
                <button
                  type="button"
                  onClick={handleReset}
                  className="absolute top-2 right-2 p-2 rounded-xl bg-slate-900/70 hover:bg-slate-900 text-white text-xs transition-colors"
                >
                  {t.common.change}
                </button>
              </div>

              <button
                type="button"
                onClick={handleUploadScan}
                disabled={isLoading}
                className={`w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2 transition-all ${
                  isLoading ? 'opacity-60 cursor-not-allowed' : ''
                } ${isEasyMode ? 'text-xl py-4' : 'text-base'}`}
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>{progressStep || t.medicine.analyzing}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>{t.medicine.searchButton}</span>
                    <ArrowRight className={`w-5 h-5 ${language === 'ur' ? 'rotate-180' : ''}`} />
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Mode 2: Type Medicine Name */}
      {activeInputMode === 'search' && !analysisResult && (
        <form
          onSubmit={handleSearchSubmit}
          className="bg-white/90 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-teal-100 shadow-md"
        >
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={typedName}
              onChange={(e) => setTypedName(e.target.value)}
              placeholder={t.medicine.searchPlaceholder}
              className={`flex-1 px-5 py-3.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium text-slate-800 ${
                isEasyMode ? 'text-xl py-4' : 'text-base'
              }`}
            />
            <button
              type="submit"
              disabled={isLoading || !typedName.trim()}
              className={`px-8 py-3.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold shadow-md shadow-teal-500/20 flex items-center justify-center gap-2 transition-all ${
                isLoading || !typedName.trim() ? 'opacity-60 cursor-not-allowed' : ''
              } ${isEasyMode ? 'text-xl py-4' : 'text-base'}`}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>{progressStep || t.medicine.analyzing}</span>
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  <span>{t.medicine.searchButton}</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* Error state with Retry */}
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

      {/* OCR Confirmation Dialog */}
      {showConfirmModal && (
        <OcrConfirmModal
          detectedNames={detectedNames}
          onConfirm={handleGenerateExplanation}
          onCancel={() => setShowConfirmModal(false)}
          isLoading={isLoading}
        />
      )}

      {/* Analysis Result Card */}
      {analysisResult && (
        <div>
          <div className="flex justify-end mb-4">
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm font-semibold shadow-xs"
            >
              <RefreshCw className="w-4 h-4 text-teal-600" />
              <span>{t.common.scanAnotherMedicine}</span>
            </button>
          </div>
          <MedicineCard data={analysisResult} />
        </div>
      )}
    </div>
  );
}
