'use client';

import {useCallback} from 'react';
import {useDropzone} from 'react-dropzone';
import {Upload, Sparkles, ImageIcon, Paintbrush} from 'lucide-react';
import {Button} from '@/components/ui/Button';
import {cn} from '@/lib/utils';

export type PersonalizationMode = 'none' | 'upload' | 'design';

interface PersonalizationSelectorProps {
  mode: PersonalizationMode;
  onModeChange: (mode: PersonalizationMode) => void;
  onFileUpload: (file: File | null) => void;
  onDesignClick: () => void;
  uploadedFile: File | null;
  hasDesign: boolean;
  copy: {
    title: string;
    description: string;
    modes: {
      none: string;
      upload: string;
      design: string;
    };
    uploadZone: {
      dragActive: string;
      dragInactive: string;
      browse: string;
      formats: string;
    };
    actions: {
      openEditor: string;
      change: string;
    };
  };
}

export function PersonalizationSelector({
  mode,
  onModeChange,
  onFileUpload,
  onDesignClick,
  uploadedFile,
  hasDesign,
  copy
}: PersonalizationSelectorProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onFileUpload(acceptedFiles[0]);
        onModeChange('upload');
      }
    },
    [onFileUpload, onModeChange]
  );

  const {getRootProps, getInputProps, isDragActive} = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.svg', '.webp', '.pdf']
    },
    multiple: false,
    noClick: mode === 'upload' && uploadedFile !== null
  });

  return (
    <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 text-slate-900 shadow-sm dark:border-white/10 dark:bg-[#161616] dark:text-slate-100">
      <header className="space-y-1">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          {copy.title}
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          {copy.description}
        </p>
      </header>

      {/* Mode Selection */}
      <div className="grid gap-3">
        {/* None */}
        <button
          type="button"
          onClick={() => onModeChange('none')}
          className={cn(
            'flex items-center gap-3 rounded-xl border-2 p-4 text-left transition-all',
            mode === 'none'
              ? 'border-brand bg-brand/5 dark:bg-brand/10'
              : 'border-slate-200 hover:border-slate-300 dark:border-white/10 dark:hover:border-white/20'
          )}
        >
          <div
            className={cn(
              'flex h-5 w-5 items-center justify-center rounded-full border-2',
              mode === 'none'
                ? 'border-brand bg-brand'
                : 'border-slate-300 dark:border-slate-600'
            )}
          >
            {mode === 'none' && (
              <div className="h-2 w-2 rounded-full bg-white" />
            )}
          </div>
          <div className="flex-1">
            <p className="font-medium text-slate-900 dark:text-white">
              {copy.modes.none}
            </p>
          </div>
        </button>

        {/* Upload */}
        <button
          type="button"
          onClick={() => onModeChange('upload')}
          className={cn(
            'flex items-center gap-3 rounded-xl border-2 p-4 text-left transition-all',
            mode === 'upload'
              ? 'border-brand bg-brand/5 dark:bg-brand/10'
              : 'border-slate-200 hover:border-slate-300 dark:border-white/10 dark:hover:border-white/20'
          )}
        >
          <div
            className={cn(
              'flex h-5 w-5 items-center justify-center rounded-full border-2',
              mode === 'upload'
                ? 'border-brand bg-brand'
                : 'border-slate-300 dark:border-slate-600'
            )}
          >
            {mode === 'upload' && (
              <div className="h-2 w-2 rounded-full bg-white" />
            )}
          </div>
          <ImageIcon size={18} className="text-slate-400" />
          <div className="flex-1">
            <p className="font-medium text-slate-900 dark:text-white">
              {copy.modes.upload}
            </p>
          </div>
        </button>

        {/* Design */}
        <button
          type="button"
          onClick={() => onModeChange('design')}
          className={cn(
            'flex items-center gap-3 rounded-xl border-2 p-4 text-left transition-all',
            mode === 'design'
              ? 'border-brand bg-brand/5 dark:bg-brand/10'
              : 'border-slate-200 hover:border-slate-300 dark:border-white/10 dark:hover:border-white/20'
          )}
        >
          <div
            className={cn(
              'flex h-5 w-5 items-center justify-center rounded-full border-2',
              mode === 'design'
                ? 'border-brand bg-brand'
                : 'border-slate-300 dark:border-slate-600'
            )}
          >
            {mode === 'design' && (
              <div className="h-2 w-2 rounded-full bg-white" />
            )}
          </div>
          <Paintbrush size={18} className="text-slate-400" />
          <div className="flex-1">
            <p className="font-medium text-slate-900 dark:text-white">
              {copy.modes.design}
            </p>
          </div>
        </button>
      </div>

      {/* Upload Zone */}
      {mode === 'upload' && (
        <div className="mt-4 space-y-3">
          {!uploadedFile ? (
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
                      {copy.uploadZone.dragActive}
                    </p>
                  </>
                ) : (
                  <>
                    <Upload size={32} className="text-slate-400" />
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">
                        {copy.uploadZone.dragInactive}
                      </p>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        {copy.uploadZone.browse}
                      </p>
                    </div>
                    <p className="text-xs text-slate-400">
                      {copy.uploadZone.formats}
                    </p>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border-2 border-brand/40 bg-brand/5 p-4 dark:bg-brand/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/20">
                    <ImageIcon size={20} className="text-brand" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      {uploadedFile.name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    onFileUpload(null);
                  }}
                >
                  {copy.actions.change}
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Design Editor Button */}
      {mode === 'design' && (
        <div className="mt-4">
          <Button
            size="md"
            variant={hasDesign ? 'secondary' : 'primary'}
            onClick={onDesignClick}
            className="w-full"
          >
            <Paintbrush size={16} />
            {copy.actions.openEditor}
          </Button>
          {hasDesign && (
            <p className="mt-2 text-center text-xs text-brand">
              ✓ Design créé
            </p>
          )}
        </div>
      )}
    </div>
  );
}
