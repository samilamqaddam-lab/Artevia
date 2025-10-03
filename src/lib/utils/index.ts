import {clsx, type ClassValue} from 'clsx';
import {twMerge} from 'tailwind-merge';
import type {LeadTimeOption, MarkingMethod} from '@/lib/products';
import {rtlLocales, type Locale} from '@/i18n/settings';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isRTL(locale: Locale) {
  return rtlLocales.has(locale);
}

export function formatPrice(value: number, locale: Locale = 'fr') {
  return new Intl.NumberFormat(locale === 'ar' ? 'ar-MA' : 'fr-MA', {
    style: 'currency',
    currency: 'MAD',
    maximumFractionDigits: 2
  }).format(value);
}

export function generateId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `artevia-${Math.random().toString(36).slice(2, 10)}`;
}

export function getUnitPrice(method: MarkingMethod, quantity: number) {
  const sorted = [...method.priceTiers].sort((a, b) => a.minQuantity - b.minQuantity);
  if (sorted.length === 0) {
    return 0;
  }

  const safeQuantity = Math.max(quantity, sorted[0].minQuantity);

  if (sorted.length === 1 || safeQuantity <= sorted[0].minQuantity) {
    return sorted[0].unitPrice;
  }

  for (let index = 0; index < sorted.length - 1; index += 1) {
    const current = sorted[index];
    const next = sorted[index + 1];

    if (safeQuantity <= next.minQuantity) {
      const span = next.minQuantity - current.minQuantity;
      if (span <= 0) {
        return current.unitPrice;
      }
      const progress = (safeQuantity - current.minQuantity) / span;
      const interpolated = current.unitPrice - progress * (current.unitPrice - next.unitPrice);
      return Number(interpolated.toFixed(2));
    }
  }

  return sorted[sorted.length - 1].unitPrice;
}

export function calculateQuoteTotals(method: MarkingMethod, leadTime: LeadTimeOption, quantity: number) {
  const unitPrice = getUnitPrice(method, quantity);
  const subtotal = unitPrice * quantity;
  const setupFee = method.setupFee;
  const surcharge = leadTime.surchargePercent
    ? Math.round(((subtotal + setupFee) * leadTime.surchargePercent) / 100)
    : 0;
  const total = subtotal + setupFee + surcharge;
  return {unitPrice, subtotal, setupFee, surcharge, total};
}

export function formatLeadTime(lead: LeadTimeOption, locale: Locale) {
  const daysLabel = locale === 'ar' ? 'يوم' : 'j';
  return `${lead.days} ${daysLabel}`;
}
