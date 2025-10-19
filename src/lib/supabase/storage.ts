import {createClient} from './client';
import {logger} from '@/lib/logger';

/**
 * Upload a file to Supabase Storage
 */
export async function uploadFile(
  bucket: string,
  path: string,
  file: File
): Promise<{url: string; path: string} | null> {
  const supabase = createClient();

  const {data, error} = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: '3600',
    upsert: true
  });

  if (error) {
    logger.error('Error uploading file:', error);
    throw error;
  }

  const {
    data: {publicUrl}
  } = supabase.storage.from(bucket).getPublicUrl(data.path);

  return {
    url: publicUrl,
    path: data.path
  };
}

/**
 * Delete a file from Supabase Storage
 */
export async function deleteFile(bucket: string, path: string): Promise<void> {
  const supabase = createClient();

  const {error} = await supabase.storage.from(bucket).remove([path]);

  if (error) {
    logger.error('Error deleting file:', error);
    throw error;
  }
}

/**
 * Upload avatar for current user
 */
export async function uploadAvatar(file: File): Promise<string> {
  const supabase = createClient();

  const {
    data: {user}
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // Generate unique filename
  const fileExt = file.name.split('.').pop();
  const fileName = `${user.id}-${Date.now()}.${fileExt}`;
  const filePath = `avatars/${fileName}`;

  const result = await uploadFile('avatars', filePath, file);
  if (!result) throw new Error('Upload failed');

  return result.url;
}

/**
 * Delete avatar for current user
 */
export async function deleteAvatar(avatarUrl: string): Promise<void> {
  if (!avatarUrl) return;

  // Extract path from URL
  const url = new URL(avatarUrl);
  const pathMatch = url.pathname.match(/\/storage\/v1\/object\/public\/avatars\/(.+)/);

  if (!pathMatch) {
    logger.warn('Could not extract path from avatar URL:', avatarUrl);
    return;
  }

  const path = pathMatch[1];
  await deleteFile('avatars', path);
}
