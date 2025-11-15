/**
 * Price Override Types
 *
 * Allows admins to override default product pricing stored in code.
 * The system stores 3 reference price points; interpolation for
 * intermediate quantities happens in the existing pricing logic.
 */

export type PriceOverride = {
  id: string;
  product_id: string;
  method_id: string;

  // Three reference price tiers
  tier_1_quantity: number;
  tier_1_price: number;
  tier_2_quantity: number;
  tier_2_price: number;
  tier_3_quantity: number;
  tier_3_price: number;

  // Audit fields
  updated_by: string | null;
  updated_at: string;
  created_at: string;
};

export type PriceOverrideInput = {
  product_id: string;
  method_id: string;
  tier_1_quantity: number;
  tier_1_price: number;
  tier_2_quantity: number;
  tier_2_price: number;
  tier_3_quantity: number;
  tier_3_price: number;
};

export type PriceOverrideWithDetails = PriceOverride & {
  product_name: string;
  method_name: string;
  has_override: boolean;
};
