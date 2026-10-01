import { Project, Service, Skill, SiteSettings, Inquiry } from '../types/index.ts';

export const initialSiteSettings: SiteSettings = {
  id: 'default',
  business_name: 'NIRA Infotech',
  logo_url: '', // Default falls back to custom high-res branded vector emblem
  email: 'contact@nirainfotech.com',
  phone: '+91 98765 43210',
  whatsapp: '+91 98765 43210',
  whatsapp_message: 'Hello NIRA Infotech, I am interested in your website development services.',
  location: 'Ahmedabad, India · Remote & Global Delivery',
  hero_kicker: 'Full Stack Web Development & IT Solutions',
  hero_title: 'Modern Websites. Smart Digital Solutions.',
  hero_description: 'Building modern, responsive and professional websites and web applications for businesses, students, startups and individuals.',
  about: 'NIRA Infotech is a dedicated freelance web development and IT services agency. We combine modern engineering with clean design to build high-performance web applications that convert visitors into clients.',
  mission: 'To engineer reliable, visually compelling, and performant digital solutions that empower small businesses, developers, and visionaries to succeed online.',
  vision: 'To become a globally trusted partner for modern full-stack web applications, recognized for speed, architectural clarity, and outstanding client collaboration.',
  founder_name: 'Nirav Patel',
  founder_role: 'Founder & Full Stack IT Specialist',
  founder_bio: 'Experienced full stack developer passionate about React, Express, Supabase, and crafting responsive user-centric products from scratch to deployment.',
  founder_avatar: '',
  instagram: 'https://instagram.com/nirainfotech',
  linkedin: 'https://linkedin.com/company/nirainfotech',
  github: 'https://github.com/nirainfotech',
  facebook: 'https://facebook.com/nirainfotech',
  twitter: 'https://twitter.com/nirainfotech',
  footer_text: '© 2026 NIRA Infotech. All rights reserved. Built with modern web standards.',
  updated_at: new Date().toISOString()
};

