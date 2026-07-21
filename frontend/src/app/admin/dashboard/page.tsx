'use client';

import { useAuth } from '@/shared/context/AuthContext';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Stats {
  blogs: number;
  projects: number;
  messages: number;
}

export default function AdminDashboardPage() {
  const { isAuthenticated } = useAuth();
  const [stats, setStats] = useState<Stats>({ blogs: 0, projects: 0, messages: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchStats = async () => {
      try {
        const API_URL = 'https://portfolio-6i9r.onrender.com';
        
        const token = localStorage.getItem('portfolio-admin-token') || localStorage.getItem('admin-token') || '';
        const [blogsRes, projectsRes, messagesRes] = await Promise.all([
          fetch(`${API_URL}/api/blogs`),
          fetch(`${API_URL}/api/projects`),
          fetch(`${API_URL}/api/admin/messages`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }),
        ]);

        const blogs = blogsRes.ok ? await blogsRes.json() : [];
        const projects = projectsRes.ok ? await projectsRes.json() : [];
        const messages = messagesRes.ok ? await messagesRes.json() : [];

        setStats({
          blogs: Array.isArray(blogs) ? blogs.length : 0,
          projects: Array.isArray(projects) ? projects.length : 0,
          messages: Array.isArray(messages) ? messages.length : 0,
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-semibold text-white">Dashboard</h1>
        <p className="mt-2 text-slate-400">Welcome to your portfolio admin panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        <Link href="/admin/blogs">
          <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-8 hover:border-white/20 cursor-pointer transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">Blog Posts</p>
                <p className="mt-2 text-3xl font-bold text-white">{loading ? '-' : stats.blogs}</p>
              </div>
              <div className="rounded-full bg-blue-500/20 p-4">
                <svg className="h-8 w-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
          </div>
        </Link>

        <Link href="/admin/projects">
          <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-8 hover:border-white/20 cursor-pointer transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">Projects</p>
                <p className="mt-2 text-3xl font-bold text-white">{loading ? '-' : stats.projects}</p>
              </div>
              <div className="rounded-full bg-purple-500/20 p-4">
                <svg className="h-8 w-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.5a2 2 0 00-1 .267" />
                </svg>
              </div>
            </div>
          </div>
        </Link>

        <Link href="/admin/messages">
          <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-8 hover:border-white/20 cursor-pointer transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">Messages</p>
                <p className="mt-2 text-3xl font-bold text-white">{loading ? '-' : stats.messages}</p>
              </div>
              <div className="rounded-full bg-green-500/20 p-4">
                <svg className="h-8 w-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Quick Actions */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold text-white mb-6">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Link href="/admin/blogs" className="rounded-lg border border-white/10 bg-slate-900/70 p-4 hover:bg-slate-900 transition-colors">
            <p className="font-medium text-white">Manage Blogs</p>
            <p className="mt-1 text-sm text-slate-400">Create, edit, or delete blog posts</p>
          </Link>
          <Link href="/admin/projects" className="rounded-lg border border-white/10 bg-slate-900/70 p-4 hover:bg-slate-900 transition-colors">
            <p className="font-medium text-white">Manage Projects</p>
            <p className="mt-1 text-sm text-slate-400">Manage your project portfolio</p>
          </Link>
          <Link href="/admin/messages" className="rounded-lg border border-white/10 bg-slate-900/70 p-4 hover:bg-slate-900 transition-colors">
            <p className="font-medium text-white">View Messages</p>
            <p className="mt-1 text-sm text-slate-400">Check contact form submissions</p>
          </Link>
          <Link href="/admin/profile" className="rounded-lg border border-white/10 bg-slate-900/70 p-4 hover:bg-slate-900 transition-colors">
            <p className="font-medium text-white">Edit Profile</p>
            <p className="mt-1 text-sm text-slate-400">Update your information</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
