'use client';

import {Info} from 'lucide-react';

interface GuidesLegendProps {
  copy: {
    title: string;
    bleed: {name: string; description: string};
    safe: {name: string; description: string};
    print: {name: string; description: string};
    tip: string;
  };
}

export function GuidesLegend({copy}: GuidesLegendProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-[#171717]">
      <div className="mb-3 flex items-center gap-2">
        <Info size={16} className="text-brand" />
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
          {copy.title}
        </h3>
      </div>

      <div className="space-y-3 text-sm">
        {/* Zone de coupe (rouge) */}
        <div className="flex items-start gap-3">
          <div className="mt-0.5 h-4 w-4 flex-shrink-0 rounded border-2 border-red-500 bg-red-50 dark:bg-red-950/20" />
          <div className="flex-1">
            <p className="font-medium text-slate-900 dark:text-white">
              {copy.bleed.name}
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              {copy.bleed.description}
            </p>
          </div>
        </div>

        {/* Zone protégée (verte) */}
        <div className="flex items-start gap-3">
          <div className="mt-0.5 h-4 w-4 flex-shrink-0 rounded border-2 border-green-500 bg-green-50 dark:bg-green-950/20" />
          <div className="flex-1">
            <p className="font-medium text-slate-900 dark:text-white">
              {copy.safe.name}
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              {copy.safe.description}
            </p>
          </div>
        </div>

        {/* Zone visible (bleue) */}
        <div className="flex items-start gap-3">
          <div className="mt-0.5 h-4 w-4 flex-shrink-0 rounded border-2 border-blue-500 bg-blue-50 dark:bg-blue-950/20" />
          <div className="flex-1">
            <p className="font-medium text-slate-900 dark:text-white">
              {copy.print.name}
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              {copy.print.description}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-lg bg-brand/5 p-3 dark:bg-brand/10">
        <p className="text-xs text-slate-700 dark:text-slate-300">
          {copy.tip}
        </p>
      </div>
    </div>
  );
}
