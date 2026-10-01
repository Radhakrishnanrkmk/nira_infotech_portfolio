import { Router, Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import * as projectService from './services/projectService.ts';
import * as serviceService from './services/serviceService.ts';
import * as skillService from './services/skillService.ts';
import * as inquiryService from './services/inquiryService.ts';
import * as settingService from './services/settingService.ts';
import {
  isSupabaseConfigured,
  supabase,
  getSupabaseStatus,
  testSupabaseCredentials,
  connectSupabase,
  disconnectSupabase,
  syncLocalDataToSupabase
} from './db.ts';

export const apiRouter = Router();

// Middleware: Admin auth check
export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Unauthorized: Admin authentication token required' });
  }

  const token = authHeader.split(' ')[1];
  // Simple token verification (nira-admin-session or custom token)
  if (token.startsWith('nira-admin-') || token === 'admin-authenticated-session') {
    return next();
  }

  return res.status(403).json({ success: false, error: 'Forbidden: Invalid or expired admin token' });
};

// ----------------- AUTH ENDPOINTS -----------------
apiRouter.post('/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  // Standard demo credentials and flexible admin login
  const validEmail = email === 'admin@nirainfotech.com' || email === 'admin' || email === 'smitsmit0012@gmail.com';
  const validPass = password === 'admin123456' || password === 'admin' || password === 'nira2026';

  if (validEmail && validPass) {
    const token = `nira-admin-${Date.now()}`;
    return res.json({
      success: true,
      token,
      user: {
        id: 'admin-1',
        email: email.includes('@') ? email : 'admin@nirainfotech.com',
        role: 'admin',
        name: 'NIRA Admin'
      }
    });
  }

  return res.status(401).json({
    success: false,
    error: 'Invalid email or password. Default is admin@nirainfotech.com / admin123456'
  });
});

apiRouter.get('/auth/me', requireAdmin, (req: Request, res: Response) => {
  res.json({
    success: true,
    user: {
      id: 'admin-1',
      email: 'admin@nirainfotech.com',
      role: 'admin',
      name: 'NIRA Admin'
    }
  });
});

