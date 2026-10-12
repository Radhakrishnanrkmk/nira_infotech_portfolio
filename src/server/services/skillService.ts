import { supabase, isSupabaseConfigured, readLocalDb, saveLocalDb } from '../db.ts';
import { Skill } from '../../types/index.ts';
import { initialSkills } from '../../data/initialData.ts';

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

export async function getAllSkills(): Promise<Skill[]> {
  const db = readLocalDb();

  if (isSupabaseConfigured && supabase) {
    try {
      const res = await runWithTimeout(
        supabase
          .from('skills')
          .select('*')
          .order('display_order', { ascending: true }),
        { data: null, error: { message: 'timeout' } } as any
      );

      const { data, error } = res;

      if (!error && Array.isArray(data)) {
        if (data.length > 0) {
          return data as Skill[];
        }

        // Auto-seed initial skills if Supabase table is empty
        const seedSkills = db.skills && db.skills.length > 0 ? db.skills : initialSkills;
        const rowsToInsert = seedSkills.map(({ id, ...rest }) => ({
          ...rest,
          ...(isUuid(id) ? { id } : {})
        }));

        const { data: seeded, error: seedErr } = await supabase
          .from('skills')
          .insert(rowsToInsert)
          .select();

        if (!seedErr && seeded && seeded.length > 0) {
          return seeded as Skill[];
        }
      }
    } catch {
      // Graceful fallback
    }
  }

  return (db.skills && db.skills.length > 0 ? db.skills : initialSkills)
    .sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
}

export async function createSkill(skillData: Partial<Skill>): Promise<Skill> {
  const payload: any = {
    name: skillData.name || 'New Skill',
    description: skillData.description || '',
    icon: skillData.icon || 'Code',
    category: skillData.category || 'Frontend',
    active: skillData.active !== undefined ? Boolean(skillData.active) : true,
    display_order: Number(skillData.display_order) || 0,
    created_at: new Date().toISOString()
  };

  if (isUuid(skillData.id)) {
    payload.id = skillData.id;
  }

  if (isSupabaseConfigured && supabase) {
    try {
      const res = await runWithTimeout(
        supabase
          .from('skills')
          .insert([payload])
          .select()
          .single(),
        { data: null, error: { message: 'timeout' } } as any
      );

      if (!res.error && res.data) {
        const created = res.data as Skill;
        const db = readLocalDb();
        db.skills = db.skills || [];
        db.skills.push(created);
        saveLocalDb(db);
        return created;
      }
    } catch {
      // Graceful fallback
    }
  }

  const localSkill: Skill = {
    ...payload,
    id: skillData.id || `sk-${Date.now()}`
  };
  const db = readLocalDb();
  db.skills = db.skills || [];
  db.skills.push(localSkill);
  saveLocalDb(db);
  return localSkill;
}

export async function updateSkill(id: string, updates: Partial<Skill>): Promise<Skill | null> {
  const sanitizedUpdates = { ...updates };
  delete (sanitizedUpdates as any).id;

  if (isSupabaseConfigured && supabase && isUuid(id)) {
    try {
      const res = await runWithTimeout(
        supabase
          .from('skills')
          .update(sanitizedUpdates)
          .eq('id', id)
          .select()
          .single(),
        { data: null, error: { message: 'timeout' } } as any
      );

      if (!res.error && res.data) {
        const updated = res.data as Skill;
        const db = readLocalDb();
        const index = db.skills.findIndex(s => s.id === id);
        if (index !== -1) {
          db.skills[index] = updated;
          saveLocalDb(db);
        }
        return updated;
      }
    } catch {
      // Graceful fallback
    }
  }

  const db = readLocalDb();
  const index = db.skills.findIndex(s => s.id === id);
  if (index === -1) return null;

  db.skills[index] = {
    ...db.skills[index],
    ...sanitizedUpdates
  };
  saveLocalDb(db);
  return db.skills[index];
}

export async function deleteSkill(id: string): Promise<boolean> {
  let deletedFromSupabase = false;
  const db = readLocalDb();
  const existingSkill = db.skills.find(s => s.id === id);

  if (isSupabaseConfigured && supabase) {
    try {
      if (isUuid(id)) {
        const res = await runWithTimeout(
          supabase
            .from('skills')
            .delete()
            .eq('id', id),
          { error: { message: 'timeout' } } as any
        );
        if (!res.error) {
          deletedFromSupabase = true;
        }
      } else if (existingSkill?.name) {
        const res = await runWithTimeout(
          supabase
            .from('skills')
            .delete()
            .eq('name', existingSkill.name),
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

  const initialLength = db.skills.length;
  db.skills = db.skills.filter(s => s.id !== id);
  saveLocalDb(db);

  return deletedFromSupabase || db.skills.length < initialLength;
}
