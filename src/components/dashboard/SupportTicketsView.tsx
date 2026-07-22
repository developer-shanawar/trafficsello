import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Ticket, Plus, Send, MessageSquare, Clock, CheckCircle2, ShieldAlert, User, X } from 'lucide-react';
import { useStore } from '../../lib/store';
import { SupportTicket } from '../../types';

export const SupportTicketsView: React.FC = () => {
  const { user, supportTickets, createTicket, addTicketMessage } = useStore();
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState<SupportTicket['category']>('Campaign Delivery');
  const [priority, setPriority] = useState<SupportTicket['priority']>('medium');
  const [message, setMessage] = useState('');
  const [replyText, setReplyText] = useState('');

  const userTickets = supportTickets.filter(t => t.userId === user?.id || user?.role === 'admin');
  const activeTicket = userTickets.find(t => t.id === selectedTicketId) || userTickets[0] || null;

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !message) return;

    createTicket({ subject, category, priority, message });
    setSubject('');
    setMessage('');
    setShowCreateModal(false);
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText || !activeTicket) return;

    addTicketMessage(activeTicket.id, replyText);
    setReplyText('');
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">24/7 Dedicated Support Center</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Submit campaign inquiries, wallet verification questions, or custom CPM volume requests.
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="py-2.5 px-4 bg-[#DFFF2F] hover:bg-[#cbe820] text-slate-950 font-extrabold rounded-2xl text-xs shadow flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" /> Open Support Ticket
        </button>
      </div>

      {/* Ticket Interface Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[500px]">
        
        {/* Left Ticket List Sidebar */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 shadow-sm space-y-2 overflow-y-auto max-h-[600px]">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 p-2">Your Tickets ({userTickets.length})</h3>
          {userTickets.length === 0 ? (
            <p className="text-center text-xs text-slate-400 py-8">No open support tickets.</p>
          ) : (
            userTickets.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedTicketId(t.id)}
                className={`w-full p-3.5 rounded-2xl text-left border transition-all cursor-pointer ${
                  activeTicket?.id === t.id
                    ? 'bg-slate-900 text-white dark:bg-slate-800 border-slate-900 dark:border-[#DFFF2F] shadow-md'
                    : 'bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-100 dark:border-slate-800 hover:border-[#DFFF2F]/50'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                    t.status === 'open' ? 'bg-amber-500/20 text-amber-400' :
                    t.status === 'in_progress' ? 'bg-emerald-500/20 text-emerald-400' :
                    'bg-blue-500/20 text-blue-400'
                  }`}>
                    {t.status.replace('_', ' ')}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">{t.category}</span>
                </div>
                <h4 className="text-xs font-bold truncate mt-1">{t.subject}</h4>
                <p className="text-[10px] text-slate-400 mt-1">{t.messages.length} messages • {new Date(t.createdAt).toLocaleDateString()}</p>
              </button>
            ))
          )}
        </div>

        {/* Right Active Ticket Messages Thread */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          {activeTicket ? (
            <>
              {/* Ticket Header */}
              <div className="pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-[#DFFF2F] font-bold font-mono">ID: {activeTicket.id}</span>
                  <span className="text-xs text-slate-400 font-medium">Priority: <strong className="uppercase text-white">{activeTicket.priority}</strong></span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{activeTicket.subject}</h3>
                <p className="text-xs text-slate-400 mt-0.5">Submitted by {activeTicket.userName} ({activeTicket.userEmail})</p>
              </div>

              {/* Messages Feed */}
              <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2 mb-4 flex-1">
                {activeTicket.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-4 rounded-2xl max-w-lg text-xs space-y-1 ${
                      msg.sender === 'admin'
                        ? 'bg-amber-500/10 border border-amber-500/20 text-amber-100 ml-auto'
                        : 'bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 mr-auto'
                    }`}
                  >
                    <div className="flex justify-between items-center font-bold text-[11px]">
                      <span className="flex items-center gap-1">
                        {msg.sender === 'admin' ? <ShieldAlert className="w-3.5 h-3.5 text-amber-400" /> : <User className="w-3.5 h-3.5 text-[#DFFF2F]" />}
                        {msg.senderName}
                      </span>
                      <span className="text-[9px] text-slate-400 font-mono">{new Date(msg.createdAt).toLocaleTimeString()}</span>
                    </div>
                    <p className="text-xs leading-relaxed">{msg.text}</p>
                  </div>
                ))}
              </div>

              {/* Reply Input */}
              <form onSubmit={handleSendReply} className="pt-4 border-t border-slate-100 dark:border-slate-800 flex gap-2">
                <input
                  type="text"
                  required
                  placeholder="Write a message reply..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#DFFF2F]"
                />
                <button
                  type="submit"
                  className="py-3 px-5 bg-[#DFFF2F] hover:bg-[#cbe820] text-slate-950 font-black rounded-2xl text-xs transition-all shadow flex items-center gap-1.5 cursor-pointer"
                >
                  Send <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-20 text-slate-400">
              <Ticket className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Select a ticket to view conversation or open a new support request.</p>
            </div>
          )}
        </div>
      </div>

      {/* Create Ticket Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl text-white relative">
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute right-5 top-5 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-xl font-bold mb-4">Open New Support Ticket</h3>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Subject</label>
                <input
                  type="text"
                  required
                  placeholder="Brief summary of your question"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-[#DFFF2F]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-[#DFFF2F]"
                  >
                    <option value="Campaign Delivery">Campaign Delivery</option>
                    <option value="Billing & Wallet">Billing & Wallet</option>
                    <option value="Technical Issue">Technical Issue</option>
                    <option value="General Inquiry">General Inquiry</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-[#DFFF2F]"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High / Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Detailed Description</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Provide details or questions..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-[#DFFF2F]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#DFFF2F] hover:bg-[#cbe820] text-slate-950 font-bold rounded-xl text-xs transition-colors"
              >
                Submit Ticket
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
