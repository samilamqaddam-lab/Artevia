/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import {useEffect, useMemo, useRef, useState} from 'react';
import {fabric} from 'fabric';
import {useSearchParams} from 'next/navigation';
import {EditorSidebar} from './Sidebar/EditorSidebar';
import {CanvasWorkspace} from './Canvas/CanvasWorkspace';
import {PropertyPanel} from './Properties/PropertyPanel';
import {EditorHeader} from './Header/EditorHeader';
import type {ImprintZone, Product} from '@/lib/products';
import {generateId} from '@/lib/utils';
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
  export: (format: string) => unknown;
}

interface CanvaEditorProps {
  product: Product;
  locale: Locale;
  mode?: QuoteMode;
  activeZone?: ImprintZone;
  onCanvasReady?: (api: EditorApi | null) => void;
  onClose?: () => void;
}

type GuideRefs = {
  bleed?: fabric.Rect;
  safe?: fabric.Rect;
  print?: fabric.Rect;
};

export function CanvaEditor({
  product,
  locale,
  mode = 'logo',
  activeZone,
  onCanvasReady,
  onClose
}: CanvaEditorProps) {
  const canvasElementRef = useRef<HTMLCanvasElement | null>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas>();
  const [selectedObject, setSelectedObject] = useState<fabric.Object | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const guideRefs = useRef<GuideRefs>({});
  const [saving, setSaving] = useState(false);
  const searchParams = useSearchParams();
  const initialProjectId = useRef<string | null>(null);

  const {
    projectId,
    projectName,
    zoom,
    guides,
    backgroundColor,
    setProjectId,
    setProjectName,
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

  const [viewportWidth, setViewportWidth] = useState<number>(() =>
    typeof window === 'undefined' ? MAX_CANVAS_WIDTH : window.innerWidth
  );

  const aspectRatio = canvasConfig.height / canvasConfig.width;

  const {displayWidth, displayHeight, baseZoom} = useMemo(() => {
    const horizontalPadding = viewportWidth > 1024 ? 480 : 64; // Account for sidebar + property panel
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
  }, [product.id, searchParams]);

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

    fabricCanvas.on('selection:created', updateSelection);
    fabricCanvas.on('selection:updated', updateSelection);
    fabricCanvas.on('selection:cleared', () => setSelectedObject(null));
    fabricCanvas.on('object:added', (event) => {
      if (!(event.target?.data && event.target.data.isGuide)) {
        markDirty(true);
      }
    });
    fabricCanvas.on('object:removed', (event) => {
      if (!(event.target?.data && event.target.data.isGuide)) {
        markDirty(true);
      }
    });
    fabricCanvas.on('object:modified', (event) => {
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
      },
      export: (format: string) => {
        if (format === 'json') {
          return fabricCanvas.toJSON();
        }
        return null;
      }
    });

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

  function initializeGuides(fabricCanvas: fabric.Canvas) {
    const {width, height, safeMargin, bleedMargin} = canvasConfig;

    Object.values(guideRefs.current).forEach((guide) => {
      if (guide) fabricCanvas.remove(guide);
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
    bleedRect.set({data: {isGuide: true}, excludeFromExport: true, visible: guides.bleed});

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
    safeRect.set({data: {isGuide: true}, excludeFromExport: true, visible: guides.safe});

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
    printRect.set({data: {isGuide: true}, excludeFromExport: true, visible: guides.print});

    guideRefs.current = {bleed: bleedRect, safe: safeRect, print: printRect};
    fabricCanvas.add(bleedRect, safeRect, printRect);
    fabricCanvas.sendToBack(bleedRect);
    fabricCanvas.renderAll();
  }

  const addText = () => {
    if (!canvas) return;
    const textbox = new fabric.Textbox('Votre texte ici', {
      left: canvasConfig.width / 2,
      top: canvasConfig.height / 2,
      fontSize: 120,
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
  };

  const addShape = (shape: keyof typeof DEFAULT_SHAPES) => {
    if (!canvas || !allowShapes) return;
    const factory = DEFAULT_SHAPES[shape];
    const shapeObj = factory() as fabric.Object;
    shapeObj.set({
      left: canvasConfig.width / 2,
      top: canvasConfig.height / 2,
      originX: 'center',
      originY: 'center'
    } as fabric.Object);
    shapeObj.set('data', {id: generateId()});
    canvas.add(shapeObj);
    canvas.setActiveObject(shapeObj);
    canvas.renderAll();
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
      });
    };
    reader.readAsDataURL(file);
    event.target.value = '';
  };

  const handleLoadTemplate = (templateCanvas: Record<string, unknown>) => {
    if (!canvas) return;
    canvas.loadFromJSON(templateCanvas, () => {
      initializeGuides(canvas);
      canvas.renderAll();
      markDirty(true);
    });
  };

  const handleLoadProject = async (projectId: string) => {
    if (!canvas) return;
    const projects = await listProjects();
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    canvas.loadFromJSON(project.canvas, () => {
      initializeGuides(canvas);
      canvas.renderAll();
      setProjectId(project.id);
      setProjectName(project.name);
      markDirty(false);
    });
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
      markDirty(false);
    } finally {
      setSaving(false);
    }
  };

  const exportDesign = async (format: 'png' | 'svg' | 'json') => {
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

  const updateSelectedProperty = (property: string, value: unknown) => {
    if (!canvas) return;
    const active = canvas.getActiveObjects();
    if (!active.length) return;
    active.forEach((obj) => {
      obj.set(property as never, value as never);
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

  const duplicateSelected = () => {
    if (!canvas) return;
    const active = canvas.getActiveObject();
    if (!active) return;
    active.clone((cloned: fabric.Object) => {
      cloned.set({left: (active.left ?? 0) + 40, top: (active.top ?? 0) + 40});
      cloned.set('data', {id: generateId()});
      canvas.add(cloned);
      canvas.setActiveObject(cloned);
      canvas.renderAll();
    });
  };

  const removeSelected = () => {
    if (!canvas) return;
    const active = canvas.getActiveObjects();
    if (!active.length) return;
    active.forEach((obj) => canvas.remove(obj));
    canvas.discardActiveObject();
    canvas.renderAll();
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

  return (
    <div className="flex h-screen flex-col bg-slate-50 dark:bg-[#0f0f0f]">
      <EditorHeader
        projectName={projectName}
        onProjectNameChange={setProjectName}
        onBack={onClose ?? (() => window.history.back())}
        onSave={saveProject}
        onExport={exportDesign}
        onToggleGuides={(guide) => setGuides({[guide]: !guides[guide]})}
        guides={guides}
        isSaving={saving}
        isDirty={isDirty}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <EditorSidebar
          product={product}
          locale={locale}
          allowShapes={allowShapes}
          onAddText={addText}
          onAddShape={addShape}
          onUploadImage={handleUploadImage}
          onLoadTemplate={handleLoadTemplate}
          onLoadProject={handleLoadProject}
        />

        {/* Canvas */}
        <CanvasWorkspace
          canvasRef={canvasElementRef}
          canvasWidth={canvasConfig.width}
          canvasHeight={canvasConfig.height}
          displayWidth={displayWidth}
          displayHeight={displayHeight}
          zoom={zoom}
          onZoomIn={() => setZoom(Math.min(3, zoom + 0.1))}
          onZoomOut={() => setZoom(Math.max(0.2, zoom - 0.1))}
          onResetZoom={() => setZoom(1)}
          className="flex-1"
        />

        {/* Property Panel */}
        <PropertyPanel
          selectedObject={selectedObject}
          backgroundColor={backgroundColor}
          onUpdateProperty={updateSelectedProperty}
          onUpdateBackgroundColor={setBackgroundColor}
          onUpdateTextContent={updateTextContent}
          onDuplicate={duplicateSelected}
          onDelete={removeSelected}
          onBringForward={bringForward}
          onSendBackward={sendBackward}
        />
      </div>

      <input ref={fileInputRef} type="file" accept="image/*" onChange={onFileChange} hidden />
    </div>
  );
}
