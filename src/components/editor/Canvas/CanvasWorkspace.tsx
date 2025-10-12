'use client';

import {useEffect, useRef} from 'react';
import {motion} from 'framer-motion';
import {Minus, Plus, Maximize2} from 'lucide-react';
import {Button} from '@/components/ui/Button';
import {cn} from '@/lib/utils';

interface CanvasWorkspaceProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  canvasWidth: number;
  canvasHeight: number;
  displayWidth: number;
  displayHeight: number;
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  className?: string;
}

export function CanvasWorkspace({
  canvasRef,
  canvasWidth,
  canvasHeight,
  displayWidth,
  displayHeight,
  zoom,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  className
}: CanvasWorkspaceProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Center the canvas when zoom changes
    if (containerRef.current) {
      const container = containerRef.current;
      const scrollX = (container.scrollWidth - container.clientWidth) / 2;
      const scrollY = (container.scrollHeight - container.clientHeight) / 2;
      container.scrollTo(scrollX, scrollY);
    }
  }, [zoom]);

  return (
    <div className={cn('relative flex h-full flex-col', className)}>
      {/* Canvas Container */}
      <div
        ref={containerRef}
        className="relative flex flex-1 items-center justify-center overflow-auto bg-slate-100 dark:bg-[#0f0f0f]"
      >
        <motion.div
          initial={{opacity: 0, scale: 0.95}}
          animate={{opacity: 1, scale: 1}}
          transition={{duration: 0.3}}
          className="relative m-8 overflow-hidden rounded-2xl border-2 border-slate-300 bg-white shadow-2xl dark:border-white/20 dark:shadow-[0_20px_60px_-20px_rgba(0,0,0,0.5)]"
          style={{
            width: `${displayWidth}px`,
            height: `${displayHeight}px`
          }}
        >
          <canvas
            ref={canvasRef}
            width={canvasWidth}
            height={canvasHeight}
            className="h-full w-full"
            style={{
              width: `${displayWidth}px`,
              height: `${displayHeight}px`
            }}
          />
        </motion.div>
      </div>

      {/* Floating Zoom Controls */}
      <motion.div
        initial={{opacity: 0, y: 20}}
        animate={{opacity: 1, y: 0}}
        transition={{delay: 0.2}}
        className="absolute bottom-6 right-6 flex items-center gap-2 rounded-full border border-slate-200 bg-white/95 px-3 py-2 shadow-lg backdrop-blur-sm dark:border-white/10 dark:bg-[#171717]/95"
      >
        <Button
          size="sm"
          variant="ghost"
          onClick={onZoomOut}
          disabled={zoom <= 0.2}
          aria-label="Zoom arrière"
          className="h-8 w-8 p-0"
        >
          <Minus size={14} aria-hidden />
        </Button>

        <button
          onClick={onResetZoom}
          className="min-w-[3rem] px-2 text-xs font-semibold text-slate-600 hover:text-brand dark:text-slate-300"
        >
          {Math.round(zoom * 100)}%
        </button>

        <Button
          size="sm"
          variant="ghost"
          onClick={onZoomIn}
          disabled={zoom >= 3}
          aria-label="Zoom avant"
          className="h-8 w-8 p-0"
        >
          <Plus size={14} aria-hidden />
        </Button>

        <div className="mx-1 h-5 w-px bg-slate-200 dark:bg-white/10" />

        <Button
          size="sm"
          variant="ghost"
          onClick={onResetZoom}
          aria-label="Adapter à l'écran"
          className="h-8 w-8 p-0"
        >
          <Maximize2 size={14} aria-hidden />
        </Button>
      </motion.div>
    </div>
  );
}