// ----------------- STATS ENDPOINT -----------------
apiRouter.get('/stats', async (_req: Request, res: Response) => {
  try {
    const [projects, services, skills, inquiries] = await Promise.all([
      projectService.getAllProjects(),
      serviceService.getAllServices(),
      skillService.getAllSkills(),
      inquiryService.getAllInquiries()
    ]);

    const newInquiries = inquiries.filter(i => i.status === 'New').length;
    const completedProjects = projects.filter(p => p.status === 'Completed').length;

    res.json({
      success: true,
      data: {
        totalProjects: projects.length,
        completedProjects,
        totalServices: services.length,
        totalSkills: skills.length,
        totalInquiries: inquiries.length,
        newInquiries,
        inProgressInquiries: inquiries.filter(i => i.status === 'In Progress').length,
        isSupabaseConnected: isSupabaseConfigured
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ----------------- PROJECTS ENDPOINTS -----------------
apiRouter.get('/projects', async (_req: Request, res: Response) => {
  try {
    const projects = await projectService.getAllProjects();
    res.json({ success: true, data: projects });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.get('/projects/:id', async (req: Request, res: Response) => {
  try {
    const project = await projectService.getProjectById(req.params.id);
    if (!project) return res.status(404).json({ success: false, error: 'Project not found' });
    res.json({ success: true, data: project });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.post('/projects', requireAdmin, async (req: Request, res: Response) => {
  try {
    const project = await projectService.createProject(req.body);
    res.status(201).json({ success: true, data: project });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.put('/projects/:id', requireAdmin, async (req: Request, res: Response) => {
  try {
    const updated = await projectService.updateProject(req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, error: 'Project not found' });
    res.json({ success: true, data: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.delete('/projects/:id', requireAdmin, async (req: Request, res: Response) => {
  try {
    const deleted = await projectService.deleteProject(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, error: 'Project not found' });
    res.json({ success: true, message: 'Project deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ----------------- SERVICES ENDPOINTS -----------------
apiRouter.get('/services', async (_req: Request, res: Response) => {
  try {
    const services = await serviceService.getAllServices();
    res.json({ success: true, data: services });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.post('/services', requireAdmin, async (req: Request, res: Response) => {
  try {
    const service = await serviceService.createService(req.body);
    res.status(201).json({ success: true, data: service });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.put('/services/:id', requireAdmin, async (req: Request, res: Response) => {
  try {
    const updated = await serviceService.updateService(req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, error: 'Service not found' });
    res.json({ success: true, data: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.delete('/services/:id', requireAdmin, async (req: Request, res: Response) => {
  try {
    const deleted = await serviceService.deleteService(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, error: 'Service not found' });
    res.json({ success: true, message: 'Service deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ----------------- SKILLS ENDPOINTS -----------------
apiRouter.get('/skills', async (_req: Request, res: Response) => {
  try {
    const skills = await skillService.getAllSkills();
    res.json({ success: true, data: skills });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.post('/skills', requireAdmin, async (req: Request, res: Response) => {
  try {
    const skill = await skillService.createSkill(req.body);
    res.status(201).json({ success: true, data: skill });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.put('/skills/:id', requireAdmin, async (req: Request, res: Response) => {
  try {
    const updated = await skillService.updateSkill(req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, error: 'Skill not found' });
    res.json({ success: true, data: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.delete('/skills/:id', requireAdmin, async (req: Request, res: Response) => {
  try {
    const deleted = await skillService.deleteSkill(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, error: 'Skill not found' });
    res.json({ success: true, message: 'Skill deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ----------------- INQUIRIES ENDPOINTS -----------------
apiRouter.get('/inquiries', requireAdmin, async (_req: Request, res: Response) => {
  try {
    const inquiries = await inquiryService.getAllInquiries();
    res.json({ success: true, data: inquiries });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.post('/inquiries', async (req: Request, res: Response) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, error: 'Name, email, and message are required.' });
    }
    const inquiry = await inquiryService.createInquiry(req.body);
    res.status(201).json({
      success: true,
      message: 'Inquiry submitted successfully! We will get in touch soon.',
      data: inquiry
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.put('/inquiries/:id', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const updated = await inquiryService.updateInquiryStatus(req.params.id, status);
    if (!updated) return res.status(404).json({ success: false, error: 'Inquiry not found' });
    res.json({ success: true, data: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.delete('/inquiries/:id', requireAdmin, async (req: Request, res: Response) => {
  try {
    const deleted = await inquiryService.deleteInquiry(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, error: 'Inquiry not found' });
    res.json({ success: true, message: 'Inquiry deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ----------------- SETTINGS ENDPOINTS -----------------
apiRouter.get('/settings', async (_req: Request, res: Response) => {
  try {
    const settings = await settingService.getSettings();
    res.json({ success: true, data: settings });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.put('/settings', requireAdmin, async (req: Request, res: Response) => {
  try {
    const updated = await settingService.updateSettings(req.body);
    res.json({ success: true, data: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ----------------- IMAGE UPLOAD ENDPOINT -----------------
apiRouter.post('/upload', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { base64Data, filename, bucket = 'project-posters' } = req.body;
    if (!base64Data) {
      return res.status(400).json({ success: false, error: 'Image data is required' });
    }

    // If Supabase Storage is configured and accessible, upload to bucket
    if (isSupabaseConfigured && supabase) {
      try {
        const cleanBase64 = base64Data.replace(/^data:image\/\w+;base64,/, '');
        const buffer = Buffer.from(cleanBase64, 'base64');
        const cleanName = `${Date.now()}-${(filename || 'image.png').replace(/[^a-zA-Z0-9.-]/g, '_')}`;

        const { data: uploadData, error } = await supabase.storage
          .from(bucket)
          .upload(cleanName, buffer, {
            contentType: 'image/png',
            upsert: true
          });

        if (!error && uploadData) {
          const { data: publicUrlData } = supabase.storage
            .from(bucket)
            .getPublicUrl(cleanName);
          return res.json({ success: true, url: publicUrlData.publicUrl });
        }
      } catch (err) {
        console.warn('Supabase storage upload error, falling back to data URL:', err);
      }
    }

    // Fallback: return the data URL directly so it immediately renders and persists
    return res.json({ success: true, url: base64Data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ----------------- SUPABASE SCHEMA EXPORT -----------------
apiRouter.get('/schema', (_req: Request, res: Response) => {
  try {
    const schemaPath = path.resolve(process.cwd(), 'supabase-schema.sql');
    if (fs.existsSync(schemaPath)) {
      const sql = fs.readFileSync(schemaPath, 'utf-8');
      return res.json({ success: true, sql });
    }
    res.status(404).json({ success: false, error: 'Schema file not found' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ----------------- DYNAMIC SUPABASE CONNECTION ENDPOINTS -----------------
apiRouter.get('/admin/supabase/status', requireAdmin, (_req: Request, res: Response) => {
  try {
    const status = getSupabaseStatus();
    res.json({ success: true, data: status });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.post('/admin/supabase/test', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { url, key } = req.body;
    if (!url || !key) {
      return res.status(400).json({ success: false, message: 'Project URL and API Key are required to test connection.' });
    }
    const result = await testSupabaseCredentials(url.trim(), key.trim());
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

apiRouter.post('/admin/supabase/connect', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { url, anonKey, serviceRoleKey } = req.body;
    if (!url || (!anonKey && !serviceRoleKey)) {
      return res.status(400).json({ success: false, message: 'Project URL and at least one API Key (anon or service role) are required.' });
    }
    const result = await connectSupabase(url, anonKey, serviceRoleKey);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

apiRouter.post('/admin/supabase/disconnect', requireAdmin, (_req: Request, res: Response) => {
  try {
    const result = disconnectSupabase();
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

apiRouter.post('/admin/supabase/sync', requireAdmin, async (_req: Request, res: Response) => {
  try {
    const result = await syncLocalDataToSupabase();
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

