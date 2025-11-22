-- =====================================================
-- Product Images Management System
-- =====================================================
-- This migration creates a complete product image management system
-- with Supabase Storage bucket and database table for tracking images

-- =====================================================
-- 1. Create Storage Bucket for Product Images
-- =====================================================
-- Note: Storage bucket creation must be done via Supabase Dashboard or Management API
-- as it cannot be created via SQL migrations. Instructions provided below.

/*
MANUAL STEP REQUIRED:
---------------------
Please create a storage bucket named 'product-images' with these settings:
1. Go to Supabase Dashboard > Storage
2. Click "New Bucket"
3. Name: product-images
4. Public: true (for public access to product images)
5. File size limit: 10MB
6. Allowed MIME types: image/jpeg, image/jpg, image/png, image/webp, image/gif
*/

-- =====================================================
-- 2. Create Product Images Table
-- =====================================================

-- Drop existing table if migration is re-run
DROP TABLE IF EXISTS product_images CASCADE;

-- Create product_images table to track all product images
CREATE TABLE product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL,
  image_url TEXT NOT NULL,
  image_type TEXT NOT NULL DEFAULT 'uploaded' CHECK (image_type IN ('local', 'external', 'uploaded')),
  storage_path TEXT, -- Path in Supabase Storage (for uploaded images)
  is_hero BOOLEAN DEFAULT false,
  display_order INTEGER NOT NULL DEFAULT 0,
  alt_text TEXT,
  attribution JSONB, -- {title, source, link} for external images
  metadata JSONB, -- {width, height, size, format, thumbnails}
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),

  -- Ensure only one hero image per product
  CONSTRAINT unique_hero_per_product EXCLUDE (product_id WITH =) WHERE (is_hero = true)
);

-- Create indexes for performance
CREATE INDEX idx_product_images_product ON product_images(product_id);
CREATE INDEX idx_product_images_order ON product_images(product_id, display_order);
CREATE INDEX idx_product_images_hero ON product_images(product_id) WHERE is_hero = true;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_product_images_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp update
CREATE TRIGGER update_product_images_timestamp
  BEFORE UPDATE ON product_images
  FOR EACH ROW
  EXECUTE FUNCTION update_product_images_updated_at();

-- =====================================================
-- 3. Create RLS Policies for product_images table
-- =====================================================

-- Enable RLS
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view product images (public products)
CREATE POLICY "Public can view product images"
  ON product_images FOR SELECT
  USING (true);

-- Policy: Only authenticated admin users can insert images
CREATE POLICY "Admin can insert product images"
  ON product_images FOR INSERT
  WITH CHECK (
    auth.uid() IN (
      SELECT id FROM auth.users
      WHERE email IN (
        'admin@arteva.ma',
        'sami@arteva.ma',
        'samilamqaddam@gmail.com'
      )
    )
  );

-- Policy: Only authenticated admin users can update images
CREATE POLICY "Admin can update product images"
  ON product_images FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT id FROM auth.users
      WHERE email IN (
        'admin@arteva.ma',
        'sami@arteva.ma',
        'samilamqaddam@gmail.com'
      )
    )
  )
  WITH CHECK (
    auth.uid() IN (
      SELECT id FROM auth.users
      WHERE email IN (
        'admin@arteva.ma',
        'sami@arteva.ma',
        'samilamqaddam@gmail.com'
      )
    )
  );

-- Policy: Only authenticated admin users can delete images
CREATE POLICY "Admin can delete product images"
  ON product_images FOR DELETE
  USING (
    auth.uid() IN (
      SELECT id FROM auth.users
      WHERE email IN (
        'admin@arteva.ma',
        'sami@arteva.ma',
        'samilamqaddam@gmail.com'
      )
    )
  );

-- =====================================================
-- 4. Storage Bucket RLS Policies (SQL Commands)
-- =====================================================
-- These policies will be applied after bucket creation

