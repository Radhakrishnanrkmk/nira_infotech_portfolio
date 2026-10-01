-- =========================================================
-- NIRA INFOTECH — SUPABASE POSTGRESQL DATABASE SCHEMA
-- Run this in your Supabase SQL Editor to initialize all tables,
-- storage buckets, and Row Level Security (RLS) policies.
-- =========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROJECTS TABLE
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  poster_url TEXT,
  category TEXT DEFAULT 'Full Stack',
  technologies TEXT[] DEFAULT '{}',
  live_url TEXT,
  demo_url TEXT,
  github_url TEXT,
  details TEXT,
  features TEXT[] DEFAULT '{}',
  featured BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'Completed', -- Completed, In Progress, Planning
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. SERVICES TABLE
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT DEFAULT 'Code',
  image_url TEXT,
  active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. SKILLS TABLE
CREATE TABLE IF NOT EXISTS skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT DEFAULT 'Code2',
  category TEXT DEFAULT 'Frontend', -- Frontend, Backend, Database & Cloud, Tools
  active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. INQUIRIES TABLE
CREATE TABLE IF NOT EXISTS inquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  service TEXT,
  project_type TEXT,
  budget TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'New', -- New, Contacted, In Progress, Completed, Closed
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. SITE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS site_settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  business_name TEXT DEFAULT 'NIRA Infotech',
  logo_url TEXT,
  email TEXT DEFAULT 'contact@nirainfotech.com',
  phone TEXT DEFAULT '+91 98765 43210',
  whatsapp TEXT DEFAULT '+91 98765 43210',
  whatsapp_message TEXT DEFAULT 'Hello NIRA Infotech, I am interested in your website development services.',
  location TEXT DEFAULT 'Ahmedabad, India (Available Worldwide)',
  hero_kicker TEXT DEFAULT 'Full Stack Web Development & IT Solutions',
  hero_title TEXT DEFAULT 'Modern Websites. Smart Digital Solutions.',
  hero_description TEXT DEFAULT 'Building modern, responsive and professional websites and web applications for businesses, students, startups and individuals.',
  about TEXT DEFAULT 'NIRA Infotech is a dedicated freelance web development and IT services agency. We specialize in crafting responsive, high-performance web applications tailored to the unique goals of startups, businesses, and academic innovators.',
  mission TEXT DEFAULT 'To engineer reliable, visually compelling, and performant digital solutions that empower small businesses, developers, and visionaries to succeed online.',
  vision TEXT DEFAULT 'To become a globally trusted partner for modern full-stack web applications, known for speed, clean architecture, and exceptional client collaboration.',
  founder_name TEXT DEFAULT 'NIRA Tech Lead',
  founder_role TEXT DEFAULT 'Full Stack Developer & Founder',
  founder_bio TEXT DEFAULT 'Passionate full-stack software engineer with expertise in React, Node.js, TypeScript, and modern cloud databases.',
  founder_avatar TEXT DEFAULT '',
  instagram TEXT DEFAULT 'https://instagram.com/nirainfotech',
  linkedin TEXT DEFAULT 'https://linkedin.com/company/nirainfotech',
  github TEXT DEFAULT 'https://github.com/nirainfotech',
  facebook TEXT DEFAULT '',
  twitter TEXT DEFAULT '',
  footer_text TEXT DEFAULT 'Crafted with precision by NIRA Infotech. All rights reserved.',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Public can read projects, services, skills, and site_settings
CREATE POLICY "Allow public read access for projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Allow public read access for services" ON services FOR SELECT USING (true);
CREATE POLICY "Allow public read access for skills" ON skills FOR SELECT USING (true);
CREATE POLICY "Allow public read access for site_settings" ON site_settings FOR SELECT USING (true);

-- Anyone can submit inquiries
CREATE POLICY "Allow public insert for inquiries" ON inquiries FOR INSERT WITH CHECK (true);

-- Authenticated users (admin) or service role can manage everything
CREATE POLICY "Allow authenticated manage projects" ON projects FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated manage services" ON services FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated manage skills" ON skills FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated manage inquiries" ON inquiries FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated manage site_settings" ON site_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 7. INITIAL SEED FOR SITE SETTINGS
INSERT INTO site_settings (id, business_name, hero_title, hero_description)
VALUES ('default', 'NIRA Infotech', 'Modern Websites. Smart Digital Solutions.', 'Building modern, responsive and professional websites and web applications for businesses, students, startups and individuals.')
ON CONFLICT (id) DO NOTHING;
