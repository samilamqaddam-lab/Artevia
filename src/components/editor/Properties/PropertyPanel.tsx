'use client';

import {motion, AnimatePresence} from 'framer-motion';
import {Palette, Type as TypeIcon, Move, Trash2, Copy, Layers} from 'lucide-react';
import {fabric} from 'fabric';
import {Button} from '@/components/ui/Button';

interface PropertyPanelProps {
  selectedObject: fabric.Object | null;
  backgroundColor: string;
  onUpdateProperty: (property: string, value: unknown) => void;
  onUpdateBackgroundColor: (color: string) => void;
  onUpdateTextContent: (text: string) => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onBringForward: () => void;
  onSendBackward: () => void;
}

export function PropertyPanel({
  selectedObject,
  backgroundColor,
  onUpdateProperty,
  onUpdateBackgroundColor,
  onUpdateTextContent,
  onDuplicate,
  onDelete,
  onBringForward,
  onSendBackward
}: PropertyPanelProps) {
  const isText = selectedObject instanceof fabric.Textbox || selectedObject instanceof fabric.IText;
  const fill = selectedObject?.get('fill') as string | undefined;
  const fontSize = selectedObject && 'fontSize' in selectedObject ? selectedObject.fontSize : undefined;
  const stroke = selectedObject?.get('stroke') as string | undefined;
  const textContent = isText ? (selectedObject as fabric.Textbox).text : '';

  return (
    <div className="flex h-full w-80 flex-shrink-0 flex-col border-l border-slate-200 bg-white dark:border-white/10 dark:bg-[#171717]">
      {/* Always show background color */}
      <div className="border-b border-slate-200 p-4 dark:border-white/10">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
          <Palette size={16} className="text-brand" />
          Fond de canvas
        </div>
        <div className="mt-3">
          <input
            type="color"
            value={backgroundColor}
            onChange={(e) => onUpdateBackgroundColor(e.target.value)}
            className="h-12 w-full cursor-pointer rounded-xl border-2 border-slate-200 dark:border-white/10"
          />
        </div>
      </div>

      {/* Object properties (shown only when selected) */}
      <AnimatePresence mode="wait">
        {selectedObject ? (
          <motion.div
            key="properties"
            initial={{opacity: 0, y: -10}}
            animate={{opacity: 1, y: 0}}
            exit={{opacity: 0, y: -10}}
            className="flex-1 overflow-y-auto p-4"
          >
            <div className="space-y-6">
              {/* Actions */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Actions rapides
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={onDuplicate}
                    className="justify-start gap-2"
                  >
                    <Copy size={14} />
                    Dupliquer
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={onDelete}
                    className="justify-start gap-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/20"
                  >
                    <Trash2 size={14} />
                    Supprimer
                  </Button>
                </div>
              </div>

              {/* Layering */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <Layers size={14} />
                  Ordre des calques
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={onBringForward}
                    className="flex-1"
                  >
                    ↑ Avant
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={onSendBackward}
                    className="flex-1"
                  >
                    ↓ Arrière
                  </Button>
                </div>
              </div>

              {/* Fill Color */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <Palette size={14} />
                  Couleur de remplissage
                </div>
                <input
                  type="color"
                  value={fill ?? '#000000'}
                  onChange={(e) => onUpdateProperty('fill', e.target.value)}
                  className="h-12 w-full cursor-pointer rounded-xl border-2 border-slate-200 dark:border-white/10"
                />
              </div>

              {/* Stroke Color (if has stroke) */}
              {stroke !== undefined && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Couleur du contour
                  </p>
                  <input
                    type="color"
                    value={stroke ?? '#000000'}
                    onChange={(e) => onUpdateProperty('stroke', e.target.value)}
                    className="h-12 w-full cursor-pointer rounded-xl border-2 border-slate-200 dark:border-white/10"
                  />
                </div>
              )}

              {/* Text properties */}
              {isText && (
                <>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                      <TypeIcon size={14} />
                      Taille du texte
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min={20}
                        max={320}
                        value={Number(fontSize ?? 120)}
                        onChange={(e) => onUpdateProperty('fontSize', Number(e.target.value))}
                        className="flex-1"
                      />
                      <span className="min-w-[3rem] text-right text-sm font-semibold text-slate-600 dark:text-slate-300">
                        {String(fontSize)}px
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Contenu du texte
                    </p>
                    <textarea
                      value={textContent}
                      onChange={(e) => onUpdateTextContent(e.target.value)}
                      className="min-h-[100px] w-full rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand focus:outline-none dark:border-white/10 dark:bg-[#0f0f0f] dark:text-white"
                      placeholder="Saisissez votre texte..."
                    />
                  </div>
                </>
              )}

              {/* Position info (read-only for now) */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <Move size={14} />
                  Position
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 dark:border-white/10 dark:bg-[#0f0f0f]">
                    <p className="text-slate-500">X</p>
                    <p className="font-mono font-semibold text-slate-900 dark:text-white">
                      {Math.round(selectedObject.left ?? 0)}px
                    </p>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 dark:border-white/10 dark:bg-[#0f0f0f]">
                    <p className="text-slate-500">Y</p>
                    <p className="font-mono font-semibold text-slate-900 dark:text-white">
                      {Math.round(selectedObject.top ?? 0)}px
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            className="flex flex-1 items-center justify-center p-8 text-center"
          >
            <div className="space-y-3">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-[#0f0f0f]">
                <Palette size={24} className="text-slate-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-white">
                  Aucune sélection
                </p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Cliquez sur un élément du canvas pour le modifier
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
