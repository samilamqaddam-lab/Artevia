import {getSupabaseClient} from './supabase/server';
import type {Product, MarkingMethod} from './products';
import type {PriceOverride} from '@/types/price-overrides';
import {logger} from './logger';

/**
 * Fetch all price overrides from database
 * Returns a map for quick lookups: {product_id}:{method_id} => PriceOverride
 */
export async function fetchPriceOverrides(): Promise<Map<string, PriceOverride>> {
  try {
    const supabase = getSupabaseClient();

    const {data, error} = await supabase
      .from('price_overrides')
      .select('*');

    if (error) {
      logger.error('Error fetching price overrides:', error);
      return new Map();
    }

    const overridesMap = new Map<string, PriceOverride>();
    (data || []).forEach((override: PriceOverride) => {
      const key = `${override.product_id}:${override.method_id}`;
      overridesMap.set(key, override);
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

    if (!override) {
      return method; // No override, return original
    }

    // Replace priceTiers with override values
    const updatedMethod: MarkingMethod = {
      ...method,
      priceTiers: [
        {
          minQuantity: override.tier_1_quantity,
          unitPrice: Number(override.tier_1_price)
        },
        {
          minQuantity: override.tier_2_quantity,
          unitPrice: Number(override.tier_2_price)
        },
        {
          minQuantity: override.tier_3_quantity,
          unitPrice: Number(override.tier_3_price)
        }
      ]
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
