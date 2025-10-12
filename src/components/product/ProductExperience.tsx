'use client';

import {useEffect, useMemo, useRef, useState} from 'react';
import {createPortal} from 'react-dom';
import {ChevronLeft, ChevronRight, Maximize2, X} from 'lucide-react';
import Image from 'next/image';
import {Button} from '@/components/ui/Button';
import {DesignEditor} from '@/components/editor/DesignEditor';
import type {
  Product,
  MarkingMethod,
  ImprintZone,
  Colorway,
  LeadTimeOption
} from '@/lib/products';
import {calculateQuoteTotals, formatLeadTime, formatPrice, isRTL} from '@/lib/utils';
import {useQuoteStore} from '@/stores/quote-store';
import type {Locale} from '@/i18n/settings';
import type {QuoteMode} from '@/types/quote';
import {generateBatPdf} from '@/lib/pdf/bat';

interface LocalizedMethod extends MarkingMethod {
  label: string;
  description: string;
}

interface LocalizedZone extends ImprintZone {
  label: string;
  description: string;
}

interface LocalizedColorway extends Colorway {
  label: string;
}

interface LocalizedLeadTime extends LeadTimeOption {
  label: string;
}

interface ProductCopy {
  specs: string;
  moq: string;
  quantity: string;
  method: string;
  zone: string;
  colorCount: string;
  colorway: string;
  leadTime: string;
  leadTimeHint: string;
  priceGrid: {
    title: string;
    unit: string;
    total: string;
  };
  summary: {
    title: string;
    setupFee: string;
    surcharge: string;
    perUnit: string;
    total: string;
  };
  editor: {
    title: string;
    description: string;
    mode: {
      logo: string;
      creative: string;
    };
    logoGuidelines: string;
    colorLimit: string;
    actions: {
      addToQuote: string;
      generateBat: string;
      close: string;
      fullscreen: string;
    };
    captures: {
      success: string;
      error: string;
    };
  };
  rfq: {
    added: string;
    submitted: string;
  };
}

interface ProductExperienceProps {
  locale: Locale;
  product: Product;
  name: string;
  description: string;
  methods: LocalizedMethod[];
  zones: LocalizedZone[];
  colors: LocalizedColorway[];
  leadTimes: LocalizedLeadTime[];
  copy: ProductCopy;
}

