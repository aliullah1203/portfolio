'use client';

import { useState } from 'react';
import { Button } from '@/shared/ui/button';
import { siteConfig } from '@/shared/constants/site';
import { Mail, Phone, MapPin } from 'lucide-react';

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
      const response = await fetch('https://portfolio-6i9r.onrender.com' + '/api/contact', {
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
          <p className="text-sm font-semibold text-accent-400 uppercase tracking-wide">Get in Touch</p>
          <h2 className="text-4xl font-bold text-white sm:text-5xl">Let's build something together</h2>
          <p className="max-w-2xl text-base leading-relaxed text-neutral-400">
            I'm available for remote and hybrid opportunities. Share your project requirements and I'll get back to you promptly.
          </p>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <Mail size={20} className="text-accent-500 flex-shrink-0 mt-1" />
              <div>
                <p className="text-sm font-semibold text-neutral-400">Email</p>
                <p className="mt-1 text-white font-medium">{siteConfig.email}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Phone size={20} className="text-accent-500 flex-shrink-0 mt-1" />
              <div>
                <p className="text-sm font-semibold text-neutral-400">Phone</p>
                <p className="mt-1 text-white font-medium">{siteConfig.phone}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <MapPin size={20} className="text-accent-500 flex-shrink-0 mt-1" />
              <div>
                <p className="text-sm font-semibold text-neutral-400">Location</p>
                <p className="mt-1 text-white font-medium">{siteConfig.location}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-neutral-800 bg-neutral-900/40 p-7">
          <form onSubmit={handleSubmit} className="space-y-5">
            {success && (
              <div className="rounded-md bg-accent-500/10 p-3 text-sm text-accent-400 border border-accent-500/20">
                Message sent successfully! Thank you for reaching out.
              </div>
            )}
            {error && (
              <div className="rounded-md bg-red-500/10 p-3 text-sm text-red-400 border border-red-500/20">
                {error}
              </div>
            )}
            <div>
              <label className="mb-2 block text-sm font-medium text-neutral-300">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-neutral-700 bg-neutral-900/50 px-4 py-2.5 text-sm text-neutral-100 outline-none transition focus:border-accent-500 focus:ring-1 focus:ring-accent-500/20 placeholder-neutral-500"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-neutral-300">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-neutral-700 bg-neutral-900/50 px-4 py-2.5 text-sm text-neutral-100 outline-none transition focus:border-accent-500 focus:ring-1 focus:ring-accent-500/20 placeholder-neutral-500"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-neutral-300">Subject</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-neutral-700 bg-neutral-900/50 px-4 py-2.5 text-sm text-neutral-100 outline-none transition focus:border-accent-500 focus:ring-1 focus:ring-accent-500/20 placeholder-neutral-500"
                placeholder="Subject"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-neutral-300">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={4}
                className="w-full rounded-md border border-neutral-700 bg-neutral-900/50 px-4 py-2.5 text-sm text-neutral-100 outline-none transition focus:border-accent-500 focus:ring-1 focus:ring-accent-500/20 resize-none placeholder-neutral-500"
                placeholder="Your message..."
              />
            </div>
            <Button type="submit" size="lg" disabled={loading} className="w-full">
              {loading ? 'Sending...' : 'Send Message'}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
