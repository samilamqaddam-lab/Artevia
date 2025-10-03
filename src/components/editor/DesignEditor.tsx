'use client';

import type React from 'react';
import {useEffect, useMemo, useRef, useState, useTransition} from 'react';
import {fabric} from 'fabric';
import {useTranslations} from 'next-intl';
import {useSearchParams} from 'next/navigation';
import {
  DownloadCloud,
  Layers,
  Minus,
  Plus,
  RefreshCcw,
  Save,
  Type,
  Upload,
  Square,
  Circle,
  Triangle
} from 'lucide-react';
import {Button} from '@/components/ui/Button';
import type {ImprintZone, Product} from '@/lib/products';
import {generateId, isRTL} from '@/lib/utils';
import {useEditorStore} from '@/stores/editor-store';
import type {Locale} from '@/i18n/settings';
import type {ProjectStore} from '@/lib/storage/projects';
import {deleteProject, listProjects, upsertProject} from '@/lib/storage/projects';
import type {QuoteMode} from '@/types/quote';

fabric.Object.prototype.set({transparentCorners: false, cornerColor: '#1f6f8b', borderColor: '#1f6f8b'});

const MAX_CANVAS_WIDTH = 840;
const MAX_CANVAS_HEIGHT = 620;
const MIN_CANVAS_WIDTH = 260;

const DEFAULT_SHAPES = {
  rect: () => new fabric.Rect({
    width: 360,
    height: 220,
    fill: '#1f6f8b',
    rx: 12,
    ry: 12
  }),
  circle: () => new fabric.Circle({radius: 140, fill: '#f89d13'}),
  triangle: () => new fabric.Triangle({
    width: 260,
    height: 220,
    fill: '#f97316'
  })
};

interface EditorApi {
  capture: (format?: 'jpeg' | 'png') => string | null;
}

interface DesignEditorProps {
  product: Product;
  locale: Locale;
  mode?: QuoteMode;
  activeZone?: ImprintZone;
  onCanvasReady?: (api: EditorApi | null) => void;
}

type GuideRefs = {
  bleed?: fabric.Rect;
  safe?: fabric.Rect;
  print?: fabric.Rect;
};

type ExportFormat = 'png' | 'svg' | 'json';

