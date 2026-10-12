import { supabase, isSupabaseConfigured, readLocalDb, saveLocalDb } from '../db.ts';
import { SiteSettings } from '../../types/index.ts';
import { initialSiteSettings } from '../../data/initialData.ts';

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

export async function getSettings(): Promise<SiteSettings> {
  if (isSupabaseConfigured && supabase) {
    try {
      const res = await runWithTimeout(
        supabase
          .from('site_settings')
          .select('*')
          .eq('id', 'default')
          .single(),
        { data: null, error: { message: 'timeout' } } as any
      );
      if (!res.error && res.data) return res.data as SiteSettings;
    } catch {
      // Graceful fallback
    }
  }

  const db = readLocalDb();
  return db.settings || initialSiteSettings;
}

export async function updateSettings(updates: Partial<SiteSettings>): Promise<SiteSettings> {
  const updatedAt = new Date().toISOString();

  if (isSupabaseConfigured && supabase) {
    try {
      const res = await runWithTimeout(
        supabase
          .from('site_settings')
          .upsert({ ...updates, id: 'default', updated_at: updatedAt })
          .select()
          .single(),
        { data: null, error: { message: 'timeout' } } as any
      );
      if (!res.error && res.data) return res.data as SiteSettings;
    } catch {
      // Graceful fallback
    }
  }

  const db = readLocalDb();
  db.settings = {
    ...(db.settings || initialSiteSettings),
    ...updates,
    updated_at: updatedAt
  };
  saveLocalDb(db);
  return db.settings;
}
