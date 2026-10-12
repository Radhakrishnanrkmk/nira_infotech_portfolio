import { supabase, isSupabaseConfigured, readLocalDb, saveLocalDb } from '../db.ts';
import { Project } from '../../types/index.ts';
import { initialProjects } from '../../data/initialData.ts';

const isUuid = (id?: string): boolean =>
  Boolean(id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id));

const QUERY_TIMEOUT_MS = 3500;

async function runWithTimeout<T>(promise: PromiseLike<T>, fallback: T): Promise<T> {
  let timer: NodeJS.Timeout;
  const timeoutPromise = new Promise<T>((resolve) => {
    timer = setTimeout(() => resolve(fallback), QUERY_TIMEOUT_MS);
  });
  return Promise.race([
    Promise.resolve(promise).finally(() => clearTimeout(timer)),
    timeoutPromise
  ]);
}

export async function getAllProjects(): Promise<Project[]> {
  const db = readLocalDb();

  if (isSupabaseConfigured && supabase) {
    try {
      const res = await runWithTimeout(
        supabase
          .from('projects')
          .select('*')
          .order('display_order', { ascending: true }),
        { data: null, error: { message: 'timeout' } } as any
      );

      const { data, error } = res;

      if (!error && Array.isArray(data)) {
        if (data.length > 0) {
          return data as Project[];
        }

        // Auto-seed if Supabase table is empty
        const seedProjects = db.projects && db.projects.length > 0 ? db.projects : initialProjects;
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
      }
    } catch {
      // Graceful local fallback
    }
  }

  return (db.projects && db.projects.length > 0 ? db.projects : initialProjects)
    .sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
}

export async function getProjectById(id: string): Promise<Project | null> {
  if (isSupabaseConfigured && supabase && isUuid(id)) {
    try {
      const res = await runWithTimeout(
        supabase
          .from('projects')
          .select('*')
          .eq('id', id)
          .single(),
        { data: null, error: { message: 'timeout' } } as any
      );
      if (!res.error && res.data) return res.data as Project;
    } catch {
      // Graceful fallback
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

  if (isUuid(projectData.id)) {
    payload.id = projectData.id;
  }

  if (isSupabaseConfigured && supabase) {
    try {
      const res = await runWithTimeout(
        supabase
          .from('projects')
          .insert([payload])
          .select()
          .single(),
        { data: null, error: { message: 'timeout' } } as any
      );

      if (!res.error && res.data) {
        const created = res.data as Project;
        const db = readLocalDb();
        db.projects = db.projects || [];
        db.projects.push(created);
        saveLocalDb(db);
        return created;
      }
    } catch {
      // Graceful fallback to local
    }
  }

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

  if (isSupabaseConfigured && supabase && isUuid(id)) {
    try {
      const res = await runWithTimeout(
        supabase
          .from('projects')
          .update(sanitizedUpdates)
          .eq('id', id)
          .select()
          .single(),
        { data: null, error: { message: 'timeout' } } as any
      );

      if (!res.error && res.data) {
        const updated = res.data as Project;
        const db = readLocalDb();
        const index = db.projects.findIndex(p => p.id === id);
        if (index !== -1) {
          db.projects[index] = updated;
          saveLocalDb(db);
        }
        return updated;
      }
    } catch {
      // Graceful fallback
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
  const db = readLocalDb();
  const existingProject = db.projects.find(p => p.id === id);

  if (isSupabaseConfigured && supabase) {
    try {
      if (isUuid(id)) {
        const res = await runWithTimeout(
          supabase
            .from('projects')
            .delete()
            .eq('id', id),
          { error: { message: 'timeout' } } as any
        );
        if (!res.error) {
          deletedFromSupabase = true;
        }
      } else if (existingProject?.title) {
        const res = await runWithTimeout(
          supabase
            .from('projects')
            .delete()
            .eq('title', existingProject.title),
          { error: { message: 'timeout' } } as any
        );
        if (!res.error) {
          deletedFromSupabase = true;
        }
      }
    } catch {
      // Local fallback
    }
  }

  const initialLength = db.projects.length;
  db.projects = db.projects.filter(p => p.id !== id);
  saveLocalDb(db);

  return deletedFromSupabase || db.projects.length < initialLength;
}
