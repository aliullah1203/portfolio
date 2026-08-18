'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card } from '@/shared/ui/card';
import { BlogPost } from '@/shared/types';
import { ArrowUpRight } from 'lucide-react';

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

const API_BASE = 'https://portfolio-6i9r.onrender.com';

export function BlogSection() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/blogs`, {
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
        setError('Unable to load blog posts.');
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  return (
    <section id="blog">
      <div className="mx-auto max-w-[1440px] space-y-12">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-accent-400 uppercase tracking-wide">Latest Insights</p>
            <h2 className="mt-2 text-4xl font-bold text-white sm:text-5xl">Recent Articles</h2>
          </div>
          <a
            href="/blog"
            className="inline-flex items-center gap-2 text-accent-400 hover:text-accent-300 transition font-medium"
          >
            View all
            <ArrowUpRight size={16} />
          </a>
        </div>

        {loading ? (
          <div className="rounded-lg border border-neutral-800 bg-neutral-900/50 p-12 text-center text-neutral-400">
            Loading articles...
          </div>
        ) : error ? (
          <div className="rounded-lg border border-neutral-800 bg-neutral-900/50 p-12 text-center text-neutral-400">
            {error}
          </div>
        ) : posts.length === 0 ? (
          <div className="rounded-lg border border-neutral-800 bg-neutral-900/50 p-12 text-center text-neutral-400">
            No published articles yet.
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-3">
            {posts.map((post) => (
              <Card key={post.id || post.slug} className="group overflow-hidden p-0">
                <div className="relative h-48 overflow-hidden bg-neutral-800">
                  <img
                    src={post.coverImage || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80'}
                    alt={post.title}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="space-y-4 p-5">
                  <div className="flex items-center justify-between text-xs gap-2">
                    <span className="font-semibold text-accent-400 uppercase tracking-wider">
                      {post.category || 'Article'}
                    </span>
                    <span className="text-neutral-500">{post.readTime || '5 min'}</span>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-white group-hover:text-accent-400 transition line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-sm text-neutral-400 line-clamp-2">
                      {post.excerpt}
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-xs text-neutral-500 pt-2">
                    <span>{formatDate(post.publishedAt)}</span>
                    {post.slug ? (
                      <Link
                        href={`/blog/${encodeURIComponent(post.slug)}`}
                        className="inline-flex items-center gap-1 font-semibold text-accent-400 hover:text-accent-300 transition"
                      >
                        Read <ArrowUpRight size={12} />
                      </Link>
                    ) : null}
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
