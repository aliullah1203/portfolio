'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Heart, MessageCircleMore, Sparkles, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Navbar } from '@/widgets/navbar';
import { Footer } from '@/widgets/footer';
import { BlogPost } from '@/shared/types';

const reactionOptions = [
  { key: 'like', label: 'Like', icon: ThumbsUp },
  { key: 'dislike', label: 'Dislike', icon: ThumbsDown },
  { key: 'care', label: 'Care', icon: Heart },
  { key: 'love', label: 'Love', icon: Sparkles },
];

function getApiBaseUrl() {
  const configured = process.env.NEXT_PUBLIC_API_URL?.trim();
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

export default function BlogPostPage() {
  const params = useParams();
  const routeSlug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
  const fallbackSlug = typeof window !== 'undefined'
    ? window.location.pathname.split('/').filter(Boolean).pop()
    : undefined;
  const slug = routeSlug || fallbackSlug;

  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedReaction, setSelectedReaction] = useState<string | null>(null);
  const [reactionCounts, setReactionCounts] = useState<Record<string, number>>({
    like: 0,
    dislike: 0,
    care: 0,
    love: 0,
  });
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<Array<{ id: number | string; author: string; text: string }>>([]);

  useEffect(() => {
    if (!slug) return;

    const loadPost = async () => {
      try {
        const API_URL = getApiBaseUrl();
        const [postResponse, reactionsResponse, commentsResponse] = await Promise.all([
          fetch(`${API_URL}/api/blogs/${slug}`, { cache: 'no-store' }),
          fetch(`${API_URL}/api/blogs/${slug}/reactions`, { cache: 'no-store' }),
          fetch(`${API_URL}/api/blogs/${slug}/comments`, { cache: 'no-store' }),
        ]);

        if (!postResponse.ok) {
          setPost(null);
          setLoading(false);
          return;
        }

        const data = await postResponse.json();
        setPost({
          id: data.id || slug,
          slug: data.slug || slug,
          title: data.title || 'Untitled post',
          excerpt: data.excerpt || '',
          content: data.content || data.excerpt || '',
          publishedAt: data.publishedAt || new Date().toISOString(),
          category: data.category || 'Blog',
          readTime: data.readTime || '5 min read',
          coverImage: data.coverImage || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
        });

        if (reactionsResponse.ok) {
          const reactions = await reactionsResponse.json();
          const nextCounts = { like: 0, dislike: 0, care: 0, love: 0 };
          if (Array.isArray(reactions)) {
            reactions.forEach((reaction: { reactionType: string; count: number }) => {
              nextCounts[reaction.reactionType as keyof typeof nextCounts] = reaction.count;
            });
          }
          setReactionCounts(nextCounts);
        }

        if (commentsResponse.ok) {
          const commentsData = await commentsResponse.json();
          setComments(commentsData || []);
        }
      } catch (error) {
        console.error(error);
        setPost(null);
      } finally {
        setLoading(false);
      }
    };

    void loadPost();
  }, [slug]);

  const handleReaction = async (reaction: string) => {
    try {
      const API_URL = getApiBaseUrl();
      const response = await fetch(`${API_URL}/api/blogs/${slug}/reactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reactionType: reaction }),
      });

      if (!response.ok) {
        throw new Error('Failed to save reaction');
      }

      const data = await response.json();
      const nextCounts = { like: 0, dislike: 0, care: 0, love: 0 };
      data.forEach((item: { reactionType: string; count: number }) => {
        nextCounts[item.reactionType as keyof typeof nextCounts] = item.count;
      });
      setReactionCounts(nextCounts);
      setSelectedReaction((current) => (current === reaction ? null : reaction));
    } catch (error) {
      console.error(error);
    }
  };

  const handleCommentSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!commentText.trim()) return;

    try {
      const API_URL = getApiBaseUrl();
      const response = await fetch(`${API_URL}/api/blogs/${slug}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ author: 'You', text: commentText.trim() }),
      });

      if (!response.ok) {
        throw new Error('Failed to save comment');
      }

      const savedComment = await response.json();
      setComments((current) => [...current, savedComment]);
      setCommentText('');
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <Navbar />
        <main className="mx-auto flex max-w-[1200px] items-center justify-center px-4 py-24 sm:px-6 lg:px-8">
          <p className="text-slate-400">Loading article...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <Navbar />
        <main className="mx-auto max-w-[1200px] px-4 py-24 sm:px-6 lg:px-8">
          <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-10 text-center shadow-glow">
            <p className="text-slate-300">This article could not be found.</p>
            <Link href="/blog" className="mt-6 inline-flex items-center gap-2 text-brand-300 hover:text-brand-200">
              <ArrowLeft size={16} /> Back to all posts
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />
      <main className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 lg:px-8">
        <Link href="/blog" className="mb-8 inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white">
          <ArrowLeft size={16} /> Back to blog
        </Link>

        <article className="overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/70 shadow-glow">
          <div className="relative h-72 overflow-hidden sm:h-96">
            <img src={post.coverImage} alt={post.title} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
              <div className="inline-flex rounded-full border border-white/10 bg-slate-950/70 px-3 py-1 text-xs uppercase tracking-[0.35em] text-brand-300">
                {post.category}
              </div>
              <h1 className="mt-4 text-3xl font-semibold text-white sm:text-5xl">{post.title}</h1>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">{post.excerpt}</p>
            </div>
          </div>

          <div className="space-y-8 p-6 sm:p-10">
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
              <span>{new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(post.publishedAt))}</span>
              <span>•</span>
              <span>{post.readTime}</span>
            </div>

            <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/50 p-5">
              <div className="flex flex-wrap items-center gap-3">
                {reactionOptions.map((reaction) => {
                  const Icon = reaction.icon;
                  return (
                    <button
                      key={reaction.key}
                      type="button"
                      onClick={() => handleReaction(reaction.key)}
                      className={`flex items-center gap-2 rounded-full border px-3 py-2 text-sm transition ${
                        selectedReaction === reaction.key
                          ? 'border-brand-400 bg-brand-500/20 text-brand-200'
                          : 'border-white/10 bg-slate-900/70 text-slate-300 hover:border-brand-400/40 hover:text-white'
                      }`}
                    >
                      <Icon size={16} />
                      <span>{reaction.label}</span>
                      <span className="text-xs text-slate-400">{reactionCounts[reaction.key] || 0}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="prose prose-invert max-w-none text-slate-300">
              <p className="whitespace-pre-line text-lg leading-8">{post.content}</p>
            </div>

            <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/50 p-5">
              <div className="mb-4 flex items-center gap-2 text-white">
                <MessageCircleMore size={18} />
                <h2 className="text-xl font-semibold">Comments</h2>
              </div>

              <form onSubmit={handleCommentSubmit} className="mb-6 space-y-3">
                <textarea
                  value={commentText}
                  onChange={(event) => setCommentText(event.target.value)}
                  rows={3}
                  placeholder="Write a thoughtful comment..."
                  className="w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-slate-100 outline-none focus:border-brand-400"
                />
                <button type="submit" className="rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-400">
                  Post Comment
                </button>
              </form>

              <div className="space-y-3">
                {comments.map((comment) => (
                  <div key={comment.id} className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
                    <p className="text-sm font-semibold text-white">{comment.author}</p>
                    <p className="mt-2 text-sm leading-7 text-slate-300">{comment.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
