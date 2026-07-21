'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useAuth } from '@/shared/context/AuthContext';

const AUTH_KEY = 'portfolio-admin-auth';
const TOKEN_KEY = 'portfolio-admin-token';
const API_URL = 'https://portfolio-6i9r.onrender.com';

export default function AdminLoginPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, setAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace('/admin/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }

    setError('');
    setIsSigningIn(true);

    try {
      const response = await axios.post(`${API_URL}/api/auth/login`.replace(/\/?$/, ''), { email, password });
      if (response.status >= 200 && response.status < 300) {
        const token = response.data?.accessToken || response.data?.access_token || response.data?.token || '';
        const normalizedToken = typeof token === 'string' ? token : '';
        window.localStorage.setItem(AUTH_KEY, 'true');
        if (normalizedToken) {
          window.localStorage.setItem(TOKEN_KEY, normalizedToken);
          window.localStorage.setItem('admin-token', normalizedToken);
        }
        setAuthenticated(true);
        router.replace('/admin/dashboard');
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const message = err.response?.data?.error || err.message;
        setError(message || 'Unable to sign in to the admin account right now.');
      } else {
        setError('Unable to sign in to the admin account right now.');
      }
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <main className="mx-auto flex min-h-screen max-w-[420px] items-center px-4 py-24 sm:px-6 lg:px-8">
        <div className="w-full rounded-[2rem] border border-white/10 bg-slate-900/70 p-10 shadow-glow">
          <h1 className="text-3xl font-semibold text-white">Admin Login</h1>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-200">Email</label>
              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                type="email"
                className="w-full rounded-3xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-200">Password</label>
              <input
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                type="password"
                className="w-full rounded-3xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20"
              />
            </div>
            {error ? <p className="text-sm text-red-400">{error}</p> : null}
            <button
              type="submit"
              disabled={isSigningIn}
              className="w-full rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-400 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSigningIn ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
