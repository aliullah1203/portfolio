export interface Skill {
  id: string;
  name: string;
  category: 'frontend' | 'backend' | 'database' | 'tools';
  icon: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  description: string;
  thumbnail: string;
  technologies: string[];
  liveUrl?: string;
  githubUrl?: string;
  featured?: boolean;
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  dateRange: string;
  description: string;
  tags: string[];
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content?: string;
  publishedAt: string;
  category: string;
  readTime: string;
  coverImage: string;
  tags?: string;
  metaTitle?: string;
  metaDescription?: string;
  status?: string;
  featured?: boolean;
  allowComments?: boolean;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  organization: string;
}
