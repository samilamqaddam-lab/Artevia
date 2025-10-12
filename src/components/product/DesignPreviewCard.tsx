'use client';

import {ImageIcon, Paintbrush, Edit2, Trash2} from 'lucide-react';
import Image from 'next/image';
import {Button} from '@/components/ui/Button';

interface DesignPreviewCardProps {
  type: 'upload' | 'design';
  fileName?: string;
  fileUrl?: string;
  designPreview?: string;
  onEdit?: () => void;
  onRemove: () => void;
  copy: {
    uploadedFile: string;
    designCreated: string;
    actions: {
      edit: string;
      remove: string;
    };
  };
}

export function DesignPreviewCard({
  type,
  fileName,
  fileUrl,
  designPreview,
  onEdit,
  onRemove,
  copy
}: DesignPreviewCardProps) {
  const hasPreview = (type === 'upload' && fileUrl) || (type === 'design' && designPreview);

  return (
    <div className="rounded-2xl border-2 border-brand/40 bg-gradient-to-br from-brand/5 to-transparent p-4 dark:border-brand/30 dark:from-brand/10">
      <div className="flex items-start gap-4">
        {/* Preview Thumbnail */}
        {hasPreview ? (
          <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-white/10 dark:bg-[#0f0f0f]">
            <Image
              src={type === 'upload' ? fileUrl! : designPreview!}
              alt={type === 'upload' ? fileName! : 'Design preview'}
              fill
              className="object-contain"
            />
          </div>
        ) : (
          <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-xl border border-brand/40 bg-brand/10">
            {type === 'upload' ? (
              <ImageIcon size={32} className="text-brand" />
            ) : (
              <Paintbrush size={32} className="text-brand" />
            )}
          </div>
        )}

        {/* Info */}
        <div className="flex-1 space-y-1">
          <p className="text-sm font-semibold text-slate-900 dark:text-white">
            {type === 'upload' ? copy.uploadedFile : copy.designCreated}
          </p>
          {type === 'upload' && fileName && (
            <p className="text-xs text-slate-600 dark:text-slate-400">
              {fileName}
            </p>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            {onEdit && (
              <Button
                size="sm"
                variant="ghost"
                onClick={onEdit}
                className="h-8 gap-1 text-xs"
              >
                <Edit2 size={12} />
                {copy.actions.edit}
              </Button>
            )}
            <Button
              size="sm"
              variant="ghost"
              onClick={onRemove}
              className="h-8 gap-1 text-xs text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-950/20"
            >
              <Trash2 size={12} />
              {copy.actions.remove}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
