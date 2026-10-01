import fs from 'fs';
import path from 'path';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Project, Service, Skill, SiteSettings, Inquiry } from '../types/index.ts';
import {
  initialProjects,
  initialServices,
  initialSkills,
  initialSiteSettings,
  initialInquiries
} from '../data/initialData.ts';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');
const SUPABASE_CONFIG_FILE = path.join(DATA_DIR, 'supabase-config.json');

// Ensure data folder exists (safe for serverless read-only environments like Vercel)
try {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
} catch {
  // Read-only filesystem in serverless environments
}

interface LocalDatabase {
  projects: Project[];
  services: Service[];
  skills: Skill[];
  inquiries: Inquiry[];
  settings: SiteSettings;
  adminSecret: string;
}

export interface SupabaseConfigData {
  url: string;
  anonKey: string;
  serviceRoleKey?: string;
  connectedAt?: string;
  source?: 'env' | 'dashboard';
}

export let supabase: SupabaseClient | null = null;
export let isSupabaseConfigured = false;
let currentConfig: SupabaseConfigData | null = null;

// Initialize Supabase from storage or env
function initializeClient() {
  // 1. First check persisted dashboard config
  if (fs.existsSync(SUPABASE_CONFIG_FILE)) {
    try {
      const saved = JSON.parse(fs.readFileSync(SUPABASE_CONFIG_FILE, 'utf-8'));
      if (saved && saved.url && (saved.serviceRoleKey || saved.anonKey)) {
        const key = saved.serviceRoleKey || saved.anonKey;
        supabase = createClient(saved.url, key);
        isSupabaseConfigured = true;
        currentConfig = { ...saved, source: 'dashboard' };
        console.log(`[Database] Connected to Supabase via saved config: ${saved.url}`);
        return;
      }
    } catch (e) {
      console.error('[Database] Failed to read supabase-config.json:', e);
    }
  }

  // 2. Fall back to process.env
  const envUrl = process.env.SUPABASE_URL || '';
  const envKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';

  if (envUrl && envKey) {
    supabase = createClient(envUrl, envKey);
    isSupabaseConfigured = true;
    currentConfig = {
      url: envUrl,
      anonKey: process.env.SUPABASE_ANON_KEY || '',
      serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
      source: 'env'
    };
    console.log(`[Database] Connected to Supabase via environment variables: ${envUrl}`);
  } else {
    supabase = null;
    isSupabaseConfigured = false;
    currentConfig = null;
    console.log('[Database] Supabase not configured. Using local JSON database.');
  }
}

initializeClient();

/**
 * Test a Supabase connection with given credentials
 */
export async function testSupabaseCredentials(url: string, key: string): Promise<{
  success: boolean;
  message: string;
  tablesFound?: string[];
  missingTables?: string[];
}> {
  try {
    const testClient = createClient(url, key);
    const tables = ['site_settings', 'projects', 'services', 'skills', 'inquiries'];
    const tablesFound: string[] = [];
    const missingTables: string[] = [];

    for (const table of tables) {
      const { error } = await testClient.from(table).select('count', { count: 'exact', head: true });
      if (!error) {
        tablesFound.push(table);
      } else {
        missingTables.push(table);
      }
    }

    if (tablesFound.length > 0) {
      return {
        success: true,
        message: `Successfully connected! Found ${tablesFound.length} initialized tables.`,
        tablesFound,
        missingTables
      };
    } else {
      return {
        success: true,
        message: 'Connected to Supabase project! Note: Tables have not been created yet. Run the SQL schema script in your Supabase SQL editor.',
        tablesFound: [],
        missingTables: tables
      };
    }
  } catch (err: any) {
    return {
      success: false,
      message: `Connection failed: ${err.message || 'Invalid URL or API Key'}`
    };
  }
}

/**
 * Dynamically connect and persist Supabase credentials
 */