-- Note: Run these after creating the bucket in Supabase Dashboard
/*
-- Allow public read access to product images
INSERT INTO storage.policies (bucket_id, name, definition, mode)
VALUES (
  'product-images',
  'Public Access',
  '{"SELECT": true}',
  'read'
);

-- Allow authenticated admin users to upload
INSERT INTO storage.policies (bucket_id, name, definition, mode)
VALUES (
  'product-images',
  'Admin Upload',
  '{"INSERT": "auth.uid() IN (SELECT id FROM auth.users WHERE email IN (''admin@arteva.ma'', ''sami@arteva.ma'', ''samilamqaddam@gmail.com''))"}',
  'write'
);

-- Allow authenticated admin users to update
INSERT INTO storage.policies (bucket_id, name, definition, mode)
VALUES (
  'product-images',
  'Admin Update',
  '{"UPDATE": "auth.uid() IN (SELECT id FROM auth.users WHERE email IN (''admin@arteva.ma'', ''sami@arteva.ma'', ''samilamqaddam@gmail.com''))"}',
  'write'
);

-- Allow authenticated admin users to delete
INSERT INTO storage.policies (bucket_id, name, definition, mode)
VALUES (
  'product-images',
  'Admin Delete',
  '{"DELETE": "auth.uid() IN (SELECT id FROM auth.users WHERE email IN (''admin@arteva.ma'', ''sami@arteva.ma'', ''samilamqaddam@gmail.com''))"}',
  'write'
);
*/

-- =====================================================
-- 5. Helper Functions
-- =====================================================

-- Function to get all images for a product
CREATE OR REPLACE FUNCTION get_product_images(p_product_id UUID)
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
$$ LANGUAGE plpgsql;

-- Function to reorder images for a product
CREATE OR REPLACE FUNCTION reorder_product_images(
  p_product_id UUID,
  p_image_ids UUID[]
) RETURNS BOOLEAN AS $$
DECLARE
  i INTEGER;
BEGIN
  -- Update display_order based on array position
  FOR i IN 1..array_length(p_image_ids, 1) LOOP
    UPDATE product_images
    SET display_order = i
    WHERE id = p_image_ids[i] AND product_id = p_product_id;
  END LOOP;

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Function to set hero image (ensures only one hero per product)
CREATE OR REPLACE FUNCTION set_hero_image(
  p_product_id UUID,
  p_image_id UUID
) RETURNS BOOLEAN AS $$
BEGIN
  -- First, unset any existing hero image for this product
  UPDATE product_images
  SET is_hero = false
  WHERE product_id = p_product_id AND is_hero = true;

  -- Then set the new hero image
  UPDATE product_images
  SET is_hero = true
  WHERE id = p_image_id AND product_id = p_product_id;

  RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 6. Migration Data - Import existing product images
-- =====================================================

-- Function to migrate existing product images from the current system
CREATE OR REPLACE FUNCTION migrate_existing_product_images()
RETURNS INTEGER AS $$
DECLARE
  migrated_count INTEGER := 0;
BEGIN
  -- Note: This is a placeholder for the migration logic
  -- The actual migration will be handled by a TypeScript script
  -- that reads from product-image-overrides.json and products.ts

  RETURN migrated_count;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 7. Grant permissions
-- =====================================================

-- Grant usage on the schema
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Grant permissions on the table
GRANT SELECT ON product_images TO anon;
GRANT ALL ON product_images TO authenticated;

-- Grant permissions on the functions
GRANT EXECUTE ON FUNCTION get_product_images(UUID) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION reorder_product_images(UUID, UUID[]) TO authenticated;
GRANT EXECUTE ON FUNCTION set_hero_image(UUID, UUID) TO authenticated;

-- =====================================================
-- 8. Add comments for documentation
-- =====================================================

COMMENT ON TABLE product_images IS 'Stores all product images with metadata, ordering, and attribution';
COMMENT ON COLUMN product_images.product_id IS 'Reference to the product (UUID from products collection)';
COMMENT ON COLUMN product_images.image_url IS 'Full URL to access the image (can be Supabase Storage URL or external)';
COMMENT ON COLUMN product_images.image_type IS 'Type of image source: local (public folder), external (Unsplash/Pexels), uploaded (Supabase Storage)';
COMMENT ON COLUMN product_images.storage_path IS 'Path in Supabase Storage bucket (only for uploaded images)';
COMMENT ON COLUMN product_images.is_hero IS 'Whether this is the main product image';
COMMENT ON COLUMN product_images.display_order IS 'Order of display in gallery (lower numbers first)';
COMMENT ON COLUMN product_images.alt_text IS 'Alternative text for accessibility and SEO';
COMMENT ON COLUMN product_images.attribution IS 'JSON object with image credits {title, source, link}';
COMMENT ON COLUMN product_images.metadata IS 'JSON object with image metadata {width, height, size, format, thumbnails}';