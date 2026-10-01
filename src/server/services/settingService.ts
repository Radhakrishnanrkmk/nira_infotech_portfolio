import { supabase, isSupabaseConfigured, readLocalDb, saveLocalDb } from '../db.ts';
import { SiteSettings } from '../../types/index.ts';
import { initialSiteSettings } from '../../data/initialData.ts';

export async function getSettings(): Promise<SiteSettings> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('id', 'default')
        .single();
      if (!error && data) return data as SiteSettings;
    } catch (e) {
      console.error('Supabase settings query failed:', e);
    }
  }

  const db = readLocalDb();
  return db.settings || initialSiteSettings;
}

export async function updateSettings(updates: Partial<SiteSettings>): Promise<SiteSettings> {
  const updatedAt = new Date().toISOString();

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .upsert({ ...updates, id: 'default', updated_at: updatedAt })
        .select()
        .single();
      if (!error && data) return data as SiteSettings;
    } catch (e) {
      console.error('Supabase settings update failed:', e);
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
