'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card } from '@/shared/ui/card';
import { BlogPost } from '@/shared/types';
import { ArrowRight } from 'lucide-react';

function getApiBaseUrl() {
  const configured = 'https://portfolio-6i9r.onrender.com';
  if (configured) {
    return configured.replace(/\/$/, '');
  }

  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    if (host === '0.0.0.0' || host === '::' || host === '[::]') {
      return 'http://localhost:8080';
    }
    return `http://${host}:8080`;
  }

  return 'http://localhost:8080';
}

function formatDate(value?: string) {
  if (!value) return 'Recently published';

  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(parsedDate);
}

export function BlogSection() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const API_URL = getApiBaseUrl();
        const response = await fetch(`${API_URL}/api/blogs`, {
          method: 'GET',
          headers: { Accept: 'application/json' },
          cache: 'no-store',
        });

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const data = await response.json();
        const normalizedPosts = Array.isArray(data) ? data.slice(0, 3) : [];
        setPosts(normalizedPosts);
        setError('');
      } catch (err) {
        console.error(err);
        setPosts([]);
        setError('Unable to load blog posts right now.');
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  return (
    <section id="blog">
      <div className="mx-auto max-w-[1440px] space-y-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-brand-300">Latest Insights</p>
            <h2 className="text-4xl font-semibold text-white sm:text-5xl">My Recent Blog Posts</h2>
          </div>
          <a
            href="/blog"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:bg-white/10"
          >
            View All Posts <ArrowRight size={16} />
          </a>
        </div>

        {loading ? (
          <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-10 text-center text-slate-400">
            Loading recent blog posts...
          </div>
        ) : error ? (
          <div className="rounded-[2rem] border border-white/10 bg-red-500/10 p-10 text-center text-red-300">{error}</div>
        ) : posts.length === 0 ? (
          <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-10 text-center text-slate-400">
            No published blog posts yet.
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-3">
            {posts.map((post) => (
              <Card key={post.id || post.slug} className="group overflow-hidden p-0">
                <div className="relative h-52 overflow-hidden bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950">
                  <img
                    src={post.coverImage || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80'}
                    alt={post.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 rounded-full border border-white/10 bg-slate-950/70 px-3 py-1 text-[11px] uppercase tracking-[0.25em] text-brand-300">
                    {post.category || 'Blog'}
                  </div>
                </div>
                <div className="space-y-4 p-6">
                  <div className="flex items-center justify-between text-xs uppercase tracking-[0.28em] text-brand-300">
                    <span>{post.category || 'Insights'}</span>
                    <span>{post.readTime || '5 min read'}</span>
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-2xl font-semibold text-white">{post.title}</h3>
                    <p className="text-sm leading-7 text-slate-300">{post.excerpt}</p>
                  </div>
                  <div className="flex items-center justify-between text-sm text-slate-400">
                    <span>{formatDate(post.publishedAt)}</span>
                    {post.slug ? (
                      <Link
                        href={`/blog/${encodeURIComponent(post.slug)}`}
                        className="inline-flex items-center gap-1 font-semibold text-brand-300 transition hover:text-brand-200"
                      >
                        Read More <ArrowRight size={14} />
                      </Link>
                    ) : (
                      <span className="text-slate-500">Unavailable</span>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