export function ProductExperience({
  locale,
  product,
  name,
  description,
  methods,
  zones,
  colors,
  leadTimes,
  copy
}: ProductExperienceProps) {
  const dir = isRTL(locale) ? 'rtl' : 'ltr';
  const addQuoteItem = useQuoteStore((state) => state.addItem);

  const initialMinimumQuantity = Math.max(
    product.moq,
    methods[0]?.priceTiers[0]?.minQuantity ?? product.moq
  );

  const [selectedMethodId, setSelectedMethodId] = useState(product.defaultMethodId);
  const [selectedZoneId, setSelectedZoneId] = useState(product.defaultZoneId);
  const [selectedLeadTimeId, setSelectedLeadTimeId] = useState(product.defaultLeadTimeId);
  const [selectedColorwayId, setSelectedColorwayId] = useState(colors[0]?.id ?? 'custom');
  const [quantityInput, setQuantityInput] = useState(() => String(initialMinimumQuantity));
  const [colorCount, setColorCount] = useState(1);
  const allImages = useMemo(() => {
    const unique = new Set<string>();
    const ordered: string[] = [];
    const candidates = [product.heroImage, ...(product.gallery ?? [])];
    candidates.forEach((candidate) => {
      if (!candidate) return;
      if (unique.has(candidate)) return;
      unique.add(candidate);
      ordered.push(candidate);
    });
    return ordered;
  }, [product.gallery, product.heroImage]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [mode, setMode] = useState<QuoteMode>('logo');
  const [showFullScreenEditor, setShowFullScreenEditor] = useState(false);
  const editorApiRef = useRef<{capture: (format?: 'jpeg' | 'png') => string | null} | null>(null);
  const previewRef = useRef<string | undefined>(undefined);

  const selectedMethod = useMemo(
    () => methods.find((method) => method.id === selectedMethodId) ?? methods[0],
    [methods, selectedMethodId]
  );

  const compatibleZones = useMemo(() => {
    if (!selectedMethod) return zones;
    return zones.filter((zone) => selectedMethod.compatibleZones.includes(zone.id));
  }, [zones, selectedMethod]);

  const activeZone = useMemo(() => {
    const zone = compatibleZones.find((item) => item.id === selectedZoneId);
    return zone ?? compatibleZones[0] ?? zones[0];
  }, [compatibleZones, selectedZoneId, zones]);

  const selectedLeadTime = useMemo(
    () => leadTimes.find((lead) => lead.id === selectedLeadTimeId) ?? leadTimes[0],
    [leadTimes, selectedLeadTimeId]
  );

  const minimumQuantity = useMemo(
    () => Math.max(product.moq, selectedMethod?.priceTiers?.[0]?.minQuantity ?? product.moq),
    [product.moq, selectedMethod]
  );

  useEffect(() => {
    setQuantityInput((current) => {
      const parsed = Number.parseInt(current, 10);
      if (Number.isNaN(parsed) || parsed < minimumQuantity) {
        return String(minimumQuantity);
      }
      return String(parsed);
    });
  }, [minimumQuantity]);

  useEffect(() => {
    if (typeof document === 'undefined') return undefined;
    if (!showFullScreenEditor) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [showFullScreenEditor]);

  useEffect(() => {
    setActiveImageIndex(0);
  }, [product.slug, allImages.length]);

  const quantity = useMemo(() => {
    const parsed = Number.parseInt(quantityInput, 10);
    if (Number.isNaN(parsed)) {
      return minimumQuantity;
    }
    return Math.max(minimumQuantity, parsed);
  }, [quantityInput, minimumQuantity]);

  const totals = useMemo(
    () => (selectedMethod && selectedLeadTime ? calculateQuoteTotals(selectedMethod, selectedLeadTime, quantity) : null),
    [selectedMethod, selectedLeadTime, quantity]
  );

  const priceRows = useMemo(() => {
    if (!selectedMethod)
      return [] as Array<{minQuantity: number; unitPrice: number; total: number; active: boolean}>;
    return selectedMethod.priceTiers.map((tier, index, arr) => {
      const nextTier = arr[index + 1];
      const isActive = quantity >= tier.minQuantity && (!nextTier || quantity < nextTier.minQuantity);
      return {
        minQuantity: tier.minQuantity,
        unitPrice: tier.unitPrice,
        total: tier.unitPrice * tier.minQuantity,
        active: isActive || quantity >= tier.minQuantity
      };
    });
  }, [selectedMethod, quantity]);

  const maxColorCount = selectedMethod?.maxPantoneColors ?? 0;
  const hasGallery = allImages.length > 1;
  const currentImage = allImages[activeImageIndex] ?? product.heroImage;

  const goToImage = (index: number) => {
    if (!allImages.length) return;
    const safeIndex = (index + allImages.length) % allImages.length;
    setActiveImageIndex(safeIndex);
  };

  const capturePreview = (format: 'jpeg' | 'png' = 'png') => {
    const capture = editorApiRef.current?.capture;
    if (!capture) return undefined;
    const result = capture(format) ?? undefined;
    if (format === 'png') {
      previewRef.current = result;
    }
    return result;
  };

  const handleAddToQuote = () => {
    if (!selectedMethod || !activeZone || !selectedLeadTime || !totals) return;
    const preview = capturePreview('png');
    addQuoteItem({
      productId: product.id,
      quantity,
      methodId: selectedMethod.id,
      zoneId: activeZone.id,
      leadTimeId: selectedLeadTime.id,
      colorCount: maxColorCount === 0 ? 0 : Math.min(colorCount, maxColorCount),
      colorwayId: selectedColorwayId,
      mode,
      previewDataUrl: preview
    });
    if (typeof window !== 'undefined') {
      window.alert(copy.rfq.added);
    }
  };

  const handleGenerateBat = async () => {
    if (!selectedMethod || !activeZone || !selectedLeadTime || !totals) return;
    const preview = capturePreview('jpeg');
    if (!preview) {
      window.alert(copy.editor.captures.error);
      return;
    }

    const pdfBlob = generateBatPdf({
      productName: name,
      methodLabel: selectedMethod.label,
      zoneLabel: activeZone.label,
      quantity,
      unitPrice: formatPrice(totals.unitPrice, locale),
      totalPrice: formatPrice(totals.total, locale),
      setupFee: formatPrice(totals.setupFee, locale),
      leadTimeLabel: `${selectedLeadTime.label} · ${formatLeadTime(selectedLeadTime, locale)}`,
      previewDataUrl: preview,
      customerNote: undefined,
      locale: locale === 'ar' ? 'ar' : 'fr',
      canvasWidth: product.creationCanvas.width,
      canvasHeight: product.creationCanvas.height
    });

    try {
      await fetch('/api/bat', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          productId: product.id,
          methodId: selectedMethod.id,
          zoneId: activeZone.id,
          previewDataUrl: preview
        })
      });
    } catch (error) {
      console.warn('BAT mock API error', error);
    }

    const url = URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `BAT-${product.slug}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 2000);
    if (typeof window !== 'undefined') {
      window.alert(copy.editor.captures.success);
    }

  };

  const renderEditor = () => (
    <>
      <DesignEditor
        product={product}
        locale={locale}
        mode={mode}
        activeZone={activeZone}
        onCanvasReady={(api) => {
          editorApiRef.current = api;
          if (api) {
            const initial = api.capture('png') ?? undefined;
            if (initial) {
              previewRef.current = initial;
            }
          } else {
            previewRef.current = undefined;
          }
        }}
      />
      <div className="flex flex-wrap gap-3 pt-2">
        <Button size="md" onClick={handleAddToQuote}>
          {copy.editor.actions.addToQuote}
        </Button>
        <Button size="md" variant="secondary" onClick={handleGenerateBat}>
          {copy.editor.actions.generateBat}
        </Button>
      </div>
    </>
  );

  const fullscreenOverlay =
    showFullScreenEditor && typeof document !== 'undefined'
      ? createPortal(
          <div className="fixed inset-0 z-50 flex flex-col bg-slate-900/70 backdrop-blur-sm" role="dialog" aria-modal="true">
            <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 overflow-y-auto px-4 py-6 sm:px-6">
              <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-[#121212] dark:text-slate-100">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-1">
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{copy.editor.title}</h2>
                    <p className="text-sm text-slate-600 dark:text-slate-300">{copy.editor.description}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setShowFullScreenEditor(false)}
                    className="inline-flex items-center gap-2"
                  >
                    <X size={16} aria-hidden />
                    {copy.editor.actions.close}
                  </Button>
                </div>
                <div className="mt-6 space-y-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <Button
                      size="sm"
                      variant={mode === 'logo' ? 'primary' : 'secondary'}
                      onClick={() => setMode('logo')}
                    >
                      {copy.editor.mode.logo}
                    </Button>
                    <Button
                      size="sm"
                      variant={mode === 'creative' ? 'primary' : 'secondary'}
                      onClick={() => setMode('creative')}
                    >
                      {copy.editor.mode.creative}
                    </Button>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{copy.editor.logoGuidelines}</p>
                  {renderEditor()}
                </div>
              </div>
            </div>
          </div>,
          document.body
        )
      : null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6" dir={dir}>
      <div className="flex flex-col gap-12 rounded-[36px] border border-slate-200 bg-white px-4 py-10 text-slate-900 shadow-[0_45px_90px_-70px_rgba(0,0,0,0.1)] transition-colors sm:px-10 lg:flex-row dark:border-white/10 dark:bg-[#121212] dark:text-slate-100 dark:shadow-[0_45px_90px_-70px_rgba(0,0,0,0.85)]">
        <section className="flex-1 space-y-6">
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_25px_60px_-45px_rgba(130,212,187,0.18)] dark:border-white/10 dark:bg-[#171717] dark:shadow-[0_25px_60px_-45px_rgba(130,212,187,0.45)]">
            <div className="relative aspect-square">
              <Image
                key={currentImage}
                src={currentImage}
                alt={name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 45vw"
                priority
              />
              {hasGallery && (
                <>
                  <button
                    type="button"
                    aria-label="Image précédente"
                    onClick={() => goToImage(activeImageIndex - 1)}
                    className="absolute left-3 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-slate-700 backdrop-blur transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-brand dark:bg-[#111111]/80 dark:text-slate-200"
                  >
                    <ChevronLeft size={18} aria-hidden />
                  </button>
                  <button
                    type="button"
                    aria-label="Image suivante"
                    onClick={() => goToImage(activeImageIndex + 1)}
                    className="absolute right-3 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-slate-700 backdrop-blur transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-brand dark:bg-[#111111]/80 dark:text-slate-200"
                  >
                    <ChevronRight size={18} aria-hidden />
                  </button>
                </>
              )}
            </div>
            {hasGallery && (
              <div className="grid grid-cols-4 gap-2 p-3">
                {allImages.map((image, index) => (
                  <button
                    key={image}
                    type="button"
                    onClick={() => goToImage(index)}
                    className={`relative aspect-square overflow-hidden rounded-2xl border transition focus:outline-none focus:ring-2 focus:ring-brand ${
                      index === activeImageIndex
                        ? 'border-brand ring-2 ring-brand/40'
                        : 'border-slate-200 hover:border-brand/40 dark:border-white/10'
                    }`}
                    aria-label={`${name} aperçu ${index + 1}`}
                  >
                    <Image
                      src={image}
                      alt={`${name} miniature ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="90px"
                    />
                  </button>
                ))}
              </div>
            )}

            <div className="space-y-4 p-6">
              <div>
                <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">{name}</h1>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{description}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 dark:border-white/10 dark:bg-[#111111] dark:text-slate-200">
                <dl className="grid gap-3">
                  <div className="flex items-center justify-between">
                    <dt className="font-medium text-slate-500 dark:text-slate-400">{copy.moq}</dt>
                    <dd className="font-semibold text-slate-900 dark:text-white">{product.moq}</dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="font-medium text-slate-500 dark:text-slate-400">{copy.leadTime}</dt>
                    <dd className="font-semibold text-slate-900 dark:text-white">
                      {formatLeadTime(selectedLeadTime, locale)} ({selectedLeadTime.label})
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </section>
        <section className="flex-[1.4] space-y-10">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 text-slate-900 shadow-sm dark:border-white/10 dark:bg-[#161616] dark:text-slate-100">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{copy.specs}</h2>
            <div className="mt-6 grid gap-5">
              <label className="flex flex-col gap-2 text-sm text-slate-600 dark:text-slate-200">
                <span className="font-medium text-slate-900 dark:text-white">{copy.quantity}</span>
                <input
                  type="number"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  min={minimumQuantity}
                  step={1}
                  value={quantityInput}
                  onChange={(event) => {
                    const nextValue = event.target.value.replace(/[^0-9]/g, '');
                    setQuantityInput(nextValue);
                  }}
                  onBlur={() => setQuantityInput(String(quantity))}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base font-medium text-slate-900 placeholder:text-slate-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30 dark:border-white/10 dark:bg-[#0f0f0f] dark:text-white"
                />
                <span className="text-xs text-slate-500 dark:text-slate-400">{copy.moq}: {minimumQuantity}</span>
              </label>

              <label className="flex flex-col gap-2 text-sm text-slate-600 dark:text-slate-200">
                <span className="font-medium text-slate-900 dark:text-white">{copy.method}</span>
                <select
                  value={selectedMethod?.id}
                  onChange={(event) => {
                    const nextMethod = methods.find((method) => method.id === event.target.value) ?? methods[0];
                    setSelectedMethodId(nextMethod.id);
                    setSelectedZoneId(
                      nextMethod.compatibleZones.includes(selectedZoneId)
                        ? selectedZoneId
                        : nextMethod.compatibleZones[0]
                    );
                    setColorCount(
                      nextMethod.maxPantoneColors === 0
                        ? 0
                        : Math.min(Math.max(1, colorCount), nextMethod.maxPantoneColors)
                    );
                    const minForNext = Math.max(
                      product.moq,
                      nextMethod.priceTiers[0]?.minQuantity ?? product.moq
                    );
                    setQuantityInput((prev) => {
                      const parsed = Number.parseInt(prev, 10);
                      if (Number.isNaN(parsed) || parsed < minForNext) {
                        return String(minForNext);
                      }
                      return String(parsed);
                    });
                  }}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base font-medium text-slate-900 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30 dark:border-white/10 dark:bg-[#0f0f0f] dark:text-white"
                >
                  {methods.map((method) => (
                    <option key={method.id} value={method.id}>
                      {method.label}
                    </option>
                  ))}
                </select>
                {selectedMethod?.description && (
                  <span className="text-xs text-slate-500 dark:text-slate-400">{selectedMethod.description}</span>
                )}
              </label>

              <label className="flex flex-col gap-2 text-sm text-slate-600 dark:text-slate-200">
                <span className="font-medium text-slate-900 dark:text-white">{copy.zone}</span>
                <select
                  value={activeZone?.id}
                  onChange={(event) => setSelectedZoneId(event.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base font-medium text-slate-900 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30 dark:border-white/10 dark:bg-[#0f0f0f] dark:text-white"
                >
                  {compatibleZones.map((zone) => (
                    <option key={zone.id} value={zone.id}>
                      {zone.label}
                    </option>
                  ))}
                </select>
                {activeZone?.description && (
                  <span className="text-xs text-slate-500 dark:text-slate-400">{activeZone.description}</span>
                )}
              </label>

              <label className="flex flex-col gap-2 text-sm text-slate-600 dark:text-slate-200">
                <span className="font-medium text-slate-900 dark:text-white">{copy.colorway}</span>
                <div className="flex flex-wrap gap-2">
                  {colors.map((color) => (
                    <button
                      key={color.id}
                      type="button"
                      onClick={() => setSelectedColorwayId(color.id)}
                      className={`flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-medium transition ${
                        selectedColorwayId === color.id
                          ? 'border-brand bg-brand text-charcoal shadow-[0_20px_40px_-30px_rgba(130,212,187,0.45)]'
                          : 'border-slate-200 text-slate-600 hover:border-brand/50 dark:border-white/10 dark:text-slate-200 dark:hover:border-brand/50'
                      }`}
                    >
                      <span
                        className="inline-flex h-4 w-4 rounded-full border border-slate-200 dark:border-white/30"
                        style={{backgroundColor: color.hex}}
                      />
                      {color.label}
                    </button>
                  ))}
                </div>
              </label>

              {maxColorCount > 0 && (
                <label className="flex flex-col gap-2 text-sm text-slate-600 dark:text-slate-200">
                  <span className="font-medium text-slate-900 dark:text-white">{copy.colorCount}</span>
                  <input
                    type="number"
                    min={1}
                    max={maxColorCount}
                    value={Math.min(colorCount, maxColorCount)}
                    onChange={(event) => setColorCount(Number(event.target.value) || 1)}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base font-medium text-slate-900 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30 dark:border-white/10 dark:bg-[#0f0f0f] dark:text-white"
                  />
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {copy.editor.colorLimit.replace('{{count}}', String(maxColorCount))}
                  </span>
                </label>
              )}

              <label className="flex flex-col gap-2 text-sm text-slate-600 dark:text-slate-200">
                <span className="font-medium text-slate-900 dark:text-white">{copy.leadTime}</span>
                <select
                  value={selectedLeadTime?.id}
                  onChange={(event) => setSelectedLeadTimeId(event.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base font-medium text-slate-900 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30 dark:border-white/10 dark:bg-[#0f0f0f] dark:text-white"
                >
                  {leadTimes.map((lead) => (
                    <option key={lead.id} value={lead.id}>
                      {lead.label} – {formatLeadTime(lead, locale)}
                    </option>
                  ))}
                </select>
                <span className="text-xs text-slate-500 dark:text-slate-400">{copy.leadTimeHint}</span>
              </label>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 text-slate-900 shadow-sm dark:border-white/10 dark:bg-[#161616] dark:text-slate-100">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{copy.priceGrid.title}</h3>
            <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 dark:border-white/10">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-100 text-slate-600 dark:bg-white/5 dark:text-slate-300">
                  <tr>
                    <th className="px-4 py-3 text-start font-medium">MOQ</th>
                    <th className="px-4 py-3 text-start font-medium">{copy.priceGrid.unit}</th>
                    <th className="px-4 py-3 text-start font-medium">{copy.priceGrid.total}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                  {priceRows.map((row) => (
                    <tr
                      key={row.minQuantity}
                      className={row.active ? 'bg-brand/10 text-brand dark:bg-brand/20' : 'text-slate-600 dark:text-slate-200'}
                    >
                      <td className="px-4 py-3 font-semibold">{row.minQuantity}</td>
                      <td className="px-4 py-3">{formatPrice(row.unitPrice, locale)}</td>
                      <td className="px-4 py-3">{formatPrice(row.total, locale)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {totals && (
              <div className="mt-4 grid gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 dark:border-white/10 dark:bg-[#111111] dark:text-slate-200">
                <div className="flex items-center justify-between">
                  <span>{copy.quantity}</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{quantity}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>{copy.summary.perUnit}</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{formatPrice(totals.unitPrice, locale)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>{copy.summary.setupFee}</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{formatPrice(totals.setupFee, locale)}</span>
                </div>
                {totals.surcharge > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span>{copy.summary.surcharge}</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{formatPrice(totals.surcharge, locale)}</span>
                  </div>
                )}
                <div className="mt-2 flex items-center justify-between text-base font-semibold text-brand">
                  <span>{copy.summary.total}</span>
                  <span>{formatPrice(totals.total, locale)}</span>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 text-slate-900 shadow-sm dark:border-white/10 dark:bg-[#161616] dark:text-slate-100">
            <header className="space-y-1">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{copy.editor.title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">{copy.editor.description}</p>
            </header>
            <p className="text-xs text-slate-500 dark:text-slate-400">{copy.editor.logoGuidelines}</p>
            <Button
              size="md"
              variant="primary"
              onClick={() => setShowFullScreenEditor(true)}
              className="inline-flex items-center gap-2"
            >
              <Maximize2 size={16} aria-hidden />
              {copy.editor.actions.fullscreen}
            </Button>
          </div>
        </section>
      </div>
      {fullscreenOverlay}
    </div>
  );
}
