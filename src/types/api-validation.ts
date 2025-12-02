/**
 * API Request Validation Schemas using Zod
 *
 * These schemas ensure that all incoming API requests are properly validated
 * before processing, preventing injection attacks and data corruption.
 */

import {z} from 'zod';

/**
 * RFQ (Request for Quote) Item Schema
 * Validates individual items in a quote request
 */
export const RFQItemSchema = z.object({
  productId: z.string().min(1).max(100),
  quantity: z.number().int().min(1).max(100000),
  methodId: z.string().min(1).max(100),
  zoneId: z.string().max(100).optional(),
  leadTimeId: z.string().max(100).optional(),
  colorCount: z.number().int().min(0).max(20).optional(),
  colorwayId: z.string().max(100).optional(),
  mode: z.enum(['logo', 'full', 'text']).optional(),
  selectedOptions: z.record(z.string(), z.string()).optional(),
  price: z.number().min(0).optional(),
  basePrice: z.number().min(0).optional(),
  previewDataUrl: z.string().optional(),
  personalization: z.object({
    mode: z.enum(['upload', 'design']),
    fileName: z.string().max(255).optional(),
    designData: z.any().optional()
  }).optional()
});

/**
 * Checkout Information Schema
 * Validates customer contact information
 */
export const CheckoutSchema = z.object({
  contact: z.string().min(1, 'Le nom est requis').max(100),
  email: z.string().email('Email invalide').max(200),
  phone: z.string().min(1, 'Le téléphone est requis').max(20),
  company: z.string().max(200).optional()
});

/**
 * Totals Schema
 * Validates quote total calculations
 */
export const TotalsSchema = z.object({
  total: z.number().min(0),
  discount: z.number().min(0),
  quantity: z.number().int().min(0)
});

/**
 * RFQ (Request for Quote) Main Schema
 * Validates complete quote requests
 */
export const RFQSchema = z.object({
  items: z.array(RFQItemSchema).min(1, 'Au moins un item est requis').max(100),
  notes: z.string().max(2000).optional(),
  checkout: CheckoutSchema.optional(),
  totals: TotalsSchema.optional(),
  discounts: z.array(z.string()).max(10).default([]),
  locale: z.enum(['fr', 'ar']).optional()
});

/**
 * BAT (Bon à Tirer) Schema
 * Validates print approval requests
 */
export const BATSchema = z.object({
  productId: z.string().min(1).max(100),
  methodId: z.string().min(1).max(100),
  zoneId: z.string().min(1).max(100),
  previewDataUrl: z.string().optional(),
  designData: z.any().optional()
});

/**
 * Type exports for TypeScript
 */
export type RFQItem = z.infer<typeof RFQItemSchema>;
export type Checkout = z.infer<typeof CheckoutSchema>;
export type Totals = z.infer<typeof TotalsSchema>;
export type RFQRequest = z.infer<typeof RFQSchema>;
export type BATRequest = z.infer<typeof BATSchema>;
