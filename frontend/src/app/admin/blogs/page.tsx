'use client';

import { useAuth } from '@/shared/context/AuthContext';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Blog {
  _id?: string;
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  createdAt?: string;
  updatedAt?: string;
}

export default function AdminBlogsPage() {
  const { isAuthenticated } = useAuth();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchBlogs();
  }, [isAuthenticated]);

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
    if (!confirm('Are you sure you want to delete this blog?')) return;

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

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-semibold text-white">Blogs</h1>
          <p className="mt-2 text-slate-400">Manage your blog posts</p>
        </div>
        <Link
          href="/admin/blogs/new"
          className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 transition-colors"
        >
          Create Blog
        </Link>
      </div>

      {/* Blogs List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <p className="text-slate-400">Loading...</p>
        </div>
      ) : blogs.length === 0 ? (
        <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-12 text-center">
          <p className="text-slate-400">No blogs yet. Create your first blog post!</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">Title</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">Slug</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">Created</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-slate-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((blog) => (
                <tr key={blog._id || blog.id} className="border-b border-white/5 hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-white">{blog.title}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-slate-400">{blog.slug}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-slate-400">
                      {blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : 'N/A'}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/admin/blogs/${blog._id || blog.id}`}
                        className="rounded px-3 py-1 text-sm bg-slate-700 text-white hover:bg-slate-600 transition-colors"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(blog._id || blog.id || '')}
                        className="rounded px-3 py-1 text-sm bg-red-600 text-white hover:bg-red-700 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
