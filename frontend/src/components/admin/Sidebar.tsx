'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/shared/context/AuthContext';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  count?: number;
  group?: string;
}

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();
  const [isOpen, setIsOpen] = useState(true);

  const navItems: NavItem[] = [
    {
      group: 'Main',
      label: 'Dashboard',
      href: '/admin/dashboard',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-3m0 0l7-4 7 4M5 9v10a1 1 0 001 1h12a1 1 0 001-1V9m-9 16l-7-4m0 0V5m7 4l7-4" />
        </svg>
      ),
    },
  ];

  const contentItems: NavItem[] = [
    {
      group: 'Content',
      label: 'Blog Posts',
      href: '/admin/blogs',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      group: 'Content',
      label: 'Projects',
      href: '/admin/projects',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.5a2 2 0 00-1 .267" />
        </svg>
      ),
    },
  ];

  const commItems: NavItem[] = [
    {
      group: 'Communications',
      label: 'Messages',
      href: '/admin/messages',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
  ];

  const settingsItems: NavItem[] = [
    {
      group: 'Settings',
      label: 'Profile',
      href: '/admin/profile',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
  ];

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  const handleLogout = () => {
    logout();
    router.push('/admin/login');
  };

  const NavSection = ({ items }: { items: NavItem[] }) => {
    const groupName = items[0]?.group;
    return (
      <div className="mb-6">
        {groupName && groupName !== 'Main' && (
          <div className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            {groupName}
          </div>
        )}
        <div className="space-y-1 px-2">
          {items.map((item) => (
            // @ts-expect-error - Next.js Link type strictness, href is a valid route string
            <Link key={item.href} href={item.href}>
              <div
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? 'bg-slate-800/50 text-white border-l-2 border-blue-500'
                    : 'text-slate-400 hover:text-slate-300 hover:bg-slate-800/30'
                }`}
              >
                <span className={`flex-shrink-0 ${isActive(item.href) ? 'text-blue-400' : 'text-slate-500'}`}>
                  {item.icon}
                </span>
                <span className="flex-1">{item.label}</span>
                {item.count !== undefined && item.count > 0 && (
                  <span className="ml-auto flex items-center justify-center bg-blue-500/20 text-blue-300 rounded px-2 py-0.5 text-xs font-medium">
                    {item.count}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 bottom-0 w-64 bg-slate-900 border-r border-white/10 overflow-y-auto pt-4 pb-4 transition-transform duration-300 lg:static lg:translate-x-0 z-40 flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="px-6 py-2 mb-8">
          <h2 className="text-lg font-semibold text-white">Portfolio</h2>
          <p className="text-xs text-slate-500 mt-1">Admin Panel</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1">
          <NavSection items={navItems} />
          <NavSection items={contentItems} />
          <NavSection items={commItems} />
          <NavSection items={settingsItems} />
        </nav>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full px-3 py-2 rounded-md text-sm font-medium text-slate-300 hover:text-slate-200 hover:bg-slate-800/30 transition-colors text-left"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 lg:hidden z-40 p-3 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-lg"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </>
  );
}
