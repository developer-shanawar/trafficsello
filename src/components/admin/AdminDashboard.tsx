import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldAlert, CheckCircle2, XCircle, Eye, Wallet, DollarSign,
  Users, Layers, Settings, Megaphone, Edit, Save, AlertTriangle, Image as ImageIcon,
  Bell, Plus, Trash2, Star, MessageSquare, Clock, ExternalLink, FileText, Send, Phone, Mail,
  Check, RefreshCw, Sliders, Download, Search, Ticket, UserX, UserCheck, FileSpreadsheet
} from 'lucide-react';
import { useStore } from '../../lib/store';
import { PaymentDeposit, PlatformSettings, Testimonial, EditablePageContent, SupportTicket } from '../../types';
import { exportToCSV, exportToExcel, exportToJSON, exportToPDF } from '../../lib/exportUtils';

export const AdminDashboard: React.FC = () => {
  const {
    walletDeposits, approveDeposit, rejectDeposit, campaigns, updateCampaignStatus,
    allUsers, updateUserBalanceByAdmin, toggleUserSuspension, platformSettings, updatePlatformSettings, resetToInitialData,
    testimonials, addTestimonial, updateTestimonial, deleteTestimonial, getUserStats, currentUser,
    supportTickets, createTicketForUser, addTicketMessage, updateTicketStatus
  } = useStore();

  const [activeTab, setActiveTab] = useState<'deposits' | 'campaigns' | 'users' | 'tickets' | 'pages' | 'testimonials' | 'settings'>('deposits');
  const [selectedReceiptUrl, setSelectedReceiptUrl] = useState<string | null>(null);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [newBalanceInput, setNewBalanceInput] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [campaignFilter, setCampaignFilter] = useState<'all' | 'pending' | 'running' | 'paused' | 'completed'>('all');

  // Ticket creation modal state
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [ticketTargetUserId, setTicketTargetUserId] = useState<string>('');
  const [ticketSubject, setTicketSubject] = useState<string>('');
  const [ticketCategory, setTicketCategory] = useState<SupportTicket['category']>('general');
  const [ticketPriority, setTicketPriority] = useState<SupportTicket['priority']>('medium');
  const [ticketMessage, setTicketMessage] = useState<string>('');
  const [activeTicketReplyId, setActiveTicketReplyId] = useState<string | null>(null);
  const [ticketReplyText, setTicketReplyText] = useState<string>('');

  // Settings & Page Content state
  const [settingsForm, setSettingsForm] = useState<PlatformSettings>(platformSettings);
  const [pageContentForm, setPageContentForm] = useState<EditablePageContent>(
    platformSettings.pageContent || {
      privacyPolicy: '',
      termsOfService: '',
      refundPolicy: '',
      aboutUs: '',
      supportEmail: '',
      telegramContact: '',
      whatsAppContact: ''
    }
  );

  useEffect(() => {
    setSettingsForm(platformSettings);
    if (platformSettings.pageContent) {
      setPageContentForm(platformSettings.pageContent);
    }
  }, [platformSettings]);
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [pageContentSaved, setPageContentSaved] = useState(false);

  // Testimonial modal state
  const [isTestimonialModalOpen, setIsTestimonialModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [testimonialForm, setTestimonialForm] = useState<Omit<Testimonial, 'id'>>({
    name: '',
    role: '',
    company: '',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    content: '',
    rating: 5,
    active: true
  });

  const pendingDeposits = walletDeposits.filter(d => d.status === 'pending');
  const pendingCampaigns = campaigns.filter(c => c.status === 'pending');
  const totalVolumeApproved = walletDeposits.filter(d => d.status === 'approved').reduce((a, b) => a + b.amount, 0);

  // Combine alerts
  const allNotifications = [
    ...pendingDeposits.map(d => ({
      id: d.id,
      type: 'Deposit Request' as const,
      user: d.userName,
      email: d.userEmail,
      amount: `$${d.amount.toFixed(2)}`,
      method: d.method,
      time: d.createdAt,
      status: d.status,
      adminName: d.approvedBy || 'Pending Admin',
      tab: 'deposits' as const,
      details: `TRX: ${d.trxRef}`
    })),
    ...pendingCampaigns.map(c => ({
      id: c.id,
      type: 'Campaign Approval' as const,
      user: c.userName || 'Advertiser',
      email: c.userEmail || 'user@trafficsell.com',
      amount: `$${c.budget.toFixed(2)}`,
      method: c.format || 'SmartLink',
      time: c.createdAt,
      status: c.status,
      adminName: 'Pending Quality Review',
      tab: 'campaigns' as const,
      details: `Target: ${c.visitorsTarget.toLocaleString()} Hits to ${c.url}`
    }))
  ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

  const handleApprove = (id: string) => {
    approveDeposit(id, `Deposit verified & credited by Admin ${currentUser?.fullName || 'Admin'}.`);
  };

  const handleReject = (id: string) => {
    const reason = prompt('Enter rejection reason for user notification:', 'Invalid TRX reference or receipt');
    if (reason !== null) {
      rejectDeposit(id, reason);
    }
  };

  const handleSaveUserBalance = (userId: string) => {
    updateUserBalanceByAdmin(userId, newBalanceInput);
    setEditingUserId(null);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updatePlatformSettings({
      ...settingsForm,
      pageContent: pageContentForm
    });
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2500);
  };

  const handleSavePageContent = (e: React.FormEvent) => {
    e.preventDefault();
    updatePlatformSettings({
      ...platformSettings,
      pageContent: pageContentForm
    });
    setPageContentSaved(true);
    setTimeout(() => setPageContentSaved(false), 2500);
  };

  const handleTestimonialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTestimonial) {
      updateTestimonial(editingTestimonial.id, testimonialForm);
    } else {
      addTestimonial(testimonialForm);
    }
    setIsTestimonialModalOpen(false);
    setEditingTestimonial(null);
    setTestimonialForm({
      name: '',
      role: '',
      company: '',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      content: '',
      rating: 5,
      active: true
    });
  };

  return (
    <div className="space-y-8">
      
      {/* Admin Hero Header */}
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-amber-950 text-white rounded-3xl p-6 md:p-8 border border-amber-500/30 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative overflow-hidden">
        <div>
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
            <ShieldAlert className="w-4 h-4" /> Chief Operations & Compliance Center
          </span>
          <h2 className="text-2xl sm:text-3xl font-black">TrafficSell Admin Control</h2>
          <p className="text-xs text-amber-200/80 mt-1">
            Review live deposit alerts, inspect user hit metrics, manage policy content & testimonials.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 bg-slate-950/80 p-3.5 rounded-2xl border border-amber-500/20 text-xs">
          <div className="cursor-pointer" onClick={() => setActiveTab('alerts')}>
            <span className="text-slate-400 block">Pending Alerts:</span>
            <span className="font-extrabold text-amber-400 text-lg flex items-center gap-1">
              <Bell className="w-4 h-4 text-amber-400 animate-bounce" /> {allNotifications.length} Active
            </span>
          </div>
          <div className="h-8 w-px bg-slate-800" />
          <div>
            <span className="text-slate-400 block">Approved Volume:</span>
            <span className="font-extrabold text-[#DFFF2F] text-lg">${totalVolumeApproved.toFixed(2)}</span>
          </div>
          <div className="h-8 w-px bg-slate-800" />
          <button
            onClick={() => {
              if (confirm('Reset and reload initial user, deposit, and campaign data?')) {
                resetToInitialData();
              }
            }}
            className="py-1.5 px-3 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 font-bold rounded-xl border border-amber-500/30 transition-all cursor-pointer"
          >
            ⚡ Reload Initial Data
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-4 sm:gap-6 flex-wrap">
        <button
          onClick={() => setActiveTab('deposits')}
          className={`pb-3 text-sm font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
            activeTab === 'deposits'
              ? 'border-amber-400 text-amber-500 dark:text-amber-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Wallet className="w-4 h-4" />
          Deposits Queue ({pendingDeposits.length} Pending)
        </button>
        <button
          onClick={() => setActiveTab('campaigns')}
          className={`pb-3 text-sm font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
            activeTab === 'campaigns'
              ? 'border-amber-400 text-amber-500 dark:text-amber-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Layers className="w-4 h-4" />
          Campaigns ({pendingCampaigns.length} Pending)
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`pb-3 text-sm font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
            activeTab === 'users'
              ? 'border-amber-400 text-amber-500 dark:text-amber-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          User Accounts ({allUsers.length})
        </button>
        <button
          onClick={() => setActiveTab('tickets')}
          className={`pb-3 text-sm font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
            activeTab === 'tickets'
              ? 'border-amber-400 text-amber-500 dark:text-amber-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Ticket className="w-4 h-4" />
          Support Tickets ({supportTickets.length})
        </button>
        <button
          onClick={() => setActiveTab('pages')}
          className={`pb-3 text-sm font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
            activeTab === 'pages'
              ? 'border-amber-400 text-amber-500 dark:text-amber-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <FileText className="w-4 h-4" />
          Pages Content
        </button>
        <button
          onClick={() => setActiveTab('testimonials')}
          className={`pb-3 text-sm font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
            activeTab === 'testimonials'
              ? 'border-amber-400 text-amber-500 dark:text-amber-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Star className="w-4 h-4" />
          Testimonials ({testimonials.length})
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`pb-3 text-sm font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
            activeTab === 'settings'
              ? 'border-amber-400 text-amber-500 dark:text-amber-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Settings className="w-4 h-4" />
          Site Settings
        </button>
      </div>

      {/* Payment Deposits Management Tab */}
      {activeTab === 'deposits' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm overflow-x-auto">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Manual Payment Deposits Queue</h3>
                <p className="text-xs text-slate-400">Review deposit requests, verify TRX ref and payment screenshot, and credit user wallet.</p>
              </div>
            </div>

            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-mono text-[10px]">
                <tr>
                  <th className="pb-3">Deposit ID</th>
                  <th className="pb-3">User Details</th>
                  <th className="pb-3">Gateway</th>
                  <th className="pb-3">TRX Hash / Ref</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Submitted At</th>
                  <th className="pb-3">Proof Screenshot</th>
                  <th className="pb-3">Status / Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {walletDeposits.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-400">No deposit requests found in system.</td>
                  </tr>
                ) : (
                  walletDeposits.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-3.5 font-mono text-[11px] font-bold text-[#DFFF2F]">
                        {p.id}
                      </td>
                      <td className="py-3.5">
                        <p className="font-bold text-slate-900 dark:text-white">{p.userName}</p>
                        <p className="text-[10px] text-slate-400">{p.userEmail}</p>
                        <p className="text-[9px] font-mono text-slate-500">ID: {p.userId}</p>
                      </td>
                      <td className="py-3.5 font-bold text-amber-400">{p.method}</td>
                      <td className="py-3.5 font-mono text-slate-300 font-bold">{p.trxRef}</td>
                      <td className="py-3.5 font-bold text-base text-[#DFFF2F]">${p.amount.toFixed(2)}</td>
                      <td className="py-3.5 font-mono text-slate-400 text-[11px]">
                        {new Date(p.createdAt).toLocaleString()}
                      </td>
                      <td className="py-3.5">
                        {p.screenshotUrl ? (
                          <button
                            onClick={() => setSelectedReceiptUrl(p.screenshotUrl)}
                            className="py-1 px-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer border border-slate-700"
                          >
                            <ImageIcon className="w-3 h-3 text-[#DFFF2F]" /> View Image
                          </button>
                        ) : (
                          <span className="text-slate-500 italic">No proof image</span>
                        )}
                      </td>
                      <td className="py-3.5">
                        {p.status === 'pending' ? (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleApprove(p.id)}
                              className="py-1.5 px-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1 shadow cursor-pointer"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                            </button>
                            <button
                              onClick={() => handleReject(p.id)}
                              className="py-1.5 px-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-bold rounded-xl text-xs flex items-center gap-1 cursor-pointer"
                            >
                              <XCircle className="w-3.5 h-3.5" /> Decline
                            </button>
                          </div>
                        ) : (
                          <div>
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              p.status === 'approved' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                            }`}>
                              {p.status}
                            </span>
                            {p.adminNote && (
                              <p className="text-[10px] text-slate-400 italic mt-0.5 max-w-xs">{p.adminNote}</p>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Campaign Approvals & Management Tab */}
      {activeTab === 'campaigns' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm overflow-x-auto space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Ad Campaigns Directory</h3>
              <p className="text-xs text-slate-400">Review quality, manage statuses, pause/resume, or approve user ad campaigns.</p>
            </div>

            {/* Campaign Status Filter */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
              {(['all', 'pending', 'running', 'paused', 'completed'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setCampaignFilter(filter)}
                  className={`px-3 py-1 rounded-lg font-bold capitalize transition-all cursor-pointer ${
                    campaignFilter === filter
                      ? 'bg-[#DFFF2F] text-slate-950'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-mono text-[10px]">
              <tr>
                <th className="pb-3">Campaign ID & Name</th>
                <th className="pb-3">Target URL</th>
                <th className="pb-3">User / Advertiser</th>
                <th className="pb-3">Format & Geo</th>
                <th className="pb-3">Delivered / Target Hits</th>
                <th className="pb-3">Budget</th>
                <th className="pb-3">Created</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {campaigns
                .filter(c => campaignFilter === 'all' || c.status === campaignFilter)
                .length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400">No campaigns found for filter "{campaignFilter}".</td>
                </tr>
              ) : (
                campaigns
                  .filter(c => campaignFilter === 'all' || c.status === campaignFilter)
                  .map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-3.5">
                        <span className="font-mono text-[10px] text-amber-400 block">{c.id}</span>
                        <p className="font-extrabold text-slate-900 dark:text-white">{c.name}</p>
                      </td>
                      <td className="py-3.5">
                        <a href={c.url} target="_blank" rel="noreferrer" className="text-[11px] text-emerald-600 dark:text-[#DFFF2F] hover:underline font-mono truncate max-w-xs block">
                          {c.url}
                        </a>
                      </td>
                      <td className="py-3.5">
                        <p className="font-bold text-slate-900 dark:text-white">{c.userName || 'Advertiser'}</p>
                        <p className="text-[10px] text-slate-400">{c.userEmail || '-'}</p>
                      </td>
                      <td className="py-3.5">
                        <p className="font-bold uppercase text-slate-300">{c.format || 'SmartLink'}</p>
                        <p className="text-[10px] text-slate-400">{c.country}</p>
                      </td>
                      <td className="py-3.5 font-mono">
                        <span className="text-emerald-400 font-bold">{c.visitorsDelivered.toLocaleString()}</span> / {c.visitorsTarget.toLocaleString()} Hits
                      </td>
                      <td className="py-3.5 font-extrabold text-[#DFFF2F]">${c.budget.toFixed(2)}</td>
                      <td className="py-3.5 text-slate-400 font-mono text-[10px]">
                        {new Date(c.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3.5">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                          c.status === 'running' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                          c.status === 'pending' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                          c.status === 'paused' ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' :
                          'bg-slate-500/20 text-slate-400 border border-slate-500/30'
                        }`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="py-3.5">
                        <div className="flex items-center gap-1.5">
                          {c.status === 'pending' && (
                            <button
                              onClick={() => updateCampaignStatus(c.id, 'running')}
                              className="py-1 px-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-lg text-[11px] flex items-center gap-1 cursor-pointer"
                            >
                              <CheckCircle2 className="w-3 h-3" /> Approve
                            </button>
                          )}
                          {c.status === 'running' && (
                            <button
                              onClick={() => updateCampaignStatus(c.id, 'paused')}
                              className="py-1 px-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 font-bold rounded-lg text-[11px] cursor-pointer"
                            >
                              Pause
                            </button>
                          )}
                          {c.status === 'paused' && (
                            <button
                              onClick={() => updateCampaignStatus(c.id, 'running')}
                              className="py-1 px-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 font-bold rounded-lg text-[11px] cursor-pointer"
                            >
                              Resume
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* User Stats & Accounts Tab */}
      {activeTab === 'users' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">User Accounts & Performance Statistics</h3>
              <p className="text-xs text-slate-400">View user stats, generate tickets, suspend accounts, and export data in multiple formats.</p>
            </div>

            {/* Export buttons & search */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search user name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-white"
                />
              </div>

              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                <span className="text-[10px] text-slate-400 uppercase font-mono px-2 font-bold flex items-center gap-1">
                  <Download className="w-3 h-3 text-[#DFFF2F]" /> Export:
                </span>
                <button
                  onClick={() => {
                    const headers = ['User ID', 'Name', 'Email', 'Role', 'Balance ($)', 'Status', 'Joined Date'];
                    const rows = allUsers.map(u => [u.id, u.fullName, u.email, u.role, `$${u.walletBalance.toFixed(2)}`, u.isSuspended ? 'Suspended' : 'Active', new Date(u.createdAt).toLocaleDateString()]);
                    exportToPDF('TrafficSell Users Directory Report', headers, rows);
                  }}
                  className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[10px] font-bold cursor-pointer"
                >
                  PDF
                </button>
                <button
                  onClick={() => {
                    const headers = ['User ID', 'Name', 'Email', 'Role', 'Balance ($)', 'Status', 'Joined Date'];
                    const rows = allUsers.map(u => [u.id, u.fullName, u.email, u.role, `$${u.walletBalance.toFixed(2)}`, u.isSuspended ? 'Suspended' : 'Active', new Date(u.createdAt).toLocaleDateString()]);
                    exportToExcel('TrafficSell_Users_Report', headers, rows);
                  }}
                  className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded text-[10px] font-bold cursor-pointer"
                >
                  Excel
                </button>
                <button
                  onClick={() => {
                    const headers = ['User ID', 'Name', 'Email', 'Role', 'Balance ($)', 'Status', 'Joined Date'];
                    const rows = allUsers.map(u => [u.id, u.fullName, u.email, u.role, `$${u.walletBalance.toFixed(2)}`, u.isSuspended ? 'Suspended' : 'Active', new Date(u.createdAt).toLocaleDateString()]);
                    exportToCSV('TrafficSell_Users_Report', headers, rows);
                  }}
                  className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-[#DFFF2F] rounded text-[10px] font-bold cursor-pointer"
                >
                  CSV
                </button>
                <button
                  onClick={() => exportToJSON('TrafficSell_Users_Report', allUsers)}
                  className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded text-[10px] font-bold cursor-pointer"
                >
                  JSON
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-mono text-[10px]">
                <tr>
                  <th className="pb-3">User & Contact</th>
                  <th className="pb-3">IP Address</th>
                  <th className="pb-3">Role & Status</th>
                  <th className="pb-3">Today's Hits</th>
                  <th className="pb-3">Yesterday's Hits</th>
                  <th className="pb-3">Active Campaigns</th>
                  <th className="pb-3">Total Spent</th>
                  <th className="pb-3">Wallet Balance</th>
                  <th className="pb-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {allUsers
                  .filter(u => !searchQuery || u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase()) || (u.ipAddress && u.ipAddress.includes(searchQuery)))
                  .map((u) => {
                    const stats = getUserStats(u.id);
                    return (
                      <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="py-3.5 flex items-center gap-3">
                          <img src={u.avatar} alt={u.fullName} className="w-9 h-9 rounded-xl object-cover" />
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                              {u.fullName}
                              {u.isSuspended && (
                                <span className="px-1.5 py-0.2 bg-rose-500/20 text-rose-400 text-[9px] font-black uppercase rounded">
                                  Suspended
                                </span>
                              )}
                            </p>
                            <p className="text-[10px] text-slate-400">{u.email}</p>
                            {(u.telegram || u.whatsApp) && (
                              <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-400">
                                {u.telegram && <span>TG: {u.telegram}</span>}
                                {u.whatsApp && <span>WA: {u.whatsApp}</span>}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="py-3.5 font-mono text-slate-300">
                          <span className="font-bold text-emerald-400 block">{u.ipAddress || u.lastLoginIp || u.registrationIp || '198.51.100.42'}</span>
                          <span className="text-[9px] text-slate-500">Last login IP</span>
                        </td>
                        <td className="py-3.5 space-y-1">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase block w-fit ${
                            u.role === 'admin' ? 'bg-amber-500/20 text-amber-400' : 'bg-[#DFFF2F]/20 text-[#DFFF2F]'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="py-3.5 font-mono text-emerald-400 font-bold">
                          {stats.todayHits.toLocaleString()}
                        </td>
                        <td className="py-3.5 font-mono text-slate-400">
                          {stats.yesterdayHits.toLocaleString()}
                        </td>
                        <td className="py-3.5 font-bold text-slate-900 dark:text-white">
                          {stats.activeCampaigns}
                        </td>
                        <td className="py-3.5 font-extrabold text-amber-400">
                          ${stats.totalSpent.toFixed(2)}
                        </td>
                        <td className="py-3.5 font-bold text-sm text-[#DFFF2F]">
                          {editingUserId === u.id ? (
                            <div className="flex items-center gap-1">
                              <input
                                type="number"
                                value={newBalanceInput}
                                onChange={(e) => setNewBalanceInput(Number(e.target.value))}
                                className="w-24 px-2 py-1 bg-slate-950 border border-slate-700 rounded text-xs text-white"
                              />
                              <button
                                onClick={() => handleSaveUserBalance(u.id)}
                                className="p-1 bg-emerald-500 text-slate-950 rounded font-bold cursor-pointer"
                              >
                                Save
                              </button>
                            </div>
                          ) : (
                            <span>${u.walletBalance.toFixed(2)}</span>
                          )}
                        </td>
                        <td className="py-3.5">
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => { setEditingUserId(u.id); setNewBalanceInput(u.walletBalance); }}
                              className="py-1 px-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                              title="Edit Wallet Balance"
                            >
                              <Edit className="w-3 h-3 text-[#DFFF2F]" />
                            </button>

                            <button
                              onClick={() => {
                                setTicketTargetUserId(u.id);
                                setIsTicketModalOpen(true);
                              }}
                              className="py-1 px-2.5 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                              title="Generate Ticket for User"
                            >
                              <Ticket className="w-3 h-3 text-indigo-400" /> Ticket
                            </button>

                            <button
                              onClick={() => {
                                if (u.isSuspended) {
                                  toggleUserSuspension(u.id, false);
                                } else {
                                  const reason = prompt(`Enter suspension reason for ${u.fullName}:`, 'Violation of quality traffic policy');
                                  if (reason) {
                                    toggleUserSuspension(u.id, true, reason);
                                  }
                                }
                              }}
                              className={`py-1 px-2.5 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer ${
                                u.isSuspended
                                  ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                                  : 'bg-rose-500/20 text-rose-400 hover:bg-rose-500/30'
                              }`}
                              title={u.isSuspended ? 'Unsuspend User Account' : 'Suspend / Ban User'}
                            >
                              {u.isSuspended ? <UserCheck className="w-3 h-3" /> : <UserX className="w-3 h-3" />}
                              {u.isSuspended ? 'Unsuspend' : 'Suspend'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Support Tickets Tab */}
      {activeTab === 'tickets' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Ticket className="w-5 h-5 text-[#DFFF2F]" /> Support Tickets & Operations
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Manage user inquiries, issue tickets to users, and export ticket records.</p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setTicketTargetUserId(allUsers[0]?.id || '');
                  setTicketSubject('');
                  setTicketMessage('');
                  setIsTicketModalOpen(true);
                }}
                className="py-2 px-4 bg-[#DFFF2F] hover:bg-[#cbe820] text-slate-950 font-black rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow"
              >
                <Plus className="w-4 h-4" /> Generate New Ticket for User
              </button>

              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                <span className="text-[10px] text-slate-400 uppercase font-mono px-2 font-bold flex items-center gap-1">
                  <Download className="w-3 h-3 text-[#DFFF2F]" /> Export:
                </span>
                <button
                  onClick={() => {
                    const headers = ['Ticket ID', 'User Name', 'Email', 'Subject', 'Category', 'Priority', 'Status', 'Date'];
                    const rows = supportTickets.map(t => [t.id, t.userName, t.userEmail, t.subject, t.category, t.priority, t.status, new Date(t.createdAt).toLocaleDateString()]);
                    exportToPDF('TrafficSell Support Tickets Log', headers, rows);
                  }}
                  className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[10px] font-bold cursor-pointer"
                >
                  PDF
                </button>
                <button
                  onClick={() => {
                    const headers = ['Ticket ID', 'User Name', 'Email', 'Subject', 'Category', 'Priority', 'Status', 'Date'];
                    const rows = supportTickets.map(t => [t.id, t.userName, t.userEmail, t.subject, t.category, t.priority, t.status, new Date(t.createdAt).toLocaleDateString()]);
                    exportToExcel('TrafficSell_Tickets_Export', headers, rows);
                  }}
                  className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded text-[10px] font-bold cursor-pointer"
                >
                  Excel
                </button>
                <button
                  onClick={() => {
                    const headers = ['Ticket ID', 'User Name', 'Email', 'Subject', 'Category', 'Priority', 'Status', 'Date'];
                    const rows = supportTickets.map(t => [t.id, t.userName, t.userEmail, t.subject, t.category, t.priority, t.status, new Date(t.createdAt).toLocaleDateString()]);
                    exportToCSV('TrafficSell_Tickets_Export', headers, rows);
                  }}
                  className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-[#DFFF2F] rounded text-[10px] font-bold cursor-pointer"
                >
                  CSV
                </button>
                <button
                  onClick={() => exportToJSON('TrafficSell_Tickets_Export', supportTickets)}
                  className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded text-[10px] font-bold cursor-pointer"
                >
                  JSON
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {supportTickets.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <Ticket className="w-12 h-12 mx-auto mb-2 opacity-50 text-slate-500" />
                <p className="font-bold text-slate-300">No support tickets found.</p>
              </div>
            ) : (
              supportTickets.map((t) => (
                <div key={t.id} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-[10px] font-extrabold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                          {t.id}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                          t.status === 'open' ? 'bg-amber-500/20 text-amber-400' :
                          t.status === 'in_progress' ? 'bg-indigo-500/20 text-indigo-400' :
                          'bg-emerald-500/20 text-emerald-400'
                        }`}>
                          {t.status.replace('_', ' ')}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px] font-bold uppercase">
                          {t.category}
                        </span>
                      </div>
                      <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">{t.subject}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        User: <strong className="text-slate-200">{t.userName}</strong> ({t.userEmail}) • Created: {new Date(t.createdAt).toLocaleString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={t.status}
                        onChange={(e) => updateTicketStatus(t.id, e.target.value as SupportTicket['status'])}
                        className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white font-bold cursor-pointer"
                      >
                        <option value="open">Open</option>
                        <option value="in_progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                      </select>

                      <button
                        onClick={() => setActiveTicketReplyId(activeTicketReplyId === t.id ? null : t.id)}
                        className="py-1.5 px-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl text-xs flex items-center gap-1 cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" /> Reply
                      </button>
                    </div>
                  </div>

                  {/* Messages list */}
                  <div className="space-y-2 bg-slate-900/80 p-4 rounded-xl border border-slate-800 text-xs">
                    {t.messages.map((m) => (
                      <div key={m.id} className={`p-3 rounded-xl border ${
                        m.sender === 'admin'
                          ? 'bg-amber-500/10 border-amber-500/20 text-amber-200 ml-4'
                          : 'bg-slate-950 border-slate-800 text-slate-200 mr-4'
                      }`}>
                        <div className="flex items-center justify-between text-[10px] font-bold mb-1 opacity-80">
                          <span>{m.senderName} ({m.sender === 'admin' ? 'Admin Support' : 'User'})</span>
                          <span>{new Date(m.createdAt).toLocaleTimeString()}</span>
                        </div>
                        <p className="leading-relaxed text-xs">{m.text}</p>
                      </div>
                    ))}
                  </div>

                  {/* Reply Input */}
                  {activeTicketReplyId === t.id && (
                    <div className="flex items-center gap-2 pt-2">
                      <input
                        type="text"
                        placeholder="Write admin reply to user..."
                        value={ticketReplyText}
                        onChange={(e) => setTicketReplyText(e.target.value)}
                        className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                      />
                      <button
                        onClick={() => {
                          if (ticketReplyText.trim()) {
                            addTicketMessage(t.id, ticketReplyText.trim());
                            setTicketReplyText('');
                          }
                        }}
                        className="px-4 py-2 bg-[#DFFF2F] text-slate-950 font-black text-xs rounded-xl cursor-pointer"
                      >
                        Send Reply
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Pages & Policy Content Editor Tab */}
      {activeTab === 'pages' && (
        <form onSubmit={handleSavePageContent} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm space-y-6 max-w-4xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Website Pages & Policy Content Manager</h3>
              <p className="text-xs text-slate-400 mt-1">Edit policy text, terms, refund rules, and contact channels displayed on footer & modals.</p>
            </div>
            <button
              type="submit"
              className="py-2.5 px-5 bg-[#DFFF2F] hover:bg-[#cbe820] text-slate-950 font-black rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-md"
            >
              <Save className="w-4 h-4" /> Save Page Content
            </button>
          </div>

          {pageContentSaved && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> Page and Policy Content Updated Successfully!
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">Privacy Policy Text</label>
              <textarea
                rows={4}
                value={pageContentForm.privacyPolicy}
                onChange={(e) => setPageContentForm({ ...pageContentForm, privacyPolicy: e.target.value })}
                className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs text-slate-900 dark:text-white leading-relaxed focus:outline-none focus:border-[#DFFF2F]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">Terms of Service Text</label>
              <textarea
                rows={4}
                value={pageContentForm.termsOfService}
                onChange={(e) => setPageContentForm({ ...pageContentForm, termsOfService: e.target.value })}
                className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs text-slate-900 dark:text-white leading-relaxed focus:outline-none focus:border-[#DFFF2F]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">Refund Policy Text</label>
              <textarea
                rows={4}
                value={pageContentForm.refundPolicy}
                onChange={(e) => setPageContentForm({ ...pageContentForm, refundPolicy: e.target.value })}
                className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs text-slate-900 dark:text-white leading-relaxed focus:outline-none focus:border-[#DFFF2F]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">About Us Description</label>
              <textarea
                rows={4}
                value={pageContentForm.aboutUs}
                onChange={(e) => setPageContentForm({ ...pageContentForm, aboutUs: e.target.value })}
                className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs text-slate-900 dark:text-white leading-relaxed focus:outline-none focus:border-[#DFFF2F]"
              />
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Support Email</label>
                <input
                  type="email"
                  value={pageContentForm.supportEmail}
                  onChange={(e) => setPageContentForm({ ...pageContentForm, supportEmail: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Telegram Contact</label>
                <input
                  type="text"
                  value={pageContentForm.telegramContact}
                  onChange={(e) => setPageContentForm({ ...pageContentForm, telegramContact: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">WhatsApp Contact</label>
                <input
                  type="text"
                  value={pageContentForm.whatsAppContact}
                  onChange={(e) => setPageContentForm({ ...pageContentForm, whatsAppContact: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>
        </form>
      )}

      {/* Testimonials Manager Tab */}
      {activeTab === 'testimonials' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Advertiser Testimonials Manager</h3>
              <p className="text-xs text-slate-400 mt-1">Add, edit, or remove testimonials displayed on the main landing page.</p>
            </div>
            <button
              onClick={() => {
                setEditingTestimonial(null);
                setTestimonialForm({
                  name: '',
                  role: 'Media Buyer',
                  company: 'AdNetwork',
                  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
                  content: '',
                  rating: 5,
                  active: true
                });
                setIsTestimonialModalOpen(true);
              }}
              className="py-2.5 px-4 bg-[#DFFF2F] hover:bg-[#cbe820] text-slate-950 font-black rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-md"
            >
              <Plus className="w-4 h-4" /> Add Testimonial
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {testimonials.map((t) => (
              <div
                key={t.id}
                className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(t.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      t.active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-400'
                    }`}>
                      {t.active ? 'Active' : 'Hidden'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 dark:text-slate-300 italic mb-4 leading-relaxed">
                    "{t.content}"
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <img src={t.avatar} alt={t.name} className="w-8 h-8 rounded-full object-cover" />
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">{t.name}</p>
                      <p className="text-[10px] text-slate-400">{t.role} • {t.company}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setEditingTestimonial(t);
                        setTestimonialForm({
                          name: t.name,
                          role: t.role,
                          company: t.company,
                          avatar: t.avatar,
                          content: t.content,
                          rating: t.rating,
                          active: t.active
                        });
                        setIsTestimonialModalOpen(true);
                      }}
                      className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg cursor-pointer"
                    >
                      <Edit className="w-3.5 h-3.5 text-[#DFFF2F]" />
                    </button>
                    <button
                      onClick={() => deleteTestimonial(t.id)}
                      className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Testimonial Add/Edit Modal */}
      {isTestimonialModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <form
            onSubmit={handleTestimonialSubmit}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-lg w-full space-y-4 text-slate-900 dark:text-white relative"
          >
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold">
                {editingTestimonial ? 'Edit Testimonial' : 'Add New Testimonial'}
              </h3>
              <button
                type="button"
                onClick={() => setIsTestimonialModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Name</label>
                <input
                  type="text"
                  required
                  value={testimonialForm.name}
                  onChange={(e) => setTestimonialForm({ ...testimonialForm, name: e.target.value })}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Role / Title</label>
                <input
                  type="text"
                  required
                  value={testimonialForm.role}
                  onChange={(e) => setTestimonialForm({ ...testimonialForm, role: e.target.value })}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Company</label>
                <input
                  type="text"
                  value={testimonialForm.company}
                  onChange={(e) => setTestimonialForm({ ...testimonialForm, company: e.target.value })}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Rating (1-5)</label>
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={testimonialForm.rating}
                  onChange={(e) => setTestimonialForm({ ...testimonialForm, rating: Number(e.target.value) })}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Avatar Image URL</label>
              <input
                type="text"
                value={testimonialForm.avatar}
                onChange={(e) => setTestimonialForm({ ...testimonialForm, avatar: e.target.value })}
                className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Testimonial Content</label>
              <textarea
                rows={3}
                required
                value={testimonialForm.content}
                onChange={(e) => setTestimonialForm({ ...testimonialForm, content: e.target.value })}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="testimonialActive"
                checked={testimonialForm.active}
                onChange={(e) => setTestimonialForm({ ...testimonialForm, active: e.target.checked })}
              />
              <label htmlFor="testimonialActive" className="text-xs font-bold text-slate-300">Display on Landing Page</label>
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsTestimonialModalOpen(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 font-bold text-xs rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#DFFF2F] text-slate-950 font-black text-xs rounded-xl"
              >
                Save Testimonial
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Platform Settings Tab */}
      {activeTab === 'settings' && (
        <form onSubmit={handleSaveSettings} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm space-y-6 max-w-3xl">
          
          {settingsSaved && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> Global Settings & Branding Updated!
            </div>
          )}

          <div className="space-y-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <h4 className="text-xs font-bold uppercase text-amber-400 tracking-wider flex items-center gap-2">
              <Sliders className="w-4 h-4" /> Website Name & Logo Branding Settings
            </h4>

            <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-extrabold text-white flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-[#DFFF2F]" /> Website Logo, Favicon & Brand Asset Manager
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Upload your custom logo or icon image here. It will automatically apply to the browser tab favicon, menu bar, search engines, landing page, and dashboard header.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Website Display Name</label>
                  <input
                    type="text"
                    value={settingsForm.siteName || 'TrafficSell'}
                    onChange={(e) => setSettingsForm({ ...settingsForm, siteName: e.target.value })}
                    placeholder="e.g. TrafficSell, AdTarget, GeoTraffic"
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Upload New Logo / Icon Image</label>
                  <div className="space-y-2">
                    <div className="flex gap-2 items-center">
                      <input
                        type="text"
                        value={settingsForm.siteIconUrl || ''}
                        onChange={(e) => setSettingsForm({ ...settingsForm, siteIconUrl: e.target.value })}
                        placeholder="https://... image icon URL or base64"
                        className="flex-1 px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <label className="flex-1 cursor-pointer">
                        <div className="w-full py-2.5 px-4 bg-[#DFFF2F] hover:bg-[#cbe820] text-slate-950 text-xs font-extrabold rounded-xl transition-all text-center flex items-center justify-center gap-2 shadow-md">
                          <ImageIcon className="w-4 h-4" /> Upload Image File (PNG, JPG, SVG)
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                if (typeof reader.result === 'string') {
                                  setSettingsForm(prev => ({ ...prev, siteIconUrl: reader.result as string }));
                                }
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="hidden"
                        />
                      </label>

                      <button
                        type="button"
                        onClick={() => setSettingsForm(prev => ({ ...prev, siteIconUrl: '/logo.png' }))}
                        className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-all"
                        title="Reset to default icon"
                      >
                        Default Icon
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Live Image Placement Previews */}
              <div className="pt-3 border-t border-slate-800">
                <span className="block text-[11px] font-extrabold uppercase text-[#DFFF2F] tracking-wider mb-2">
                  Live Icon Placement Previews across Website & Tab
                </span>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {/* Browser Tab Preview */}
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex flex-col justify-between">
                    <span className="text-[10px] text-slate-400 font-bold mb-2">1. Browser Tab Favicon</span>
                    <div className="flex items-center gap-2 bg-slate-800/80 px-2.5 py-1.5 rounded-lg border border-slate-700">
                      <img
                        src={settingsForm.siteIconUrl || '/logo.png'}
                        alt="Favicon Preview"
                        onError={(e) => { (e.target as HTMLImageElement).src = '/logo.png'; }}
                        className="w-4 h-4 rounded-sm object-cover"
                      />
                      <span className="text-[10px] font-bold text-slate-200 truncate">{settingsForm.siteName || 'TrafficSell'}...</span>
                    </div>
                  </div>

                  {/* Header Menu Bar Preview */}
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex flex-col justify-between">
                    <span className="text-[10px] text-slate-400 font-bold mb-2">2. Menu Bar Header</span>
                    <div className="flex items-center gap-2 bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-700">
                      <img
                        src={settingsForm.siteIconUrl || '/logo.png'}
                        alt="Navbar Preview"
                        onError={(e) => { (e.target as HTMLImageElement).src = '/logo.png'; }}
                        className="w-6 h-6 rounded-lg object-cover border border-[#DFFF2F]"
                      />
                      <span className="text-xs font-black text-white">{settingsForm.siteName || 'TrafficSell'}</span>
                    </div>
                  </div>

                  {/* Dashboard Sidebar Preview */}
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex flex-col justify-between">
                    <span className="text-[10px] text-slate-400 font-bold mb-2">3. Dashboard Header</span>
                    <div className="flex items-center gap-2 bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-700">
                      <img
                        src={settingsForm.siteIconUrl || '/logo.png'}
                        alt="Dashboard Preview"
                        onError={(e) => { (e.target as HTMLImageElement).src = '/logo.png'; }}
                        className="w-6 h-6 rounded-lg object-cover border border-[#DFFF2F]"
                      />
                      <span className="text-xs font-black text-[#DFFF2F]">Dashboard</span>
                    </div>
                  </div>

                  {/* Search Engine / Footer Preview */}
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex flex-col justify-between">
                    <span className="text-[10px] text-slate-400 font-bold mb-2">4. Search Engine / Footer</span>
                    <div className="flex items-center gap-2 bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-700">
                      <img
                        src={settingsForm.siteIconUrl || '/logo.png'}
                        alt="Footer Preview"
                        onError={(e) => { (e.target as HTMLImageElement).src = '/logo.png'; }}
                        className="w-6 h-6 rounded-lg object-cover border border-[#DFFF2F]"
                      />
                      <span className="text-[10px] font-bold text-slate-300">trafficsell.com</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-2">Navigation Menu Bar Display Mode</label>
              <div className="grid grid-cols-3 gap-3 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setSettingsForm({ ...settingsForm, brandDisplayMode: 'both' })}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    (settingsForm.brandDisplayMode || 'both') === 'both'
                      ? 'bg-[#DFFF2F] text-slate-950 border-[#DFFF2F] shadow'
                      : 'bg-slate-950 text-slate-300 border-slate-800'
                  }`}
                >
                  Icon & Name
                </button>
                <button
                  type="button"
                  onClick={() => setSettingsForm({ ...settingsForm, brandDisplayMode: 'icon' })}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    settingsForm.brandDisplayMode === 'icon'
                      ? 'bg-[#DFFF2F] text-slate-950 border-[#DFFF2F] shadow'
                      : 'bg-slate-950 text-slate-300 border-slate-800'
                  }`}
                >
                  Icon Only
                </button>
                <button
                  type="button"
                  onClick={() => setSettingsForm({ ...settingsForm, brandDisplayMode: 'text' })}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    settingsForm.brandDisplayMode === 'text'
                      ? 'bg-[#DFFF2F] text-slate-950 border-[#DFFF2F] shadow'
                      : 'bg-slate-950 text-slate-300 border-slate-800'
                  }`}
                >
                  Name Only
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Minimum Deposit Threshold ($)</label>
              <input
                type="number"
                step="0.5"
                value={settingsForm.minDeposit}
                onChange={(e) => setSettingsForm({ ...settingsForm, minDeposit: Number(e.target.value) })}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Minimum Baseline CPM ($)</label>
              <input
                type="number"
                step="0.01"
                value={settingsForm.minCPM}
                onChange={(e) => setSettingsForm({ ...settingsForm, minCPM: Number(e.target.value) })}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Global Announcement Bar Message</label>
            <input
              type="text"
              value={settingsForm.announcement}
              onChange={(e) => setSettingsForm({ ...settingsForm, announcement: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white"
            />
          </div>

          <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <h4 className="text-xs font-bold uppercase text-slate-400">Payment Accounts Displayed to Users</h4>
            
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">JazzCash Account No</label>
                <input
                  type="text"
                  value={settingsForm.paymentAccounts.jazzCashAccount}
                  onChange={(e) => setSettingsForm({
                    ...settingsForm,
                    paymentAccounts: { ...settingsForm.paymentAccounts, jazzCashAccount: e.target.value }
                  })}
                  className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">EasyPaisa Account No</label>
                <input
                  type="text"
                  value={settingsForm.paymentAccounts.easyPaisaAccount}
                  onChange={(e) => setSettingsForm({
                    ...settingsForm,
                    paymentAccounts: { ...settingsForm.paymentAccounts, easyPaisaAccount: e.target.value }
                  })}
                  className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">PayPal Email</label>
                <input
                  type="text"
                  value={settingsForm.paymentAccounts.payPalEmail}
                  onChange={(e) => setSettingsForm({
                    ...settingsForm,
                    paymentAccounts: { ...settingsForm.paymentAccounts, payPalEmail: e.target.value }
                  })}
                  className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">USDT TRC20 Address</label>
                <input
                  type="text"
                  value={settingsForm.paymentAccounts.usdtTrc20Address}
                  onChange={(e) => setSettingsForm({
                    ...settingsForm,
                    paymentAccounts: { ...settingsForm.paymentAccounts, usdtTrc20Address: e.target.value }
                  })}
                  className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="py-3 px-6 bg-[#DFFF2F] text-slate-950 font-black rounded-xl text-xs transition-colors cursor-pointer"
          >
            Save Admin Settings
          </button>
        </form>
      )}

      {/* Screenshot Modal */}
      {selectedReceiptUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-xl w-full text-white relative">
            <button
              onClick={() => setSelectedReceiptUrl(null)}
              className="absolute right-4 top-4 p-2 text-slate-400 hover:text-white cursor-pointer"
            >
              Close ✕
            </button>
            <h3 className="text-sm font-bold mb-4">Payment Receipt Screenshot Verification</h3>
            <img src={selectedReceiptUrl} alt="Receipt" className="max-h-[70vh] mx-auto rounded-2xl shadow-xl" />
          </div>
        </div>
      )}

      {/* Admin Ticket Creation Modal */}
      {isTicketModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full text-white relative space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <Ticket className="w-4 h-4 text-[#DFFF2F]" /> Generate Ticket for User
              </h3>
              <button
                onClick={() => setIsTicketModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-bold">Select Target User</label>
                <select
                  value={ticketTargetUserId}
                  onChange={(e) => setTicketTargetUserId(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-bold"
                >
                  {allUsers.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.fullName} ({u.email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-bold">Ticket Subject</label>
                <input
                  type="text"
                  placeholder="e.g. Traffic campaign optimization guidelines"
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Category</label>
                  <select
                    value={ticketCategory}
                    onChange={(e) => setTicketCategory(e.target.value as SupportTicket['category'])}
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  >
                    <option value="general">General</option>
                    <option value="billing">Billing</option>
                    <option value="campaigns">Campaigns</option>
                    <option value="technical">Technical</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Priority</label>
                  <select
                    value={ticketPriority}
                    onChange={(e) => setTicketPriority(e.target.value as SupportTicket['priority'])}
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-bold">Initial Message</label>
                <textarea
                  rows={3}
                  placeholder="Explain details or instructions for user..."
                  value={ticketMessage}
                  onChange={(e) => setTicketMessage(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setIsTicketModalOpen(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 font-bold text-xs rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (ticketTargetUserId && ticketSubject && ticketMessage) {
                    createTicketForUser(ticketTargetUserId, {
                      subject: ticketSubject,
                      category: ticketCategory,
                      priority: ticketPriority,
                      message: ticketMessage
                    });
                    setIsTicketModalOpen(false);
                    setTicketSubject('');
                    setTicketMessage('');
                  }
                }}
                className="px-5 py-2 bg-[#DFFF2F] text-slate-950 font-black text-xs rounded-xl cursor-pointer"
              >
                Issue Ticket
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
