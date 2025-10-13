import {createClient} from './client';

// Types will be generated after running: npm run types:generate
// For now, we use generic types
type Project = {
  id: string;
  user_id: string;
  name: string;
  product_id: string;
  canvas: Record<string, unknown>;
  preview_url: string | null;
  is_public: boolean;
  tags: string[];
  created_at: string;
  updated_at: string;
};

type ProjectInsert = Omit<Project, 'created_at' | 'updated_at'> & {
  id?: string;
  user_id?: string;
};

type ProjectUpdate = Partial<Omit<Project, 'id' | 'user_id' | 'created_at'>>;

/**
 * Get all projects for the current user
 */
export async function getProjects(): Promise<Project[]> {
  const supabase = createClient();

  const {data, error} = await // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (supabase as any)
    .from('projects')
    .select('*')
    .order('updated_at', {ascending: false});

  if (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }

  return data || [];
}

/**
 * Get a single project by ID
 */
export async function getProject(id: string): Promise<Project | null> {
  const supabase = createClient();

  const {data, error} = await // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (supabase as any)
    .from('projects')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching project:', error);
    return null;
  }

  return data;
}

/**
 * Create a new project
 */
export async function createProject(project: Omit<ProjectInsert, 'user_id'>): Promise<Project> {
  const supabase = createClient();

  const {
    data: {user}
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const {data, error} = await // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (supabase as any)
    .from('projects')
    .insert({
      ...project,
      user_id: user.id
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating project:', error);
    throw error;
  }

  return data;
}

/**
 * Update an existing project
 */
export async function updateProject(id: string, updates: ProjectUpdate): Promise<Project> {
  const supabase = createClient();

  const {data, error} = await // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (supabase as any)
    .from('projects')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating project:', error);
    throw error;
  }

  return data;
}

/**
 * Delete a project
 */
export async function deleteProject(id: string): Promise<void> {
  const supabase = createClient();

  const {error} = await // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (supabase as any).from('projects').delete().eq('id', id);

  if (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
}

/**
 * Get projects by product ID
 */
export async function getProjectsByProduct(productId: string): Promise<Project[]> {
  const supabase = createClient();

  const {data, error} = await // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (supabase as any)
    .from('projects')
    .select('*')
    .eq('product_id', productId)
    .order('updated_at', {ascending: false});

  if (error) {
    console.error('Error fetching projects by product:', error);
    throw error;
  }

  return data || [];
}

/**
 * Get public projects (for inspiration/templates)
 */
export async function getPublicProjects(limit = 50): Promise<Project[]> {
  const supabase = createClient();

  const {data, error} = await // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (supabase as any)
    .from('projects')
    .select('*')
    .eq('is_public', true)
    .order('updated_at', {ascending: false})
    .limit(limit);

  if (error) {
    console.error('Error fetching public projects:', error);
    throw error;
  }

  return data || [];
}
