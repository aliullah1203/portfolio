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
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [archivedIds, setArchivedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchMessages();
  }, [isAuthenticated]);

  const fetchMessages = async () => {
    try {
      const API_URL = 'https://portfolio-6i9r.onrender.com';
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
    try {
      const API_URL = 'https://portfolio-6i9r.onrender.com';
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
        setDeleteConfirm(null);
      }
    } catch (error) {
      console.error('Failed to delete message:', error);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  const filteredMessages = messages.filter(msg =>
    msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatTimeAgo = (dateString: string | undefined) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="p-6 md:p-8 lg:p-10 h-full flex flex-col">
      {/* Header with Stats */}
      <div className="mb-8">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-white">Messages</h1>
            <p className="mt-1 text-sm text-slate-400">Contact form submissions and inquiries</p>
          </div>
          <div className="flex gap-2">
            <div className="px-4 py-2 rounded-md bg-slate-800/50 border border-white/10">
              <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Total</p>
              <p className="text-lg font-bold text-white mt-1">{messages.length}</p>
            </div>
            <div className="px-4 py-2 rounded-md bg-blue-600/10 border border-blue-500/30">
              <p className="text-xs text-blue-300 uppercase tracking-wider font-semibold">Unread</p>
              <p className="text-lg font-bold text-blue-300 mt-1">{messages.filter(m => !m.read).length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 flex gap-3">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-3 h-4 w-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search by name, email, or subject..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-md border border-white/10 bg-slate-900/50 text-white placeholder-slate-500 text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
          />
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 grid gap-6 lg:grid-cols-3 min-h-0">
        {/* Messages List */}
        <div className="lg:col-span-1 flex flex-col">
          <div className="border border-white/10 rounded-lg bg-slate-900/30 overflow-hidden flex flex-col flex-1 flex-shrink-0">
            {loading ? (
              <div className="flex justify-center items-center py-12 px-6">
                <div className="text-center">
                  <div className="inline-flex h-8 w-8 animate-spin rounded-full border-2 border-slate-600 border-r-blue-500 mb-3" />
                  <p className="text-slate-400 text-sm font-medium">Loading messages...</p>
                </div>
              </div>
            ) : filteredMessages.length === 0 ? (
              <div className="flex justify-center items-center py-16 px-6">
                <div className="text-center">
                  <div className="text-4xl mb-3 opacity-60">📭</div>
                  <p className="text-slate-400 text-sm font-medium">{searchTerm ? 'No messages found' : 'No messages'}</p>
                  <p className="text-xs text-slate-500 mt-2">
                    {searchTerm ? 'Try adjusting your search' : 'New submissions will appear here'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="overflow-y-auto flex-1">
                <div className="divide-y divide-white/5">
                  {filteredMessages.map((msg) => {
                    const msgId = msg._id || msg.id;
                    const isSelected = selectedMessage?._id === msg._id || selectedMessage?.id === msg.id;
                    const isArchived = archivedIds.has(msgId || '');
                    
                    if (isArchived) return null;
                    
                    return (
                      <button
                        key={msgId}
                        onClick={() => setSelectedMessage(msg)}
                        className={`w-full px-4 py-4 text-left hover:bg-slate-800/30 transition-all duration-200 border-l-2 group ${
                          isSelected
                            ? 'bg-slate-800/50 border-l-blue-500'
                            : 'border-l-transparent hover:border-l-slate-600'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className={`font-semibold truncate text-sm ${msg.read ? 'text-slate-300' : 'text-white'}`}>
                                {msg.name}
                              </p>
                              {!msg.read && (
                                <div className="flex-shrink-0 h-2 w-2 rounded-full bg-blue-500" />
                              )}
                            </div>
                            <p className="text-xs text-slate-500 truncate mt-1">{msg.email}</p>
                            <p className="text-xs text-slate-600 truncate mt-2 line-clamp-1">{msg.subject}</p>
                          </div>
                          <div className="flex-shrink-0 text-right">
                            <p className="text-xs text-slate-500 whitespace-nowrap">
                              {formatTimeAgo(msg.created || msg.createdAt)}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Message Detail Panel */}
        <div className="lg:col-span-2 flex flex-col min-h-0">
          {selectedMessage ? (
            <div className="border border-white/10 rounded-lg bg-slate-900/30 overflow-hidden flex flex-col flex-shrink-0 h-full">
              {/* Detail Header with Actions */}
              <div className="border-b border-white/10 px-6 py-5 bg-slate-900/50">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1 min-w-0">
                    <h2 className="text-lg font-semibold text-white truncate">{selectedMessage.name}</h2>
                    <p className="mt-1 text-sm text-slate-400 truncate">{selectedMessage.email}</p>
                  </div>
                  <div className="flex-shrink-0 flex gap-2">
                    {!selectedMessage.read && (
                      <span className="px-2.5 py-1 rounded-full bg-blue-600/20 border border-blue-500/30 text-xs font-medium text-blue-300">
                        Unread
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-xs text-slate-500">
                  Received {formatDate(selectedMessage.created || selectedMessage.createdAt)}
                </p>
              </div>

              {/* Delete Confirmation Inline */}
              {deleteConfirm === (selectedMessage._id || selectedMessage.id) && (
                <div className="border-b border-white/10 px-6 py-4 bg-red-500/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <svg className="h-5 w-5 text-red-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <p className="text-sm text-red-300 font-medium">Permanently delete this message?</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setDeleteConfirm(null)}
                      className="px-3 py-1.5 text-xs font-medium border border-white/20 rounded-md text-slate-300 hover:bg-slate-800/30 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleDelete(selectedMessage._id || selectedMessage.id || '')}
                      className="px-3 py-1.5 text-xs font-medium bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}

              {/* Detail Content */}
              <div className="overflow-y-auto flex-1 px-6 py-6 space-y-6">
                {/* Subject */}
                <div>
                  <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-widest mb-3">Subject</h3>
                  <p className="text-sm text-white font-medium">{selectedMessage.subject}</p>
                </div>

                {/* Message Body */}
                <div className="border-t border-white/10 pt-6">
                  <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-widest mb-4">Message</h3>
                  <div className="bg-slate-950/40 rounded-md border border-white/5 p-4">
                    <p className="whitespace-pre-wrap text-sm text-slate-300 leading-relaxed font-light">
                      {selectedMessage.message}
                    </p>
                  </div>
                </div>

                {/* Sender Information */}
                <div className="border-t border-white/10 pt-6">
                  <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-widest mb-4">Sender Information</h3>
                  <div className="space-y-3 bg-slate-950/20 rounded-md border border-white/5 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Name</span>
                      <span className="text-sm text-white font-medium">{selectedMessage.name}</span>
                    </div>
                    <div className="border-t border-white/10" />
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Email</span>
                      <a
                        href={`mailto:${selectedMessage.email}`}
                        className="text-sm text-blue-400 hover:text-blue-300 font-medium truncate"
                      >
                        {selectedMessage.email}
                      </a>
                    </div>
                    <div className="border-t border-white/10" />
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Received</span>
                      <span className="text-sm text-slate-300">
                        {formatDate(selectedMessage.created || selectedMessage.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Footer */}
              <div className="border-t border-white/10 px-6 py-4 flex gap-3 bg-slate-900/50">
                {deleteConfirm !== (selectedMessage._id || selectedMessage.id) ? (
                  <>
                    <button
                      onClick={() => setDeleteConfirm(selectedMessage._id || selectedMessage.id || '')}
                      className="flex-1 px-4 py-2.5 rounded-md bg-red-600/10 text-red-300 text-sm font-medium hover:bg-red-600/20 border border-red-500/20 transition-all duration-200"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => setSelectedMessage(null)}
                      className="flex-1 px-4 py-2.5 rounded-md border border-white/10 text-slate-300 text-sm font-medium hover:bg-slate-800/30 transition-all duration-200"
                    >
                      Close
                    </button>
                  </>
                ) : null}
              </div>
            </div>
          ) : (
            <div className="border border-white/10 rounded-lg bg-slate-900/30 flex items-center justify-center flex-shrink-0">
              <div className="text-center py-20 px-6">
                <div className="text-5xl mb-4 opacity-50">💬</div>
                <p className="text-slate-400 font-semibold text-base">No message selected</p>
                <p className="text-xs text-slate-500 mt-3">Select a message from the list to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
