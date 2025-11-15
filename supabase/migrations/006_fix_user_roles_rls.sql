-- =====================================================
-- Migration: Fix User Roles RLS Policies
-- Description: Fixes RLS policies to work correctly with authenticated users
-- Created: 2025-11-15
-- =====================================================

-- 1. Create a debug function to help diagnose role issues
CREATE OR REPLACE FUNCTION public.get_user_role_debug(user_id_param UUID)
RETURNS TABLE(role TEXT, created_at TIMESTAMPTZ, updated_at TIMESTAMPTZ)
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT ur.role, ur.created_at, ur.updated_at
  FROM public.user_roles ur
  WHERE ur.user_id = user_id_param;
END;
$$ LANGUAGE plpgsql;

-- 2. Drop existing problematic policies
DROP POLICY IF EXISTS "Users can read their own role" ON public.user_roles;
DROP POLICY IF EXISTS "Super admins can manage all roles" ON public.user_roles;

-- 3. Create new, simplified policies for authenticated users
CREATE POLICY "Authenticated users can read their own role"
  ON public.user_roles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Super admins can manage all roles"
  ON public.user_roles
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'super_admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'super_admin'
    )
  );

-- 4. Grant execute permission on debug function
GRANT EXECUTE ON FUNCTION public.get_user_role_debug(UUID) TO authenticated;

-- =====================================================
-- Migration completed successfully
-- =====================================================
