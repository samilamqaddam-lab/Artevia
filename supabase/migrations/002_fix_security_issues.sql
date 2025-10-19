-- ============================================================================
-- Security Fixes Migration
-- Created: 2025-10-19
-- Description: Fix SECURITY DEFINER view and search_path mutable functions
-- ============================================================================

-- ============================================================================
-- FIX 1: Add search_path to handle_new_user function
-- ============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_catalog
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$;

-- ============================================================================
-- FIX 2: Add search_path to update_updated_at function
-- ============================================================================
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public, pg_catalog
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- ============================================================================
-- FIX 3: Add search_path to version_project function
-- ============================================================================
CREATE OR REPLACE FUNCTION public.version_project()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_catalog
AS $$
DECLARE
  next_version INTEGER;
BEGIN
  -- Get next version number
  SELECT COALESCE(MAX(version_number), 0) + 1
  INTO next_version
  FROM public.design_versions
  WHERE project_id = NEW.id;

  -- Insert new version
  INSERT INTO public.design_versions (project_id, version_number, canvas, preview_url)
  VALUES (NEW.id, next_version, NEW.canvas, NEW.preview_url);

  RETURN NEW;
END;
$$;

-- ============================================================================
-- FIX 4: Recreate view with SECURITY INVOKER (explicit)
-- ============================================================================
DROP VIEW IF EXISTS public.recent_projects;

CREATE VIEW public.recent_projects
WITH (security_invoker = true)
AS
SELECT
  p.id,
  p.name,
  p.product_id,
  p.preview_url,
  p.created_at,
  p.updated_at,
  prof.full_name as owner_name,
  prof.company_name as owner_company
FROM public.projects p
LEFT JOIN public.profiles prof ON p.user_id = prof.id
WHERE p.is_public = TRUE
ORDER BY p.updated_at DESC
LIMIT 100;

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================
