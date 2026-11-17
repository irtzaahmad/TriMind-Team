'use client';

import React, { useState } from 'react';
import { TestResultItem, TestStatus } from '@/types';
import { useLanguage } from '@/hooks/useLanguage';
import {
  CheckCircle2,
  ArrowUpCircle,
  ArrowDownCircle,
  HelpCircle,
  AlertOctagon,
  EyeOff,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface ReportTableProps {
  testResults: TestResultItem[];
}

export default function ReportTable({ testResults }: ReportTableProps) {
  const { t, isEasyMode } = useLanguage();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const getStatusBadge = (status: TestStatus, isBlurry?: boolean) => {
    if (isBlurry || status === 'unclear') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-300">
          <EyeOff className="w-3.5 h-3.5" />
          <span>{t.report.statusLabels.unclear}</span>
        </span>
      );
    }

    switch (status) {
      case 'normal':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>{t.report.statusLabels.normal}</span>
          </span>
        );
      case 'high':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-300">
            <ArrowUpCircle className="w-3.5 h-3.5 text-rose-600" />
            <span>{t.report.statusLabels.high}</span>
          </span>
        );
      case 'low':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-300">
            <ArrowDownCircle className="w-3.5 h-3.5 text-amber-600" />
            <span>{t.report.statusLabels.low}</span>
          </span>
        );
      case 'not_provided':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
            <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
            <span>{t.report.statusLabels.not_provided}</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200">
            <AlertOctagon className="w-3.5 h-3.5 text-blue-600" />
            <span>{t.report.statusLabels.unknown}</span>
          </span>
        );
    }
  };

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-3xl border border-slate-200/80 shadow-md overflow-hidden">
      <div className="p-6 border-b border-slate-100">
        <h3 className={`font-bold text-slate-900 ${isEasyMode ? 'text-2xl' : 'text-xl'}`}>
          {t.report.testsFound} ({testResults.length})
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          {t.report.validationBadge}
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 text-slate-600 text-xs sm:text-sm uppercase font-semibold border-b border-slate-200">
              <th className="p-4">{t.report.testTable.name}</th>
              <th className="p-4">{t.report.testTable.value}</th>
              <th className="p-4">{t.report.testTable.range}</th>
              <th className="p-4">{t.report.testTable.status}</th>
              <th className="p-4 w-12"><span className="sr-only">Details</span></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-800 text-sm">
            {testResults.map((item, index) => {
              const isExpanded = expandedIndex === index;
              return (
                <React.Fragment key={index}>
                  <tr
                    onClick={() => toggleExpand(index)}
                    className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                  >
                    <td className={`p-4 font-semibold text-slate-900 ${isEasyMode ? 'text-lg' : 'text-sm sm:text-base'}`}>
                      {item.testName}
                    </td>
                    <td className={`p-4 font-bold ${isEasyMode ? 'text-lg' : 'text-sm sm:text-base'}`}>
                      <span className={item.status === 'high' ? 'text-rose-600' : item.status === 'low' ? 'text-amber-600' : 'text-slate-900'}>
                        {item.value} {item.unit}
                      </span>
                    </td>
                    <td className="p-4 text-slate-600 font-mono text-xs sm:text-sm">
                      {item.referenceRange}
                    </td>
                    <td className="p-4">
                      {getStatusBadge(item.status, item.isBlurryOrUnclear)}
                    </td>
                    <td className="p-4 text-slate-400">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </td>
                  </tr>

                  {/* Expandable Explanation Row */}
                  {isExpanded && item.statusExplanation && (
                    <tr className="bg-teal-50/40">
                      <td colSpan={5} className="p-4 text-xs sm:text-sm text-slate-700 leading-relaxed border-t border-teal-100">
                        <div className="flex items-start gap-2">
                          <span className="font-semibold text-teal-800 shrink-0">{t.common.meaning}:</span>
                          <span>{item.statusExplanation}</span>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
