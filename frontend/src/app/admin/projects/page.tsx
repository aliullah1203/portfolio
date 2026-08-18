'use client';

import { useAuth } from '@/shared/context/AuthContext';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Table from '@/components/admin/Table';
import Badge from '@/components/admin/Badge';

interface Project {
  _id?: string;
  id?: string;
  title: string;
  slug: string;
  description: string;
  featured?: boolean;
  createdAt?: string;
  updatedAt?: string;
  technologies?: string[];
}

export default function AdminProjectsPage() {
  const { isAuthenticated } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchProjects();
  }, [isAuthenticated]);

  useEffect(() => {
    const filtered = projects.filter(project =>
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.technologies?.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredProjects(filtered);
  }, [projects, searchTerm]);

  const fetchProjects = async () => {
    try {
      const API_URL = 'https://portfolio-6i9r.onrender.com';
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
    if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) return;

    try {
      const API_URL = 'https://portfolio-6i9r.onrender.com';
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

  const columns = [
    {
      key: 'title',
      label: 'Title',
      render: (value: string) => <span className="font-medium text-white">{value}</span>,
    },
    {
      key: 'technologies',
      label: 'Technologies',
      render: (value: string[] | undefined) => {
        if (!value || value.length === 0) return <span className="text-slate-500">-</span>;
        return (
          <div className="flex flex-wrap gap-1">
            {value.slice(0, 2).map((tech, i) => (
              <Badge key={i} variant="pending" className="text-xs py-0 px-1.5">
                {tech}
              </Badge>
            ))}
            {value.length > 2 && (
              <span className="text-xs text-slate-400">+{value.length - 2}</span>
            )}
          </div>
        );
      },
    },
    {
      key: 'featured',
      label: 'Status',
      width: '120px',
      align: 'center' as const,
      render: (value: boolean) => (
        <Badge variant={value ? 'featured' : 'default'}>
          {value ? 'Featured' : 'Active'}
        </Badge>
      ),
    },
    {
      key: 'createdAt',
      label: 'Created',
      width: '120px',
      render: (value: string) => (
        <span className="text-slate-400 text-sm">
          {value ? new Date(value).toLocaleDateString() : 'N/A'}
        </span>
      ),
    },
    {
      key: 'id',
      label: 'Actions',
      width: '100px',
      align: 'right' as const,
      render: (value: string, row: Project) => (
        <div className="flex justify-end gap-2">
          <Link
            href={`/admin/projects/${row._id || row.id}`}
            className="inline-flex items-center px-3 py-1.5 rounded-md text-xs bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white transition-colors"
          >
            Edit
          </Link>
          <button
            onClick={() => handleDelete(row._id || row.id || '')}
            className="inline-flex items-center px-3 py-1.5 rounded-md text-xs bg-red-600/20 text-red-300 hover:bg-red-600/30 transition-colors"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 md:p-8 lg:p-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-white">Projects</h1>
          <p className="mt-1 text-sm text-slate-400">Showcase and manage your project portfolio</p>
        </div>
        <Link
          href="/admin/projects/new"
          className="inline-flex items-center px-4 py-2 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <span className="mr-2">+</span>
          Create Project
        </Link>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <svg className="absolute left-3 top-2.5 h-5 w-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search projects by title, slug, or technology..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-md border border-white/10 bg-slate-900/30 text-white placeholder-slate-500 text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
          />
        </div>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        data={filteredProjects}
        isLoading={loading}
        isEmpty={filteredProjects.length === 0}
        emptyMessage={searchTerm ? 'No projects found matching your search' : 'No projects yet. Create your first project!'}
      />
    </div>
  );
}
