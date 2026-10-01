import { supabase, isSupabaseConfigured, readLocalDb, saveLocalDb } from '../db.ts';
import { Inquiry } from '../../types/index.ts';

export async function getAllInquiries(): Promise<Inquiry[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('inquiries')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) return data as Inquiry[];
    } catch (e) {
      console.error('Supabase inquiries query failed:', e);
    }
  }

  const db = readLocalDb();
  return (db.inquiries || []).sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

const isUuid = (id?: string): boolean =>
  Boolean(id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id));

export async function createInquiry(data: Partial<Inquiry>): Promise<Inquiry> {
  const payload: any = {
    name: data.name?.trim() || 'Anonymous Client',
    email: data.email?.trim() || '',
    phone: data.phone?.trim() || '',
    company: data.company?.trim() || '',
    service: data.service || 'Website Development',
    project_type: data.project_type || 'Custom Web Project',
    budget: data.budget || 'To be discussed',
    message: data.message?.trim() || '',
    status: 'New',
    created_at: new Date().toISOString()
  };

  if (isUuid(data.id)) {
    payload.id = data.id;
  }

  // 1. Save to Supabase if configured
  if (isSupabaseConfigured && supabase) {
    try {
      const { data: saved, error } = await supabase
        .from('inquiries')
        .insert([payload])
        .select()
        .single();
      if (!error && saved) {
        dispatchEmailNotification(saved as Inquiry);
        return saved as Inquiry;
      }
      console.error('Supabase inquiry insert failed:', error?.message);
    } catch (e) {
      console.error('Supabase inquiry insert exception:', e);
    }
  }

  // 2. Fallback to local DB
  const newInquiry: Inquiry = {
    ...payload,
    id: data.id || `inq-${Date.now()}`
  };
  const db = readLocalDb();
  db.inquiries = db.inquiries || [];
  db.inquiries.unshift(newInquiry);
  saveLocalDb(db);

  // 3. Trigger email notification dispatcher
  dispatchEmailNotification(newInquiry);

  return newInquiry;
}

export async function updateInquiryStatus(
  id: string,
  status: Inquiry['status']
): Promise<Inquiry | null> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('inquiries')
        .update({ status })
        .eq('id', id)
        .select()
        .single();
      if (!error && data) return data as Inquiry;
    } catch (e) {
      console.error('Supabase inquiry update failed:', e);
    }
  }

  const db = readLocalDb();
  const inquiry = db.inquiries.find(i => i.id === id);
  if (!inquiry) return null;

  inquiry.status = status;
  saveLocalDb(db);
  return inquiry;
}

export async function deleteInquiry(id: string): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase
        .from('inquiries')
        .delete()
        .eq('id', id);
      if (!error) return true;
    } catch (e) {
      console.error('Supabase inquiry delete failed:', e);
    }
  }

  const db = readLocalDb();
  const initialLength = db.inquiries.length;
  db.inquiries = db.inquiries.filter(i => i.id !== id);
  saveLocalDb(db);
  return db.inquiries.length < initialLength;
}

function dispatchEmailNotification(inquiry: Inquiry) {
  // Safe backend email notification logging / integration hook
  console.log(`[EMAIL NOTIFICATION] New client inquiry received from ${inquiry.name} <${inquiry.email}> for ${inquiry.service}. Budget: ${inquiry.budget}`);
}
