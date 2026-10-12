import { supabase, isSupabaseConfigured, readLocalDb, saveLocalDb } from '../db.ts';
import { Service } from '../../types/index.ts';
import { initialServices } from '../../data/initialData.ts';

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

export async function getAllServices(): Promise<Service[]> {
  const db = readLocalDb();

  if (isSupabaseConfigured && supabase) {
    try {
      const res = await runWithTimeout(
        supabase
          .from('services')
          .select('*')
          .order('display_order', { ascending: true }),
        { data: null, error: { message: 'timeout' } } as any
      );

      const { data, error } = res;

      if (!error && Array.isArray(data)) {
        if (data.length > 0) {
          return data as Service[];
        }

        // Auto-seed initial services if Supabase table is empty
        const seedServices = db.services && db.services.length > 0 ? db.services : initialServices;
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
      }
    } catch {
      // Graceful local fallback
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
      const res = await runWithTimeout(
        supabase
          .from('services')
          .insert([payload])
          .select()
          .single(),
        { data: null, error: { message: 'timeout' } } as any
      );

      if (!res.error && res.data) {
        const created = res.data as Service;
        const db = readLocalDb();
        db.services = db.services || [];
        db.services.push(created);
        saveLocalDb(db);
        return created;
      }
    } catch {
      // Graceful fallback
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

  if (isSupabaseConfigured && supabase && isUuid(id)) {
    try {
      const res = await runWithTimeout(
        supabase
          .from('services')
          .update(sanitizedUpdates)
          .eq('id', id)
          .select()
          .single(),
        { data: null, error: { message: 'timeout' } } as any
      );

      if (!res.error && res.data) {
        const updated = res.data as Service;
        const db = readLocalDb();
        const index = db.services.findIndex(s => s.id === id);
        if (index !== -1) {
          db.services[index] = updated;
          saveLocalDb(db);
        }
        return updated;
      }
    } catch {
      // Graceful fallback
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
  const db = readLocalDb();
  const existingService = db.services.find(s => s.id === id);

  if (isSupabaseConfigured && supabase) {
    try {
      if (isUuid(id)) {
        const res = await runWithTimeout(
          supabase
            .from('services')
            .delete()
            .eq('id', id),
          { error: { message: 'timeout' } } as any
        );
        if (!res.error) {
          deletedFromSupabase = true;
        }
      } else if (existingService?.title) {
        const res = await runWithTimeout(
          supabase
            .from('services')
            .delete()
            .eq('title', existingService.title),
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

  const initialLength = db.services.length;
  db.services = db.services.filter(s => s.id !== id);
  saveLocalDb(db);

  return deletedFromSupabase || db.services.length < initialLength;
}
