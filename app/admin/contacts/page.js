'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaEnvelope, FaSearch, FaTrash, FaCheckCircle } from 'react-icons/fa';
import LoadingSpinner from '@/components/LoadingSpinner';
import Modal from '@/components/Modal';
import Button from '@/components/Button';
import toast from 'react-hot-toast';

export default function AdminContactsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewModal, setViewModal] = useState({ show: false, message: null });

  useEffect(() => {
    if (status === 'unauthenticated' || (session && session.user.role !== 'admin')) {
      router.push('/admin/login');
    } else if (session) {
      fetchMessages();
    }
  }, [status, session]);

  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/contact');
      const data = await response.json();
      console.log('Contact messages data:', data); // Debug log
      if (data.success) {
        setMessages(data.data || []); // Fixed: API returns data.data, not data.messages
      } else {
        toast.error(data.error || 'Failed to load messages');
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const deleteMessage = async (id) => {
    try {
      const response = await fetch(`/api/contact/${id}`, { method: 'DELETE' });
      const data = await response.json();
      if (data.success) {
        toast.success('Message deleted');
        setMessages(messages.filter(m => m._id !== id));
        setViewModal({ show: false, message: null });
      }
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const filteredMessages = Array.isArray(messages) ? messages.filter(msg =>
    msg.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.message?.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  if (status === 'loading' || loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-8">
      <div className="container">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Contact Messages</h1>
          <p className="text-gray-600">View customer inquiries and messages</p>
          <div className="mt-6">
            <input type="text" placeholder="Search messages..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="input-field" />
          </div>
        </motion.div>

        <div className="grid gap-4">
          {filteredMessages.map((msg, i) => (
            <motion.div key={msg._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => setViewModal({ show: true, message: msg })}>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <FaEnvelope className="text-primary-600" />
                    <h3 className="font-semibold text-gray-900">{msg.name}</h3>
                    <span className="text-sm text-gray-500">{msg.email}</span>
                  </div>
                  <p className="text-gray-600 line-clamp-2">{msg.message}</p>
                  <p className="text-xs text-gray-400 mt-2">{new Date(msg.createdAt).toLocaleString()}</p>
                </div>
                {msg.status === 'new' && (
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">New</span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <Modal isOpen={viewModal.show} onClose={() => setViewModal({ show: false, message: null })} title="Message Details">
        {viewModal.message && (
          <div className="space-y-4">
            <div><strong>From:</strong> {viewModal.message.name} ({viewModal.message.email})</div>
            <div><strong>Phone:</strong> {viewModal.message.phone}</div>
            <div><strong>Date:</strong> {new Date(viewModal.message.createdAt).toLocaleString()}</div>
            <div><strong>Message:</strong><p className="mt-2 text-gray-600">{viewModal.message.message}</p></div>
            <div className="flex gap-4"><Button variant="danger" onClick={() => deleteMessage(viewModal.message._id)}><FaTrash className="mr-2" /> Delete</Button></div>
          </div>
        )}
      </Modal>
    </div>
  );
}
