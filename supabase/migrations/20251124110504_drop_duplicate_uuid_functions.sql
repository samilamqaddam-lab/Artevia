-- Drop duplicate UUID versions of functions
-- Our product IDs are strings (e.g., 'notepad-spiral'), not UUIDs
-- This resolves the function overloading ambiguity

-- Drop the UUID version (old, incorrect)
DROP FUNCTION IF EXISTS set_hero_image(p_product_id uuid, p_image_id uuid);

-- Drop the UUID version (old, incorrect)
DROP FUNCTION IF EXISTS reorder_product_images(p_product_id uuid, p_image_ids uuid[]);

-- The TEXT versions (correct) remain:
-- - set_hero_image(p_product_id text, p_image_id uuid)
-- - reorder_product_images(p_product_id text, p_image_ids uuid[])
