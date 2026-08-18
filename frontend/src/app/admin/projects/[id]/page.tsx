'use client';

import { useAuth } from '@/shared/context/AuthContext';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

interface ProjectData {
  _id?: string;
  id?: string;
  title: string;
  slug: string;
  description: string;
  thumbnail: string;
  technologies: string;
  liveUrl: string;
  githubUrl: string;
  featured?: boolean;
}

export default function EditProjectPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [formData, setFormData] = useState<ProjectData>({
    title: '',
    slug: '',
    description: '',
    thumbnail: '',
    technologies: '',
    liveUrl: '',
    githubUrl: '',
    featured: false,
  });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchProject();
  }, [isAuthenticated, id]);

  const fetchProject = async () => {
    try {
      const API_URL = 'https://portfolio-6i9r.onrender.com';
      const response = await fetch(`${API_URL}/api/projects`);
      const projects = await response.json();
      const project = (Array.isArray(projects) ? projects : []).find(p => (p._id || p.id) === id);
      if (project) {
        setFormData({
          title: project.title || '',
          slug: project.slug || '',
          description: project.description || '',
          thumbnail: project.thumbnail || '',
          technologies: Array.isArray(project.technologies)
            ? project.technologies.join(', ')
            : project.technologies || '',
          liveUrl: project.liveUrl || '',
          githubUrl: project.githubUrl || '',
          featured: project.featured || false,
        });
      }
    } catch (error) {
      setError('Failed to load project');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const finalValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({
      ...prev,
      [name]: finalValue,
    }));
  };

  const getStoredToken = () => {
    if (typeof window === 'undefined') return '';
    return window.localStorage.getItem('portfolio-admin-token') || window.localStorage.getItem('admin-token') || '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const API_URL = 'https://portfolio-6i9r.onrender.com';
      const token = getStoredToken();
      const payload = {
        ...formData,
        technologies: typeof formData.technologies === 'string'
          ? formData.technologies.split(',').map(t => t.trim()).filter(Boolean)
          : formData.technologies,
      };
      const response = await fetch(`${API_URL}/api/admin/projects/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        router.push('/admin/projects');
      } else {
        const errorData = await response.json().catch(() => null);
        setError(errorData?.error || 'Failed to update project');
      }
    } catch (error) {
      setError('Failed to update project');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <p className="text-slate-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 lg:p-10">
      {/* Header */}
      <div className="mb-8 flex items-center gap-4">
        <Link href="/admin/projects" className="text-slate-400 hover:text-white">
          ← Back
        </Link>
        <h1 className="text-2xl font-semibold text-white">Edit Project</h1>
      </div>

      <div className="max-w-3xl">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basics Section */}
          <div className="border border-white/10 rounded-lg bg-slate-900/30 p-6">
            <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-6">Basics</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full rounded-md border border-white/10 bg-slate-900/50 px-3 py-2 text-sm text-slate-100 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Slug *</label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  required
                  className="w-full rounded-md border border-white/10 bg-slate-900/50 px-3 py-2 text-sm text-slate-100 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="border border-white/10 rounded-lg bg-slate-900/30 p-6">
            <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-6">Content</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={5}
                  required
                  className="w-full rounded-md border border-white/10 bg-slate-900/50 px-3 py-2 text-sm text-slate-100 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Thumbnail URL *</label>
                <input
                  type="url"
                  name="thumbnail"
                  value={formData.thumbnail}
                  onChange={handleChange}
                  required
                  placeholder="https://example.com/image.jpg"
                  className="w-full rounded-md border border-white/10 bg-slate-900/50 px-3 py-2 text-sm text-slate-100 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Technologies (comma separated) *</label>
                <input
                  type="text"
                  name="technologies"
                  value={formData.technologies}
                  onChange={handleChange}
                  required
                  placeholder="React, TypeScript, Node.js"
                  className="w-full rounded-md border border-white/10 bg-slate-900/50 px-3 py-2 text-sm text-slate-100 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>
          </div>

          {/* Links Section */}
          <div className="border border-white/10 rounded-lg bg-slate-900/30 p-6">
            <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-6">Links</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Live URL</label>
                <input
                  type="url"
                  name="liveUrl"
                  value={formData.liveUrl}
                  onChange={handleChange}
                  placeholder="https://example.com"
                  className="w-full rounded-md border border-white/10 bg-slate-900/50 px-3 py-2 text-sm text-slate-100 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">GitHub URL</label>
                <input
                  type="url"
                  name="githubUrl"
                  value={formData.githubUrl}
                  onChange={handleChange}
                  placeholder="https://github.com/username/repo"
                  className="w-full rounded-md border border-white/10 bg-slate-900/50 px-3 py-2 text-sm text-slate-100 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>
          </div>

          {/* Publishing Section */}
          <div className="border border-white/10 rounded-lg bg-slate-900/30 p-6">
            <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-6">Publishing</h2>
            <div>
              <label className="flex items-center gap-3 text-sm text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured as unknown as boolean}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-white/20 bg-slate-950"
                />
                Featured Project
              </label>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-md bg-red-500/20 border border-red-500/30 p-4 text-sm text-red-300">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-white/10">
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <Link
              href="/admin/projects"
              className="px-4 py-2 rounded-md border border-white/10 text-white text-sm font-medium hover:bg-slate-800/30 transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
