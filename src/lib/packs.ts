import type {QuoteMode} from '@/types/quote';
import type {Product} from '@/lib/products';

export type PackLineItem = {
  productId: Product['id'];
  quantity: number;
  methodId?: string;
  zoneId?: string;
  leadTimeId?: string;
  colorwayId?: string;
  colorCount?: number;
  mode?: QuoteMode;
};

export type PackDiscount = {
  code: string;
  percent: number;
  description: string;
};

/**
 * Pack Discount Validation Rules
 *
 * A pack discount is only applied when ALL of the following conditions are met:
 *
 * 1. All products from the pack are in the cart
 * 2. Each product quantity >= pack minimum quantity
 * 3. Print method matches exactly (methodId) - affects pricing
 * 4. Print zone matches exactly (zoneId) - affects pricing
 * 5. Lead time matches exactly (leadTimeId) - affects pricing
 * 6. Color count matches exactly (colorCount) - affects pricing
 *
 * FLEXIBLE:
 * - Color choice (colorwayId) can be changed without losing the discount
 *
 * If any configuration aspect (method, zone, lead time, color count) is changed,
 * the items revert to normal prices from the price list.
 */
export type PackDefinition = {
  id: string;
  labelKey: string;
  items: PackLineItem[];
  notes?: string;
  discount?: PackDiscount;
};

export const packs: PackDefinition[] = [
  {
    id: 'pack-onboarding-startup',
    labelKey: 'packLabels.pack-onboarding-startup',
    items: [
      {
        productId: 'totebag-canvas',
        quantity: 50,
        methodId: 'screenprint-tote',
        zoneId: 'front',
        leadTimeId: 'standard',
        colorwayId: 'natural',
        colorCount: 2,
        mode: 'logo'
      },
      {
        productId: 'notepad-spiral',
        quantity: 50,
        methodId: 'digital-a5-100',
        zoneId: 'cover',
        leadTimeId: 'standard',
        colorwayId: 'kraft',
        colorCount: 4,
        mode: 'creative'
      },
      {
        productId: 'mug-ceramique',
        quantity: 50,
        methodId: 'sublimation',
        zoneId: 'wrap',
        leadTimeId: 'standard',
        colorwayId: 'white',
        colorCount: 4,
        mode: 'logo'
      },
      {
        productId: 'pen-s1',
        quantity: 50,
        methodId: 'laser-s1',
        zoneId: 'barrel',
        leadTimeId: 'standard',
        colorwayId: 'black',
        colorCount: 1,
        mode: 'logo'
      }
    ],
    notes:
      "Pack d'accueil clés en main : totebag, bloc-notes, mug et stylo assortis prêts à personnaliser.",
    discount: {
      code: 'ARTEVA-STARTUP',
      percent: 7,
      description: 'Remise de 7% appliquée automatiquement sur le pack Onboarding Startup.'
    }
  },
  {
    id: 'pack-salon-event',
    labelKey: 'packLabels.pack-salon-event',
    items: [
      {
        productId: 'notepad-spiral',
        quantity: 100,
        methodId: 'digital-a5-100',
        zoneId: 'cover',
        leadTimeId: 'express',
        colorwayId: 'kraft',
        colorCount: 4,
        mode: 'creative'
      },
      {
        productId: 'usb-16go',
        quantity: 100,
        methodId: 'uv-usb',
        zoneId: 'recto',
        leadTimeId: 'standard',
        colorwayId: 'white',
        colorCount: 4,
        mode: 'logo'
      },
      {
        productId: 'tshirt-essential',
        quantity: 80,
        methodId: 'silkscreen-tee',
        zoneId: 'front',
        leadTimeId: 'standard',
        colorwayId: 'white',
        colorCount: 3,
        mode: 'creative'
      }
    ],
    notes:
      "Dotation salon : bloc-notes, clés USB et t-shirts staff pour un stand homogène.",
    discount: {
      code: 'ARTEVA-SALON',
      percent: 6,
      description: 'Remise de 6% sur la dotation Salon & Événement lorsque le pack est complet.'
    }
  },
  {
    id: 'pack-premium-direction',
    labelKey: 'packLabels.pack-premium-direction',
    items: [
      {
        productId: 'pen-s1',
        quantity: 40,
        methodId: 'laser-s1',
        zoneId: 'barrel',
        leadTimeId: 'standard',
        colorwayId: 'blue',
        colorCount: 1,
        mode: 'logo'
      },
      {
        productId: 'notepad-spiral',
        quantity: 40,
        methodId: 'digital-a5-100',
        zoneId: 'cover',
        leadTimeId: 'standard',
        colorwayId: 'midnight',
        colorCount: 4,
        mode: 'creative'
      },
      {
        productId: 'mug-ceramique',
        quantity: 40,
        methodId: 'laser-engraved',
        zoneId: 'logo',
        leadTimeId: 'standard',
        colorwayId: 'black',
        colorCount: 1,
        mode: 'logo'
      }
    ],
    notes:
      "Coffret premium incluant stylo gravé, carnet relié et mug noir gravé pour vos VIP.",
    discount: {
      code: 'ARTEVA-PREMIUM',
      percent: 8,
      description: 'Remise de 8% sur le pack Premium Direction tant que les quantités sont respectées.'
    }
  }
];

export const packsById: Record<string, PackDefinition> = packs.reduce(
  (accumulator, pack) => {
    accumulator[pack.id] = pack;
    return accumulator;
  },
  {} as Record<string, PackDefinition>
);

export function getPackById(id: string): PackDefinition | undefined {
  return packsById[id];
}
