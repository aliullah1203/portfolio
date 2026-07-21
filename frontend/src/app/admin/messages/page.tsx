'use client';

import { useAuth } from '@/shared/context/AuthContext';
import { useState, useEffect } from 'react';

interface Message {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  created?: string;
  createdAt?: string;
  read?: boolean;
}

export default function AdminMessagesPage() {
  const { isAuthenticated } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchMessages();
  }, [isAuthenticated]);

  const fetchMessages = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
      const token = typeof window !== 'undefined'
        ? window.localStorage.getItem('portfolio-admin-token') || window.localStorage.getItem('admin-token')
        : null;
      const response = await fetch(`${API_URL}/api/admin/messages`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
      const data = await response.json();
      setMessages(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
      const token = typeof window !== 'undefined'
        ? window.localStorage.getItem('portfolio-admin-token') || window.localStorage.getItem('admin-token')
        : null;
      const response = await fetch(`${API_URL}/api/admin/messages/${id}`, {
        method: 'DELETE',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (response.ok) {
        setMessages(messages.filter(m => (m._id || m.id) !== id));
        setSelectedMessage(null);
      }
    } catch (error) {
      console.error('Failed to delete message:', error);
      alert('Failed to delete message');
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-semibold text-white">Messages</h1>
        <p className="mt-2 text-slate-400">View and manage contact form submissions</p>
      </div>

      {/* Messages Container */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Messages List */}
        <div className="lg:col-span-1">
          <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 overflow-hidden">
            <div className="max-h-[600px] overflow-y-auto">
              {loading ? (
                <div className="flex justify-center py-8 px-6">
                  <p className="text-slate-400">Loading...</p>
                </div>
              ) : messages.length === 0 ? (
                <div className="px-6 py-8 text-center">
                  <p className="text-slate-400">No messages yet</p>
                </div>
              ) : (
                <div className="divide-y divide-white/5">
                  {messages.map((msg) => (
                    <button
                      key={msg._id || msg.id}
                      onClick={() => setSelectedMessage(msg)}
                      className={`w-full px-6 py-4 text-left hover:bg-slate-800/30 transition-colors ${
                        selectedMessage?._id === msg._id || selectedMessage?.id === msg.id
                          ? 'bg-slate-800/50 border-l-2 border-blue-500'
                          : ''
                      }`}
                    >
                      <p className="font-medium text-white truncate">{msg.name}</p>
                      <p className="text-sm text-slate-400 truncate">{msg.email}</p>
                      <p className="text-xs text-slate-500 mt-1">
                        {msg.created || msg.createdAt ? new Date(msg.created || msg.createdAt || '').toLocaleDateString() : 'N/A'}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Message Detail */}
        <div className="lg:col-span-2">
          {selectedMessage ? (
            <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-8">
              <div className="mb-6 flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-white">{selectedMessage.name}</h2>
                  <p className="mt-1 text-slate-400">{selectedMessage.email}</p>
                </div>
                <button
                  onClick={() => handleDelete(selectedMessage._id || selectedMessage.id || '')}
                  className="rounded bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>

              <div className="border-t border-white/10 pt-6">
                <h3 className="font-semibold text-white">Subject</h3>
                <p className="mt-2 text-slate-300">{selectedMessage.subject}</p>
              </div>

              <div className="border-t border-white/10 pt-6 mt-6">
                <h3 className="font-semibold text-white">Message</h3>
                <p className="mt-4 whitespace-pre-wrap text-slate-300">{selectedMessage.message}</p>
              </div>

              <div className="border-t border-white/10 pt-6 mt-6">
                <p className="text-xs text-slate-500">
                  Received: {selectedMessage.created || selectedMessage.createdAt ? new Date(selectedMessage.created || selectedMessage.createdAt || '').toLocaleString() : 'N/A'}
                </p>
              </div>
            </div>
          ) : (
            <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-12 text-center">
              <p className="text-slate-400">Select a message to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
