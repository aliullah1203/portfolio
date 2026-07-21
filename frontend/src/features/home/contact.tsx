'use client';

import { useState } from 'react';
import { Button } from '@/shared/ui/button';
import { siteConfig } from '@/shared/constants/site';

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await fetch('http://localhost:8080/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });

      // Clear success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact">
      <div className="mx-auto grid max-w-[1440px] gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        <div className="space-y-6">
          <p className="text-sm uppercase tracking-[0.35em] text-brand-300">Let's Work Together</p>
          <h2 className="text-4xl font-semibold text-white sm:text-5xl">I'm always interested in new opportunities and exciting projects.</h2>
          <p className="max-w-2xl text-base leading-8 text-slate-300">
            I’m available for remote and hybrid opportunities. Let’s build something meaningful together.
          </p>
          <div className="space-y-4 rounded-3xl border border-white/10 bg-slate-950/70 p-8 shadow-glow">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-brand-300">Email</p>
              <p className="mt-2 text-lg font-medium text-white">{siteConfig.email}</p>
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-brand-300">Phone</p>
              <p className="mt-2 text-lg font-medium text-white">{siteConfig.phone}</p>
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-brand-300">Location</p>
              <p className="mt-2 text-lg font-medium text-white">{siteConfig.location}</p>
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-8 shadow-glow">
          <form onSubmit={handleSubmit} className="space-y-6">
            {success && (
              <div className="rounded-lg bg-green-500/10 p-4 text-green-400 border border-green-500/30">
                Message sent successfully! Thank you for reaching out.
              </div>
            )}
            {error && (
              <div className="rounded-lg bg-red-500/10 p-4 text-red-400 border border-red-500/30">
                {error}
              </div>
            )}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-200">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full rounded-3xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-200">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full rounded-3xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-200">Subject</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full rounded-3xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-200">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                className="w-full rounded-3xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20"
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Sending...' : 'Send Message'}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
