'use client';

import { useAuth } from '@/shared/context/AuthContext';
import { useState } from 'react';

export default function AdminProfilePage() {
  const { isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    fullName: 'Ali Ullah',
    email: 'ali@example.com',
    title: 'Junior Software Engineer',
    bio: 'A passionate software engineer specializing in Go, TypeScript, and modern web technologies.',
    location: 'Your Location',
    phone: '+1 (555) 000-0000',
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      // Simulating profile update - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-semibold text-white">Profile Settings</h1>
        <p className="mt-2 text-slate-400">Update your personal information</p>
      </div>

      <div className="max-w-2xl">
        {/* Profile Form */}
        <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-10">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold text-slate-200">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="mt-2 w-full rounded-lg border border-white/10 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-slate-200">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-2 w-full rounded-lg border border-white/10 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-slate-200">Professional Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Senior Software Engineer"
                className="mt-2 w-full rounded-lg border border-white/10 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-semibold text-slate-200">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., San Francisco, CA"
                className="mt-2 w-full rounded-lg border border-white/10 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-slate-200">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="mt-2 w-full rounded-lg border border-white/10 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-semibold text-slate-200">Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={5}
                placeholder="Tell us about yourself..."
                className="mt-2 w-full rounded-lg border border-white/10 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            {/* Message */}
            {message && (
              <div className={`rounded-lg p-4 ${message.includes('successfully') ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                {message}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>

        {/* Password Change Section */}
        <div className="mt-8 rounded-[2rem] border border-white/10 bg-slate-900/70 p-10">
          <h2 className="text-xl font-semibold text-white mb-6">Change Password</h2>
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-200">Current Password</label>
              <input
                type="password"
                className="mt-2 w-full rounded-lg border border-white/10 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-200">New Password</label>
              <input
                type="password"
                className="mt-2 w-full rounded-lg border border-white/10 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-200">Confirm Password</label>
              <input
                type="password"
                className="mt-2 w-full rounded-lg border border-white/10 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-slate-700 px-6 py-3 font-medium text-white hover:bg-slate-600 transition-colors"
            >
              Update Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
