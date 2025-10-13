import {createClient} from './client';

// Types will be generated after running: npm run types:generate
// For now, we use generic types
type Profile = {
  id: string;
  email: string | null;
  full_name: string | null;
  company_name: string | null;
  phone: string | null;
  locale: string | null;
  avatar_url: string | null;
  preferences: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
};

type ProfileUpdate = Partial<Omit<Profile, 'id' | 'created_at'>>;

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

  const {data, error} = await // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (supabase as any)
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching profile:', error);
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

  const {data, error} = await // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (supabase as any)
    .from('profiles')
    .update(updates)
    .eq('id', user.id)
    .select()
    .single();

  if (error) {
    console.error('Error updating profile:', error);
    throw error;
  }

  return data;
}

/**
 * Check if a profile exists for a user
 */
export async function profileExists(userId: string): Promise<boolean> {
  const supabase = createClient();

  const {count, error} = await // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (supabase as any)
    .from('profiles')
    .select('id', {count: 'exact', head: true})
    .eq('id', userId);

  if (error) {
    console.error('Error checking profile existence:', error);
    return false;
  }

  return (count ?? 0) > 0;
}
