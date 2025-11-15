-- =====================================================
-- Migration: User Roles & Role-Based Access Control
-- Description: Implements a role-based access system
-- Created: 2025-11-15
-- =====================================================

-- 1. Create user_roles table
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('super_admin', 'admin', 'user')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- 2. Create index for fast role lookups
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON public.user_roles(role);

-- 3. Enable Row Level Security
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies for user_roles table
-- Allow users to read their own role
CREATE POLICY "Users can read their own role"
  ON public.user_roles
  FOR SELECT
  USING (auth.uid() = user_id);

-- Only super_admins can manage roles
CREATE POLICY "Super admins can manage all roles"
  ON public.user_roles
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'super_admin'
    )
  );

-- 5. Create helper function to check user role
CREATE OR REPLACE FUNCTION public.has_role(required_role TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  -- Super admins have all permissions
  IF EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'super_admin'
  ) THEN
    RETURN TRUE;
  END IF;

  -- Check specific role
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = required_role
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Create function to check if user is admin (admin or super_admin)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role IN ('super_admin', 'admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Update RLS policies on price_overrides to require admin role
DROP POLICY IF EXISTS "Authenticated users can read price overrides" ON public.price_overrides;
DROP POLICY IF EXISTS "Authenticated users can insert price overrides" ON public.price_overrides;
DROP POLICY IF EXISTS "Authenticated users can update price overrides" ON public.price_overrides;
DROP POLICY IF EXISTS "Authenticated users can delete price overrides" ON public.price_overrides;

-- New policies requiring admin role
CREATE POLICY "Admins can read price overrides"
  ON public.price_overrides
  FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admins can insert price overrides"
  ON public.price_overrides
  FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update price overrides"
  ON public.price_overrides
  FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete price overrides"
  ON public.price_overrides
  FOR DELETE
  USING (public.is_admin());

-- 8. Insert super_admin roles for specified emails
DO $$
DECLARE
  v_user_id UUID;
BEGIN
  -- Assign super_admin to sami.lamqaddam@gmail.com
  SELECT id INTO v_user_id FROM auth.users WHERE email = 'sami.lamqaddam@gmail.com';
  IF v_user_id IS NOT NULL THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (v_user_id, 'super_admin')
    ON CONFLICT (user_id) DO UPDATE SET role = 'super_admin', updated_at = NOW();
  END IF;

  -- Assign super_admin to sami.artipel@gmail.com
  SELECT id INTO v_user_id FROM auth.users WHERE email = 'sami.artipel@gmail.com';
  IF v_user_id IS NOT NULL THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (v_user_id, 'super_admin')
    ON CONFLICT (user_id) DO UPDATE SET role = 'super_admin', updated_at = NOW();
  END IF;
END $$;

-- 9. Create trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION public.update_user_roles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_user_roles_updated_at ON public.user_roles;
CREATE TRIGGER update_user_roles_updated_at
  BEFORE UPDATE ON public.user_roles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_user_roles_updated_at();

-- 10. Grant necessary permissions
GRANT SELECT ON public.user_roles TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

-- =====================================================
-- Migration completed successfully
-- =====================================================
