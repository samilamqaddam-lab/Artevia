'use client';

import {motion} from 'framer-motion';
import {Sparkles} from 'lucide-react';
import Image from 'next/image';
import {getTemplatesForProduct} from '@/lib/editor/templates';
import type {Product} from '@/lib/products';
import type {Locale} from '@/i18n/settings';
import {cn} from '@/lib/utils';

interface TemplatesTabProps {
  product: Product;
  locale: Locale;
  onLoadTemplate: (templateCanvas: Record<string, unknown>) => void;
}

export function TemplatesTab({product, locale, onLoadTemplate}: TemplatesTabProps) {
  const templates = getTemplatesForProduct(product.id);

  return (
    <div className="space-y-4">
      <header className="flex items-center gap-2">
        <Sparkles size={18} className="text-brand" aria-hidden />
        <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
          Templates
        </h2>
      </header>

      <p className="text-xs text-slate-600 dark:text-slate-400">
        Démarrez rapidement avec un modèle prédéfini
      </p>

      <div className="grid grid-cols-2 gap-3">
        {templates.map((template, index) => (
          <motion.button
            key={template.id}
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{delay: index * 0.05}}
            onClick={() => onLoadTemplate(template.canvas)}
            className={cn(
              'group relative overflow-hidden rounded-2xl border-2 border-slate-200 bg-white transition-all',
              'hover:border-brand hover:shadow-lg dark:border-white/10 dark:bg-[#1f1f1f]'
            )}
          >
            {/* Template Preview */}
            <div className="relative aspect-square bg-slate-50 dark:bg-[#0f0f0f]">
              {template.thumbnail ? (
                <Image
                  src={template.thumbnail}
                  alt={template.name}
                  fill
                  className="object-cover"
                  sizes="150px"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <Sparkles size={32} className="text-slate-300 dark:text-slate-600" />
                </div>
              )}

              {/* Hover Overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-brand/0 transition-all group-hover:bg-brand/10">
                <span className="scale-0 text-xs font-semibold text-brand transition-transform group-hover:scale-100">
                  Utiliser
                </span>
              </div>
            </div>

            {/* Template Name */}
            <div className="p-2">
              <p className="text-xs font-medium text-slate-700 dark:text-slate-200">
                {template.name}
              </p>
            </div>
          </motion.button>
        ))}
      </div>

      {templates.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Sparkles size={32} className="mb-3 text-slate-300" />
          <p className="text-sm text-slate-500">
            Aucun template disponible pour ce produit
          </p>
        </div>
      )}
    </div>
  );
}
