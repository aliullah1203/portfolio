'use client';

import { useAuth } from '@/shared/context/AuthContext';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface BlogData {
  _id?: string;
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  category?: string;
  tags?: string;
  metaTitle?: string;
  metaDescription?: string;
  status?: string;
  featured?: boolean;
  allowComments?: boolean;
  publishedAt?: string;
  readTime?: string;
}

const defaultFormData = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  coverImage: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
  category: 'Development',
  tags: '',
  metaTitle: '',
  metaDescription: '',
  status: 'published',
  featured: false,
  allowComments: true,
  publishedAt: new Date().toISOString(),
  readTime: '5 min read',
};

export default function EditBlogPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [formData, setFormData] = useState<BlogData>(defaultFormData);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) return;
    void fetchBlog();
  }, [isAuthenticated, id]);

  const fetchBlog = async () => {
    try {
      const API_URL = 'https://portfolio-6i9r.onrender.com';
      const response = await fetch(`${API_URL}/api/blogs`);
      const blogs = await response.json();
      const blog = (Array.isArray(blogs) ? blogs : []).find((item) => (item._id || item.id) === id);
      if (blog) {
        setFormData({
          ...defaultFormData,
          ...blog,
          title: blog.title || '',
          slug: blog.slug || '',
          excerpt: blog.excerpt || '',
          content: blog.content || '',
          coverImage: blog.coverImage || defaultFormData.coverImage,
          category: blog.category || defaultFormData.category,
          tags: blog.tags || '',
          metaTitle: blog.metaTitle || '',
          metaDescription: blog.metaDescription || '',
          status: blog.status || defaultFormData.status,
          featured: Boolean(blog.featured),
          allowComments: blog.allowComments !== false,
          publishedAt: blog.publishedAt || defaultFormData.publishedAt,
          readTime: blog.readTime || defaultFormData.readTime,
        });
      }
    } catch (err) {
      setError('Failed to load blog');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const isCheckbox = type === 'checkbox';

    setFormData((prev) => ({
      ...prev,
      [name]: isCheckbox ? (e.target as HTMLInputElement).checked : value,
    }));

    if (name === 'title') {
      setFormData((prev) => ({
        ...prev,
        slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const API_URL = 'https://portfolio-6i9r.onrender.com';
      const token = window.localStorage.getItem('portfolio-admin-token') || window.localStorage.getItem('admin-token') || '';
      const payload = {
        ...formData,
        title: formData.title?.trim(),
        slug: formData.slug?.trim(),
        excerpt: formData.excerpt?.trim(),
        content: formData.content?.trim(),
        category: formData.category || defaultFormData.category,
        tags: formData.tags || '',
        readTime: formData.readTime || defaultFormData.readTime,
      };

      const response = await fetch(`${API_URL}/api/admin/blogs/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        router.push('/admin/blogs');
      } else {
        const message = await response.text();
        setError(message || 'Failed to update blog');
      }
    } catch (err) {
      setError('Failed to update blog');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <p className="text-slate-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center gap-4">
        <Link href="/admin/blogs" className="text-slate-400 hover:text-white">
          ← Back
        </Link>
        <h1 className="text-4xl font-semibold text-white">Edit Blog</h1>
      </div>

      <div className="max-w-5xl rounded-[2rem] border border-white/10 bg-slate-900/70 p-8 sm:p-10">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid gap-8 lg:grid-cols-[1.7fr_0.9fr]">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-200">Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full rounded-lg border border-white/10 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-200">Slug *</label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full rounded-lg border border-white/10 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-200">Excerpt *</label>
                <textarea
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleChange}
                  rows={3}
                  required
                  className="mt-2 w-full rounded-lg border border-white/10 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-200">Content (Rich Text/Markdown) *</label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  rows={12}
                  required
                  className="mt-2 w-full rounded-lg border border-white/10 bg-slate-950/80 px-4 py-3 font-mono text-sm text-slate-100 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
                  placeholder="Write your article content here..."
                />
              </div>
            </div>

            <div className="space-y-6 rounded-2xl border border-white/10 bg-slate-950/40 p-5">
              <div>
                <label className="block text-sm font-semibold text-slate-200">Cover Image</label>
                <input
                  type="text"
                  name="coverImage"
                  value={formData.coverImage}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-lg border border-white/10 bg-slate-900/80 px-4 py-3 text-slate-100 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-200">Category</label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-lg border border-white/10 bg-slate-900/80 px-4 py-3 text-slate-100 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-200">Tags</label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  placeholder="react, nextjs, backend"
                  className="mt-2 w-full rounded-lg border border-white/10 bg-slate-900/80 px-4 py-3 text-slate-100 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-200">Meta Title</label>
                <input
                  type="text"
                  name="metaTitle"
                  value={formData.metaTitle}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-lg border border-white/10 bg-slate-900/80 px-4 py-3 text-slate-100 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-200">Meta Description</label>
                <textarea
                  name="metaDescription"
                  value={formData.metaDescription}
                  onChange={handleChange}
                  rows={3}
                  className="mt-2 w-full rounded-lg border border-white/10 bg-slate-900/80 px-4 py-3 text-slate-100 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-200">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-lg border border-white/10 bg-slate-900/80 px-4 py-3 text-slate-100 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-3 rounded-lg border border-white/10 bg-slate-900/70 px-3 py-3 text-sm text-slate-200">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={Boolean(formData.featured)}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-white/20 bg-slate-950"
                  />
                  Featured Post
                </label>

                <label className="flex items-center gap-3 rounded-lg border border-white/10 bg-slate-900/70 px-3 py-3 text-sm text-slate-200">
                  <input
                    type="checkbox"
                    name="allowComments"
                    checked={formData.allowComments !== false}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-white/20 bg-slate-950"
                  />
                  Allow Comments
                </label>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-200">Published At</label>
                <input
                  type="datetime-local"
                  name="publishedAt"
                  value={(formData.publishedAt || '').slice(0, 16)}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-lg border border-white/10 bg-slate-900/80 px-4 py-3 text-slate-100 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>
          </div>

          {error && <div className="rounded-lg bg-red-500/20 p-4 text-red-300">{error}</div>}

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <Link
              href="/admin/blogs"
              className="flex-1 rounded-lg border border-white/10 px-6 py-3 text-center font-medium text-white hover:bg-slate-800 transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
