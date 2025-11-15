-- Migration: Price Override System
-- Description: Allow admins to override default product pricing without code changes
-- Created: 2025-11-15

-- Create price_overrides table
CREATE TABLE IF NOT EXISTS public.price_overrides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Product and method identification
  product_id TEXT NOT NULL,
  method_id TEXT NOT NULL,

  -- Three reference price tiers (interpolation happens in code)
  tier_1_quantity INTEGER NOT NULL CHECK (tier_1_quantity > 0),
  tier_1_price DECIMAL(10,2) NOT NULL CHECK (tier_1_price > 0),

  tier_2_quantity INTEGER NOT NULL CHECK (tier_2_quantity > tier_1_quantity),
  tier_2_price DECIMAL(10,2) NOT NULL CHECK (tier_2_price > 0),

  tier_3_quantity INTEGER NOT NULL CHECK (tier_3_quantity > tier_2_quantity),
  tier_3_price DECIMAL(10,2) NOT NULL CHECK (tier_3_price > 0),

  -- Audit trail
  updated_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Ensure one override per product+method combination
  UNIQUE(product_id, method_id)
);

-- Add index for fast lookups
CREATE INDEX idx_price_overrides_product_method
  ON public.price_overrides(product_id, method_id);

-- Enable RLS
ALTER TABLE public.price_overrides ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Anyone authenticated can read price overrides
CREATE POLICY "Authenticated users can read price overrides"
  ON public.price_overrides
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- RLS Policy: Authenticated users can insert price overrides
CREATE POLICY "Authenticated users can insert price overrides"
  ON public.price_overrides
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- RLS Policy: Authenticated users can update their own overrides
CREATE POLICY "Authenticated users can update price overrides"
  ON public.price_overrides
  FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- RLS Policy: Authenticated users can delete price overrides
CREATE POLICY "Authenticated users can delete price overrides"
  ON public.price_overrides
  FOR DELETE
  USING (auth.role() = 'authenticated');

-- Add trigger to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_price_overrides_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  NEW.updated_by = auth.uid();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_update_price_overrides_updated_at
  BEFORE UPDATE ON public.price_overrides
  FOR EACH ROW
  EXECUTE FUNCTION public.update_price_overrides_updated_at();

-- Add comment on table
COMMENT ON TABLE public.price_overrides IS
  'Stores custom pricing overrides for product methods. Three reference price points are stored; interpolation for intermediate quantities happens in application code.';
