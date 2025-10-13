-- ============================================================================
-- Artevia Database Schema - Initial Migration
-- Created: 2025-10-13
-- Description: Creates profiles, projects, and secures existing tables
-- ============================================================================

-- ============================================================================
-- PROFILES TABLE
-- ============================================================================
-- Stores extended user information beyond Supabase Auth

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  company_name TEXT,
  phone TEXT,
  locale TEXT DEFAULT 'fr' CHECK (locale IN ('fr', 'ar')),
  avatar_url TEXT,
  preferences JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to execute handle_new_user
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- PROJECTS TABLE
-- ============================================================================
-- Stores user design projects (migrating from IndexedDB to Supabase)

CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  product_id TEXT NOT NULL,
  canvas JSONB NOT NULL,
  preview_url TEXT,
  is_public BOOLEAN DEFAULT FALSE,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- RLS Policies for projects
CREATE POLICY "Users can view own projects"
  ON public.projects
  FOR SELECT
  USING (auth.uid() = user_id OR is_public = TRUE);

CREATE POLICY "Users can create projects"
  ON public.projects
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects"
  ON public.projects
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects"
  ON public.projects
  FOR DELETE
  USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON public.projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_product_id ON public.projects(product_id);
CREATE INDEX IF NOT EXISTS idx_projects_updated_at ON public.projects(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_projects_public ON public.projects(is_public) WHERE is_public = TRUE;

-- Function to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for auto-updating updated_at
DROP TRIGGER IF EXISTS projects_updated_at ON public.projects;
CREATE TRIGGER projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ============================================================================
-- ORDERS TABLE - SECURITY UPDATE
-- ============================================================================
-- Add user_id and enable RLS for existing orders table

-- Add user_id column if it doesn't exist
ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Enable Row Level Security
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- RLS Policies for orders
DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
CREATE POLICY "Users can view own orders"
  ON public.orders
  FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Authenticated users can create orders" ON public.orders;
CREATE POLICY "Authenticated users can create orders"
  ON public.orders
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Optional: Admin policy (uncomment if needed)
-- CREATE POLICY "Admin can view all orders"
--   ON public.orders
--   FOR SELECT
--   USING (auth.jwt()->>'role' = 'admin');

-- Index for user_id
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);

-- ============================================================================
-- DESIGN VERSIONS TABLE
-- ============================================================================
-- Stores version history of projects for undo/redo functionality

CREATE TABLE IF NOT EXISTS public.design_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  version_number INTEGER NOT NULL,
  canvas JSONB NOT NULL,
  preview_url TEXT,
  change_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (project_id, version_number)
);

-- Enable Row Level Security
ALTER TABLE public.design_versions ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view versions of their own projects
CREATE POLICY "Users can view own project versions"
  ON public.design_versions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = design_versions.project_id
      AND projects.user_id = auth.uid()
    )
  );

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_design_versions_project_id
  ON public.design_versions(project_id, version_number DESC);

-- Function to auto-create versions when project canvas changes
CREATE OR REPLACE FUNCTION version_project()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-version on canvas update
DROP TRIGGER IF EXISTS on_project_updated ON public.projects;
CREATE TRIGGER on_project_updated
  AFTER UPDATE OF canvas ON public.projects
  FOR EACH ROW
  WHEN (OLD.canvas IS DISTINCT FROM NEW.canvas)
  EXECUTE FUNCTION version_project();

-- ============================================================================
-- SHARED PROJECTS TABLE
-- ============================================================================
-- Enables project sharing between users

CREATE TABLE IF NOT EXISTS public.shared_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  shared_by UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  shared_with_email TEXT NOT NULL,
  permission TEXT CHECK (permission IN ('view', 'edit')) DEFAULT 'view',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (project_id, shared_with_email)
);

-- Enable Row Level Security
ALTER TABLE public.shared_projects ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view project shares"
  ON public.shared_projects
  FOR SELECT
  USING (auth.uid() = shared_by);

CREATE POLICY "Users can share their projects"
  ON public.shared_projects
  FOR INSERT
  WITH CHECK (
    auth.uid() = shared_by
    AND EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = shared_projects.project_id
      AND projects.user_id = auth.uid()
    )
  );

-- Indexes
CREATE INDEX IF NOT EXISTS idx_shared_projects_email
  ON public.shared_projects(shared_with_email);
CREATE INDEX IF NOT EXISTS idx_shared_projects_project_id
  ON public.shared_projects(project_id);

-- ============================================================================
-- HELPER VIEWS
-- ============================================================================

-- View: Recent projects with user info
CREATE OR REPLACE VIEW public.recent_projects AS
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
-- GRANTS (if needed)
-- ============================================================================
-- Note: Supabase handles most grants automatically via RLS
-- Uncomment if you need specific service role access

-- GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
-- GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, service_role;
-- GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================
-- Next steps:
-- 1. Regenerate TypeScript types: npx supabase gen types typescript
-- 2. Update application code to use new tables
-- 3. Migrate existing IndexedDB data to Supabase projects table
-- 4. Test RLS policies thoroughly
-- ============================================================================
