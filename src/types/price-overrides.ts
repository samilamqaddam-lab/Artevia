/**
 * Price Override Types
 *
 * Allows admins to override default product pricing stored in code.
 * The system now supports flexible pricing with any number of tiers per product.
 */

export type PriceTier = {
  quantity: number;
  price: number;
};

export type PriceTiersStructure = {
  tiers: PriceTier[];
};

export type PriceOverride = {
  id: string;
  product_id: string;
  method_id: string;

  // Flexible price tiers (supports any number of tiers)
  price_tiers: PriceTiersStructure;

  // Audit fields
  updated_by: string | null;
  updated_at: string | null;
  created_at: string | null;
};

export type PriceOverrideInput = {
  product_id: string;
  method_id: string;
  price_tiers: PriceTiersStructure;
};

export type PriceOverrideWithDetails = PriceOverride & {
  product_name: string;
  method_name: string;
  has_override: boolean;
};
