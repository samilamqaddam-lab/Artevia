# URGENT: Fix Product Images Table Schema

## Issue
The `product_images` table was created with `product_id UUID` but our application uses string IDs like "notepad-spiral", not UUIDs. This is causing the migration script to fail.

## Solution
Execute this SQL in Supabase Dashboard SQL Editor to fix the schema:

### Steps:
1. Go to: https://supabase.com/dashboard/project/qygpijoytpbxgbkaylkz/sql/new
2. Copy and paste the entire SQL below
3. Click "Run"

### SQL to Execute:

```sql
-- Fix product_id column type from UUID to TEXT
-- Product IDs in the application are strings like "notepad-spiral", not UUIDs

-- Drop existing table and recreate with correct type
DROP TABLE IF EXISTS product_images CASCADE;

-- Recreate product_images table with TEXT product_id
CREATE TABLE product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id TEXT NOT NULL,
  image_url TEXT NOT NULL,
  image_type TEXT NOT NULL DEFAULT 'uploaded' CHECK (image_type IN ('local', 'external', 'uploaded')),
  storage_path TEXT,
  is_hero BOOLEAN DEFAULT false,
  display_order INTEGER NOT NULL DEFAULT 0,
  alt_text TEXT,
  attribution JSONB,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Create unique constraint: only one hero image per product
CREATE UNIQUE INDEX idx_unique_hero_per_product
ON product_images (product_id)
WHERE is_hero = true;

-- Create indexes
CREATE INDEX idx_product_images_product_id ON product_images(product_id);
CREATE INDEX idx_product_images_display_order ON product_images(product_id, display_order);
CREATE INDEX idx_product_images_hero ON product_images(is_hero) WHERE is_hero = true;

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_product_images_updated_at
  BEFORE UPDATE ON product_images
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Public can read, only admins can modify
CREATE POLICY "Public can view product images"
  ON product_images FOR SELECT
  TO PUBLIC
  USING (true);

CREATE POLICY "Admins can insert product images"
  ON product_images FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "Admins can update product images"
  ON product_images FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role IN ('admin', 'super_admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "Admins can delete product images"
  ON product_images FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role IN ('admin', 'super_admin')
    )
  );

-- Helper function: Set an image as hero (unsets others)
CREATE OR REPLACE FUNCTION set_hero_image(
  p_product_id TEXT,
  p_image_id UUID
)
RETURNS BOOLEAN AS $$
BEGIN
  -- First, unset all hero images for this product
  UPDATE product_images
  SET is_hero = false
  WHERE product_id = p_product_id;

  -- Then set the specified image as hero
  UPDATE product_images
  SET is_hero = true
  WHERE id = p_image_id AND product_id = p_product_id;

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function: Reorder images
CREATE OR REPLACE FUNCTION reorder_product_images(
  p_product_id TEXT,
  p_image_ids UUID[]
)
RETURNS BOOLEAN AS $$
DECLARE
  image_id UUID;
  new_order INTEGER := 0;
BEGIN
  -- Update display order for each image in the provided order
  FOREACH image_id IN ARRAY p_image_ids
  LOOP
    UPDATE product_images
    SET display_order = new_order
    WHERE id = image_id AND product_id = p_product_id;

    new_order := new_order + 1;
  END LOOP;

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function: Get all images for a product (ordered)
CREATE OR REPLACE FUNCTION get_product_images(p_product_id TEXT)
RETURNS TABLE (
  id UUID,
  image_url TEXT,
  image_type TEXT,
  storage_path TEXT,
  is_hero BOOLEAN,
  display_order INTEGER,
  alt_text TEXT,
  attribution JSONB,
  metadata JSONB
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    pi.id,
    pi.image_url,
    pi.image_type,
    pi.storage_path,
    pi.is_hero,
    pi.display_order,
    pi.alt_text,
    pi.attribution,
    pi.metadata
  FROM product_images pi
  WHERE pi.product_id = p_product_id
  ORDER BY pi.is_hero DESC, pi.display_order ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## What Changed?
- `product_id UUID` → `product_id TEXT` (line 10)
- Function signatures updated to accept TEXT instead of UUID

## After Running This:
1. Let me know when done
2. I'll regenerate the TypeScript types
3. Then we'll re-run the migration script
