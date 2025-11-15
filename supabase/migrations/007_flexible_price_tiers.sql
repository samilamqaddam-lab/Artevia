-- Migration: Convert fixed price tiers to flexible JSONB structure
-- This allows products to have any number of price tiers (not just 3)

-- Step 1: Add new JSONB column for flexible tiers
ALTER TABLE public.price_overrides
ADD COLUMN price_tiers JSONB;

-- Step 2: Migrate existing data from fixed columns to JSONB format
UPDATE public.price_overrides
SET price_tiers = jsonb_build_object(
  'tiers', jsonb_build_array(
    jsonb_build_object('quantity', tier_1_quantity, 'price', tier_1_price),
    jsonb_build_object('quantity', tier_2_quantity, 'price', tier_2_price),
    jsonb_build_object('quantity', tier_3_quantity, 'price', tier_3_price)
  )
);

-- Step 3: Make the new column NOT NULL (after migration)
ALTER TABLE public.price_overrides
ALTER COLUMN price_tiers SET NOT NULL;

-- Step 4: Add validation constraint to ensure proper structure
ALTER TABLE public.price_overrides
ADD CONSTRAINT price_tiers_structure_check
CHECK (
  price_tiers ? 'tiers' AND
  jsonb_typeof(price_tiers->'tiers') = 'array' AND
  jsonb_array_length(price_tiers->'tiers') >= 1
);

-- Step 5: Drop old fixed columns (no longer needed)
ALTER TABLE public.price_overrides
DROP COLUMN tier_1_quantity,
DROP COLUMN tier_1_price,
DROP COLUMN tier_2_quantity,
DROP COLUMN tier_2_price,
DROP COLUMN tier_3_quantity,
DROP COLUMN tier_3_price;

-- Step 6: Create index on JSONB column for better query performance
CREATE INDEX idx_price_overrides_tiers ON public.price_overrides USING gin(price_tiers);

-- Step 7: Add helpful comment
COMMENT ON COLUMN public.price_overrides.price_tiers IS
'Flexible pricing tiers in JSONB format: {"tiers": [{"quantity": 30, "price": 14.97}, ...]}';
