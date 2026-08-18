'use client';

import { useAuth } from '@/shared/context/AuthContext';
import { useState } from 'react';

export default function AdminProfilePage() {
  const { isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    fullName: 'Ali Ullah',
    email: 'ali@example.com',
    title: 'Software Engineer',
    bio: 'A software engineer focused on building reliable backend systems, modern web apps, and scalable product experiences with Go, TypeScript, and cloud-native technologies.',
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
    <div className="p-6 md:p-8 lg:p-10 h-full flex flex-col">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-white">Profile Settings</h1>
            <p className="mt-1 text-sm text-slate-400">Manage your account and personal information</p>
          </div>
          <div className="flex gap-3">
            <div className="px-4 py-2 rounded-md bg-slate-800/50 border border-white/10">
              <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Account Status</p>
              <p className="text-sm font-semibold text-emerald-300 mt-1">Active</p>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Form Container */}
      <div className="max-w-3xl flex-1 flex flex-col">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Information Section */}
          <div className="border border-white/10 rounded-lg bg-slate-900/30 p-6">
            <div className="mb-6 pb-4 border-b border-white/10">
              <h2 className="text-sm font-semibold text-white uppercase tracking-wider">Personal Information</h2>
              <p className="text-xs text-slate-400 mt-1">Your basic profile details</p>
            </div>

            <div className="space-y-5">
              {/* Full Name and Email Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full rounded-md border border-white/10 bg-slate-950/30 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full rounded-md border border-white/10 bg-slate-950/30 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                  />
                </div>
              </div>

              {/* Phone and Location Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2.5">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full rounded-md border border-white/10 bg-slate-950/30 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2.5">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g., San Francisco, CA"
                    className="w-full rounded-md border border-white/10 bg-slate-950/30 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Professional Information Section */}
          <div className="border border-white/10 rounded-lg bg-slate-900/30 p-6">
            <div className="mb-6 pb-4 border-b border-white/10">
              <h2 className="text-sm font-semibold text-white uppercase tracking-wider">Professional Information</h2>
              <p className="text-xs text-slate-400 mt-1">Your career and professional details</p>
            </div>

            <div className="space-y-5">
              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2.5">
                  Professional Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Senior Software Engineer"
                  className="w-full rounded-md border border-white/10 bg-slate-950/30 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                />
              </div>

              {/* Bio */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2.5">
                  Professional Bio
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Tell us about yourself, your expertise, and what you're passionate about..."
                  className="w-full rounded-md border border-white/10 bg-slate-950/30 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 resize-none"
                />
                <p className="text-xs text-slate-500 mt-2">{formData.bio.length} / 500 characters</p>
              </div>
            </div>
          </div>

          {/* Success/Error Message */}
          {message && (
            <div
              className={`rounded-lg border p-4 transition-all duration-300 ${
                message.includes('successfully')
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : 'bg-red-500/10 border-red-500/30 text-red-300'
              }`}
            >
              <div className="flex items-center gap-3">
                {message.includes('successfully') ? (
                  <svg className="h-5 w-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                )}
                <p className="text-sm font-medium">{message}</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-6 border-t border-white/10">
            <button
              type="button"
              className="px-4 py-2.5 rounded-md border border-white/10 text-slate-300 text-sm font-medium hover:bg-slate-800/30 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center px-6 py-2.5 rounded-md bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {saving ? (
                <>
                  <svg className="h-4 w-4 animate-spin mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity="0.25" />
                    <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" opacity="0.75" />
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