export const initialProjects: Project[] = [
  {
    id: 'proj-1',
    title: 'College Food QR Pass',
    description: 'QR-based digital food pass & meal entitlement management system for college events and campus dining.',
    poster_url: '',
    category: 'Full Stack Web App',
    technologies: ['React.js', 'Node.js', 'Express.js', 'Supabase', 'Tailwind CSS'],
    live_url: 'https://demo-foodpass.nirainfotech.com',
    demo_url: 'https://demo-foodpass.nirainfotech.com',
    github_url: 'https://github.com/nirainfotech/college-food-qr-pass',
    details: 'Designed and deployed for large-scale college technical festivals and campus mess halls. Replaces paper coupons with dynamic, cryptographically signed QR codes scanned via any smartphone camera.',
    features: [
      'Instant QR generation for registered attendees',
      'Sub-second camera scanning and entitlement verification',
      'Real-time fraud prevention & single-use pass invalidation',
      'Admin analytics dashboard for real-time meal counts and peak load monitoring'
    ],
    featured: true,
    status: 'Completed',
    display_order: 1,
    created_at: '2026-03-15T10:00:00.000Z',
    updated_at: '2026-03-20T14:30:00.000Z'
  },
  {
    id: 'proj-2',
    title: 'NIRA Business Website',
    description: 'Modern corporate web presence with dynamic service catalog, interactive project showcases, and client portal.',
    poster_url: '',
    category: 'Business Website',
    technologies: ['React.js', 'TypeScript', 'Node.js', 'Supabase', 'Tailwind CSS'],
    live_url: 'https://nirainfotech.com',
    demo_url: 'https://demo.nirainfotech.com',
    github_url: 'https://github.com/nirainfotech/nira-business-site',
    details: 'Full responsive corporate portfolio and client booking engine with automated WhatsApp notifications, fast SEO-friendly performance, and live admin CMS.',
    features: [
      'Integrated No-Code Admin Panel for 100% content customization',
      'Instant WhatsApp client connection with pre-filled consultation message',
      'Sub-1s page load speeds and 100/100 Lighthouse performance metrics',
      'Supabase PostgreSQL persistent storage with automated inquiries management'
    ],
    featured: true,
    status: 'Completed',
    display_order: 2,
    created_at: '2026-04-01T08:00:00.000Z',
    updated_at: '2026-04-05T12:00:00.000Z'
  },
  {
    id: 'proj-3',
    title: 'SmartFlow Agency CRM',
    description: 'Streamlined client relationship and quote tracking pipeline for freelance developers and boutique agencies.',
    poster_url: '',
    category: 'Full Stack Web App',
    technologies: ['React.js', 'Express.js', 'PostgreSQL', 'REST API'],
    live_url: 'https://smartflow-demo.nirainfotech.com',
    demo_url: 'https://smartflow-demo.nirainfotech.com',
    github_url: 'https://github.com/nirainfotech/smartflow-crm',
    details: 'A lightweight alternative to bloated enterprise CRMs, specifically engineered for freelancers to track project scopes, client milestones, and revenue stages.',
    features: [
      'Kanban board for client proposal states (New, Contacted, In Progress, Closed)',
      '1-click invoice estimation and automated WhatsApp proposal link generator',
      'Secure JWT authentication and role-based staff access'
    ],
    featured: true,
    status: 'Completed',
    display_order: 3,
    created_at: '2026-04-12T11:20:00.000Z',
    updated_at: '2026-04-18T09:10:00.000Z'
  },
  {
    id: 'proj-4',
    title: 'DevStudio Portfolio & CMS',
    description: 'High-contrast portfolio theme with dynamic Markdown blog and live client inquiry inbox.',
    poster_url: '',
    category: 'Portfolio Website',
    technologies: ['React.js', 'Node.js', 'Tailwind CSS', 'Vite'],
    live_url: 'https://devstudio-demo.nirainfotech.com',
    demo_url: 'https://devstudio-demo.nirainfotech.com',
    github_url: 'https://github.com/nirainfotech/devstudio-portfolio',
    details: 'Custom engineered for software engineers, student developers, and freelancers who need an ultra-fast portfolio that showcases real project demos and code repositories.',
    features: [
      'Dark mode aesthetic with metallic circuit accent styling',
      'Interactive project modal viewers with live demo embeds',
      'Mobile-optimized touch navigation and zero-friction inquiry form'
    ],
    featured: false,
    status: 'Completed',
    display_order: 4,
    created_at: '2026-05-02T14:00:00.000Z',
    updated_at: '2026-05-06T16:45:00.000Z'
  },
  {
    id: 'proj-5',
    title: 'QuickDine Digital Menu & Orders',
    description: 'Contactless QR table ordering and kitchen dispatch screen for local cafes and bistros.',
    poster_url: '',
    category: 'Full Stack Web App',
    technologies: ['React.js', 'Node.js', 'Supabase', 'Tailwind CSS'],
    live_url: 'https://quickdine-demo.nirainfotech.com',
    demo_url: 'https://quickdine-demo.nirainfotech.com',
    github_url: 'https://github.com/nirainfotech/quickdine-restaurant',
    details: 'Interactive customer menu allowing diners to order directly from table QR codes without installing any native mobile app.',
    features: [
      'Zero-app install guest browsing and cart checkout',
      'Real-time kitchen order ticket display with audio alert chime',
      'Direct bill split and WhatsApp order summary dispatch'
    ],
    featured: false,
    status: 'In Progress',
    display_order: 5,
    created_at: '2026-05-15T09:00:00.000Z',
    updated_at: '2026-05-20T11:00:00.000Z'
  }
];

export const initialServices: Service[] = [
  {
    id: 'serv-1',
    title: 'Website Development',
    description: 'Modern, high-performance, and responsive websites tailored for growing businesses, startups, and individuals.',
    icon: 'Globe',
    active: true,
    display_order: 1,
    created_at: '2026-01-10T10:00:00.000Z'
  },
  {
    id: 'serv-2',
    title: 'Portfolio Websites',
    description: 'Standout, professional portfolio websites for students, developers, and freelancers designed to win clients and interviews.',
    icon: 'Briefcase',
    active: true,
    display_order: 2,
    created_at: '2026-01-10T10:00:00.000Z'
  },
  {
    id: 'serv-3',
    title: 'Business Websites',
    description: 'Credible, conversion-focused websites for small businesses and organizations with automated lead capture.',
    icon: 'Building2',
    active: true,
    display_order: 3,
    created_at: '2026-01-10T10:00:00.000Z'
  },
  {
    id: 'serv-4',
    title: 'Landing Pages',
    description: 'Ultra-fast, high-converting product and service landing pages designed with persuasive layout and smooth interactions.',
    icon: 'Zap',
    active: true,
    display_order: 4,
    created_at: '2026-01-10T10:00:00.000Z'
  },
  {
    id: 'serv-5',
    title: 'Full Stack Applications',
    description: 'Complete custom web apps with responsive frontend, secure Node/Express backend APIs, and Supabase / PostgreSQL database.',
    icon: 'Layers',
    active: true,
    display_order: 5,
    created_at: '2026-01-10T10:00:00.000Z'
  },
  {
    id: 'serv-6',
    title: 'Website Maintenance & IT Support',
    description: 'Ongoing updates, feature enhancements, security auditing, bug fixing, and hosting infrastructure support.',
    icon: 'Wrench',
    active: true,
    display_order: 6,
    created_at: '2026-01-10T10:00:00.000Z'
  }
];

