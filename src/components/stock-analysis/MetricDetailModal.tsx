// src/components/stock-analysis/MetricDetailModal.tsx
'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { learnContent } from "@/lib/learn-content";
import { useLanguage } from "@/context/LanguageContext";
import { CheckCircle, XCircle } from "lucide-react";

interface MetricDetailModalProps {
  metricId: string | null;
  onClose: () => void;
}

export const MetricDetailModal = ({ metricId, onClose }: MetricDetailModalProps) => {
  const { language } = useLanguage();
  if (!metricId) return null;

  const content = learnContent[metricId]?.[language];
  if (!content) return null;

  return (
    <Dialog open={!!metricId} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{content.title}</DialogTitle>
        </DialogHeader>
        <div className="mt-4 space-y-6 text-slate-600 dark:text-slate-300">
          <div>
            <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-100 mb-2">What is it?</h3>
            <p>{content.definition}</p>
          </div>
          <div>
            <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-100 mb-2">Why does it matter?</h3>
            <p>{content.importance}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <h4 className="font-semibold flex items-center gap-2 text-green-700 dark:text-green-400">
                <CheckCircle className="h-5 w-5" /> What is "Good"?
              </h4>
              <p className="mt-2 text-sm">{content.good}</p>
            </div>
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <h4 className="font-semibold flex items-center gap-2 text-red-700 dark:text-red-400">
                <XCircle className="h-5 w-5" /> What is "Bad"?
              </h4>
              <p className="mt-2 text-sm">{content.bad}</p>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-100 mb-2">Where to find it?</h3>
            <p className="text-sm italic">{content.source}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};