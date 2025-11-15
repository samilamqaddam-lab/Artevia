'use client';

import {motion} from 'framer-motion';
import {ArrowLeft, Undo as _Undo, Redo as _Redo, Download, Save, Eye, Grid3x3} from 'lucide-react';
import {Button} from '@/components/ui/Button';
import {cn} from '@/lib/utils';

interface EditorHeaderProps {
  projectName: string;
  onProjectNameChange: (name: string) => void;
  onBack: () => void;
  onSave: () => void;
  onExport: (format: 'png' | 'svg' | 'json') => void;
  onToggleGuides: (guide: 'bleed' | 'safe' | 'print') => void;
  guides: {
    bleed?: boolean;
    safe?: boolean;
    print?: boolean;
  };
  isSaving?: boolean;
  isDirty?: boolean;
}

export function EditorHeader({
  projectName,
  onProjectNameChange,
  onBack,
  onSave,
  onExport,
  onToggleGuides,
  guides,
  isSaving = false,
  isDirty = false
}: EditorHeaderProps) {
  return (
    <motion.header
      initial={{opacity: 0, y: -20}}
      animate={{opacity: 1, y: 0}}
      className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 dark:border-white/10 dark:bg-[#171717]"
    >
      {/* Left: Back + Project Name */}
      <div className="flex items-center gap-3">
        <Button
          size="sm"
          variant="ghost"
          onClick={onBack}
          className="gap-2"
        >
          <ArrowLeft size={16} aria-hidden />
          Retour
        </Button>

        <div className="h-6 w-px bg-slate-200 dark:bg-white/10" />

        <input
          type="text"
          value={projectName}
          onChange={(e) => onProjectNameChange(e.target.value)}
          className={cn(
            'rounded-lg border border-transparent bg-transparent px-3 py-1.5 text-sm font-semibold text-slate-900 transition-colors',
            'hover:border-slate-200 hover:bg-slate-50 focus:border-brand focus:outline-none',
            'dark:text-white dark:hover:border-white/10 dark:hover:bg-[#1f1f1f] dark:focus:border-brand'
          )}
          placeholder="Nom du projet"
        />

        {isDirty && (
          <span className="text-xs text-slate-500 dark:text-slate-400">
            (non sauvegardé)
          </span>
        )}
      </div>

      {/* Center: Actions */}
      <div className="flex items-center gap-2">
        {/* Guides Toggle */}
        <div className="flex items-center gap-1 rounded-lg border border-slate-200 p-1 dark:border-white/10">
          <Button
            size="sm"
            variant={guides.bleed ? 'primary' : 'ghost'}
            onClick={() => onToggleGuides('bleed')}
            title="Zone de fond perdu"
            className="h-7 px-2"
          >
            <Grid3x3 size={14} aria-hidden />
          </Button>
          <Button
            size="sm"
            variant={guides.safe ? 'primary' : 'ghost'}
            onClick={() => onToggleGuides('safe')}
            title="Zone de sécurité"
            className="h-7 px-2"
          >
            <Eye size={14} aria-hidden />
          </Button>
        </div>
      </div>

      {/* Right: Save + Export */}
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="secondary"
          onClick={onSave}
          loading={isSaving}
          disabled={!isDirty}
          className="gap-2"
        >
          <Save size={14} aria-hidden />
          Sauvegarder
        </Button>

        <div className="relative">
          <Button
            size="sm"
            variant="primary"
            onClick={() => onExport('png')}
            className="gap-2"
          >
            <Download size={14} aria-hidden />
            Télécharger
          </Button>
          {/* TODO: Add dropdown for export formats */}
        </div>
      </div>
    </motion.header>
  );
}
