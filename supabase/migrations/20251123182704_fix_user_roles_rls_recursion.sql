-- Fix infinite recursion in user_roles RLS policies
-- The "Super admins can manage all roles" policy was causing recursion
-- because it queries user_roles to check if user is super_admin

-- Drop the recursive policy
DROP POLICY IF EXISTS "Super admins can manage all roles" ON user_roles;

-- The existing "Authenticated users can read their own role" policy is sufficient
-- for our use case since isAdmin() only reads the user's own role