export async function connectSupabase(url: string, anonKey: string, serviceRoleKey?: string): Promise<{
  success: boolean;
  message: string;
}> {
  const activeKey = serviceRoleKey?.trim() || anonKey.trim();
  const cleanUrl = url.trim().replace(/\/+$/, '');

  const testResult = await testSupabaseCredentials(cleanUrl, activeKey);
  if (!testResult.success) {
    return { success: false, message: testResult.message };
  }

  // Update in-memory live clients
  supabase = createClient(cleanUrl, activeKey);
  isSupabaseConfigured = true;
  currentConfig = {
    url: cleanUrl,
    anonKey: anonKey.trim(),
    serviceRoleKey: serviceRoleKey?.trim() || '',
    connectedAt: new Date().toISOString(),
    source: 'dashboard'
  };

  // Persist to file
  try {
    fs.writeFileSync(SUPABASE_CONFIG_FILE, JSON.stringify(currentConfig, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to persist supabase config:', err);
  }

  return {
    success: true,
    message: testResult.message
  };
}

/**
 * Disconnect Supabase and revert to local database
 */
export function disconnectSupabase(): { success: boolean; message: string } {
  try {
    if (fs.existsSync(SUPABASE_CONFIG_FILE)) {
      fs.unlinkSync(SUPABASE_CONFIG_FILE);
    }
  } catch (e) {
    console.error('Error removing supabase config file:', e);
  }

  // Re-check env or revert to local
  const envUrl = process.env.SUPABASE_URL || '';
  const envKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';

  if (envUrl && envKey) {
    supabase = createClient(envUrl, envKey);
    isSupabaseConfigured = true;
    currentConfig = { url: envUrl, anonKey: '', serviceRoleKey: envKey, source: 'env' };
  } else {
    supabase = null;
    isSupabaseConfigured = false;
    currentConfig = null;
  }

  return {
    success: true,
    message: 'Disconnected from Supabase. Reverted to local database storage.'
  };
}

/**
 * Get current Supabase status info
 */
export function getSupabaseStatus(): {
  isConnected: boolean;
  url: string;
  source: 'env' | 'dashboard' | 'none';
  connectedAt?: string;
} {
  return {
    isConnected: isSupabaseConfigured,
    url: currentConfig?.url || '',
    source: currentConfig?.source || 'none',
    connectedAt: currentConfig?.connectedAt
  };
}

/**
 * Sync current local JSON data to connected Supabase database
 */
export async function syncLocalDataToSupabase(): Promise<{
  success: boolean;
  message: string;
  syncedCounts?: { projects: number; services: number; skills: number; settings: boolean };
}> {
  if (!isSupabaseConfigured || !supabase) {
    return { success: false, message: 'Cannot sync: Supabase is not connected.' };
  }

  const db = readLocalDb();
  const counts = { projects: 0, services: 0, skills: 0, settings: false };

  const isUuid = (str?: string) =>
    Boolean(str && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str));

  try {
    // 1. Sync Site Settings
    const { error: settingsError } = await supabase
      .from('site_settings')
      .upsert({ ...db.settings, id: 'default', updated_at: new Date().toISOString() });
    if (!settingsError) counts.settings = true;

    // 2. Sync Projects
    for (const proj of (db.projects && db.projects.length > 0 ? db.projects : initialProjects)) {
      const { id, ...rest } = proj;
      const payload = {
        ...rest,
        ...(isUuid(id) ? { id } : {}),
        updated_at: new Date().toISOString()
      };
      const { error } = await supabase.from('projects').insert([payload]);
      if (!error) counts.projects++;
      else console.error('Supabase project sync error:', error.message);
    }

    // 3. Sync Services
    for (const srv of (db.services && db.services.length > 0 ? db.services : initialServices)) {
      const { id, ...rest } = srv;
      const payload = {
        ...rest,
        ...(isUuid(id) ? { id } : {}),
        updated_at: new Date().toISOString()
      };
      const { error } = await supabase.from('services').insert([payload]);
      if (!error) counts.services++;
      else console.error('Supabase service sync error:', error.message);
    }

    // 4. Sync Skills
    for (const skl of (db.skills && db.skills.length > 0 ? db.skills : initialSkills)) {
      const { id, ...rest } = skl;
      const payload = {
        ...rest,
        ...(isUuid(id) ? { id } : {})
      };
      const { error } = await supabase.from('skills').insert([payload]);
      if (!error) counts.skills++;
      else console.error('Supabase skill sync error:', error.message);
    }

    return {
      success: true,
      message: `Sync complete! Synced ${counts.projects} projects, ${counts.services} services, ${counts.skills} skills, and website settings.`,
      syncedCounts: counts
    };
  } catch (err: any) {
    return {
      success: false,
      message: `Sync partially failed: ${err.message}`
    };
  }
}

// Read local DB with fallback to initial seed
export function readLocalDb(): LocalDatabase {
  try {
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      const data = JSON.parse(content);
      return {
        projects: data.projects || initialProjects,
        services: data.services || initialServices,
        skills: data.skills || initialSkills,
        inquiries: data.inquiries || initialInquiries,
        settings: data.settings || initialSiteSettings,
        adminSecret: data.adminSecret || 'admin123456'
      };
    }
  } catch (err) {
    console.error('Error reading local db.json:', err);
  }

  // Initial seed
  const initialDb: LocalDatabase = {
    projects: initialProjects,
    services: initialServices,
    skills: initialSkills,
    inquiries: initialInquiries,
    settings: initialSiteSettings,
    adminSecret: 'admin123456'
  };
  saveLocalDb(initialDb);
  return initialDb;
}

// Save local DB
export function saveLocalDb(db: LocalDatabase): void {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing local db.json:', err);
  }
}
