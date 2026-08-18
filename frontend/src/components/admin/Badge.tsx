'use client';

interface BadgeProps {
  variant?: 'default' | 'published' | 'draft' | 'featured' | 'pending' | 'error' | 'success';
  children: React.ReactNode;
  className?: string;
}

export default function Badge({ variant = 'default', children, className = '' }: BadgeProps) {
  const variantStyles = {
    default: 'bg-slate-500/20 text-slate-300 border border-slate-500/30',
    published: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
    draft: 'bg-slate-500/20 text-slate-300 border border-slate-500/30',
    featured: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
    pending: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
    error: 'bg-red-500/20 text-red-300 border border-red-500/30',
    success: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
