'use client';

import { useAuth } from '@/shared/context/AuthContext';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Table from '@/components/admin/Table';
import Badge from '@/components/admin/Badge';

interface Blog {
  _id?: string;
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  createdAt?: string;
  updatedAt?: string;
  featured?: boolean;
}

export default function AdminBlogsPage() {
  const { isAuthenticated } = useAuth();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchBlogs();
  }, [isAuthenticated]);

  useEffect(() => {
    const filtered = blogs.filter(blog => 
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.slug.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBlogs(filtered);
  }, [blogs, searchTerm]);

  const fetchBlogs = async () => {
    try {
      const API_URL = 'https://portfolio-6i9r.onrender.com';
      const response = await fetch(`${API_URL}/api/blogs`);
      const data = await response.json();
      setBlogs(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog? This action cannot be undone.')) return;

    try {
      const API_URL = 'https://portfolio-6i9r.onrender.com';
      const token = window.localStorage.getItem('portfolio-admin-token') || window.localStorage.getItem('admin-token') || '';
      const response = await fetch(`${API_URL}/api/admin/blogs/${id}`, {
        method: 'DELETE',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (response.ok) {
        setBlogs(blogs.filter(b => (b._id || b.id) !== id));
      } else {
        const message = await response.text();
        alert(message || 'Failed to delete blog');
      }
    } catch (error) {
      console.error('Failed to delete blog:', error);
      alert('Failed to delete blog');
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
      key: 'slug',
      label: 'Slug',
      render: (value: string) => <span className="text-slate-400 text-sm">{value}</span>,
    },
    {
      key: 'createdAt',
      label: 'Published',
      width: '120px',
      render: (value: string) => (
        <span className="text-slate-400 text-sm">
          {value ? new Date(value).toLocaleDateString() : 'N/A'}
        </span>
      ),
    },
    {
      key: 'featured',
      label: 'Status',
      width: '100px',
      align: 'center' as const,
      render: (value: boolean) => (
        <Badge variant={value ? 'featured' : 'published'}>
          {value ? 'Featured' : 'Published'}
        </Badge>
      ),
    },
    {
      key: 'id',
      label: 'Actions',
      width: '100px',
      align: 'right' as const,
      render: (value: string, row: Blog) => (
        <div className="flex justify-end gap-2">
          <Link
            href={`/admin/blogs/${row._id || row.id}`}
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
          <h1 className="text-2xl font-semibold text-white">Blog Posts</h1>
          <p className="mt-1 text-sm text-slate-400">Manage and publish your blog content</p>
        </div>
        <Link
          href="/admin/blogs/new"
          className="inline-flex items-center px-4 py-2 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <span className="mr-2">+</span>
          Create Blog
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
            placeholder="Search blogs by title or slug..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-md border border-white/10 bg-slate-900/30 text-white placeholder-slate-500 text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
          />
        </div>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        data={filteredBlogs}
        isLoading={loading}
        isEmpty={filteredBlogs.length === 0}
        emptyMessage={searchTerm ? 'No blogs found matching your search' : 'No blog posts yet. Create your first blog post!'}
      />
    </div>
  );
}
