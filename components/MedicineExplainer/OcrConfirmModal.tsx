'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { Check, Plus, Trash2, Edit3, ArrowRight } from 'lucide-react';

interface OcrConfirmModalProps {
  detectedNames: string[];
  onConfirm: (confirmedNames: string[]) => void;
  onCancel: () => void;
  isLoading: boolean;
}

export default function OcrConfirmModal({
  detectedNames,
  onConfirm,
  onCancel,
  isLoading,
}: OcrConfirmModalProps) {
  const { t, isEasyMode, language } = useLanguage();
  const [names, setNames] = useState<string[]>(detectedNames.length > 0 ? detectedNames : ['']);
  const [newInput, setNewInput] = useState('');

  const handleUpdate = (index: number, val: string) => {
    const updated = [...names];
    updated[index] = val;
    setNames(updated);
  };

  const handleRemove = (index: number) => {
    setNames(names.filter((_, i) => i !== index));
  };

  const handleAdd = () => {
    if (newInput.trim()) {
      setNames([...names, newInput.trim()]);
      setNewInput('');
    }
  };

  const handleFinalConfirm = () => {
    const filtered = names.map((n) => n.trim()).filter(Boolean);
    if (filtered.length > 0) {
      onConfirm(filtered);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-teal-100 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center">
            <Edit3 className="w-5 h-5" />
          </div>
          <div>
            <h3 className={`font-bold text-slate-900 ${isEasyMode ? 'text-2xl' : 'text-xl'}`}>
              {t.medicine.confirmTitle}
            </h3>
          </div>
        </div>

        <p className={`text-slate-600 mb-6 leading-relaxed ${isEasyMode ? 'text-base font-medium' : 'text-sm'}`}>
          {t.medicine.confirmDesc}
        </p>

        {/* List of Detected Medicine Names */}
        <div className="space-y-3 mb-6">
          {names.map((name, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="text"
                value={name}
                onChange={(e) => handleUpdate(index, e.target.value)}
                placeholder={t.medicine.addMedicinePlaceholder}
                className={`flex-1 px-4 py-2.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium text-slate-800 ${
                  isEasyMode ? 'text-lg py-3' : 'text-base'
                }`}
              />
              {names.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                  aria-label="Remove medicine"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Add Another Medicine Input */}
        <div className="flex items-center gap-2 mb-8">
          <input
            type="text"
            value={newInput}
            onChange={(e) => setNewInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            placeholder={t.medicine.addMedicinePlaceholder}
            className="flex-1 px-4 py-2 rounded-xl border border-dashed border-teal-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-teal-50/30"
          />
          <button
            type="button"
            onClick={handleAdd}
            className="px-3.5 py-2 rounded-xl bg-teal-100 hover:bg-teal-200 text-teal-800 font-semibold text-sm flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>{t.medicine.addBtn}</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-medium text-sm transition-colors"
          >
            {t.common.cancel}
          </button>
          <button
            type="button"
            onClick={handleFinalConfirm}
            disabled={isLoading || names.filter((n) => n.trim()).length === 0}
            className={`w-full sm:w-auto px-6 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2 transition-all ${
              isLoading ? 'opacity-60 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? (
              <span>{t.medicine.analyzing}</span>
            ) : (
              <>
                <Check className="w-5 h-5" />
                <span>{t.medicine.confirmButton}</span>
                <ArrowRight className={`w-4 h-4 ${language === 'ur' ? 'rotate-180' : ''}`} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
