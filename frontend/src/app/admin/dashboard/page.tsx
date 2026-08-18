'use client';

import { useAuth } from '@/shared/context/AuthContext';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Stats {
  blogs: number;
  projects: number;
  messages: number;
}

interface RecentItem {
  id: string;
  type: 'blog' | 'project' | 'message';
  title: string;
  timestamp: string;
  url: string;
}

export default function AdminDashboardPage() {
  const { isAuthenticated } = useAuth();
  const [stats, setStats] = useState<Stats>({ blogs: 0, projects: 0, messages: 0 });
  const [recentItems, setRecentItems] = useState<RecentItem[]>([]);
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

        // Build recent items list
        const recent: RecentItem[] = [];
        
        if (Array.isArray(blogs)) {
          blogs.slice(-3).forEach((blog: any) => {
            recent.push({
              id: blog._id || blog.id,
              type: 'blog',
              title: blog.title,
              timestamp: blog.createdAt || blog.created || new Date().toISOString(),
              url: `/admin/blogs/${blog._id || blog.id}`,
            });
          });
        }

        if (Array.isArray(projects)) {
          projects.slice(-2).forEach((project: any) => {
            recent.push({
              id: project._id || project.id,
              type: 'project',
              title: project.title,
              timestamp: project.createdAt || project.created || new Date().toISOString(),
              url: `/admin/projects/${project._id || project.id}`,
            });
          });
        }

        // Sort by timestamp
        recent.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        setRecentItems(recent.slice(0, 5));
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [isAuthenticated]);

  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      blog: 'Blog post created',
      project: 'Project created',
      message: 'Message received',
    };
    return labels[type] || 'Item updated';
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="p-6 md:p-8 lg:p-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-white">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-400">Overview of your portfolio</p>
      </div>

      {/* KPI Cards - Compact Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Link href="/admin/blogs">
          <div className="border border-white/10 rounded-lg bg-slate-900/30 p-6 hover:border-white/20 hover:bg-slate-900/50 transition-all cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Blog Posts</p>
                <p className="mt-2 text-3xl font-bold text-white">{loading ? '-' : stats.blogs}</p>
              </div>
              <div className="text-3xl text-slate-600">📝</div>
            </div>
          </div>
        </Link>

        <Link href="/admin/projects">
          <div className="border border-white/10 rounded-lg bg-slate-900/30 p-6 hover:border-white/20 hover:bg-slate-900/50 transition-all cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Projects</p>
                <p className="mt-2 text-3xl font-bold text-white">{loading ? '-' : stats.projects}</p>
              </div>
              <div className="text-3xl text-slate-600">🚀</div>
            </div>
          </div>
        </Link>

        <Link href="/admin/messages">
          <div className="border border-white/10 rounded-lg bg-slate-900/30 p-6 hover:border-white/20 hover:bg-slate-900/50 transition-all cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Messages</p>
                <p className="mt-2 text-3xl font-bold text-white">{loading ? '-' : stats.messages}</p>
              </div>
              <div className="text-3xl text-slate-600">💬</div>
            </div>
          </div>
        </Link>

        <div className="border border-white/10 rounded-lg bg-slate-900/30 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</p>
              <p className="mt-2 text-sm font-medium text-emerald-300">All Systems Operational</p>
            </div>
            <div className="text-lg">✓</div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      {recentItems.length > 0 && (
        <div className="border border-white/10 rounded-lg bg-slate-900/30 p-6">
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {recentItems.map((item) => (
              // @ts-expect-error - Next.js Link type strictness, url is a valid route string
              <Link key={item.id} href={item.url}>
                <div className="flex items-center justify-between p-3 rounded-md hover:bg-slate-800/30 transition-colors cursor-pointer">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{item.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{getTypeLabel(item.type)}</p>
                  </div>
                  <p className="text-xs text-slate-500 ml-4 flex-shrink-0">{formatTimeAgo(item.timestamp)}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && recentItems.length === 0 && (
        <div className="border border-white/10 rounded-lg bg-slate-900/30 p-12 text-center">
          <p className="text-slate-400">No recent activity yet</p>
          <p className="text-xs text-slate-500 mt-2">Start creating content to see activity here</p>
        </div>
      )}
    </div>
  );
}