export const initialSkills: Skill[] = [
  // Frontend
  { id: 'sk-1', name: 'HTML5', category: 'Frontend', icon: 'Code', description: 'Semantic markup, accessible standards & SEO structure', active: true, display_order: 1 },
  { id: 'sk-2', name: 'CSS3 & Modern Styling', category: 'Frontend', icon: 'Palette', description: 'CSS Grid, Flexbox, responsive layouts & keyframe animations', active: true, display_order: 2 },
  { id: 'sk-3', name: 'JavaScript (ES6+)', category: 'Frontend', icon: 'FileCode', description: 'Asynchronous programming, DOM manipulation, functional paradigms', active: true, display_order: 3 },
  { id: 'sk-4', name: 'React.js', category: 'Frontend', icon: 'Atom', description: 'Component architecture, custom hooks, state management', active: true, display_order: 4 },
  { id: 'sk-5', name: 'Tailwind CSS', category: 'Frontend', icon: 'Sparkles', description: 'Utility-first styling, design token systems, responsive tokens', active: true, display_order: 5 },
  { id: 'sk-6', name: 'Responsive Design', category: 'Frontend', icon: 'Smartphone', description: 'Mobile-first fluid layouts, touch optimization, multi-device fidelity', active: true, display_order: 6 },

  // Backend
  { id: 'sk-7', name: 'Node.js', category: 'Backend', icon: 'Server', description: 'Event-driven server runtime, microservices, file streams', active: true, display_order: 7 },
  { id: 'sk-8', name: 'Express.js', category: 'Backend', icon: 'Cpu', description: 'RESTful API routing, middleware pipelines, error handling', active: true, display_order: 8 },
  { id: 'sk-9', name: 'REST API Design', category: 'Backend', icon: 'Network', description: 'Clean CRUD endpoints, HTTP status standards, rate limiting', active: true, display_order: 9 },

  // Database & Cloud
  { id: 'sk-10', name: 'Supabase', category: 'Database & Cloud', icon: 'Database', description: 'Postgres backend, Row Level Security, Auth & Cloud Storage', active: true, display_order: 10 },
  { id: 'sk-11', name: 'PostgreSQL', category: 'Database & Cloud', icon: 'HardDrive', description: 'Relational schema design, indexes, complex queries & foreign keys', active: true, display_order: 11 },

  // Tools & DevOps
  { id: 'sk-12', name: 'Git & GitHub', category: 'Tools & DevOps', icon: 'GitBranch', description: 'Version control, branch workflows, pull requests & releases', active: true, display_order: 12 }
];

export const initialInquiries: Inquiry[] = [
  {
    id: 'inq-1',
    name: 'Aarav Sharma',
    email: 'aarav@apextech.in',
    phone: '+91 98234 56789',
    company: 'Apex Logistics',
    service: 'Full Stack Applications',
    project_type: 'Custom Web Application',
    budget: '$500 - $1,500',
    message: 'We need an internal order dispatch portal with Supabase database and real-time status updates for our warehouse team. Looking forward to discussing timelines!',
    status: 'New',
    created_at: '2026-09-28T09:30:00.000Z'
  },
  {
    id: 'inq-2',
    name: 'Priya Mehta',
    email: 'priya.mehta@eduhub.org',
    phone: '+91 97123 45678',
    company: 'EduHub Institute',
    service: 'Website Development',
    project_type: 'College Event QR System',
    budget: '$300 - $800',
    message: 'We saw your College Food QR Pass project and would love to build a similar attendee badge scanning system for our upcoming annual tech summit.',
    status: 'Contacted',
    created_at: '2026-09-29T14:15:00.000Z'
  },
  {
    id: 'inq-3',
    name: 'Marcus Vance',
    email: 'marcus@vancestudios.co',
    phone: '+1 415 555 0192',
    company: 'Vance Design Studios',
    service: 'Portfolio Websites',
    project_type: 'Freelance Portfolio',
    budget: '$800 - $2,000',
    message: 'Looking for a clean, minimalist developer portfolio that can be updated effortlessly via an admin panel. Loved your dark mode branding!',
    status: 'In Progress',
    created_at: '2026-09-30T16:40:00.000Z'
  }
];
