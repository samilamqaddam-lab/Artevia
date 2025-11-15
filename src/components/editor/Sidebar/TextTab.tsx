'use client';

import {Type} from 'lucide-react';
import {Button} from '@/components/ui/Button';
import type {Locale} from '@/i18n/settings';

interface TextTabProps {
  locale: Locale;
  onAddText: (options?: {
    text?: string;
    fontSize?: number;
    fontWeight?: string | number;
  }) => void;
}

const TEXT_PRESETS = [
  {id: 'heading', label: 'Titre', fontSize: 120, text: 'Titre Principal', fontWeight: 'bold'},
  {id: 'subheading', label: 'Sous-titre', fontSize: 80, text: 'Sous-titre', fontWeight: 600},
  {id: 'body', label: 'Corps', fontSize: 50, text: 'Texte de corps', fontWeight: 'normal'}
];

export function TextTab({locale: _locale, onAddText}: TextTabProps) {
  return (
    <div className="space-y-4">
      <header className="flex items-center gap-2">
        <Type size={18} className="text-brand" aria-hidden />
        <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
          Texte
        </h2>
      </header>

      <p className="text-xs text-slate-600 dark:text-slate-400">
        Ajoutez du texte à votre design
      </p>

      <div className="space-y-3">
        <Button
          size="md"
          variant="primary"
          onClick={() => onAddText()}
          className="w-full justify-start gap-2"
        >
          <Type size={16} aria-hidden />
          Ajouter du texte
        </Button>

        <div className="space-y-2">
          <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
            Styles prédéfinis
          </p>
          {TEXT_PRESETS.map(preset => (
            <button
              key={preset.id}
              onClick={() => onAddText({
                text: preset.text,
                fontSize: preset.fontSize,
                fontWeight: preset.fontWeight
              })}
              className="w-full rounded-xl border border-slate-200 bg-white p-3 text-left transition-all hover:border-brand hover:shadow-sm dark:border-white/10 dark:bg-[#1f1f1f] dark:hover:border-brand"
            >
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {preset.label} · {preset.fontSize}px
              </p>
              <p
                className="mt-1 text-slate-900 dark:text-white"
                style={{
                  fontSize: `${Math.min(preset.fontSize / 5, 20)}px`,
                  fontWeight: preset.fontWeight
                }}
              >
                {preset.text}
              </p>
            </button>
          ))}
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-white/10 dark:bg-[#0f0f0f]">
          <p className="text-xs text-slate-600 dark:text-slate-400">
            💡 Astuce : Double-cliquez sur le texte pour le modifier directement sur le canvas
          </p>
        </div>
      </div>
    </div>
  );
}
