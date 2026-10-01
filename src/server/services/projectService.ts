import { supabase, isSupabaseConfigured, readLocalDb, saveLocalDb } from '../db.ts';
import { Project } from '../../types/index.ts';
import { initialProjects } from '../../data/initialData.ts';

const isUuid = (id?: string): boolean =>
  Boolean(id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id));

export async function getAllProjects(): Promise<Project[]> {
  const db = readLocalDb();

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('display_order', { ascending: true });

      if (!error && Array.isArray(data)) {
        if (data.length > 0) {
          return data as Project[];
        }

        // If Supabase table is empty, auto-seed from local data so user always sees projects
        const seedProjects = db.projects && db.projects.length > 0 ? db.projects : initialProjects;
        console.log(`[Supabase] Projects table empty. Auto-seeding ${seedProjects.length} initial projects...`);

        const rowsToInsert = seedProjects.map(({ id, ...rest }) => ({
          ...rest,
          ...(isUuid(id) ? { id } : {})
        }));

        const { data: seeded, error: seedErr } = await supabase
          .from('projects')
          .insert(rowsToInsert)
          .select();

        if (!seedErr && seeded && seeded.length > 0) {
          return seeded as Project[];
        }
      } else if (error) {
        console.warn('Supabase projects query warning, falling back to local:', error.message);
      }
    } catch (e) {
      console.error('Supabase query failed, falling back:', e);
    }
  }

  return (db.projects && db.projects.length > 0 ? db.projects : initialProjects)
    .sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
}

export async function getProjectById(id: string): Promise<Project | null> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();
      if (!error && data) return data as Project;
    } catch (e) {
      console.error('Supabase fetch failed:', e);
    }
  }

  const db = readLocalDb();
  return db.projects.find(p => p.id === id) || null;
}

export async function createProject(projectData: Partial<Project>): Promise<Project> {
  const payload: any = {
    title: projectData.title || 'Untitled Project',
    description: projectData.description || '',
    poster_url: projectData.poster_url || '',
    category: projectData.category || 'Web Application',
    technologies: Array.isArray(projectData.technologies) ? projectData.technologies : [],
    live_url: projectData.live_url || '',
    demo_url: projectData.demo_url || '',
    github_url: projectData.github_url || '',
    details: projectData.details || '',
    features: Array.isArray(projectData.features) ? projectData.features : [],
    featured: Boolean(projectData.featured),
    status: projectData.status || 'Completed',
    display_order: Number(projectData.display_order) || 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  // Only pass id if it is a valid UUID, otherwise allow database to generate UUID
  if (isUuid(projectData.id)) {
    payload.id = projectData.id;
  }

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert([payload])
        .select()
        .single();

      if (!error && data) {
        const created = data as Project;
        const db = readLocalDb();
        db.projects = db.projects || [];
        db.projects.push(created);
        saveLocalDb(db);
        return created;
      }
      console.error('Supabase project insert failed:', error?.message);
    } catch (e) {
      console.error('Supabase project insert exception:', e);
    }
  }

  // Fallback to local DB with generated ID
  const localProject: Project = {
    ...payload,
    id: projectData.id || `proj-${Date.now()}`
  };
  const db = readLocalDb();
  db.projects = db.projects || [];
  db.projects.push(localProject);
  saveLocalDb(db);
  return localProject;
}

export async function updateProject(id: string, updates: Partial<Project>): Promise<Project | null> {
  const updatedAt = new Date().toISOString();
  const sanitizedUpdates = { ...updates, updated_at: updatedAt };
  delete (sanitizedUpdates as any).id;

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .update(sanitizedUpdates)
        .eq('id', id)
        .select()
        .single();

      if (!error && data) {
        const updated = data as Project;
        const db = readLocalDb();
        const index = db.projects.findIndex(p => p.id === id);
        if (index !== -1) {
          db.projects[index] = updated;
          saveLocalDb(db);
        }
        return updated;
      }
      console.error('Supabase project update failed:', error?.message);
    } catch (e) {
      console.error('Supabase update failed:', e);
    }
  }

  const db = readLocalDb();
  const index = db.projects.findIndex(p => p.id === id);
  if (index === -1) return null;

  db.projects[index] = {
    ...db.projects[index],
    ...sanitizedUpdates
  };
  saveLocalDb(db);
  return db.projects[index];
}

export async function deleteProject(id: string): Promise<boolean> {
  let deletedFromSupabase = false;

  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (!error) {
        deletedFromSupabase = true;
      } else {
        console.error('Supabase project delete failed:', error.message);
      }
    } catch (e) {
      console.error('Supabase delete failed:', e);
    }
  }

  const db = readLocalDb();
  const initialLength = db.projects.length;
  db.projects = db.projects.filter(p => p.id !== id);
  saveLocalDb(db);

  return deletedFromSupabase || db.projects.length < initialLength;
}
