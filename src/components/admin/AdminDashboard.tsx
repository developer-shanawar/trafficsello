import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck, CheckCircle2, XCircle, Eye, Wallet, DollarSign,
  Users, Layers, Settings, Megaphone, Edit, Save, AlertTriangle, Image as ImageIcon,
  Bell, Plus, Trash2, Star, MessageSquare, Clock, ExternalLink, FileText, Send, Phone, Mail,
  Check, Sliders, Download, Search, Ticket, UserX, UserCheck, ChevronDown, ChevronUp,
  Sparkles, CornerDownRight, Filter, RefreshCw, Share2, ArrowUpRight, Percent, BarChart3
} from 'lucide-react';
import { useStore } from '../../lib/store';
import { PaymentDeposit, PlatformSettings, Testimonial, EditablePageContent, SupportTicket, UserProfile } from '../../types';
import { exportToCSV, exportToExcel, exportToJSON, exportToPDF } from '../../lib/exportUtils';
import { requestNativeNotificationPermission } from '../../lib/notifications';
import { SocialAdsSection } from '../SocialAdsSection';
import { AnalyticsView } from '../dashboard/AnalyticsView';

export const AdminDashboard: React.FC = () => {
  const {
    walletDeposits, approveDeposit, rejectDeposit, campaigns, updateCampaignStatus,
    allUsers, updateUserBalanceByAdmin, toggleUserSuspension, platformSettings, updatePlatformSettings,
    testimonials, addTestimonial, updateTestimonial, deleteTestimonial, getUserStats, user,
    supportTickets, createTicketForUser, addTicketMessage, updateTicketStatus, sendAdminNotification,
    socialCampaigns,
    withdrawalRequests, approveWithdrawal, rejectWithdrawal,
    commissionRequests, approveCommissionIncrease, rejectCommissionIncrease
  } = useStore();

  const [activeTab, setActiveTab] = useState<'analytics' | 'users' | 'campaigns' | 'social_ads' | 'tickets' | 'notifications' | 'deposits' | 'withdrawals' | 'commission_requests' | 'pages' | 'testimonials' | 'settings'>('analytics');
  const [notifGranted, setNotifGranted] = useState<boolean>(
    typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted'
  );

  const handleEnableAlerts = async () => {
    const granted = await requestNativeNotificationPermission();
    setNotifGranted(granted);
    if (granted) {
      alert('✅ Desktop Push Notifications enabled! You will get alerts for new orders & deposits.');
    } else {
      alert('⚠️ Push Notification permission was blocked or not granted in your browser settings.');
    }
  };
  
  // User Management State
  const [userSearchQuery, setUserSearchQuery] = useState<string>('');
  const [userRoleFilter, setUserRoleFilter] = useState<string>('all');
  const [userStatusFilter, setUserStatusFilter] = useState<string>('all');
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null);
  const [editingBalanceUserId, setEditingBalanceUserId] = useState<string | null>(null);
  const [balanceInputValue, setBalanceInputValue] = useState<number>(0);

  // Campaigns State
  const [campaignSearchQuery, setCampaignSearchQuery] = useState<string>('');
  const [campaignFilter, setCampaignFilter] = useState<'all' | 'pending' | 'running' | 'paused' | 'completed'>('all');

  // Support Ticket / Chat State
  const [activeChatTicketId, setActiveChatTicketId] = useState<string | null>(null);
  const [chatReplyText, setChatReplyText] = useState<string>('');
  const [ticketSearchQuery, setTicketSearchQuery] = useState<string>('');
  const [ticketStatusFilter, setTicketStatusFilter] = useState<string>('all');
  const [isNewTicketModalOpen, setIsNewTicketModalOpen] = useState<boolean>(false);
  const [newTicketUserId, setNewTicketUserId] = useState<string>('');
  const [newTicketSubject, setNewTicketSubject] = useState<string>('');
  const [newTicketCategory, setNewTicketCategory] = useState<SupportTicket['category']>('general');
  const [newTicketPriority, setNewTicketPriority] = useState<SupportTicket['priority']>('medium');
  const [newTicketMessage, setNewTicketMessage] = useState<string>('');

  // Notification Section State
  const [notifTargetUserId, setNotifTargetUserId] = useState<string>('all');
  const [notifTitle, setNotifTitle] = useState<string>('');
  const [notifMessage, setNotifMessage] = useState<string>('');
  const [notifType, setNotifType] = useState<'system' | 'campaign' | 'payment' | 'ticket'>('system');
  const [notifSentSuccess, setNotifSentSuccess] = useState<boolean>(false);

  // Receipts / Modal state
  const [selectedReceiptUrl, setSelectedReceiptUrl] = useState<string | null>(null);

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
  const openTickets = supportTickets.filter(t => t.status === 'open');

  // Filtered Users list
  const filteredUsers = allUsers.filter(u => {
    const queryMatch = !userSearchQuery ||
      u.fullName.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
      (u.telegram && u.telegram.toLowerCase().includes(userSearchQuery.toLowerCase())) ||
      (u.whatsApp && u.whatsApp.includes(userSearchQuery));
    
    const roleMatch = userRoleFilter === 'all' || u.role === userRoleFilter;
    const statusMatch = userStatusFilter === 'all' ||
      (userStatusFilter === 'active' && !u.isSuspended) ||
      (userStatusFilter === 'suspended' && u.isSuspended);

    return queryMatch && roleMatch && statusMatch;
  });

  // Sorted Tickets for Chat View
  // Sort priority: Open / New User tickets on top!
  const sortedTickets = [...supportTickets].sort((a, b) => {
    // Check if user is a new user (joined recently or has fewer than 2 tickets)
    const userA = allUsers.find(u => u.id === a.userId);
    const userB = allUsers.find(u => u.id === b.userId);
    const isNewUserA = userA ? new Date(userA.createdAt).getTime() > Date.now() - 30 * 24 * 60 * 60 * 1000 : false;
    const isNewUserB = userB ? new Date(userB.createdAt).getTime() > Date.now() - 30 * 24 * 60 * 60 * 1000 : false;

    if (a.status === 'open' && b.status !== 'open') return -1;
    if (a.status !== 'open' && b.status === 'open') return 1;

    if (isNewUserA && !isNewUserB) return -1;
    if (!isNewUserA && isNewUserB) return 1;

    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  }).filter(t => {
    const matchQuery = !ticketSearchQuery ||
      t.subject.toLowerCase().includes(ticketSearchQuery.toLowerCase()) ||
      t.userName.toLowerCase().includes(ticketSearchQuery.toLowerCase()) ||
      t.userEmail.toLowerCase().includes(ticketSearchQuery.toLowerCase());
    const matchStatus = ticketStatusFilter === 'all' || t.status === ticketStatusFilter;
    return matchQuery && matchStatus;
  });

  // Selected chat ticket
  const selectedChatTicket = supportTickets.find(t => t.id === activeChatTicketId);

  const handleApproveDeposit = (id: string) => {
    approveDeposit(id, `Deposit verified & credited by Admin ${user?.fullName || 'Admin'}.`);
  };

  const handleRejectDeposit = (id: string) => {
    const reason = prompt('Enter rejection reason for user notification:', 'Invalid TRX reference or receipt');
    if (reason !== null) {
      rejectDeposit(id, reason);
    }
  };

  const handleSaveBalance = (userId: string) => {
    updateUserBalanceByAdmin(userId, Number(balanceInputValue));
    setEditingBalanceUserId(null);
  };

  const handleSendNotification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifTitle.trim() || !notifMessage.trim()) return;

    sendAdminNotification({ userId: notifTargetUserId, title: notifTitle, message: notifMessage, type: notifType });
    setNotifTitle('');
    setNotifMessage('');
    setNotifSentSuccess(true);
    setTimeout(() => setNotifSentSuccess(false), 3000);
  };

  const handleSendChatReply = (ticketId: string) => {
    if (!chatReplyText.trim()) return;
    addTicketMessage(ticketId, chatReplyText.trim());
    setChatReplyText('');
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
    <div className="space-y-6">

      {/* Modern Compact Admin Control Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#DFFF2F]" />
            <h2 className="text-xl font-extrabold text-white">Admin Control Panel</h2>
            <span className="px-2.5 py-0.5 rounded-full bg-[#DFFF2F]/10 text-[#DFFF2F] border border-[#DFFF2F]/20 text-[10px] font-black uppercase">
              Live Systems
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Manage user accounts, monitor campaigns, respond to support chats, and issue notifications.
          </p>
        </div>

        {/* System Badges & Desktop Notification Alert toggle */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <button
            onClick={handleEnableAlerts}
            className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 font-semibold transition-all ${
              notifGranted
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500/20'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            {notifGranted ? 'Push Alerts Active' : 'Enable Push Alerts'}
          </button>

          <div className="bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 flex items-center gap-2">
            <Users className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-slate-400">Users:</span>
            <strong className="text-white font-mono">{allUsers.length}</strong>
          </div>

          <div
            onClick={() => setActiveTab('deposits')}
            className="bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 flex items-center gap-2 cursor-pointer hover:border-amber-500/50 transition-colors"
          >
            <Wallet className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-slate-400">Pending Deposits:</span>
            <strong className={`font-mono ${pendingDeposits.length > 0 ? 'text-amber-400 font-black animate-pulse' : 'text-slate-200'}`}>
              {pendingDeposits.length}
            </strong>
          </div>

          <div
            onClick={() => setActiveTab('tickets')}
            className="bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 flex items-center gap-2 cursor-pointer hover:border-[#DFFF2F]/50 transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5 text-[#DFFF2F]" />
            <span className="text-slate-400">Open Support Chats:</span>
            <strong className="text-[#DFFF2F] font-mono font-black">{openTickets.length}</strong>
          </div>
        </div>
      </div>

      {/* Admin Tabs Navigation Bar */}
      <div className="bg-slate-900/80 p-2 rounded-2xl border border-slate-800 flex flex-wrap items-center gap-1.5 text-xs font-bold">
        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'analytics'
              ? 'bg-[#DFFF2F] text-slate-950 font-black shadow'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <BarChart3 className="w-4 h-4" /> Live Analytics
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'users'
              ? 'bg-[#DFFF2F] text-slate-950 font-black shadow'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Users className="w-4 h-4" /> Users & Accounts ({allUsers.length})
        </button>

        <button
          onClick={() => setActiveTab('campaigns')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'campaigns'
              ? 'bg-[#DFFF2F] text-slate-950 font-black shadow'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" /> Traffic Campaigns ({campaigns.length})
        </button>

        <button
          onClick={() => setActiveTab('social_ads')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'social_ads'
              ? 'bg-[#DFFF2F] text-slate-950 font-black shadow'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Share2 className="w-4 h-4" /> Social Ads ({socialCampaigns.length})
        </button>

        <button
          onClick={() => setActiveTab('tickets')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'tickets'
              ? 'bg-[#DFFF2F] text-slate-950 font-black shadow'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <MessageSquare className="w-4 h-4" /> Support Chats ({supportTickets.length})
          {openTickets.length > 0 && (
            <span className="px-1.5 py-0.2 bg-amber-400 text-slate-950 text-[10px] font-black rounded-full">
              {openTickets.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('notifications')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'notifications'
              ? 'bg-[#DFFF2F] text-slate-950 font-black shadow'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Bell className="w-4 h-4" /> Notifications Center
        </button>

        <button
          onClick={() => setActiveTab('deposits')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'deposits'
              ? 'bg-[#DFFF2F] text-slate-950 font-black shadow'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Wallet className="w-4 h-4" /> Wallet Deposits ({pendingDeposits.length})
        </button>

        <button
          onClick={() => setActiveTab('withdrawals')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'withdrawals'
              ? 'bg-[#DFFF2F] text-slate-950 font-black shadow'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <ArrowUpRight className="w-4 h-4" /> Withdrawals ({withdrawalRequests.filter(w => w.status === 'in review').length})
        </button>

        <button
          onClick={() => setActiveTab('commission_requests')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'commission_requests'
              ? 'bg-[#DFFF2F] text-slate-950 font-black shadow'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Percent className="w-4 h-4" /> Rate Increase Requests ({commissionRequests.filter(c => c.status === 'in review').length})
        </button>

        <button
          onClick={() => setActiveTab('pages')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'pages'
              ? 'bg-[#DFFF2F] text-slate-950 font-black shadow'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" /> Page Content
        </button>

        <button
          onClick={() => setActiveTab('testimonials')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'testimonials'
              ? 'bg-[#DFFF2F] text-slate-950 font-black shadow'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Star className="w-4 h-4" /> Testimonials
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'settings'
              ? 'bg-[#DFFF2F] text-slate-950 font-black shadow'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Settings className="w-4 h-4" /> Site Branding
        </button>
      </div>

      {/* TAB 0: LIVE ANALYTICS */}
      {activeTab === 'analytics' && (
        <AnalyticsView />
      )}

      {/* TAB 1: USERS & ACCOUNTS */}
      {activeTab === 'users' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-[#DFFF2F]" /> User Accounts Management
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Search by name/email, expand any dropdown to view full account metrics, edit balance, or toggle suspension.
              </p>
            </div>

            {/* Controls: Search, Filters & Export */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Search input */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search name, email, telegram..."
                  value={userSearchQuery}
                  onChange={(e) => setUserSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 w-52 focus:border-[#DFFF2F] outline-none"
                />
              </div>

              {/* Role filter */}
              <select
                value={userRoleFilter}
                onChange={(e) => setUserRoleFilter(e.target.value)}
                className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 font-bold outline-none cursor-pointer"
              >
                <option value="all">All Roles</option>
                <option value="advertiser">Advertisers</option>
                <option value="publisher">Publishers</option>
                <option value="tenant">Tenants</option>
                <option value="admin">Admins</option>
              </select>

              {/* Status filter */}
              <select
                value={userStatusFilter}
                onChange={(e) => setUserStatusFilter(e.target.value)}
                className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 font-bold outline-none cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
              </select>

              {/* Export Buttons */}
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                <span className="text-[10px] text-slate-400 uppercase font-mono px-2 font-bold flex items-center gap-1">
                  <Download className="w-3 h-3 text-[#DFFF2F]" /> Export:
                </span>
                <button
                  onClick={() => {
                    const headers = ['ID', 'Name', 'Email', 'Role', 'Balance ($)', 'Status', 'Joined Date'];
                    const rows = filteredUsers.map(u => [u.id, u.fullName, u.email, u.role, `$${u.walletBalance.toFixed(2)}`, u.isSuspended ? 'Suspended' : 'Active', new Date(u.createdAt).toLocaleDateString()]);
                    exportToPDF('TrafficSell Users Report', headers, rows);
                  }}
                  className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[10px] font-bold cursor-pointer"
                >
                  PDF
                </button>
                <button
                  onClick={() => {
                    const headers = ['ID', 'Name', 'Email', 'Role', 'Balance ($)', 'Status', 'Joined Date'];
                    const rows = filteredUsers.map(u => [u.id, u.fullName, u.email, u.role, `$${u.walletBalance.toFixed(2)}`, u.isSuspended ? 'Suspended' : 'Active', new Date(u.createdAt).toLocaleDateString()]);
                    exportToExcel('TrafficSell_Users_Report', headers, rows);
                  }}
                  className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded text-[10px] font-bold cursor-pointer"
                >
                  Excel
                </button>
                <button
                  onClick={() => {
                    const headers = ['ID', 'Name', 'Email', 'Role', 'Balance ($)', 'Status', 'Joined Date'];
                    const rows = filteredUsers.map(u => [u.id, u.fullName, u.email, u.role, `$${u.walletBalance.toFixed(2)}`, u.isSuspended ? 'Suspended' : 'Active', new Date(u.createdAt).toLocaleDateString()]);
                    exportToCSV('TrafficSell_Users_Report', headers, rows);
                  }}
                  className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-[#DFFF2F] rounded text-[10px] font-bold cursor-pointer"
                >
                  CSV
                </button>
              </div>
            </div>
          </div>

          {/* User Cards / Dropdown Accordion List */}
          <div className="space-y-3">
            {filteredUsers.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-xs font-bold">
                No user accounts match search criteria "{userSearchQuery}".
              </div>
            ) : (
              filteredUsers.map((u) => {
                const stats = getUserStats(u.id);
                const isExpanded = expandedUserId === u.id;
                const userCampaigns = campaigns.filter(c => c.userId === u.id);
                const userTickets = supportTickets.filter(t => t.userId === u.id);

                return (
                  <div
                    key={u.id}
                    className={`rounded-2xl border transition-all overflow-hidden ${
                      isExpanded
                        ? 'bg-slate-950 border-[#DFFF2F]/40 shadow-lg'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {/* User Summary Header Row */}
                    <div
                      onClick={() => setExpandedUserId(isExpanded ? null : u.id)}
                      className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 cursor-pointer select-none"
                    >
                      <div className="flex items-center gap-3">
                        <img src={u.avatar} alt={u.fullName} className="w-10 h-10 rounded-xl object-cover border border-slate-800" />
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-extrabold text-white">{u.fullName}</h4>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                              u.role === 'admin' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                              u.role === 'tenant' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                              u.role === 'publisher' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                              'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            }`}>
                              {u.role}
                            </span>
                            {u.isSuspended && (
                              <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 text-[10px] font-black uppercase border border-rose-500/30">
                                Suspended
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-400 font-mono mt-0.5">{u.email}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 text-xs">
                        <div>
                          <span className="text-[10px] text-slate-500 uppercase font-mono block">Wallet Balance</span>
                          <span className="font-extrabold text-[#DFFF2F] font-mono text-sm">${u.walletBalance.toFixed(2)}</span>
                        </div>

                        <div>
                          <span className="text-[10px] text-slate-500 uppercase font-mono block">Joined Date</span>
                          <span className="text-slate-300 font-mono text-xs">{new Date(u.createdAt).toLocaleDateString()}</span>
                        </div>

                        <div className="p-1.5 bg-slate-900 rounded-lg text-slate-400 hover:text-white border border-slate-800">
                          {isExpanded ? <ChevronUp className="w-4 h-4 text-[#DFFF2F]" /> : <ChevronDown className="w-4 h-4" />}
                        </div>
                      </div>
                    </div>

                    {/* Expandable Dropdown Account Details Panel */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="border-t border-slate-800/80 p-5 bg-slate-900/90 space-y-5 text-xs"
                        >
                          {/* Detailed Grid Stats */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                              <span className="text-slate-500 block text-[10px] uppercase font-mono">Telegram Contact</span>
                              <span className="font-bold text-white block mt-0.5">{u.telegram || 'Not provided'}</span>
                            </div>

                            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                              <span className="text-slate-500 block text-[10px] uppercase font-mono">WhatsApp Contact</span>
                              <span className="font-bold text-white block mt-0.5">{u.whatsApp || 'Not provided'}</span>
                            </div>

                            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                              <span className="text-slate-500 block text-[10px] uppercase font-mono">Country & Location</span>
                              <span className="font-bold text-slate-200 block mt-0.5">{u.country || 'Global'} ({u.city || 'N/A'})</span>
                            </div>

                            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                              <span className="text-slate-500 block text-[10px] uppercase font-mono">Active Campaigns</span>
                              <span className="font-extrabold text-[#DFFF2F] block mt-0.5">{stats.activeCampaignsCount} Active</span>
                            </div>
                          </div>

                          {/* Quick Admin Actions Row */}
                          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                            {/* Balance Modifier */}
                            <div className="flex items-center gap-2">
                              {editingBalanceUserId === u.id ? (
                                <div className="flex items-center gap-2">
                                  <input
                                    type="number"
                                    step="0.01"
                                    value={balanceInputValue}
                                    onChange={(e) => setBalanceInputValue(parseFloat(e.target.value) || 0)}
                                    className="w-28 px-3 py-1 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono font-bold text-xs"
                                  />
                                  <button
                                    onClick={() => handleSaveBalance(u.id)}
                                    className="px-3 py-1 bg-[#DFFF2F] text-slate-950 font-black rounded-lg cursor-pointer"
                                  >
                                    Save
                                  </button>
                                  <button
                                    onClick={() => setEditingBalanceUserId(null)}
                                    className="px-2 py-1 text-slate-400 hover:text-white cursor-pointer"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => {
                                    setEditingBalanceUserId(u.id);
                                    setBalanceInputValue(u.walletBalance);
                                  }}
                                  className="py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-lg flex items-center gap-1.5 cursor-pointer"
                                >
                                  <Edit className="w-3.5 h-3.5 text-[#DFFF2F]" /> Edit Balance (${u.walletBalance.toFixed(2)})
                                </button>
                              )}
                            </div>

                            <div className="flex items-center gap-2">
                              {/* Open Support Chat Button */}
                              <button
                                onClick={() => {
                                  setActiveTab('tickets');
                                  setNewTicketUserId(u.id);
                                  setIsNewTicketModalOpen(true);
                                }}
                                className="py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-lg flex items-center gap-1.5 cursor-pointer"
                              >
                                <MessageSquare className="w-3.5 h-3.5 text-blue-400" /> Start Chat
                              </button>

                              {/* Send Direct Notification */}
                              <button
                                onClick={() => {
                                  setActiveTab('notifications');
                                  setNotifTargetUserId(u.id);
                                }}
                                className="py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold rounded-lg flex items-center gap-1.5 cursor-pointer"
                              >
                                <Bell className="w-3.5 h-3.5" /> Send Notification
                              </button>

                              {/* Suspend / Reactivate */}
                              <button
                                onClick={() => toggleUserSuspension(u.id)}
                                className={`py-1.5 px-3 font-bold rounded-lg flex items-center gap-1.5 cursor-pointer ${
                                  u.isSuspended
                                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30'
                                    : 'bg-rose-500/20 text-rose-400 border border-rose-500/30 hover:bg-rose-500/30'
                                }`}
                              >
                                {u.isSuspended ? (
                                  <>
                                    <UserCheck className="w-3.5 h-3.5" /> Reactivate User
                                  </>
                                ) : (
                                  <>
                                    <UserX className="w-3.5 h-3.5" /> Suspend User
                                  </>
                                )}
                              </button>
                            </div>
                          </div>

                          {/* User Campaigns Mini Summary */}
                          <div>
                            <h5 className="font-bold text-slate-300 mb-2 flex items-center gap-1.5">
                              <Layers className="w-3.5 h-3.5 text-[#DFFF2F]" /> User Campaigns ({userCampaigns.length})
                            </h5>
                            {userCampaigns.length === 0 ? (
                              <p className="text-slate-500 italic">No campaigns created by this user yet.</p>
                            ) : (
                              <div className="space-y-1.5">
                                {userCampaigns.map(c => (
                                  <div key={c.id} className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                                    <div>
                                      <span className="font-extrabold text-white">{c.name}</span>
                                      <span className="text-[10px] text-slate-400 block font-mono">{c.url}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                      <span className="text-emerald-400 font-mono font-bold">{c.visitorsDelivered.toLocaleString()} / {(c.visitorsTarget || 0).toLocaleString()} hits</span>
                                      <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-slate-800 text-slate-300">
                                        {c.status}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* TAB 2: ALL CAMPAIGNS */}
      {activeTab === 'campaigns' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#DFFF2F]" /> All Campaigns Data
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Inspect and control all advertising campaigns running across the network.</p>
            </div>

            {/* Campaign Filter Bar */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search title, URL, advertiser..."
                  value={campaignSearchQuery}
                  onChange={(e) => setCampaignSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 w-52 focus:border-[#DFFF2F] outline-none"
                />
              </div>

              {(['all', 'pending', 'running', 'paused', 'completed'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setCampaignFilter(status)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase cursor-pointer transition-colors ${
                    campaignFilter === status
                      ? 'bg-[#DFFF2F] text-slate-950 font-black'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 text-slate-400 uppercase font-mono text-[10px]">
                <tr>
                  <th className="pb-3">Campaign & Title</th>
                  <th className="pb-3">Target URL</th>
                  <th className="pb-3">Advertiser User</th>
                  <th className="pb-3">Format & CPM</th>
                  <th className="pb-3">Visitors Delivered</th>
                  <th className="pb-3">Budget</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {campaigns
                  .filter(c => {
                    const matchStatus = campaignFilter === 'all' || c.status === campaignFilter;
                    const matchSearch = !campaignSearchQuery ||
                      (c.name && c.name.toLowerCase().includes(campaignSearchQuery.toLowerCase())) ||
                      (c.url && c.url.toLowerCase().includes(campaignSearchQuery.toLowerCase())) ||
                      (c.userId && c.userId.toLowerCase().includes(campaignSearchQuery.toLowerCase()));
                    return matchStatus && matchSearch;
                  })
                  .map((c) => {
                    const userOwner = allUsers.find(u => u.id === c.userId);

                    return (
                      <tr key={c.id} className="hover:bg-slate-800/40">
                        <td className="py-3.5">
                          <span className="font-mono text-[10px] text-amber-400 block">{c.id}</span>
                          <p className="font-extrabold text-white text-xs">{c.name}</p>
                        </td>

                        <td className="py-3.5">
                          <a
                            href={c.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-emerald-400 hover:underline font-mono truncate max-w-xs block text-[11px]"
                          >
                            {c.url}
                          </a>
                        </td>

                        <td className="py-3.5">
                          <p className="font-bold text-white">{userOwner?.fullName || 'Advertiser'}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{userOwner?.email || c.userId}</p>
                          <span className="inline-block mt-1 px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded text-[9px] font-bold uppercase">
                            Role: {userOwner?.role || 'advertiser'}
                          </span>
                        </td>

                        <td className="py-3.5">
                          <span className="font-bold uppercase text-slate-300 block">{c.format || 'SmartLink'}</span>
                          <span className="text-[10px] text-amber-400 font-mono">${(c.cpm || 0.05).toFixed(2)} CPM</span>
                          <span className="text-[9px] text-[#DFFF2F] font-bold block mt-0.5">⚡ Est. Speed: 1 Hour</span>
                        </td>

                        <td className="py-3.5 font-mono">
                          <div className="flex items-center gap-1.5">
                            <span className="text-emerald-400 font-bold">{(c.visitorsDelivered || 0).toLocaleString()}</span>
                            <span className="text-slate-500">/ {(c.visitorsTarget || 0).toLocaleString()}</span>
                          </div>
                          <span className="text-[9px] text-slate-400 block mt-0.5">Delivery Time: ~1h</span>
                        </td>

                        <td className="py-3.5 font-extrabold text-[#DFFF2F] font-mono">
                          ${(c.budget || ((c.visitorsTarget || 0) * (c.cpm || 0.05) / 1000)).toFixed(2)}
                        </td>

                        <td className="py-3.5">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                            c.status === 'running' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                            c.status === 'pending' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                            c.status === 'completed' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                            c.status === 'paused' ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' :
                            'bg-slate-500/20 text-slate-400 border border-slate-500/30'
                          }`}>
                            {c.status === 'running' ? 'Approved & Running (1h)' : c.status}
                          </span>
                        </td>

                        <td className="py-3.5">
                          <div className="flex flex-wrap items-center gap-1.5">
                            {c.status === 'pending' && (
                              <button
                                onClick={() => updateCampaignStatus(c.id, 'running')}
                                className="py-1 px-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black rounded-lg text-[11px] flex items-center gap-1 cursor-pointer shadow"
                              >
                                <CheckCircle2 className="w-3 h-3" /> Approve & Start (1h)
                              </button>
                            )}

                            {c.status === 'running' && (
                              <>
                                <button
                                  onClick={() => updateCampaignStatus(c.id, 'completed')}
                                  className="py-1 px-2.5 bg-blue-500 hover:bg-blue-600 text-slate-950 font-bold rounded-lg text-[11px] cursor-pointer"
                                >
                                  Complete (1h)
                                </button>
                                <button
                                  onClick={() => updateCampaignStatus(c.id, 'paused')}
                                  className="py-1 px-2.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 font-bold rounded-lg text-[11px] cursor-pointer border border-amber-500/30"
                                >
                                  Pause
                                </button>
                              </>
                            )}

                            {c.status === 'paused' && (
                              <button
                                onClick={() => updateCampaignStatus(c.id, 'running')}
                                className="py-1 px-2.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 font-bold rounded-lg text-[11px] cursor-pointer border border-emerald-500/30"
                              >
                                Resume (1h)
                              </button>
                            )}
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

      {/* TAB: SOCIAL ADS SMM */}
      {activeTab === 'social_ads' && (
        <SocialAdsSection />
      )}

      {/* TAB 3: SUPPORT TICKETS & CHAT FORM */}
      {activeTab === 'tickets' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[#DFFF2F]" /> Support Chats & Live Ticket Form
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                New user tickets are prioritized on top. Click any chat to open the interactive chat box.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  setNewTicketUserId(allUsers[0]?.id || '');
                  setNewTicketSubject('');
                  setNewTicketMessage('');
                  setIsNewTicketModalOpen(true);
                }}
                className="py-2 px-4 bg-[#DFFF2F] hover:bg-[#cbe820] text-slate-950 font-black rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow"
              >
                <Plus className="w-4 h-4" /> Start New Support Chat
              </button>
            </div>
          </div>

          {/* Chat Form Cards List */}
          <div className="space-y-3">
            {sortedTickets.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <Ticket className="w-12 h-12 mx-auto mb-2 opacity-40 text-slate-400" />
                <p className="font-bold text-slate-300">No support tickets found.</p>
              </div>
            ) : (
              sortedTickets.map((t, index) => {
                const userOwner = allUsers.find(u => u.id === t.userId);
                const isNewUser = userOwner ? new Date(userOwner.createdAt).getTime() > Date.now() - 30 * 24 * 60 * 60 * 1000 : false;
                const messageCount = t.messages?.length || 0;
                const lastMsg = t.messages?.[t.messages.length - 1];

                return (
                  <div
                    key={t.id}
                    onClick={() => setActiveChatTicketId(t.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                      activeChatTicketId === t.id
                        ? 'bg-slate-950 border-[#DFFF2F] ring-1 ring-[#DFFF2F]'
                        : t.status === 'open'
                        ? 'bg-amber-500/5 border-amber-500/30 hover:border-amber-500/60'
                        : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Chat Number Badge */}
                      <div className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs font-black text-[#DFFF2F] whitespace-nowrap">
                        Chat #{index + 1}
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                            t.status === 'open' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                            t.status === 'in_progress' ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' :
                            'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          }`}>
                            {t.status.replace('_', ' ')}
                          </span>

                          {isNewUser && (
                            <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 text-[10px] font-black uppercase border border-blue-500/30 flex items-center gap-1">
                              <Sparkles className="w-3 h-3" /> New User
                            </span>
                          )}

                          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px] font-bold uppercase">
                            {t.category}
                          </span>
                        </div>

                        <h4 className="text-sm font-extrabold text-white">{t.subject}</h4>
                        <p className="text-xs text-slate-400 mt-0.5">
                          User: <strong className="text-slate-200">{t.userName}</strong> ({t.userEmail})
                        </p>

                        {/* Last message preview */}
                        {lastMsg && (
                          <p className="text-xs text-slate-400 italic mt-1 line-clamp-1 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800/80">
                            "{lastMsg.text}"
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs">
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block font-mono flex items-center justify-end gap-1">
                          <MessageSquare className="w-3 h-3 text-[#DFFF2F]" /> {messageCount} chats made
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono block mt-0.5">
                          {new Date(t.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <button className="py-2 px-3 bg-[#DFFF2F] text-slate-950 font-black rounded-xl text-xs flex items-center gap-1.5 cursor-pointer whitespace-nowrap">
                        Open Chat Box
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* FLOATING / MODAL CHAT BOX FOR SUPPORT TICKETS */}
      {selectedChatTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full h-[600px] flex flex-col overflow-hidden shadow-2xl relative">
            
            {/* Chat Header */}
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-extrabold text-white">{selectedChatTicket.subject}</h3>
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 text-[10px] font-black uppercase">
                    {selectedChatTicket.status}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Chatting with <strong className="text-slate-200">{selectedChatTicket.userName}</strong> ({selectedChatTicket.userEmail})
                </p>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={selectedChatTicket.status}
                  onChange={(e) => updateTicketStatus(selectedChatTicket.id, e.target.value as SupportTicket['status'])}
                  className="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white font-bold cursor-pointer"
                >
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>

                <button
                  onClick={() => setActiveChatTicketId(null)}
                  className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl text-xs cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Chat Messages Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-950/50">
              {selectedChatTicket.messages?.map((m) => (
                <div
                  key={m.id}
                  className={`flex flex-col ${m.sender === 'admin' ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mb-1 font-mono">
                    <span className="font-bold text-slate-400">{m.senderName}</span>
                    <span>•</span>
                    <span>{new Date(m.createdAt).toLocaleTimeString()}</span>
                  </div>

                  <div
                    className={`p-3.5 rounded-2xl max-w-[80%] text-xs leading-relaxed ${
                      m.sender === 'admin'
                        ? 'bg-[#DFFF2F] text-slate-950 font-bold rounded-tr-none shadow-md'
                        : 'bg-slate-900 text-slate-100 border border-slate-800 rounded-tl-none'
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Reply Form */}
            <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
              <input
                type="text"
                placeholder="Type your admin reply here..."
                value={chatReplyText}
                onChange={(e) => setChatReplyText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSendChatReply(selectedChatTicket.id);
                  }
                }}
                className="flex-1 px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:border-[#DFFF2F] outline-none"
              />

              <button
                onClick={() => handleSendChatReply(selectedChatTicket.id)}
                className="py-2.5 px-5 bg-[#DFFF2F] hover:bg-[#cbe820] text-slate-950 font-black rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow"
              >
                <Send className="w-4 h-4" /> Reply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: NOTIFICATIONS CENTER */}
      {activeTab === 'notifications' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6 max-w-3xl">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Bell className="w-5 h-5 text-[#DFFF2F]" /> Dispatch User Notifications
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Send direct notifications to a specific user or broadcast system alerts to all users.
            </p>
          </div>

          {notifSentSuccess && (
            <div className="p-3 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-xl text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> Notification dispatched successfully!
            </div>
          )}

          <form onSubmit={handleSendNotification} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-bold mb-1">Target Recipient</label>
              <select
                value={notifTargetUserId}
                onChange={(e) => setNotifTargetUserId(e.target.value)}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-bold outline-none"
              >
                <option value="all">🌐 All Users (System Broadcast)</option>
                {allUsers.map(u => (
                  <option key={u.id} value={u.id}>
                    👤 {u.fullName} ({u.email})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Notification Title</label>
              <input
                type="text"
                placeholder="e.g. Deposit Credited / Campaign Approved"
                value={notifTitle}
                onChange={(e) => setNotifTitle(e.target.value)}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-[#DFFF2F]"
                required
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Category / Type</label>
              <select
                value={notifType}
                onChange={(e) => setNotifType(e.target.value as any)}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none"
              >
                <option value="system">System Alert</option>
                <option value="campaign">Campaign Update</option>
                <option value="payment">Wallet / Deposit Alert</option>
                <option value="ticket">Support Alert</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Notification Message Body</label>
              <textarea
                rows={4}
                placeholder="Write message details for the user..."
                value={notifMessage}
                onChange={(e) => setNotifMessage(e.target.value)}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-[#DFFF2F]"
                required
              />
            </div>

            <button
              type="submit"
              className="py-3 px-6 bg-[#DFFF2F] hover:bg-[#cbe820] text-slate-950 font-black rounded-xl text-xs cursor-pointer shadow flex items-center gap-2"
            >
              <Send className="w-4 h-4" /> Send Notification
            </button>
          </form>
        </div>
      )}

      {/* TAB 5: WALLET DEPOSITS QUEUE */}
      {activeTab === 'deposits' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Wallet className="w-5 h-5 text-[#DFFF2F]" /> Pending Wallet Deposit Requests
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Verify receipt screenshots and credit user balances.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 text-slate-400 uppercase font-mono text-[10px]">
                <tr>
                  <th className="pb-3">User</th>
                  <th className="pb-3">Payment Method</th>
                  <th className="pb-3">TRX Reference</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Receipt Screenshot</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {walletDeposits.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-500">No deposit requests recorded yet.</td>
                  </tr>
                ) : (
                  walletDeposits.map((d) => (
                    <tr key={d.id} className="hover:bg-slate-800/40">
                      <td className="py-3.5">
                        <p className="font-extrabold text-white">{d.userName}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{d.userEmail}</p>
                      </td>

                      <td className="py-3.5">
                        <span className="font-bold text-amber-400">{d.method}</span>
                      </td>

                      <td className="py-3.5 font-mono text-slate-300">
                        {d.trxRef}
                      </td>

                      <td className="py-3.5 font-black text-[#DFFF2F] font-mono text-sm">
                        ${d.amount.toFixed(2)}
                      </td>

                      <td className="py-3.5">
                        {d.screenshotUrl ? (
                          <button
                            onClick={() => setSelectedReceiptUrl(d.screenshotUrl)}
                            className="text-xs text-blue-400 hover:underline flex items-center gap-1 font-bold cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" /> View Receipt
                          </button>
                        ) : (
                          <span className="text-slate-500 italic">No receipt</span>
                        )}
                      </td>

                      <td className="py-3.5 text-slate-400 font-mono text-[10px]">
                        {new Date(d.createdAt).toLocaleDateString()}
                      </td>

                      <td className="py-3.5">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                          d.status === 'approved' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                          d.status === 'pending' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                          'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        }`}>
                          {d.status}
                        </span>
                      </td>

                      <td className="py-3.5">
                        {d.status === 'pending' && (
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleApproveDeposit(d.id)}
                              className="py-1 px-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-lg text-[11px] flex items-center gap-1 cursor-pointer"
                            >
                              <CheckCircle2 className="w-3 h-3" /> Approve
                            </button>
                            <button
                              onClick={() => handleRejectDeposit(d.id)}
                              className="py-1 px-2.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 font-bold rounded-lg text-[11px] cursor-pointer border border-rose-500/30"
                            >
                              Reject
                            </button>
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

      {/* TAB: REFERRAL WITHDRAWALS */}
      {activeTab === 'withdrawals' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <ArrowUpRight className="w-5 h-5 text-emerald-400" />
                Referral Payout & Withdrawal Requests ({withdrawalRequests.length})
              </h3>
              <p className="text-xs text-slate-400">
                Review, approve, or decline payout requests submitted by affiliates.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 text-slate-400 uppercase font-mono text-[10px]">
                <tr>
                  <th className="pb-3">ID</th>
                  <th className="pb-3">Affiliate User</th>
                  <th className="pb-3">Method</th>
                  <th className="pb-3">Account Title / Number / Address</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Requested On</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {withdrawalRequests.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-400">
                      No withdrawal requests found.
                    </td>
                  </tr>
                ) : (
                  withdrawalRequests.map((w) => (
                    <tr key={w.id} className="hover:bg-slate-800/40">
                      <td className="py-3.5 font-mono text-[11px] font-bold text-[#DFFF2F]">{w.id}</td>
                      <td className="py-3.5">
                        <p className="font-extrabold text-white">{w.userName}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{w.userEmail}</p>
                      </td>
                      <td className="py-3.5 font-bold text-amber-400">{w.method}</td>
                      <td className="py-3.5 font-mono text-slate-300">
                        {w.accountTitle && <div className="text-white font-bold">{w.accountTitle}</div>}
                        {w.accountNumber && <div className="text-slate-300">{w.accountNumber}</div>}
                        {w.cryptoAddress && <div className="text-[#DFFF2F] font-mono break-all max-w-xs">{w.cryptoAddress}</div>}
                      </td>
                      <td className="py-3.5 font-black text-emerald-400 font-mono text-sm">${w.amount.toFixed(2)}</td>
                      <td className="py-3.5 text-slate-400 font-mono text-[10px]">
                        {new Date(w.createdAt).toLocaleString()}
                      </td>
                      <td className="py-3.5">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                          w.status === 'approved' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                          w.status === 'in review' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse' :
                          'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        }`}>
                          {w.status}
                        </span>
                      </td>
                      <td className="py-3.5">
                        {(w.status === 'in review' || w.status === 'pending') && (
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => {
                                const note = prompt('Enter admin note / TRX proof for approval:', `Payout sent via ${w.method}`);
                                if (note !== null) approveWithdrawal(w.id, note);
                              }}
                              className="py-1 px-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold rounded-lg text-[11px] flex items-center gap-1 cursor-pointer"
                            >
                              <CheckCircle2 className="w-3 h-3" /> Approve Payout
                            </button>
                            <button
                              onClick={() => {
                                const note = prompt('Enter rejection reason (Funds will be refunded to user referral balance):', 'Incorrect account details');
                                if (note !== null) rejectWithdrawal(w.id, note);
                              }}
                              className="py-1 px-2.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 font-bold rounded-lg text-[11px] cursor-pointer border border-rose-500/30"
                            >
                              Reject & Refund
                            </button>
                          </div>
                        )}
                        {w.adminNote && <p className="text-[10px] text-slate-400 italic mt-1">{w.adminNote}</p>}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB: COMMISSION INCREASE REQUESTS */}
      {activeTab === 'commission_requests' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <Percent className="w-5 h-5 text-[#DFFF2F]" />
                Affiliate Commission Rate Increase Requests ({commissionRequests.length})
              </h3>
              <p className="text-xs text-slate-400">
                Review high-volume promotional channel applications and assign custom commission rates (8%, 10%, 15%).
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 text-slate-400 uppercase font-mono text-[10px]">
                <tr>
                  <th className="pb-3">User</th>
                  <th className="pb-3">Current Rate</th>
                  <th className="pb-3">Requested Rate</th>
                  <th className="pb-3">Promotional Channels / Reason</th>
                  <th className="pb-3">Est. Monthly Referrals</th>
                  <th className="pb-3">Requested Date</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {commissionRequests.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-400">
                      No rate increase requests found.
                    </td>
                  </tr>
                ) : (
                  commissionRequests.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-800/40">
                      <td className="py-3.5">
                        <p className="font-extrabold text-white">{c.userName}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{c.userEmail}</p>
                      </td>
                      <td className="py-3.5 font-bold text-slate-300">{Math.round(((allUsers.find(u => u.id === c.userId)?.customReferralRate) || 0.05) * 100)}%</td>
                      <td className="py-3.5 font-black text-[#DFFF2F] text-sm">{c.requestedRate}%</td>
                      <td className="py-3.5 text-slate-300 max-w-xs leading-tight">
                        <div className="font-bold text-white text-xs">{c.socialPlatform || 'Promotional Channel'}</div>
                        <p className="text-[11px] text-slate-300 line-clamp-2 mt-0.5">{c.message}</p>
                        {c.proofUrl && (
                          <a href={c.proofUrl} target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:underline text-[10px] flex items-center gap-1 font-mono mt-1">
                            <span>Proof URL</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </td>
                      <td className="py-3.5 font-bold text-emerald-400">{c.referralsCount} users/mo</td>
                      <td className="py-3.5 text-slate-400 font-mono text-[10px]">
                        {new Date(c.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3.5">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                          c.status === 'approved' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                          c.status === 'in review' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse' :
                          'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        }`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="py-3.5">
                        {(c.status === 'in review' || c.status === 'pending') && (
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => approveCommissionIncrease(c.id, c.requestedRate)}
                              className="py-1 px-2.5 bg-[#DFFF2F] hover:bg-[#cbe820] text-slate-950 font-black rounded-lg text-[11px] flex items-center gap-1 cursor-pointer"
                            >
                              <CheckCircle2 className="w-3 h-3" /> Approve {c.requestedRate}%
                            </button>
                            <button
                              onClick={() => {
                                const note = prompt('Rejection note:', 'Minimum active referral threshold not met');
                                if (note !== null) rejectCommissionIncrease(c.id, note);
                              }}
                              className="py-1 px-2.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 font-bold rounded-lg text-[11px] cursor-pointer border border-rose-500/30"
                            >
                              Reject
                            </button>
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

      {/* TAB 6: PAGE CONTENT */}
      {activeTab === 'pages' && (
        <form onSubmit={handleSavePageContent} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6 max-w-4xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-white">Editable Page Content & Legal Policies</h3>
              <p className="text-xs text-slate-400">Update Terms of Service, Privacy Policy, Refund Policy, and About Us text.</p>
            </div>
            {pageContentSaved && (
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Saved!
              </span>
            )}
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-bold mb-1">Privacy Policy</label>
              <textarea
                rows={5}
                value={pageContentForm.privacyPolicy}
                onChange={(e) => setPageContentForm({ ...pageContentForm, privacyPolicy: e.target.value })}
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Terms of Service</label>
              <textarea
                rows={5}
                value={pageContentForm.termsOfService}
                onChange={(e) => setPageContentForm({ ...pageContentForm, termsOfService: e.target.value })}
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Refund Policy</label>
              <textarea
                rows={4}
                value={pageContentForm.refundPolicy}
                onChange={(e) => setPageContentForm({ ...pageContentForm, refundPolicy: e.target.value })}
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">About Us</label>
              <textarea
                rows={4}
                value={pageContentForm.aboutUs}
                onChange={(e) => setPageContentForm({ ...pageContentForm, aboutUs: e.target.value })}
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            className="py-3 px-6 bg-[#DFFF2F] hover:bg-[#cbe820] text-slate-950 font-black rounded-xl text-xs cursor-pointer shadow"
          >
            Save Page Content
          </button>
        </form>
      )}

      {/* TAB 7: TESTIMONIALS */}
      {activeTab === 'testimonials' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-white">Client Testimonials Manager</h3>
              <p className="text-xs text-slate-400">Add or edit testimonials featured on the landing page.</p>
            </div>

            <button
              onClick={() => {
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
                setIsTestimonialModalOpen(true);
              }}
              className="py-2 px-4 bg-[#DFFF2F] text-slate-950 font-black rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Testimonial
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {testimonials.map((t) => (
              <div key={t.id} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img src={t.avatar} alt={t.name} className="w-8 h-8 rounded-full object-cover" />
                    <div>
                      <h4 className="font-extrabold text-white">{t.name}</h4>
                      <p className="text-[10px] text-slate-400">{t.role} ({t.company})</p>
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
                      className="p-1 text-slate-400 hover:text-white cursor-pointer"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteTestimonial(t.id)}
                      className="p-1 text-rose-400 hover:text-rose-300 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-slate-300 italic">"{t.content}"</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 8: SITE BRANDING & SETTINGS */}
      {activeTab === 'settings' && (
        <form onSubmit={handleSaveSettings} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6 max-w-3xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-white">Platform Branding & Payment Accounts</h3>
              <p className="text-xs text-slate-400">Configure site name, logo image URL, announcement message, and admin wallet payment numbers.</p>
            </div>
            {settingsSaved && (
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Settings Saved!
              </span>
            )}
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-bold mb-1">Website Name</label>
              <input
                type="text"
                value={settingsForm.siteName}
                onChange={(e) => setSettingsForm({ ...settingsForm, siteName: e.target.value })}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-bold"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Site Logo / Icon Image URL</label>
              <input
                type="text"
                value={settingsForm.siteIconUrl}
                onChange={(e) => setSettingsForm({ ...settingsForm, siteIconUrl: e.target.value })}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Minimum Deposit Amount ($ USD)</label>
                <input
                  type="number"
                  step="0.01"
                  min="1"
                  value={settingsForm.minDeposit || 5}
                  onChange={(e) => setSettingsForm({ ...settingsForm, minDeposit: Number(e.target.value) })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-bold font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Default Minimum CPM Rate ($ USD)</label>
                <input
                  type="number"
                  step="0.001"
                  min="0.01"
                  value={settingsForm.minCPM || 0.10}
                  onChange={(e) => setSettingsForm({ ...settingsForm, minCPM: Number(e.target.value) })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-bold font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Announcement Message</label>
              <input
                type="text"
                value={settingsForm.announcement || ''}
                onChange={(e) => setSettingsForm({ ...settingsForm, announcement: e.target.value })}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
              />
            </div>

            <div className="border-t border-slate-800 pt-4 space-y-4">
              <h4 className="font-extrabold text-[#DFFF2F] text-sm">Admin Deposit & Payout Payment Accounts</h4>

              {/* JazzCash */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
                <div>
                  <label className="block text-slate-400 text-[11px] mb-1 font-bold">JazzCash Account Number</label>
                  <input
                    type="text"
                    value={settingsForm.paymentAccounts?.jazzCashAccount || ''}
                    onChange={(e) => setSettingsForm({
                      ...settingsForm,
                      paymentAccounts: { ...settingsForm.paymentAccounts, jazzCashAccount: e.target.value }
                    })}
                    placeholder="03001234567"
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-[11px] mb-1 font-bold">JazzCash Account Title</label>
                  <input
                    type="text"
                    value={settingsForm.paymentAccounts?.jazzCashTitle || ''}
                    onChange={(e) => setSettingsForm({
                      ...settingsForm,
                      paymentAccounts: { ...settingsForm.paymentAccounts, jazzCashTitle: e.target.value }
                    })}
                    placeholder="John Doe"
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs font-bold"
                  />
                </div>
              </div>

              {/* EasyPaisa */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
                <div>
                  <label className="block text-slate-400 text-[11px] mb-1 font-bold">EasyPaisa Account Number</label>
                  <input
                    type="text"
                    value={settingsForm.paymentAccounts?.easyPaisaAccount || ''}
                    onChange={(e) => setSettingsForm({
                      ...settingsForm,
                      paymentAccounts: { ...settingsForm.paymentAccounts, easyPaisaAccount: e.target.value }
                    })}
                    placeholder="03121234567"
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-[11px] mb-1 font-bold">EasyPaisa Account Title</label>
                  <input
                    type="text"
                    value={settingsForm.paymentAccounts?.easyPaisaTitle || ''}
                    onChange={(e) => setSettingsForm({
                      ...settingsForm,
                      paymentAccounts: { ...settingsForm.paymentAccounts, easyPaisaTitle: e.target.value }
                    })}
                    placeholder="John Doe"
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs font-bold"
                  />
                </div>
              </div>

              {/* PayPal */}
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
                <label className="block text-slate-400 text-[11px] mb-1 font-bold">PayPal Receiving Email</label>
                <input
                  type="email"
                  value={settingsForm.paymentAccounts?.payPalEmail || ''}
                  onChange={(e) => setSettingsForm({
                    ...settingsForm,
                    paymentAccounts: { ...settingsForm.paymentAccounts, payPalEmail: e.target.value }
                  })}
                  placeholder="payments@example.com"
                  className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono text-xs"
                />
              </div>

              {/* USDT Addresses */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
                <div>
                  <label className="block text-slate-400 text-[11px] mb-1 font-bold">USDT TRC20 Address</label>
                  <input
                    type="text"
                    value={settingsForm.paymentAccounts?.usdtTrc20Address || ''}
                    onChange={(e) => setSettingsForm({
                      ...settingsForm,
                      paymentAccounts: { ...settingsForm.paymentAccounts, usdtTrc20Address: e.target.value }
                    })}
                    placeholder="T..."
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-[11px] mb-1 font-bold">USDT BEP20 Address</label>
                  <input
                    type="text"
                    value={settingsForm.paymentAccounts?.usdtBep20Address || ''}
                    onChange={(e) => setSettingsForm({
                      ...settingsForm,
                      paymentAccounts: { ...settingsForm.paymentAccounts, usdtBep20Address: e.target.value }
                    })}
                    placeholder="0x..."
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-[11px] mb-1 font-bold">USDT ERC20 Address</label>
                  <input
                    type="text"
                    value={settingsForm.paymentAccounts?.usdtErc20Address || ''}
                    onChange={(e) => setSettingsForm({
                      ...settingsForm,
                      paymentAccounts: { ...settingsForm.paymentAccounts, usdtErc20Address: e.target.value }
                    })}
                    placeholder="0x..."
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono text-xs"
                  />
                </div>
              </div>

              {/* Bank Transfer */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
                <div>
                  <label className="block text-slate-400 text-[11px] mb-1 font-bold">Bank Name</label>
                  <input
                    type="text"
                    value={settingsForm.paymentAccounts?.bankName || ''}
                    onChange={(e) => setSettingsForm({
                      ...settingsForm,
                      paymentAccounts: { ...settingsForm.paymentAccounts, bankName: e.target.value }
                    })}
                    placeholder="Meezan Bank"
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-[11px] mb-1 font-bold">Account Title</label>
                  <input
                    type="text"
                    value={settingsForm.paymentAccounts?.bankAccountName || ''}
                    onChange={(e) => setSettingsForm({
                      ...settingsForm,
                      paymentAccounts: { ...settingsForm.paymentAccounts, bankAccountName: e.target.value }
                    })}
                    placeholder="John Doe"
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-[11px] mb-1 font-bold">IBAN / Account Number</label>
                  <input
                    type="text"
                    value={settingsForm.paymentAccounts?.bankIban || ''}
                    onChange={(e) => setSettingsForm({
                      ...settingsForm,
                      paymentAccounts: { ...settingsForm.paymentAccounts, bankIban: e.target.value }
                    })}
                    placeholder="PK00MEZN..."
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono text-xs"
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="py-3 px-6 bg-[#DFFF2F] hover:bg-[#cbe820] text-slate-950 font-black rounded-xl text-xs cursor-pointer shadow"
          >
            Save Admin Settings
          </button>
        </form>
      )}

      {/* Screenshot Verification Modal */}
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

      {/* Admin New Ticket / Chat Modal */}
      {isNewTicketModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full text-white relative space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#DFFF2F]" /> Issue New Support Chat to User
              </h3>
              <button
                onClick={() => setIsNewTicketModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-bold">Target User</label>
                <select
                  value={newTicketUserId}
                  onChange={(e) => setNewTicketUserId(e.target.value)}
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
                <label className="block text-slate-400 mb-1 font-bold">Chat Subject</label>
                <input
                  type="text"
                  placeholder="e.g. Campaign performance check & guidance"
                  value={newTicketSubject}
                  onChange={(e) => setNewTicketSubject(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-[#DFFF2F]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Category</label>
                  <select
                    value={newTicketCategory}
                    onChange={(e) => setNewTicketCategory(e.target.value as SupportTicket['category'])}
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  >
                    <option value="general">General Inquiry</option>
                    <option value="billing">Billing & Wallet</option>
                    <option value="campaigns">Campaign Delivery</option>
                    <option value="technical">Technical Support</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Priority</label>
                  <select
                    value={newTicketPriority}
                    onChange={(e) => setNewTicketPriority(e.target.value as SupportTicket['priority'])}
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-bold">First Message</label>
                <textarea
                  rows={3}
                  placeholder="Type initial message or instructions..."
                  value={newTicketMessage}
                  onChange={(e) => setNewTicketMessage(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-[#DFFF2F]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setIsNewTicketModalOpen(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 font-bold text-xs rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (newTicketUserId && newTicketSubject && newTicketMessage) {
                    createTicketForUser(newTicketUserId, {
                      subject: newTicketSubject,
                      category: newTicketCategory,
                      priority: newTicketPriority,
                      message: newTicketMessage
                    });
                    setIsNewTicketModalOpen(false);
                    setNewTicketSubject('');
                    setNewTicketMessage('');
                  }
                }}
                className="px-5 py-2 bg-[#DFFF2F] text-slate-950 font-black text-xs rounded-xl cursor-pointer"
              >
                Create Chat
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
