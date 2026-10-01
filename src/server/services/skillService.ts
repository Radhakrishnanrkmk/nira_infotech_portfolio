import { supabase, isSupabaseConfigured, readLocalDb, saveLocalDb } from '../db.ts';
import { Skill } from '../../types/index.ts';
import { initialSkills } from '../../data/initialData.ts';

const isUuid = (id?: string): boolean =>
  Boolean(id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id));

export async function getAllSkills(): Promise<Skill[]> {
  const db = readLocalDb();

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .order('display_order', { ascending: true });

      if (!error && Array.isArray(data)) {
        if (data.length > 0) {
          return data as Skill[];
        }

        // If Supabase table is empty, auto-seed with initial skills
        const seedSkills = db.skills && db.skills.length > 0 ? db.skills : initialSkills;
        console.log(`[Supabase] Skills table empty. Auto-seeding ${seedSkills.length} initial skills...`);

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
      } else if (error) {
        console.warn('Supabase skills query warning, using local db:', error.message);
      }
    } catch (e) {
      console.error('Supabase skills query failed, falling back:', e);
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
      const { data, error } = await supabase
        .from('skills')
        .insert([payload])
        .select()
        .single();

      if (!error && data) {
        const created = data as Skill;
        const db = readLocalDb();
        db.skills = db.skills || [];
        db.skills.push(created);
        saveLocalDb(db);
        return created;
      }
      console.error('Supabase skill insert failed:', error?.message);
    } catch (e) {
      console.error('Supabase skill insert exception:', e);
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

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('skills')
        .update(sanitizedUpdates)
        .eq('id', id)
        .select()
        .single();

      if (!error && data) {
        const updated = data as Skill;
        const db = readLocalDb();
        const index = db.skills.findIndex(s => s.id === id);
        if (index !== -1) {
          db.skills[index] = updated;
          saveLocalDb(db);
        }
        return updated;
      }
      console.error('Supabase skill update failed:', error?.message);
    } catch (e) {
      console.error('Supabase update failed:', e);
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

  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase
        .from('skills')
        .delete()
        .eq('id', id);

      if (!error) {
        deletedFromSupabase = true;
      } else {
        console.error('Supabase skill delete failed:', error.message);
      }
    } catch (e) {
      console.error('Supabase delete failed:', e);
    }
  }

  const db = readLocalDb();
  const initialLength = db.skills.length;
  db.skills = db.skills.filter(s => s.id !== id);
  saveLocalDb(db);

  return deletedFromSupabase || db.skills.length < initialLength;
}
