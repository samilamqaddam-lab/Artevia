import {createClient} from './client';
import type {Database} from './types';
import {logger} from '@/lib/logger';
import {uploadAvatar, deleteAvatar} from './storage';

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

/**
 * Get the profile of the current user or a specific user
 */
export async function getProfile(userId?: string): Promise<Profile | null> {
  const supabase = createClient();

  // If no userId provided, use current user
  if (!userId) {
    const {
      data: {user}
    } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    userId = user.id;
  }

  const {data, error} = await supabase.from('profiles').select('*').eq('id', userId).single();

  if (error) {
    logger.error('Error fetching profile:', error);
    return null;
  }

  return data;
}

/**
 * Update the current user's profile
 */
export async function updateProfile(updates: ProfileUpdate): Promise<Profile | null> {
  const supabase = createClient();

  const {
    data: {user}
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const {data, error} = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', user.id)
    .select()
    .single();

  if (error) {
    logger.error('Error updating profile:', error);
    throw error;
  }

  return data;
}

/**
 * Check if a profile exists for a user
 */
export async function profileExists(userId: string): Promise<boolean> {
  const supabase = createClient();

  const {count, error} = await supabase
    .from('profiles')
    .select('id', {count: 'exact', head: true})
    .eq('id', userId);

  if (error) {
    logger.error('Error checking profile existence:', error);
    return false;
  }

  return (count ?? 0) > 0;
}

/**
 * Update avatar
 */
export async function updateProfileAvatar(file: File): Promise<Profile | null> {
  const supabase = createClient();

  const {
    data: {user}
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // Get current profile to delete old avatar
  const currentProfile = await getProfile();
  if (currentProfile?.avatar_url) {
    try {
      await deleteAvatar(currentProfile.avatar_url);
    } catch (error) {
      logger.warn('Failed to delete old avatar:', error);
    }
  }

  // Upload new avatar
  const avatarUrl = await uploadAvatar(file);

  // Update profile with new avatar URL
  return updateProfile({avatar_url: avatarUrl});
}

/**
 * Remove avatar
 */
export async function removeProfileAvatar(): Promise<Profile | null> {
  const supabase = createClient();

  const {
    data: {user}
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // Get current profile to delete avatar
  const currentProfile = await getProfile();
  if (currentProfile?.avatar_url) {
    try {
      await deleteAvatar(currentProfile.avatar_url);
    } catch (error) {
      logger.warn('Failed to delete avatar:', error);
    }
  }

  // Update profile to remove avatar URL
  return updateProfile({avatar_url: null});
}
