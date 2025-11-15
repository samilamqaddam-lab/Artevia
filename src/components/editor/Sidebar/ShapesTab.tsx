'use client';

import {Square, Circle, Triangle as TriangleIcon} from 'lucide-react';
import {motion} from 'framer-motion';
import type {Locale} from '@/i18n/settings';
import {cn} from '@/lib/utils';

interface ShapesTabProps {
  locale: Locale;
  onAddShape: (shape: 'rect' | 'circle' | 'triangle') => void;
}

const SHAPES = [
  {
    id: 'rect' as const,
    icon: Square,
    label: 'Rectangle',
    color: '#1f6f8b'
  },
  {
    id: 'circle' as const,
    icon: Circle,
    label: 'Cercle',
    color: '#f89d13'
  },
  {
    id: 'triangle' as const,
    icon: TriangleIcon,
    label: 'Triangle',
    color: '#f97316'
  }
];

export function ShapesTab({locale: _locale, onAddShape}: ShapesTabProps) {
  return (
    <div className="space-y-4">
      <header className="flex items-center gap-2">
        <Square size={18} className="text-brand" aria-hidden />
        <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
          Formes
        </h2>
      </header>

      <p className="text-xs text-slate-600 dark:text-slate-400">
        Ajoutez des formes géométriques à votre design
      </p>

      <div className="grid grid-cols-2 gap-3">
        {SHAPES.map((shape, index) => {
          const Icon = shape.icon;

          return (
            <motion.button
              key={shape.id}
              initial={{opacity: 0, scale: 0.9}}
              animate={{opacity: 1, scale: 1}}
              transition={{delay: index * 0.05}}
              onClick={() => onAddShape(shape.id)}
              className={cn(
                'group relative flex aspect-square flex-col items-center justify-center gap-3 rounded-2xl border-2 border-slate-200 bg-white transition-all',
                'hover:border-brand hover:shadow-lg dark:border-white/10 dark:bg-[#1f1f1f]'
              )}
            >
              <div
                className="rounded-full p-4 transition-transform group-hover:scale-110"
                style={{backgroundColor: `${shape.color}20`}}
              >
                <Icon
                  size={28}
                  className="transition-colors"
                  style={{color: shape.color}}
                  aria-hidden
                />
              </div>
              <span className="text-xs font-medium text-slate-700 dark:text-slate-200">
                {shape.label}
              </span>
            </motion.button>
          );
        })}
      </div>

      <div className="space-y-2">
        <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
          Personnalisation
        </p>
        <div className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
          <p>• Modifiez la couleur avec le panneau de propriétés</p>
          <p>• Redimensionnez en glissant les coins</p>
          <p>• Faites pivoter avec les poignées</p>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-white/10 dark:bg-[#0f0f0f]">
        <p className="text-xs text-slate-600 dark:text-slate-400">
          💡 Astuce : Combinez plusieurs formes pour créer des designs complexes
        </p>
      </div>
    </div>
  );
}
