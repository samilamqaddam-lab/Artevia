import {getSupabaseServiceClient} from './supabase/server';
import type {Product, MarkingMethod} from './products';
import type {PriceOverride} from '@/types/price-overrides';
import {logger} from './logger';

/**
 * Fetch all price overrides from database
 * Returns a map for quick lookups: {product_id}:{method_id} => PriceOverride
 */
export async function fetchPriceOverrides(): Promise<Map<string, PriceOverride>> {
  try {
    // Use service client for DB operations (no auth required for reading overrides)
    const supabase = getSupabaseServiceClient();

    const {data, error} = await supabase
      .from('price_overrides')
      .select('*');

    if (error) {
      logger.error('Error fetching price overrides:', error);
      return new Map();
    }

    const overridesMap = new Map<string, PriceOverride>();
    (data || []).forEach((override) => {
      const key = `${override.product_id}:${override.method_id}`;
      overridesMap.set(key, override as unknown as PriceOverride);
    });

    return overridesMap;
  } catch (error) {
    logger.error('fetchPriceOverrides error:', error);
    return new Map();
  }
}

/**
 * Apply price overrides to a product's methods
 * Returns a new product object with updated pricing
 */
export function applyPriceOverrides(
  product: Product,
  overridesMap: Map<string, PriceOverride>
): Product {
  const updatedMethods = product.methods.map((method) => {
    const key = `${product.id}:${method.id}`;
    const override = overridesMap.get(key);

    if (!override || !override.price_tiers?.tiers) {
      return method; // No override, return original
    }

    // Replace priceTiers with override values from flexible JSONB structure
    const updatedMethod: MarkingMethod = {
      ...method,
      priceTiers: override.price_tiers.tiers.map((tier) => ({
        minQuantity: tier.quantity,
        unitPrice: tier.price
      }))
    };

    return updatedMethod;
  });

  return {
    ...product,
    methods: updatedMethods
  };
}

/**
 * Get a single product with price overrides applied
 */
export async function getProductWithPricing(productId: string, baseProducts: Product[]): Promise<Product | undefined> {
  const baseProduct = baseProducts.find((p) => p.id === productId);
  if (!baseProduct) return undefined;

  const overridesMap = await fetchPriceOverrides();
  return applyPriceOverrides(baseProduct, overridesMap);
}

/**
 * Get all products with price overrides applied
 */
export async function getAllProductsWithPricing(baseProducts: Product[]): Promise<Product[]> {
  const overridesMap = await fetchPriceOverrides();
  return baseProducts.map((product) => applyPriceOverrides(product, overridesMap));
}
