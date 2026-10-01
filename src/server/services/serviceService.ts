import { supabase, isSupabaseConfigured, readLocalDb, saveLocalDb } from '../db.ts';
import { Service } from '../../types/index.ts';
import { initialServices } from '../../data/initialData.ts';

const isUuid = (id?: string): boolean =>
  Boolean(id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id));

export async function getAllServices(): Promise<Service[]> {
  const db = readLocalDb();

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('display_order', { ascending: true });

      if (!error && Array.isArray(data)) {
        if (data.length > 0) {
          return data as Service[];
        }

        // If Supabase table is empty, auto-seed with initial services
        const seedServices = db.services && db.services.length > 0 ? db.services : initialServices;
        console.log(`[Supabase] Services table empty. Auto-seeding ${seedServices.length} initial services...`);

        const rowsToInsert = seedServices.map(({ id, ...rest }) => ({
          ...rest,
          ...(isUuid(id) ? { id } : {})
        }));

        const { data: seeded, error: seedErr } = await supabase
          .from('services')
          .insert(rowsToInsert)
          .select();

        if (!seedErr && seeded && seeded.length > 0) {
          return seeded as Service[];
        }
      } else if (error) {
        console.warn('Supabase services query warning, using local db:', error.message);
      }
    } catch (e) {
      console.error('Supabase services query failed, falling back:', e);
    }
  }

  return (db.services && db.services.length > 0 ? db.services : initialServices)
    .sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
}

export async function createService(serviceData: Partial<Service>): Promise<Service> {
  const payload: any = {
    title: serviceData.title || 'New Service',
    description: serviceData.description || '',
    icon: serviceData.icon || 'Code',
    image_url: serviceData.image_url || '',
    active: serviceData.active !== undefined ? Boolean(serviceData.active) : true,
    display_order: Number(serviceData.display_order) || 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  if (isUuid(serviceData.id)) {
    payload.id = serviceData.id;
  }

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('services')
        .insert([payload])
        .select()
        .single();

      if (!error && data) {
        const created = data as Service;
        const db = readLocalDb();
        db.services = db.services || [];
        db.services.push(created);
        saveLocalDb(db);
        return created;
      }
      console.error('Supabase service insert failed:', error?.message);
    } catch (e) {
      console.error('Supabase service insert exception:', e);
    }
  }

  const localService: Service = {
    ...payload,
    id: serviceData.id || `serv-${Date.now()}`
  };
  const db = readLocalDb();
  db.services = db.services || [];
  db.services.push(localService);
  saveLocalDb(db);
  return localService;
}

export async function updateService(id: string, updates: Partial<Service>): Promise<Service | null> {
  const updatedAt = new Date().toISOString();
  const sanitizedUpdates = { ...updates, updated_at: updatedAt };
  delete (sanitizedUpdates as any).id;

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('services')
        .update(sanitizedUpdates)
        .eq('id', id)
        .select()
        .single();

      if (!error && data) {
        const updated = data as Service;
        const db = readLocalDb();
        const index = db.services.findIndex(s => s.id === id);
        if (index !== -1) {
          db.services[index] = updated;
          saveLocalDb(db);
        }
        return updated;
      }
      console.error('Supabase service update failed:', error?.message);
    } catch (e) {
      console.error('Supabase service update failed:', e);
    }
  }

  const db = readLocalDb();
  const index = db.services.findIndex(s => s.id === id);
  if (index === -1) return null;

  db.services[index] = {
    ...db.services[index],
    ...sanitizedUpdates
  };
  saveLocalDb(db);
  return db.services[index];
}

export async function deleteService(id: string): Promise<boolean> {
  let deletedFromSupabase = false;

  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id);

      if (!error) {
        deletedFromSupabase = true;
      } else {
        console.error('Supabase service delete failed:', error.message);
      }
    } catch (e) {
      console.error('Supabase delete failed:', e);
    }
  }

  const db = readLocalDb();
  const initialLength = db.services.length;
  db.services = db.services.filter(s => s.id !== id);
  saveLocalDb(db);

  return deletedFromSupabase || db.services.length < initialLength;
}
