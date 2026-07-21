'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/shared/context/AuthContext';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading, logout } = useAuth();
  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !isLoginPage) {
      router.replace('/admin/login');
    }
  }, [isAuthenticated, isLoading, isLoginPage, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="text-slate-100">Loading...</div>
      </div>
    );
  }

  // Allow login page to render without authentication
  if (isLoginPage) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100">
        {children}
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const handleLogout = () => {
    logout();
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Navigation */}
      <nav className="border-b border-white/10 bg-slate-900/50 backdrop-blur">
        <div className="mx-auto max-w-[1440px] px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link href="/admin/dashboard" className="text-lg font-semibold text-white hover:text-slate-300">
              Admin Panel
            </Link>
            <div className="flex items-center gap-6">
              <div className="hidden gap-4 sm:flex">
                <Link
                  href="/admin/dashboard"
                  className="text-slate-300 hover:text-white transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  href="/admin/blogs"
                  className="text-slate-300 hover:text-white transition-colors"
                >
                  Blogs
                </Link>
                <Link
                  href="/admin/projects"
                  className="text-slate-300 hover:text-white transition-colors"
                >
                  Projects
                </Link>
                <Link
                  href="/admin/messages"
                  className="text-slate-300 hover:text-white transition-colors"
                >
                  Messages
                </Link>
                <Link
                  href="/admin/profile"
                  className="text-slate-300 hover:text-white transition-colors"
                >
                  Profile
                </Link>
              </div>
              <button
                onClick={handleLogout}
                className="rounded-lg bg-red-600 px-4 py-2 font-medium text-white hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>{children}</main>
    </div>
  );
}
