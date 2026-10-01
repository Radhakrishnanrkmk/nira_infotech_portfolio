import { Project, Service, Skill, SiteSettings, Inquiry } from '../types/index.ts';

const TOKEN_KEY = 'nira_admin_token';

export const getAuthToken = (): string | null => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
};

export const setAuthToken = (token: string) => {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {}
};

export const clearAuthToken = () => {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {}
};

export const isAuthenticated = (): boolean => {
  return Boolean(getAuthToken());
};

async function fetchJson<T>(url: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, { ...options, headers });
  const data = await response.json();

  if (!response.ok || data.success === false) {
    throw new Error(data.error || data.message || `Request failed with status ${response.status}`);
  }

  return data.data !== undefined ? data.data : data;
}

// ----------------- AUTH -----------------
export async function adminLogin(email: string, pass: string): Promise<{ token: string; user: any }> {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password: pass })
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Authentication failed');
  }
  setAuthToken(data.token);
  return data;
}

export async function checkAdminAuth(): Promise<boolean> {
  const token = getAuthToken();
  if (!token) return false;
  try {
    const res = await fetch('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.ok;
  } catch {
    return false;
  }
}

// ----------------- STATS -----------------
export async function getDashboardStats() {
  return fetchJson<{
    totalProjects: number;
    completedProjects: number;
    totalServices: number;
    totalSkills: number;
    totalInquiries: number;
    newInquiries: number;
    inProgressInquiries: number;
    isSupabaseConnected: boolean;
  }>('/api/stats');
}

// ----------------- PROJECTS -----------------
export async function fetchProjects(): Promise<Project[]> {
  return fetchJson<Project[]>('/api/projects');
}

export async function fetchProject(id: string): Promise<Project> {
  return fetchJson<Project>(`/api/projects/${id}`);
}

export async function saveProject(project: Partial<Project>): Promise<Project> {
  if (project.id && !project.id.startsWith('proj-new')) {
    return fetchJson<Project>(`/api/projects/${project.id}`, {
      method: 'PUT',
      body: JSON.stringify(project)
    });
  } else {
    return fetchJson<Project>('/api/projects', {
      method: 'POST',
      body: JSON.stringify(project)
    });
  }
}

export async function deleteProjectApi(id: string): Promise<void> {
  await fetchJson(`/api/projects/${id}`, { method: 'DELETE' });
}

// ----------------- SERVICES -----------------
export async function fetchServices(): Promise<Service[]> {
  return fetchJson<Service[]>('/api/services');
}

export async function saveService(service: Partial<Service>): Promise<Service> {
  if (service.id && !service.id.startsWith('serv-new')) {
    return fetchJson<Service>(`/api/services/${service.id}`, {
      method: 'PUT',
      body: JSON.stringify(service)
    });
  } else {
    return fetchJson<Service>('/api/services', {
      method: 'POST',
      body: JSON.stringify(service)
    });
  }
}

export async function deleteServiceApi(id: string): Promise<void> {
  await fetchJson(`/api/services/${id}`, { method: 'DELETE' });
}

// ----------------- SKILLS -----------------
export async function fetchSkills(): Promise<Skill[]> {
  return fetchJson<Skill[]>('/api/skills');
}

export async function saveSkill(skill: Partial<Skill>): Promise<Skill> {
  if (skill.id && !skill.id.startsWith('sk-new')) {
    return fetchJson<Skill>(`/api/skills/${skill.id}`, {
      method: 'PUT',
      body: JSON.stringify(skill)
    });
  } else {
    return fetchJson<Skill>('/api/skills', {
      method: 'POST',
      body: JSON.stringify(skill)
    });
  }
}

export async function deleteSkillApi(id: string): Promise<void> {
  await fetchJson(`/api/skills/${id}`, { method: 'DELETE' });
}

// ----------------- INQUIRIES -----------------
export async function fetchInquiries(): Promise<Inquiry[]> {
  return fetchJson<Inquiry[]>('/api/inquiries');
}

export async function submitInquiry(data: Partial<Inquiry>): Promise<Inquiry> {
  const res = await fetch('/api/inquiries', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error || 'Failed to submit inquiry');
  }
  return json.data;
}

export async function updateInquiryStatusApi(id: string, status: Inquiry['status']): Promise<Inquiry> {
  return fetchJson<Inquiry>(`/api/inquiries/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ status })
  });
}

export async function deleteInquiryApi(id: string): Promise<void> {
  await fetchJson(`/api/inquiries/${id}`, { method: 'DELETE' });
}

// ----------------- SETTINGS -----------------
export async function fetchSiteSettings(): Promise<SiteSettings> {
  return fetchJson<SiteSettings>('/api/settings');
}

export async function updateSiteSettings(settings: Partial<SiteSettings>): Promise<SiteSettings> {
  return fetchJson<SiteSettings>('/api/settings', {
    method: 'PUT',
    body: JSON.stringify(settings)
  });
}

// ----------------- UPLOAD -----------------
export async function uploadImageApi(base64Data: string, filename: string, bucket = 'project-posters'): Promise<string> {
  const res = await fetchJson<{ url: string }>('/api/upload', {
    method: 'POST',
    body: JSON.stringify({ base64Data, filename, bucket })
  });
  return res.url;
}

// ----------------- SCHEMA -----------------
export async function fetchSupabaseSchema(): Promise<string> {
  const res = await fetch('/api/schema');
  const json = await res.json();
  return json.sql || '';
}

// ----------------- SUPABASE DYNAMIC CONNECTION -----------------
export interface SupabaseStatusResponse {
  isConnected: boolean;
  url: string;
  source: 'env' | 'dashboard' | 'none';
  connectedAt?: string;
}

export async function fetchSupabaseStatus(): Promise<SupabaseStatusResponse> {
  const res = await fetchJson<SupabaseStatusResponse>('/api/admin/supabase/status');
  return res;
}

export async function testSupabaseApi(url: string, key: string): Promise<{
  success: boolean;
  message: string;
  tablesFound?: string[];
  missingTables?: string[];
}> {
  const res = await fetch('/api/admin/supabase/test', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getAuthToken()}`
    },
    body: JSON.stringify({ url, key })
  });
  return res.json();
}

export async function connectSupabaseApi(url: string, anonKey: string, serviceRoleKey?: string): Promise<{
  success: boolean;
  message: string;
}> {
  const res = await fetch('/api/admin/supabase/connect', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getAuthToken()}`
    },
    body: JSON.stringify({ url, anonKey, serviceRoleKey })
  });
  return res.json();
}

export async function disconnectSupabaseApi(): Promise<{ success: boolean; message: string }> {
  const res = await fetch('/api/admin/supabase/disconnect', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getAuthToken()}`
    }
  });
  return res.json();
}

export async function syncDataToSupabaseApi(): Promise<{
  success: boolean;
  message: string;
  syncedCounts?: { projects: number; services: number; skills: number; settings: boolean };
}> {
  const res = await fetch('/api/admin/supabase/sync', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getAuthToken()}`
    }
  });
  return res.json();
}

