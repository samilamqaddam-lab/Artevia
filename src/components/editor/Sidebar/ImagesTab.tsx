'use client';

import {useCallback} from 'react';
import {useDropzone} from 'react-dropzone';
import {Image as ImageIcon, Upload, Sparkles} from 'lucide-react';
import {Button} from '@/components/ui/Button';
import type {Locale} from '@/i18n/settings';
import {cn} from '@/lib/utils';

interface ImagesTabProps {
  locale: Locale;
  onUploadImage: (file?: File) => void;
}

export function ImagesTab({onUploadImage}: ImagesTabProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onUploadImage(acceptedFiles[0]);
    }
  }, [onUploadImage]);

  const {getRootProps, getInputProps, isDragActive} = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.svg', '.webp']
    },
    multiple: false
  });

  return (
    <div className="space-y-4">
      <header className="flex items-center gap-2">
        <ImageIcon size={18} className="text-brand" aria-hidden />
        <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
          Images
        </h2>
      </header>

      <p className="text-xs text-slate-600 dark:text-slate-400">
        Ajoutez des images ou votre logo
      </p>

      {/* Drag & Drop Zone */}
      <div
        {...getRootProps()}
        className={cn(
          'rounded-2xl border-2 border-dashed p-8 text-center transition-all cursor-pointer',
          isDragActive
            ? 'border-brand bg-brand/5'
            : 'border-slate-300 bg-slate-50 hover:border-brand hover:bg-slate-100 dark:border-white/20 dark:bg-[#0f0f0f] dark:hover:border-brand'
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-3">
          {isDragActive ? (
            <>
              <Sparkles size={32} className="text-brand" />
              <p className="text-sm font-medium text-brand">
                Déposez votre image ici
              </p>
            </>
          ) : (
            <>
              <Upload size={32} className="text-slate-400" />
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-white">
                  Glissez une image
                </p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  ou cliquez pour parcourir
                </p>
              </div>
              <p className="text-xs text-slate-400">
                PNG, JPG, SVG jusqu&apos;à 10MB
              </p>
            </>
          )}
        </div>
      </div>

      <Button
        size="md"
        variant="secondary"
        onClick={() => onUploadImage()}
        className="w-full justify-start gap-2"
      >
        <Upload size={16} aria-hidden />
        Parcourir les fichiers
      </Button>

      <div className="space-y-2">
        <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
          Recommandations
        </p>
        <div className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
          <p>✓ Logo vectoriel (SVG) pour meilleure qualité</p>
          <p>✓ Fond transparent (PNG) recommandé</p>
          <p>✓ Haute résolution (min 300 DPI)</p>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-white/10 dark:bg-[#0f0f0f]">
        <p className="text-xs text-slate-600 dark:text-slate-400">
          💡 Astuce : Utilisez des images haute résolution pour une impression optimale
        </p>
      </div>
    </div>
  );
}
