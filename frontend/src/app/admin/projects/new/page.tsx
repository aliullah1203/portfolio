'use client';

import { useAuth } from '@/shared/context/AuthContext';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CreateProjectPage() {
  const { isAuthenticated } = useAuth();
  const getStoredToken = () => {
    if (typeof window === 'undefined') return '';
    return window.localStorage.getItem('portfolio-admin-token') || window.localStorage.getItem('admin-token') || '';
  };
  const router = useRouter();
  const [formData, setFormData] = useState({
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
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const finalValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({
      ...prev,
      [name]: finalValue,
    }));

    // Auto-generate slug from title
    if (name === 'title') {
      setFormData(prev => ({
        ...prev,
        slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
      const token = getStoredToken();
      const payload = {
        ...formData,
        technologies: formData.technologies.split(',').map(t => t.trim()).filter(Boolean),
      };
      const response = await fetch(`${API_URL}/api/admin/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok) {
        router.push('/admin/projects');
      } else {
        setError(data?.error || 'Failed to create project');
      }
    } catch (error) {
      setError('Failed to create project');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center gap-4">
        <Link href="/admin/projects" className="text-slate-400 hover:text-white">
          ← Back
        </Link>
        <h1 className="text-4xl font-semibold text-white">Create Project</h1>
      </div>

      <div className="max-w-2xl rounded-[2rem] border border-white/10 bg-slate-900/70 p-10">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-slate-200">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="mt-2 w-full rounded-lg border border-white/10 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-semibold text-slate-200">Slug</label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              required
              className="mt-2 w-full rounded-lg border border-white/10 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-slate-200">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={5}
              required
              className="mt-2 w-full rounded-lg border border-white/10 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* Thumbnail */}
          <div>
            <label className="block text-sm font-semibold text-slate-200">Thumbnail URL</label>
            <input
              type="url"
              name="thumbnail"
              value={formData.thumbnail}
              onChange={handleChange}
              required
              className="mt-2 w-full rounded-lg border border-white/10 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* Technologies */}
          <div>
            <label className="block text-sm font-semibold text-slate-200">Technologies (comma separated)</label>
            <input
              type="text"
              name="technologies"
              value={formData.technologies}
              onChange={handleChange}
              required
              className="mt-2 w-full rounded-lg border border-white/10 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* Live URL */}
          <div>
            <label className="block text-sm font-semibold text-slate-200">Live URL</label>
            <input
              type="url"
              name="liveUrl"
              value={formData.liveUrl}
              onChange={handleChange}
              className="mt-2 w-full rounded-lg border border-white/10 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* GitHub URL */}
          <div>
            <label className="block text-sm font-semibold text-slate-200">GitHub URL</label>
            <input
              type="url"
              name="githubUrl"
              value={formData.githubUrl}
              onChange={handleChange}
              className="mt-2 w-full rounded-lg border border-white/10 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* Featured */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              name="featured"
              checked={formData.featured as unknown as boolean}
              onChange={handleChange}
              className="h-4 w-4 rounded border-white/10 bg-slate-950/80 text-blue-600 focus:ring-2 focus:ring-blue-500/20"
            />
            <label className="text-sm font-semibold text-slate-200">Mark as featured</label>
          </div>

          {/* Error Message */}
          {error && <div className="rounded-lg bg-red-500/20 p-4 text-red-300">{error}</div>}

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {saving ? 'Creating...' : 'Create Project'}
            </button>
            <Link
              href="/admin/projects"
              className="flex-1 rounded-lg border border-white/10 px-6 py-3 text-center font-medium text-white hover:bg-slate-800 transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
