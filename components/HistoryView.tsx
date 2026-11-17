'use client';

import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { HistoryItem, MedicineAnalysis, MedicalReportAnalysis } from '@/types';
import MedicineCard from '@/components/MedicineExplainer/MedicineCard';
import ReportSummaryCard from '@/components/ReportExplainer/ReportSummaryCard';
import ReportTable from '@/components/ReportExplainer/ReportTable';
import { History, Trash2, Pill, FileText, ArrowRight, Eye } from 'lucide-react';

interface HistoryViewProps {
  onSelectTab: (tab: 'medicine' | 'report' | 'assistant') => void;
}

export default function HistoryView({ onSelectTab }: HistoryViewProps) {
  const { history, clearHistory, t, isEasyMode, setActiveContext } = useLanguage();
  const [selectedItem, setSelectedItem] = React.useState<HistoryItem | null>(null);

  const handleInspect = (item: HistoryItem) => {
    setSelectedItem(item);
    setActiveContext({
      type: item.type,
      title: item.title,
      summary: item.type === 'medicine'
        ? `Medicine: ${item.title}`
        : `Lab Report: ${item.title}`,
      data: item.data,
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h2 className={`font-bold text-slate-900 ${isEasyMode ? 'text-2xl' : 'text-xl'}`}>
              {t.history.title}
            </h2>
            <p className="text-xs text-slate-500">{t.history.savedAlert}</p>
          </div>
        </div>

        {history.length > 0 && (
          <button
            type="button"
            onClick={clearHistory}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 font-semibold text-xs transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>{t.history.clear}</span>
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="bg-white/80 rounded-3xl p-10 text-center border border-slate-200/80 shadow-xs">
          <p className="text-slate-500 text-sm mb-4">{t.history.empty}</p>
          <div className="flex justify-center gap-3">
            <button
              type="button"
              onClick={() => onSelectTab('medicine')}
              className="px-4 py-2 rounded-xl bg-teal-600 text-white text-xs font-bold"
            >
              {t.hero.startMedicine}
            </button>
            <button
              type="button"
              onClick={() => onSelectTab('report')}
              className="px-4 py-2 rounded-xl bg-sky-600 text-white text-xs font-bold"
            >
              {t.hero.startReport}
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {history.map((item) => (
            <div
              key={item.id}
              onClick={() => handleInspect(item)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && handleInspect(item)}
              className="p-4 rounded-2xl bg-white/90 border border-slate-200 hover:border-teal-300 shadow-xs hover:shadow-md transition-all flex items-center justify-between cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  item.type === 'medicine' ? 'bg-teal-50 text-teal-600' : 'bg-sky-50 text-sky-600'
                }`}>
                  {item.type === 'medicine' ? <Pill className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm group-hover:text-teal-700 transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-400">{item.date}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-semibold text-teal-700">
                <span>{t.history.view}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Selected Item Modal / Inspector */}
      {selectedItem && (
        <div className="mt-8 pt-6 border-t border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-900">
              {t.history.inspectionTitle}: {selectedItem.title}
            </h3>
            <button
              type="button"
              onClick={() => setSelectedItem(null)}
              className="text-xs font-semibold px-3 py-1 bg-slate-100 rounded-lg text-slate-600 hover:bg-slate-200"
            >
              {t.common.close}
            </button>
          </div>

          {selectedItem.type === 'medicine' ? (
            <MedicineCard data={selectedItem.data as MedicineAnalysis} />
          ) : (
            <div className="space-y-6">
              <ReportSummaryCard data={selectedItem.data as MedicalReportAnalysis} />
              <ReportTable testResults={(selectedItem.data as MedicalReportAnalysis).testResults} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
