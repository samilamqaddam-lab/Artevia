-- Add indexes to improve performance for product image operations
-- These indexes will help with the hero image and reordering operations

-- Index for finding images by product_id and is_hero
CREATE INDEX IF NOT EXISTS idx_product_images_product_hero
ON product_images(product_id, is_hero);

-- Index for ordering images by display_order
CREATE INDEX IF NOT EXISTS idx_product_images_product_order
ON product_images(product_id, display_order);

-- Index for finding specific image by id
CREATE INDEX IF NOT EXISTS idx_product_images_id
ON product_images(id);

-- Ensure we have proper constraints
-- Make sure only one image per product can be hero
DROP INDEX IF EXISTS unique_hero_per_product;
CREATE UNIQUE INDEX unique_hero_per_product
ON product_images (product_id)
WHERE is_hero = true;