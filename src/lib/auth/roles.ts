/**
 * Role-Based Access Control (RBAC) Utilities
 *
 * This module provides utilities for checking user roles and permissions.
 *
 * Available Roles:
 * - super_admin: Full system access, can manage other admins
 * - admin: Can manage pricing and content
 * - user: Regular user, no admin access
 */

import {getSupabaseClient} from '@/lib/supabase/server';

export type UserRole = 'super_admin' | 'admin' | 'user';

export type UserRoleData = {
  id: string;
  user_id: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
};

/**
 * Get the role of the currently authenticated user
 * @returns The user's role or null if not found
 */
export async function getCurrentUserRole(): Promise<UserRole | null> {
  const supabase = getSupabaseClient();

  // Get current user
  const {
    data: {user},
    error: authError
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return null;
  }

  // Use RPC function to get role (bypasses type issues and RLS)
  const {data: roleData, error} = await supabase.rpc('get_user_role_debug', {
    user_id_param: user.id
  });

  if (error || !roleData || roleData.length === 0) {
    return null;
  }

  return roleData[0].role as UserRole;
}

/**
 * Check if the current user has a specific role
 * @param requiredRole - The role to check for
 * @returns True if user has the required role
 */
export async function hasRole(requiredRole: UserRole): Promise<boolean> {
  const userRole = await getCurrentUserRole();

  if (!userRole) {
    return false;
  }

  // Super admins have all permissions
  if (userRole === 'super_admin') {
    return true;
  }

  // Check exact role match
  return userRole === requiredRole;
}

/**
 * Check if the current user is an admin (admin or super_admin)
 * @returns True if user is an admin
 */
export async function isAdmin(): Promise<boolean> {
  const userRole = await getCurrentUserRole();

  if (!userRole) {
    return false;
  }

  return userRole === 'super_admin' || userRole === 'admin';
}

/**
 * Check if the current user is a super admin
 * @returns True if user is a super admin
 */
export async function isSuperAdmin(): Promise<boolean> {
  const userRole = await getCurrentUserRole();
  return userRole === 'super_admin';
}

/**
 * Require admin role or throw error
 * Useful for API routes
 * @throws Error if user is not an admin
 */
export async function requireAdmin(): Promise<void> {
  const admin = await isAdmin();

  if (!admin) {
    throw new Error('Unauthorized: Admin role required');
  }
}

/**
 * Require super admin role or throw error
 * Useful for API routes that modify sensitive settings
 * @throws Error if user is not a super admin
 */
export async function requireSuperAdmin(): Promise<void> {
  const superAdmin = await isSuperAdmin();

  if (!superAdmin) {
    throw new Error('Unauthorized: Super admin role required');
  }
}
