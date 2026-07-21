'use client';

import { useAuth } from '@/shared/context/AuthContext';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Project {
  _id?: string;
  id?: string;
  title: string;
  slug: string;
  description: string;
  featured?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export default function AdminProjectsPage() {
  const { isAuthenticated } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchProjects();
  }, [isAuthenticated]);

  const fetchProjects = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
      const response = await fetch(`${API_URL}/api/projects`);
      const data = await response.json();
      setProjects(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStoredToken = () => {
    if (typeof window === 'undefined') return '';
    return window.localStorage.getItem('portfolio-admin-token') || window.localStorage.getItem('admin-token') || '';
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
      const token = getStoredToken();
      const response = await fetch(`${API_URL}/api/admin/projects/${id}`, {
        method: 'DELETE',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (response.ok) {
        setProjects(projects.filter(p => (p._id || p.id) !== id));
      }
    } catch (error) {
      console.error('Failed to delete project:', error);
      alert('Failed to delete project');
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-semibold text-white">Projects</h1>
          <p className="mt-2 text-slate-400">Manage your project portfolio</p>
        </div>
        <Link
          href="/admin/projects/new"
          className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 transition-colors"
        >
          Create Project
        </Link>
      </div>

      {/* Projects List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <p className="text-slate-400">Loading...</p>
        </div>
      ) : projects.length === 0 ? (
        <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-12 text-center">
          <p className="text-slate-400">No projects yet. Create your first project!</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <div
              key={project._id || project.id}
              className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-6 hover:border-white/20 transition-all"
            >
              <div className="mb-4 flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-white">{project.title}</h3>
                  <p className="mt-1 text-sm text-slate-400">{project.slug}</p>
                </div>
                {project.featured && (
                  <span className="rounded-full bg-yellow-500/20 px-2 py-1 text-xs font-medium text-yellow-300">
                    Featured
                  </span>
                )}
              </div>
              <p className="line-clamp-2 text-sm text-slate-300">{project.description}</p>
              <div className="mt-6 flex gap-2">
                <Link
                  href={`/admin/projects/${project._id || project.id}`}
                  className="flex-1 rounded px-3 py-2 text-center text-sm bg-slate-700 text-white hover:bg-slate-600 transition-colors"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(project._id || project.id || '')}
                  className="flex-1 rounded px-3 py-2 text-center text-sm bg-red-600 text-white hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