export function DesignEditor({product, locale, mode = 'logo', activeZone, onCanvasReady}: DesignEditorProps) {
  const canvasElementRef = useRef<HTMLCanvasElement | null>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas>();
  const [selectedObject, setSelectedObject] = useState<fabric.Object | null>(null);
  const [layers, setLayers] = useState<fabric.Object[]>([]);
  const [projects, setProjects] = useState<ProjectStore[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const guideRefs = useRef<GuideRefs>({});
  const [isPending, startTransition] = useTransition();
  const [saving, setSaving] = useState(false);
  const searchParams = useSearchParams();
  const initialProjectId = useRef<string | null>(null);

  const tEditor = useTranslations('editor');
  const tCommon = useTranslations('common');
  const tDesigns = useTranslations('designs');
  const dir = isRTL(locale) ? 'rtl' : 'ltr';

  const {
    projectId,
    projectName,
    activeTool,
    zoom,
    guides,
    backgroundColor,
    setProjectId,
    setProjectName,
    setActiveTool,
    setZoom,
    setGuides,
    setBackgroundColor,
    markDirty,
    isDirty
  } = useEditorStore();

  const canvasConfig = useMemo(
    () => (mode === 'logo' && activeZone ? activeZone : product.creationCanvas),
    [activeZone, mode, product.creationCanvas]
  );
  const allowShapes = mode === 'creative';
  const allowText = true;
  const allowImage = true;

  useEffect(() => {
    if (!allowShapes && activeTool === 'shape') {
      setActiveTool('select');
    }
  }, [allowShapes, activeTool, setActiveTool]);

  const [viewportWidth, setViewportWidth] = useState<number>(() =>
    typeof window === 'undefined' ? MAX_CANVAS_WIDTH : window.innerWidth
  );

  const aspectRatio = canvasConfig.height / canvasConfig.width;

  const {displayWidth, displayHeight, baseZoom} = useMemo(() => {
    const horizontalPadding = viewportWidth > 1024 ? 320 : 64;
    let width = Math.min(MAX_CANVAS_WIDTH, viewportWidth - horizontalPadding);
    width = Math.max(MIN_CANVAS_WIDTH, width);
    let height = width * aspectRatio;
    if (height > MAX_CANVAS_HEIGHT) {
      height = MAX_CANVAS_HEIGHT;
      width = Math.max(MIN_CANVAS_WIDTH, height / aspectRatio);
    }
    const zoom = width / canvasConfig.width;
    return {displayWidth: width, displayHeight: height, baseZoom: zoom};
  }, [aspectRatio, canvasConfig.width, viewportWidth]);

  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setProjectName(`${product.id}-draft`);
    setProjectId(undefined);
    setBackgroundColor('#ffffff');
    initialProjectId.current = searchParams.get('projectId');
  }, [product.id, searchParams, setBackgroundColor, setProjectId, setProjectName]);

  useEffect(() => {
    if (!canvasElementRef.current) {
      return () => undefined;
    }

    const fabricCanvas = new fabric.Canvas(canvasElementRef.current, {
      selection: true,
      preserveObjectStacking: true
    });

    fabricCanvas.setWidth(canvasConfig.width);
    fabricCanvas.setHeight(canvasConfig.height);
    fabricCanvas.setBackgroundColor('#ffffff', () => fabricCanvas.renderAll());

    const updateSelection = () => {
      const active = fabricCanvas.getActiveObject() ?? null;
      setSelectedObject(active);
    };

    const updateLayers = () => {
      const visibleObjects = fabricCanvas
        .getObjects()
        .filter((obj) => !(obj.data && obj.data.isGuide));
      setLayers([...visibleObjects].reverse());
    };

    fabricCanvas.on('selection:created', updateSelection);
    fabricCanvas.on('selection:updated', updateSelection);
    fabricCanvas.on('selection:cleared', () => setSelectedObject(null));
    fabricCanvas.on('object:added', (event) => {
      updateLayers();
      if (!(event.target?.data && event.target.data.isGuide)) {
        markDirty(true);
      }
    });
    fabricCanvas.on('object:removed', (event) => {
      updateLayers();
      if (!(event.target?.data && event.target.data.isGuide)) {
        markDirty(true);
      }
    });
    fabricCanvas.on('object:modified', (event) => {
      updateLayers();
      if (!(event.target?.data && event.target.data.isGuide)) {
        markDirty(true);
      }
    });

    initializeGuides(fabricCanvas);
    setCanvas(fabricCanvas);
    onCanvasReady?.({
      capture: (format: 'jpeg' | 'png' = 'png') => {
        const options =
          format === 'png'
            ? ({format: 'png', multiplier: 1} as fabric.IDataURLOptions)
            : ({format: 'jpeg', quality: 0.92, multiplier: 1} as fabric.IDataURLOptions);
        const previousTransform = fabricCanvas.viewportTransform?.slice() as number[] | undefined;
        fabricCanvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
        fabricCanvas.renderAll();
        const dataUrl = fabricCanvas.toDataURL(options);
        if (previousTransform) {
          fabricCanvas.setViewportTransform(previousTransform);
          fabricCanvas.renderAll();
        }
        return dataUrl;
      }
    });
    loadProjects();
    const visibleObjects = fabricCanvas
      .getObjects()
      .filter((obj) => !(obj.data && obj.data.isGuide));
    setLayers([...visibleObjects].reverse());

    return () => {
      onCanvasReady?.(null);
      fabricCanvas.dispose();
    };
  }, [canvasConfig, onCanvasReady, product.id]);

  useEffect(() => {
    if (!canvas) return;
    canvas.setBackgroundColor(backgroundColor, () => canvas.renderAll());
  }, [backgroundColor, canvas]);

  useEffect(() => {
    if (!canvas) return;
    const zoomLevel = baseZoom * zoom;
    canvas.setViewportTransform([zoomLevel, 0, 0, zoomLevel, 0, 0]);
    canvas.renderAll();
  }, [canvas, baseZoom, zoom]);

  useEffect(() => {
    if (!canvas) return;
    Object.entries(guideRefs.current).forEach(([key, guide]) => {
      if (!guide) return;
      const visible = guides[key as keyof GuideRefs];
      guide.set('visible', visible);
    });
    canvas.renderAll();
  }, [guides, canvas]);

  useEffect(() => {
    if (!canvas) return;
    canvas.renderAll();
  }, [displayWidth, canvas]);

  function initializeGuides(fabricCanvas: fabric.Canvas) {
    const {width, height, safeMargin, bleedMargin} = canvasConfig;

    Object.values(guideRefs.current).forEach((guide) => {
      if (guide) {
        fabricCanvas.remove(guide);
      }
    });

    const bleedRect = new fabric.Rect({
      left: 0,
      top: 0,
      width,
      height,
      stroke: '#ef4444',
      strokeDashArray: [20, 12],
      strokeWidth: 6,
      fill: 'transparent',
      selectable: false,
      evented: false
    });
    bleedRect.set({data: {isGuide: true}, excludeFromExport: true});
    bleedRect.set('visible', guides.bleed);

    const safeRect = new fabric.Rect({
      left: safeMargin,
      top: safeMargin,
      width: width - safeMargin * 2,
      height: height - safeMargin * 2,
      stroke: '#22c55e',
      strokeDashArray: [12, 12],
      strokeWidth: 4,
      fill: 'transparent',
      selectable: false,
      evented: false
    });
    safeRect.set({data: {isGuide: true}, excludeFromExport: true});
    safeRect.set('visible', guides.safe);

    const printRect = new fabric.Rect({
      left: bleedMargin,
      top: bleedMargin,
      width: width - bleedMargin * 2,
      height: height - bleedMargin * 2,
      stroke: '#1d4ed8',
      strokeDashArray: [10, 10],
      strokeWidth: 3,
      fill: 'transparent',
      selectable: false,
      evented: false
    });
    printRect.set({data: {isGuide: true}, excludeFromExport: true});
    printRect.set('visible', guides.print);

    guideRefs.current = {bleed: bleedRect, safe: safeRect, print: printRect};

    fabricCanvas.add(bleedRect, safeRect, printRect);
    fabricCanvas.sendToBack(bleedRect);
    fabricCanvas.renderAll();
  }

  const addText = () => {
    if (!canvas) return;
    const textbox = new fabric.Textbox(tEditor('fields.textPlaceholder'), {
      left: canvasConfig.width / 2,
      top: canvasConfig.height / 2,
      fontSize: 140,
      fill: '#1f2937',
      fontFamily: 'Cairo, Inter, sans-serif',
      textAlign: 'center',
      originX: 'center',
      originY: 'center'
    });
    textbox.set('data', {id: generateId()});
    canvas.add(textbox);
    canvas.setActiveObject(textbox);
    canvas.renderAll();
    setActiveTool('select');
  };


  const addShape = (shape: keyof typeof DEFAULT_SHAPES) => {
    if (!canvas || !allowShapes) return;
    const factory = DEFAULT_SHAPES[shape];
    const shapeObj = factory();
    shapeObj.set({
      left: canvasConfig.width / 2,
      top: canvasConfig.height / 2,
      originX: 'center',
      originY: 'center'
    });
    shapeObj.set('data', {id: generateId()});
    canvas.add(shapeObj);
    canvas.setActiveObject(shapeObj);
    canvas.renderAll();
    setActiveTool('select');
  };

  const handleUploadImage = () => {
    fileInputRef.current?.click();
  };

  const onFileChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const file = event.target.files?.[0];
    if (!file || !canvas) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (!reader.result) return;
      fabric.Image.fromURL(reader.result as string, (img) => {
        img.set({
          left: canvasConfig.width / 2,
          top: canvasConfig.height / 2,
          originX: 'center',
          originY: 'center',
          cornerStyle: 'circle'
        });
        img.scaleToWidth(canvasConfig.width / 2);
        img.set('data', {id: generateId()});
        canvas.add(img);
        canvas.setActiveObject(img);
        canvas.renderAll();
        setActiveTool('select');
      });
    };
    reader.readAsDataURL(file);
    event.target.value = '';
  };

  const adjustZoom = (delta: number) => {
    const nextZoom = Math.min(3, Math.max(0.2, zoom + delta));
    setZoom(Number(nextZoom.toFixed(2)));
  };

  const resetView = () => {
    setZoom(1);
    canvas?.setViewportTransform([baseZoom, 0, 0, baseZoom, 0, 0]);
    canvas?.renderAll();
  };

  const removeSelected = () => {
    if (!canvas) return;
    const active = canvas.getActiveObjects();
    if (!active.length) return;
    active.forEach((obj) => canvas.remove(obj));
    canvas.discardActiveObject();
    canvas.renderAll();
  };

  const duplicateSelected = () => {
    if (!canvas) return;
    const active = canvas.getActiveObject();
    if (!active) return;
    active.clone((cloned) => {
      cloned.set({left: (active.left ?? 0) + 40, top: (active.top ?? 0) + 40});
      cloned.set('data', {id: generateId()});
      canvas.add(cloned);
      canvas.setActiveObject(cloned);
      canvas.renderAll();
    });
  };

  const bringForward = () => {
    if (!canvas) return;
    const active = canvas.getActiveObject();
    if (!active) return;
    canvas.bringForward(active);
    canvas.renderAll();
  };

  const sendBackward = () => {
    if (!canvas) return;
    const active = canvas.getActiveObject();
    if (!active) return;
    canvas.sendBackwards(active);
    canvas.renderAll();
  };

  const exportDesign = async (format: ExportFormat) => {
    if (!canvas) return;
    const guidesToHide = Object.values(guideRefs.current).filter(Boolean) as fabric.Rect[];
    guidesToHide.forEach((guide) => guide.set('opacity', 0));
    canvas.renderAll();

    try {
      if (format === 'png') {
        const dataUrl = canvas.toDataURL({format: 'png'});
        downloadFile(dataUrl, `${projectName || product.slug}.png`);
      } else if (format === 'svg') {
        const svg = canvas.toSVG({suppressPreamble: false});
        const blob = new Blob([svg], {type: 'image/svg+xml'});
        downloadFile(URL.createObjectURL(blob), `${projectName || product.slug}.svg`);
      } else if (format === 'json') {
        const json = canvas.toJSON();
        const blob = new Blob([JSON.stringify(json, null, 2)], {type: 'application/json'});
        downloadFile(URL.createObjectURL(blob), `${projectName || product.slug}.json`);
      }
    } finally {
      guidesToHide.forEach((guide) => guide.set('opacity', 1));
      canvas.renderAll();
    }
  };

  const downloadFile = (href: string, filename: string) => {
    const anchor = document.createElement('a');
    anchor.href = href;
    anchor.download = filename;
    anchor.rel = 'noopener noreferrer';
    anchor.click();
    if (href.startsWith('blob:')) {
      setTimeout(() => URL.revokeObjectURL(href), 1000);
    }
  };

  const saveProject = async () => {
    if (!canvas) return;
    setSaving(true);
    const id = projectId ?? generateId();
    setProjectId(id);
    const json = canvas.toJSON();
    const previewDataUrl = canvas.toDataURL({format: 'png', multiplier: 0.2});
    const record: ProjectStore = {
      id,
      name: projectName,
      productId: product.id,
      canvas: json as Record<string, unknown>,
      previewDataUrl,
      updatedAt: Date.now()
    };
    try {
      await upsertProject(record);
      await loadProjects();
      markDirty(false);
    } finally {
      setSaving(false);
    }
  };

  const loadProjects = async () => {
    const records = await listProjects();
    setProjects(records);
  };

  const loadProject = (record: ProjectStore) => {
    if (!canvas) return;
    startTransition(() => {
      canvas.loadFromJSON(record.canvas, () => {
        initializeGuides(canvas);
        const visibleObjects = canvas
          .getObjects()
          .filter((obj) => !(obj.data && obj.data.isGuide));
        setLayers([...visibleObjects].reverse());
        canvas.renderAll();
        setProjectId(record.id);
        setProjectName(record.name);
        markDirty(false);
      });
    });
  };

  useEffect(() => {
    if (!canvas) return;
    const targetId = initialProjectId.current;
    if (!targetId || projects.length === 0) return;
    const match = projects.find((project) => project.id === targetId && project.productId === product.id);
    if (match) {
      loadProject(match);
    }
    initialProjectId.current = null;
  }, [canvas, product.id, projects]);

  const removeProject = async (id: string) => {
    await deleteProject(id);
    await loadProjects();
  };

  const updateSelectedProperty = (property: string, value: unknown) => {
    if (!canvas) return;
    const active = canvas.getActiveObjects();
    if (!active.length) return;
    active.forEach((obj) => {
      obj.set(property as never, value);
      obj.setCoords();
    });
    canvas.renderAll();
  };

  const updateTextContent = (value: string) => {
    if (!canvas) return;
    const active = canvas.getActiveObjects();
    active.forEach((obj) => {
      if ('text' in obj) {
        (obj as fabric.Textbox).set('text', value);
      }
    });
    canvas.renderAll();
  };

  const selectedIsText = selectedObject instanceof fabric.Textbox || selectedObject instanceof fabric.IText;
  const selectedFill = selectedObject?.get('fill') as string | undefined;
  const selectedFontSize = selectedObject && 'fontSize' in selectedObject ? selectedObject.fontSize : undefined;
  const selectedStroke = selectedObject?.get('stroke') as string | undefined;

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]" dir={dir}>
      <section className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-md">
        <header className="flex flex-wrap items-center gap-3">
          <input
            value={projectName}
            onChange={(event) => setProjectName(event.target.value)}
            className="w-full max-w-xs rounded-full border border-slate-200 px-4 py-2 text-sm focus:border-brand focus:outline-none"
            aria-label={tEditor('fields.projectName')}
          />
          <div className="ms-auto flex items-center gap-2">
            <Button size="sm" variant="ghost" onClick={() => setGuides({bleed: !guides.bleed})}>
              {tEditor('guides.bleed')}
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setGuides({safe: !guides.safe})}>
              {tEditor('guides.safe')}
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setGuides({print: !guides.print})}>
              {tEditor('guides.print')}
            </Button>
          </div>
        </header>

        <div className="flex flex-wrap items-center gap-2 rounded-2xl bg-slate-50 p-3">
          <span className="text-sm font-medium text-slate-700">{tEditor('title')}</span>
          {allowText && (
            <Button size="sm" variant={activeTool === 'text' ? 'primary' : 'secondary'} onClick={() => setActiveTool('text')}>
              <Type size={16} aria-hidden />
            </Button>
          )}
          {allowShapes && (
            <Button size="sm" variant={activeTool === 'shape' ? 'primary' : 'secondary'} onClick={() => setActiveTool('shape')}>
              <Square size={16} aria-hidden />
            </Button>
          )}
          {allowImage && (
            <Button size="sm" variant={activeTool === 'image' ? 'primary' : 'secondary'} onClick={() => setActiveTool('image')}>
              <Upload size={16} aria-hidden />
            </Button>
          )}
          <div className="ms-auto flex items-center gap-2">
            <Button size="sm" variant="ghost" onClick={() => adjustZoom(-0.1)} aria-label={tEditor('a11y.zoomOut')}>
              <Minus size={16} aria-hidden />
            </Button>
            <span className="text-sm font-semibold text-slate-600">{Math.round(zoom * 100)}%</span>
            <Button size="sm" variant="ghost" onClick={() => adjustZoom(0.1)} aria-label={tEditor('a11y.zoomIn')}>
              <Plus size={16} aria-hidden />
            </Button>
            <Button size="sm" variant="ghost" onClick={resetView} aria-label={tEditor('a11y.reset')}>
              <RefreshCcw size={16} aria-hidden />
            </Button>
          </div>
        </div>

        <div className="relative flex flex-1 justify-center overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 p-4 lg:justify-start">
          <div
            className="relative overflow-hidden rounded-2xl border border-slate-300 bg-white shadow-inner"
            style={{width: `${displayWidth}px`, height: `${displayHeight}px`}}
          >
            <canvas
              ref={canvasElementRef}
              width={canvasConfig.width}
              height={canvasConfig.height}
              aria-label={tEditor('a11y.canvas')}
              style={{width: `${displayWidth}px`, height: `${displayHeight}px`}}
            />
          </div>
        </div>

        <footer className="flex flex-wrap items-center gap-3">
          <Button size="sm" variant="secondary" onClick={saveProject} loading={saving} disabled={!isDirty}>
            <Save size={16} aria-hidden /> {tCommon('actions.save')}
          </Button>
          <Button size="sm" variant="ghost" onClick={duplicateSelected}>
            {tCommon('actions.duplicate')}
          </Button>
          <Button size="sm" variant="ghost" onClick={removeSelected}>
            {tCommon('actions.delete')}
          </Button>
          <div className="ms-auto flex flex-wrap items-center gap-2">
            <Button size="sm" onClick={() => exportDesign('png')}>
              <DownloadCloud size={16} aria-hidden /> PNG
            </Button>
            <Button size="sm" variant="secondary" onClick={() => exportDesign('svg')}>
              SVG
            </Button>
            <Button size="sm" variant="ghost" onClick={() => exportDesign('json')}>
              JSON
            </Button>
          </div>
        </footer>
      </section>

      <aside className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-md">
        <section className="rounded-2xl border border-slate-200 p-4">
          <header className="flex items-center gap-2">
            <Layers size={18} className="text-brand" aria-hidden />
            <h2 className="text-sm font-semibold text-slate-800">{tEditor('panels.layers')}</h2>
          </header>
          <ul className="mt-3 space-y-2">
            {layers.map((layer) => (
              <li key={layer.data?.id ?? layer.id}>
                <button
                  type="button"
                  onClick={() => {
                    canvas?.setActiveObject(layer);
                    canvas?.renderAll();
                  }}
                  className="w-full rounded-xl border border-transparent px-3 py-2 text-start text-sm text-slate-700 transition hover:border-brand/50 hover:bg-brand/5"
                >
                  {layer.type} · {(layer.data as {id?: string})?.id?.slice(0, 6) ?? layer.type}
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex gap-2">
            <Button size="sm" variant="ghost" onClick={bringForward}>
              ↑
            </Button>
            <Button size="sm" variant="ghost" onClick={sendBackward}>
              ↓
            </Button>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 p-4">
          <h2 className="text-sm font-semibold text-slate-800">{tEditor('panels.properties')}</h2>
          <div className="mt-3 space-y-3 text-sm">
            <label className="flex flex-col gap-1">
              <span>Fond</span>
              <input
                type="color"
                value={backgroundColor}
                onChange={(event) => setBackgroundColor(event.target.value)}
                className="h-10 w-full cursor-pointer rounded-md border border-slate-200"
              />
            </label>
            {selectedObject && (
              <>
                <label className="flex flex-col gap-1">
                  <span>Couleur</span>
                  <input
                    type="color"
                    value={selectedFill ?? '#000000'}
                    onChange={(event) => updateSelectedProperty('fill', event.target.value)}
                    className="h-10 w-full cursor-pointer rounded-md border border-slate-200"
                  />
                </label>
                {selectedStroke !== undefined && (
                  <label className="flex flex-col gap-1">
                    <span>Contour</span>
                    <input
                      type="color"
                      value={selectedStroke ?? '#000000'}
                      onChange={(event) => updateSelectedProperty('stroke', event.target.value)}
                      className="h-10 w-full cursor-pointer rounded-md border border-slate-200"
                    />
                  </label>
                )}
                {selectedIsText && (
                  <>
                    <label className="flex flex-col gap-1">
                      <span>Taille</span>
                      <input
                        type="range"
                        min={32}
                        max={320}
                        value={selectedFontSize ?? 120}
                        onChange={(event) => updateSelectedProperty('fontSize', Number(event.target.value))}
                      />
                    </label>
                    <label className="flex flex-col gap-1">
                      <span>Texte</span>
                      <textarea
                        className="min-h-[80px] rounded-xl border border-slate-200 px-3 py-2"
                        defaultValue={(selectedObject as fabric.Textbox)?.text ?? ''}
                        onChange={(event) => updateTextContent(event.target.value)}
                      />
                    </label>
                  </>
                )}
              </>
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 p-4">
          <h2 className="text-sm font-semibold text-slate-800">{tEditor('panels.projects')}</h2>
          <div className="mt-3 space-y-3 text-sm">
            {projects.length === 0 && <p className="text-slate-500">{tDesigns('empty')}</p>}
            {projects
              .filter((project) => project.productId === product.id)
              .map((project) => (
                <article
                  key={project.id}
                  className="flex items-center gap-3 rounded-2xl border border-slate-200 p-3"
                >
                  {project.previewDataUrl ? (
                    <img
                      src={project.previewDataUrl}
                      alt={project.name}
                      className="h-14 w-14 rounded-xl border border-slate-200 object-cover"
                    />
                  ) : (
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-dashed border-slate-300 text-xs text-slate-400">
                      {product.id}
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="font-semibold text-slate-700">{project.name}</p>
                    <p className="text-xs text-slate-400">
                      {new Date(project.updatedAt).toLocaleString(locale === 'ar' ? 'ar-MA' : 'fr-MA')}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <Button size="sm" variant="secondary" onClick={() => loadProject(project)}>
                      {tDesigns('load')}
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => removeProject(project.id)}>
                      {tDesigns('delete')}
                    </Button>
                  </div>
                </article>
              ))}
          </div>
        </section>
      </aside>

      <input ref={fileInputRef} type="file" accept="image/*" onChange={onFileChange} hidden />

      {activeTool === 'text' && (
        <ToolActionPanel
          label={tEditor('toolbox.text')}
          actionLabel={tCommon('actions.add')}
          onAction={addText}
          icon={<Type size={16} />}
        />
      )}
      {allowShapes && activeTool === 'shape' && <ShapePanel addShape={addShape} />}
      {activeTool === 'image' && (
        <ToolActionPanel
          label={tEditor('toolbox.upload')}
          actionLabel={tCommon('actions.add')}
          onAction={handleUploadImage}
          icon={<Upload size={16} />}
        />
      )}
    </div>
  );
}

function ToolActionPanel({
  label,
  actionLabel,
  onAction,
  icon
}: {
  label: string;
  actionLabel: string;
  onAction: () => void;
  icon: React.ReactNode;
}) {
  return (
    <div className="fixed bottom-6 inset-x-0 z-40 mx-auto flex max-w-md items-center justify-between rounded-full border border-brand/40 bg-white px-4 py-3 shadow-lg">
      <div className="flex items-center gap-2 text-sm font-medium text-slate-700">{icon} {label}</div>
      <Button size="sm" onClick={onAction}>
        {actionLabel}
      </Button>
    </div>
  );
}

function ShapePanel({addShape}: {addShape: (shape: keyof typeof DEFAULT_SHAPES) => void}) {
  return (
    <div className="fixed bottom-6 inset-x-0 z-40 mx-auto flex max-w-xl items-center justify-center gap-3 rounded-full border border-brand/40 bg-white px-4 py-3 shadow-lg">
      <Button size="sm" variant="secondary" onClick={() => addShape('rect')}>
        <Square size={16} aria-hidden />
      </Button>
      <Button size="sm" variant="secondary" onClick={() => addShape('circle')}>
        <Circle size={16} aria-hidden />
      </Button>
      <Button size="sm" variant="secondary" onClick={() => addShape('triangle')}>
        <Triangle size={16} aria-hidden />
      </Button>
    </div>
  );
}
