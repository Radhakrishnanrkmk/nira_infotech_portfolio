export interface Project {
  id: string;
  title: string;
  description: string;
  poster_url: string;
  category: string;
  technologies: string[];
  live_url?: string;
  demo_url?: string;
  github_url?: string;
  details?: string;
  features?: string[];
  featured: boolean;
  status: 'Completed' | 'In Progress' | 'Planning';
  display_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  image_url?: string;
  active: boolean;
  display_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface Skill {
  id: string;
  name: string;
  description?: string;
  icon: string;
  category: 'Frontend' | 'Backend' | 'Database & Cloud' | 'Tools & DevOps';
  active: boolean;
  display_order: number;
  created_at?: string;
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service?: string;
  project_type?: string;
  budget?: string;
  message: string;
  status: 'New' | 'Contacted' | 'In Progress' | 'Completed' | 'Closed';
  created_at: string;
}

export interface SiteSettings {
  id: string;
  business_name: string;
  logo_url: string;
  email: string;
  phone: string;
  whatsapp: string;
  whatsapp_message?: string;
  location: string;
  hero_kicker?: string;
  hero_title: string;
  hero_description: string;
  about: string;
  mission: string;
  vision: string;
  founder_name: string;
  founder_role: string;
  founder_bio: string;
  founder_avatar: string;
  instagram: string;
  linkedin: string;
  github: string;
  facebook: string;
  twitter?: string;
  footer_text: string;
  updated_at?: string;
}

export interface AdminUser {
  id: string;
  email: string;
  role: 'admin';
  name: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
