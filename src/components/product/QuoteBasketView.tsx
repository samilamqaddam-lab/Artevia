/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import {useCallback, useEffect, useMemo, useRef, useState, type ChangeEvent} from 'react';
import Image from 'next/image';
import {useTranslations} from 'next-intl';
import {usePathname, useRouter, useSearchParams} from 'next/navigation';
import {Button} from '@/components/ui/Button';
import {useToast} from '@/components/Providers';
import {products} from '@/lib/products';
import {calculateQuoteTotals, formatLeadTime, formatPrice, isRTL} from '@/lib/utils';
import {useQuoteStore} from '@/stores/quote-store';
import type {Locale} from '@/i18n/settings';
import {generateBatPdf} from '@/lib/pdf/bat';
import {generateQuotePdf} from '@/lib/pdf/quote';
import {getPackById, packs as packDefinitions} from '@/lib/packs';
import {logger} from '@/lib/logger';

interface QuoteBasketViewProps {
  locale: Locale;
}

export function QuoteBasketView({locale}: QuoteBasketViewProps) {
  const tQuotes = useTranslations('quotes');
  const tProducts = useTranslations('products');
  const tProduct = useTranslations('product');
  const tLeadTimes = useTranslations('leadTimes');
  const tHome = useTranslations('home');
  const direction = isRTL(locale) ? 'rtl' : 'ltr';

  const items = useQuoteStore((state) => state.items);
  const updateItem = useQuoteStore((state) => state.updateItem);
  const removeItem = useQuoteStore((state) => state.removeItem);
  const clear = useQuoteStore((state) => state.clear);

  const [notes, setNotes] = useState('');
  const [isSubmitting, setSubmitting] = useState(false);
  const [checkout, setCheckout] = useState({company: '', contact: '', email: '', phone: ''});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [isExporting, setExporting] = useState(false);
  const [confirmation, setConfirmation] = useState<{
    orderId: string;
    total: number;
    quantity: number;
    company: string;
    contact: string;
    email: string;
    receivedAt?: string;
    status?: string;
  } | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const handledPackRef = useRef<string | null>(null);
  const {pushToast} = useToast();

  const translatePackLabel = useCallback(
    (packId: string, labelKey?: string) => {
      if (!labelKey) return packId;
      try {
        return tHome(labelKey);
      } catch (error) {
        logger.warn('Missing translation for pack label', labelKey, error);
        return packId;
      }
    },
    [tHome]
  );

  useEffect(() => {
    const packId = searchParams?.get('pack');
    if (!packId) {
      handledPackRef.current = null;
      return;
    }

    if (handledPackRef.current === packId) {
      return;
    }

    const pack = getPackById(packId);
    handledPackRef.current = packId;

    const clearPackQuery = () => {
      if (!searchParams) return;
      const next = new URLSearchParams(searchParams.toString());
      next.delete('pack');
      const target = next.toString();
      router.replace((target ? `${pathname}?${target}` : pathname) as any, {scroll: false});
    };

    if (!pack) {
      clearPackQuery();
      return;
    }

    const store = useQuoteStore.getState();
    const existing = store.items.filter((item) => item.projectId === packId);
    if (existing.length) {
      existing.forEach((item) => store.removeItem(item.id));
    }

    const added: string[] = [];
    pack.items.forEach((line) => {
      const product = products.find((candidate) => candidate.id === line.productId);
      if (!product) return;

      const method = line.methodId
        ? product.methods.find((candidate) => candidate.id === line.methodId)
        : product.methods.find((candidate) => candidate.id === product.defaultMethodId) ?? product.methods[0];
      const zone = line.zoneId
        ? product.imprintZones.find((candidate) => candidate.id === line.zoneId)
        : product.imprintZones.find((candidate) => candidate.id === product.defaultZoneId) ??
          product.imprintZones[0];
      const leadTime = line.leadTimeId
        ? product.leadTimes.find((candidate) => candidate.id === line.leadTimeId)
        : product.leadTimes.find((candidate) => candidate.id === product.defaultLeadTimeId) ??
          product.leadTimes[0];
      const colorway = line.colorwayId
        ? product.colorways.find((candidate) => candidate.id === line.colorwayId)
        : product.colorways[0];

      if (!colorway) {
        return;
      }

      if (!method || !zone || !leadTime) {
        return;
      }

      const minQuantity = Math.max(
        product.moq,
        method.priceTiers?.[0]?.minQuantity ?? product.moq
      );
      const quantity = Math.max(line.quantity ?? minQuantity, minQuantity);
      const maxColors = method.maxPantoneColors ?? 0;
      const requestedColors = line.colorCount ?? (maxColors > 0 ? Math.min(1, maxColors) : 0);
      const colorCount = maxColors > 0 ? Math.min(Math.max(requestedColors, 0), maxColors) : 0;

      const addedItem = store.addItem({
        productId: product.id,
        quantity,
        methodId: method.id,
        zoneId: zone.id,
        leadTimeId: leadTime.id,
        colorwayId: colorway.id,
        colorCount,
        mode: line.mode ?? 'logo',
        projectId: packId
      });

      added.push(addedItem.id);
    });

    if (added.length) {
      setConfirmation(null);
    }

    if (added.length && !notes.trim() && pack.notes) {
      setNotes(pack.notes);
    }

    if (added.length) {
      const packLabel = translatePackLabel(packId, pack.labelKey);
      pushToast({
        title: tQuotes('toast.packLoaded', {pack: packLabel}),
        description: pack.discount
          ? tQuotes('toast.packDiscount', {
              code: pack.discount.code,
              percent: pack.discount.percent
            })
          : undefined
      });
    }

    clearPackQuery();
  }, [searchParams, pathname, router, notes, tHome, tQuotes, pushToast, translatePackLabel]);

  const enrichedItems = useMemo(() => {
    return items
      .map((item) => {
        const product = products.find((candidate) => candidate.id === item.productId);
        if (!product) return null;

        const strip = (key: string) => key.split('.').slice(1).join('.');
        const method = product.methods.find((candidate) => candidate.id === item.methodId);
        const zone = product.imprintZones.find((candidate) => candidate.id === item.zoneId);
        const colorway = product.colorways.find((candidate) => candidate.id === item.colorwayId);
        const leadTime = product.leadTimes.find((candidate) => candidate.id === item.leadTimeId);

        const methodLabel = method ? tProducts(strip(method.nameKey)) : '';
        const zoneLabel = zone ? tProducts(strip(zone.nameKey)) : '';
        const colorLabel = colorway ? tProducts(strip(colorway.labelKey)) : '';
        const leadLabel = leadTime ? `${tLeadTimes(strip(leadTime.labelKey))} · ${leadTime.days}j` : '';
        const minimumQuantity = Math.max(
          product.moq,
          method?.priceTiers?.[0]?.minQuantity ?? product.moq
        );
        const totals = method && leadTime ? calculateQuoteTotals(method, leadTime, item.quantity) : null;
        const name = tProducts(strip(product.nameKey));

        return {
          raw: item,
          product,
          name,
          method,
          methodLabel,
          zone,
          zoneLabel,
          colorLabel,
          leadTime,
          leadLabel,
          totals,
          minimumQuantity
        };
      })
      .filter((entry): entry is NonNullable<typeof entry> => entry !== null);
  }, [items, tProducts, tLeadTimes]);

  const summary = useMemo(() => {
    return enrichedItems.reduce(
      (acc, item) => {
        if (!item || !item.totals) return acc;
        return {
          quantity: acc.quantity + item.raw.quantity,
          gross: acc.gross + item.totals.total
        };
      },
      {quantity: 0, gross: 0}
    );
  }, [enrichedItems]);

  const packDiscounts = useMemo(() => {
    return packDefinitions.reduce(
      (acc, pack) => {
        if (!pack.discount || !pack.items.length) {
          return acc;
        }
        const matchingItems = enrichedItems.filter((item) => item.raw.projectId === pack.id);
        if (matchingItems.length < pack.items.length) {
          return acc;
        }
        const satisfied = pack.items.every((line) => {
          const candidate = matchingItems.find((item) => item.raw.productId === line.productId);
          if (!candidate) return false;
          return candidate.raw.quantity >= line.quantity;
        });
        if (!satisfied) {
          return acc;
        }
        const packTotal = matchingItems.reduce((sum, item) => {
          if (!item.totals) return sum;
          return sum + item.totals.total;
        }, 0);
        if (packTotal <= 0) {
          return acc;
        }
        const amount = Number(((packTotal * pack.discount.percent) / 100).toFixed(2));
        if (amount <= 0) {
          return acc;
        }
        acc.push({pack, amount});
        return acc;
      },
      [] as Array<{pack: (typeof packDefinitions)[number]; amount: number}>
    );
  }, [enrichedItems]);

  const discountTotal = packDiscounts.reduce((sum, entry) => sum + entry.amount, 0);
  const hasDiscount = discountTotal > 0;
  const finalTotal = Math.max(summary.gross - discountTotal, 0);

  const downloadBat = (item: NonNullable<(typeof enrichedItems)[number]>) => {
    if (!item.raw.previewDataUrl || !item.totals || !item.method || !item.leadTime) {
      return;
    }
    const pdfBlob = generateBatPdf({
      productName: item.name,
      methodLabel: item.methodLabel,
      zoneLabel: item.zoneLabel,
      quantity: item.raw.quantity,
      unitPrice: formatPrice(item.totals.unitPrice, locale),
      totalPrice: formatPrice(item.totals.total, locale),
      setupFee: formatPrice(item.totals.setupFee, locale),
      leadTimeLabel: `${item.leadLabel || formatLeadTime(item.leadTime, locale)}`,
      previewDataUrl: item.raw.previewDataUrl,
      customerNote: notes || undefined,
      locale: locale === 'ar' ? 'ar' : 'fr',
      canvasWidth: item.product.creationCanvas.width,
      canvasHeight: item.product.creationCanvas.height
    });
    const url = URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `BAT-${item.product.slug}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  };

  const validateCheckout = () => {
    const errors: Record<string, string> = {};
    const trimmedCompany = checkout.company.trim();
    const trimmedContact = checkout.contact.trim();
    const trimmedEmail = checkout.email.trim();
    const trimmedPhone = checkout.phone.trim();

    if (!trimmedCompany) {
      errors.company = tQuotes('checkout.validation.company');
    }
    if (!trimmedContact) {
      errors.contact = tQuotes('checkout.validation.contact');
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/u;
    if (!trimmedEmail || !emailPattern.test(trimmedEmail)) {
      errors.email = tQuotes('checkout.validation.email');
    }
    if (!trimmedPhone || trimmedPhone.replace(/[^0-9+]/g, '').length < 6) {
      errors.phone = tQuotes('checkout.validation.phone');
    }
    return errors;
  };

  const handleCheckoutChange = (field: keyof typeof checkout) => (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setCheckout((prev) => ({...prev, [field]: value}));
    if (formErrors[field]) {
      setFormErrors((prev) => {
        const next = {...prev};
        delete next[field];
        return next;
      });
    }
  };

  const submitOrder = async () => {
    if (!enrichedItems.length) {
      pushToast({title: tQuotes('toast.missing')});
      return;
    }

    const errors = validateCheckout();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setShowCheckoutForm(true);
      pushToast({title: tQuotes('toast.validation')});
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch('/api/rfq', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          items,
          notes,
          checkout,
          locale,
          totals: {
            quantity: summary.quantity,
            gross: summary.gross,
            discount: discountTotal,
            total: finalTotal
          },
          discounts: packDiscounts.map((entry) => ({
            packId: entry.pack.id,
            code: entry.pack.discount?.code ?? null,
            percent: entry.pack.discount?.percent ?? null,
            amount: entry.amount
          }))
        })
      });
      if (!response.ok) {
        throw new Error('Failed');
      }
      const data = await response.json();
      const snapshot = {
        orderId: data.orderId ?? data.id ?? '',
        total: finalTotal,
        quantity: summary.quantity,
        company: checkout.company.trim(),
        contact: checkout.contact.trim(),
        email: checkout.email.trim(),
        receivedAt: data.receivedAt,
        status: data.status
      };
      pushToast({title: tQuotes('toast.orderSent')});
      clear();
      setNotes('');
      setCheckout({company: '', contact: '', email: '', phone: ''});
      setFormErrors({});
      setShowCheckoutForm(false);
      setConfirmation(snapshot);
    } catch (error) {
      logger.error(error);
      pushToast({title: tQuotes('toast.error')});
    } finally {
      setSubmitting(false);
    }
  };

  const handleOrderClick = () => {
    if (!showCheckoutForm) {
      setFormErrors({});
      setShowCheckoutForm(true);
      return;
    }
    submitOrder();
  };

  const handleExportQuote = () => {
    if (!enrichedItems.length) {
      pushToast({title: tQuotes('toast.missing')});
      return;
    }
    setExporting(true);
    try {
      const localeTag = locale === 'ar' ? 'ar-MA' : 'fr-MA';
      const now = new Date();
      const dateFormatter = new Intl.DateTimeFormat(localeTag, {dateStyle: 'long', timeStyle: 'short'});
      const reference = `Q-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${String(now.getTime()).slice(-4)}`;

      const headerLines = [
        tQuotes('export.title'),
        tQuotes('export.reference', {ref: reference}),
        tQuotes('export.generated', {date: dateFormatter.format(now)})
      ];

      const emptyValue = tQuotes('checkout.emptyValue');
      const customerLines = [
        `${tQuotes('checkout.company')}: ${checkout.company.trim() || emptyValue}`,
        `${tQuotes('checkout.contact')}: ${checkout.contact.trim() || emptyValue}`,
        `${tQuotes('checkout.email')}: ${checkout.email.trim() || emptyValue}`,
        `${tQuotes('checkout.phone')}: ${checkout.phone.trim() || emptyValue}`
      ];

      const itemLines = enrichedItems.map((item, index) => {
        if (!item.totals) return '';
        const unitLabel = tQuotes('summary.unit');
        const unitPriceLabel = formatPrice(item.totals.unitPrice, locale);
        const lineTotal = formatPrice(item.totals.total, locale);
        return `${index + 1}. ${item.name} — ${item.raw.quantity} ${unitLabel} · ${unitPriceLabel} / u · ${lineTotal}`;
      }).filter(Boolean);

      const discountLines = packDiscounts.map((entry) => {
        const packName = translatePackLabel(entry.pack.id, entry.pack.labelKey);
        const label = tQuotes('summary.discount', {
          pack: packName,
          code: entry.pack.discount?.code ?? '',
          percent: entry.pack.discount?.percent ?? 0
        });
        return `${label}: -${formatPrice(entry.amount, locale)}`;
      });

      const totalLine = `${tQuotes('summary.total')}: ${formatPrice(finalTotal, locale)}`;

      const notesLines = notes.trim().length
        ? [`${tQuotes('export.notes')}: ${notes.trim()}`]
        : [];

      const footerLines = [tQuotes('export.payment'), tQuotes('export.thanks')];

      const pdfBlob = generateQuotePdf({
        headerLines,
        customerLines,
        itemLines,
        discountLines,
        totalLine,
        notesLines,
        footerLines
      });

      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Devis-Artevia-${reference}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(url), 2000);
      pushToast({title: tQuotes('toast.exported')});
    } finally {
      setExporting(false);
    }
  };

  return (
    <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6" dir={direction}>
      <div className="rounded-[36px] border border-slate-200 bg-white px-6 py-12 text-slate-900 shadow-[0_45px_90px_-70px_rgba(0,0,0,0.1)] sm:px-10 dark:border-white/10 dark:bg-[#121212] dark:text-slate-100 dark:shadow-[0_45px_90px_-70px_rgba(0,0,0,0.85)]">
        <header className="mb-10 text-center">
          <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">{tQuotes('title')}</h1>
        </header>
        {enrichedItems.length === 0 ? (
          confirmation ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-10 text-slate-900 shadow-sm dark:border-white/10 dark:bg-[#161616] dark:text-slate-100">
              <div className="space-y-4 text-center">
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
                  {tQuotes('success.title')}
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  {tQuotes('success.subtitle', {
                    ref: confirmation.orderId || '—'
                  })}
                </p>
              </div>
              <div className="mt-6 grid gap-4 text-sm text-slate-700 dark:text-slate-200 sm:grid-cols-2">
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white">{tQuotes('success.details.company')}</div>
                  <div>{confirmation.company || tQuotes('checkout.emptyValue')}</div>
                </div>
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white">{tQuotes('success.details.contact')}</div>
                  <div>{confirmation.contact || tQuotes('checkout.emptyValue')}</div>
                </div>
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white">{tQuotes('success.details.email')}</div>
                  <div>{confirmation.email || tQuotes('checkout.emptyValue')}</div>
                </div>
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white">{tQuotes('success.details.quantity')}</div>
                  <div>{confirmation.quantity}</div>
                </div>
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white">{tQuotes('success.details.total')}</div>
                  <div>{formatPrice(confirmation.total, locale)}</div>
                </div>
              </div>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Button size="md" onClick={() => setConfirmation(null)}>
                  {tQuotes('success.newOrder')}
                </Button>
              </div>
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center text-slate-500 dark:border-white/20 dark:bg-[#161616] dark:text-slate-400">
              {tQuotes('empty')}
            </div>
          )
        ) : (
          <div className="space-y-6">
            {enrichedItems.map((item) => (
              <article
                key={item?.raw.id}
                className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-4 text-slate-700 shadow-sm transition hover:-translate-y-1 hover:shadow-[0_30px_60px_-40px_rgba(130,212,187,0.35)] dark:border-white/10 dark:bg-[#161616] dark:text-slate-300 dark:hover:shadow-[0_30px_60px_-40px_rgba(130,212,187,0.65)] sm:flex-row"
              >
                <div className="relative h-32 w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 sm:h-32 sm:w-32 dark:border-white/10 dark:bg-[#0f0f0f]">
                  <Image
                    src={item?.product.heroImage ?? ''}
                    alt={item?.product.slug ?? ''}
                    fill
                    className="object-cover"
                    sizes="128px"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-2 text-sm text-slate-600 dark:text-slate-300">
                  <h2 className="text-base font-semibold text-slate-900 dark:text-white">{item?.name}</h2>
                  <div className="grid gap-1 text-sm text-slate-600 dark:text-slate-300">
                    <div>
                      <span className="font-medium text-slate-500 dark:text-slate-400">{tProduct('method')}: </span>
                      <span>{item?.methodLabel}</span>
                    </div>
                    <div>
                      <span className="font-medium text-slate-500 dark:text-slate-400">{tProduct('zone')}: </span>
                      <span>{item?.zoneLabel}</span>
                    </div>
                    <div>
                      <span className="font-medium text-slate-500 dark:text-slate-400">{tProduct('colorway')}: </span>
                      <span>{item?.colorLabel}</span>
                    </div>
                    <div>
                      <span className="font-medium text-slate-500 dark:text-slate-400">{tProduct('quantity')}: </span>
                      <input
                        type="number"
                        min={item?.minimumQuantity}
                        value={item?.raw.quantity ?? 0}
                        onChange={(event) => {
                          if (!item) return;
                          const nextValue = Number(event.target.value);
                          const minQuantity = item.minimumQuantity;
                          const safeValue = Number.isFinite(nextValue)
                            ? Math.max(minQuantity, Math.round(nextValue))
                            : minQuantity;
                          updateItem(item.raw.id, {quantity: safeValue});
                        }}
                        className="ml-2 w-24 rounded-xl border border-slate-200 bg-white px-3 py-1 text-right text-sm font-semibold text-slate-900 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30 dark:border-white/10 dark:bg-[#0f0f0f] dark:text-white"
                      />
                    </div>
                    <div>
                      <span className="font-medium text-slate-500 dark:text-slate-400">{tProduct('leadTime')}: </span>
                      <span>{item?.leadLabel}</span>
                    </div>
                  </div>
                  {item?.totals && (
                    <div className="mt-2 flex flex-wrap gap-3 text-sm">
                      <span className="inline-flex rounded-full bg-brand px-3 py-1 font-semibold text-charcoal shadow-[0_18px_38px_-28px_rgba(130,212,187,0.4)] dark:shadow-[0_18px_38px_-28px_rgba(130,212,187,0.8)]">
                        {formatPrice(item.totals.total, locale)}
                      </span>
                      <span className="inline-flex rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-slate-600 dark:border-white/10 dark:bg-[#0f0f0f] dark:text-slate-200">
                        {formatPrice(item.totals.unitPrice, locale)} / u
                      </span>
                    </div>
                  )}
                  <div className="flex flex-wrap gap-2 pt-2">
                    <Button
                      size="sm"
                      variant={item?.raw.previewDataUrl ? 'secondary' : 'ghost'}
                      disabled={!item?.raw.previewDataUrl}
                      onClick={() => item && downloadBat(item)}
                    >
                      {tQuotes('download')}
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => removeItem(item?.raw.id ?? '')}>
                      {tQuotes('remove')}
                    </Button>
                  </div>
                </div>
              </article>
            ))}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 text-slate-700 shadow-sm dark:border-white/10 dark:bg-[#161616] dark:text-slate-200">
              <label className="flex flex-col gap-2 text-sm">
                <span className="font-semibold text-slate-900 dark:text-white">{tQuotes('notes')}</span>
                <textarea
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  rows={4}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 placeholder:text-slate-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30 dark:border-white/10 dark:bg-[#0f0f0f] dark:text-white"
                />
              </label>
            </div>
            <footer className="flex flex-col gap-6 rounded-3xl border border-slate-200 bg-white p-6 text-slate-700 shadow-sm dark:border-white/10 dark:bg-[#161616] dark:text-slate-200">
              <div className="space-y-1 text-sm">
                <div className="font-semibold text-slate-900 dark:text-white">
                  {tQuotes('summary.items')}: {enrichedItems.length}
                </div>
                <div>{tQuotes('summary.quantity')}: {summary.quantity}</div>
                {hasDiscount && (
                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    {tQuotes('summary.gross')}: {formatPrice(summary.gross, locale)}
                  </div>
                )}
                {packDiscounts.map((entry) => (
                  <div key={entry.pack.id} className="text-sm font-semibold text-emerald-600">
                    {tQuotes('summary.discount', {
                      code: entry.pack.discount?.code ?? '',
                      percent: entry.pack.discount?.percent ?? 0,
                      pack: translatePackLabel(entry.pack.id, entry.pack.labelKey)
                    })}{' '}
                    -{formatPrice(entry.amount, locale)}
                  </div>
                ))}
                <div className="text-base font-semibold text-brand">
                  {tQuotes('summary.total')}: {formatPrice(finalTotal, locale)}
                </div>
              </div>
              {showCheckoutForm && (
                <div className="grid gap-3 text-sm text-slate-700 dark:text-slate-200">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="flex flex-col gap-2">
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {tQuotes('checkout.company')} *
                      </span>
                      <input
                        type="text"
                        value={checkout.company}
                        onChange={handleCheckoutChange('company')}
                        autoComplete="organization"
                        aria-invalid={formErrors.company ? 'true' : undefined}
                        className={`w-full rounded-2xl border bg-white px-4 py-2.5 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand/30 dark:border-white/10 dark:bg-[#0f0f0f] dark:text-white ${formErrors.company ? 'border-red-500 focus:border-red-500 focus:ring-red-200 dark:border-red-400' : 'border-slate-200 focus:border-brand dark:border-white/10'}`}
                      />
                      {formErrors.company && <span className="text-xs text-red-500">{formErrors.company}</span>}
                    </label>
                    <label className="flex flex-col gap-2">
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {tQuotes('checkout.contact')} *
                      </span>
                      <input
                        type="text"
                        value={checkout.contact}
                        onChange={handleCheckoutChange('contact')}
                        autoComplete="name"
                        aria-invalid={formErrors.contact ? 'true' : undefined}
                        className={`w-full rounded-2xl border bg-white px-4 py-2.5 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand/30 dark:border-white/10 dark:bg-[#0f0f0f] dark:text-white ${formErrors.contact ? 'border-red-500 focus:border-red-500 focus:ring-red-200 dark:border-red-400' : 'border-slate-200 focus:border-brand dark:border-white/10'}`}
                      />
                      {formErrors.contact && <span className="text-xs text-red-500">{formErrors.contact}</span>}
                    </label>
                    <label className="flex flex-col gap-2">
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {tQuotes('checkout.email')} *
                      </span>
                      <input
                        type="email"
                        value={checkout.email}
                        onChange={handleCheckoutChange('email')}
                        autoComplete="email"
                        aria-invalid={formErrors.email ? 'true' : undefined}
                        className={`w-full rounded-2xl border bg-white px-4 py-2.5 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand/30 dark:border-white/10 dark:bg-[#0f0f0f] dark:text-white ${formErrors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-200 dark:border-red-400' : 'border-slate-200 focus:border-brand dark:border-white/10'}`}
                      />
                      {formErrors.email && <span className="text-xs text-red-500">{formErrors.email}</span>}
                    </label>
                    <label className="flex flex-col gap-2">
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {tQuotes('checkout.phone')} *
                      </span>
                      <input
                        type="tel"
                        value={checkout.phone}
                        onChange={handleCheckoutChange('phone')}
                        autoComplete="tel"
                        aria-invalid={formErrors.phone ? 'true' : undefined}
                        className={`w-full rounded-2xl border bg-white px-4 py-2.5 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand/30 dark:border-white/10 dark:bg-[#0f0f0f] dark:text-white ${formErrors.phone ? 'border-red-500 focus:border-red-500 focus:ring-red-200 dark:border-red-400' : 'border-slate-200 focus:border-brand dark:border-white/10'}`}
                      />
                      {formErrors.phone && <span className="text-xs text-red-500">{formErrors.phone}</span>}
                    </label>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{tQuotes('checkout.requiredHint')}</p>
                </div>
              )}
              <div className="flex flex-wrap gap-3">
                <Button
                  size="md"
                  variant="secondary"
                  onClick={handleExportQuote}
                  loading={isExporting}
                >
                  {tQuotes('exportQuote')}
                </Button>
                <Button size="md" onClick={handleOrderClick} loading={isSubmitting}>
                  {showCheckoutForm ? tQuotes('checkout.submit') : tQuotes('checkout.open')}
                </Button>
                <Button
                  size="md"
                  variant="ghost"
                  onClick={() => {
                    clear();
                    setNotes('');
                    setConfirmation(null);
                    setCheckout({company: '', contact: '', email: '', phone: ''});
                    setFormErrors({});
                    setShowCheckoutForm(false);
                  }}
                >
                  {tQuotes('reset')}
                </Button>
              </div>
            </footer>
          </div>
        )}
      </div>
    </section>
  );
}
