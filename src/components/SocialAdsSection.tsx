import React, { useState } from 'react';
import { useStore } from '../lib/store';
import { SocialPlatform, SocialService, SocialCampaign, SocialCampaignStatus } from '../types';
import { 
  Share2, Instagram, Youtube, Send, Globe, Plus, Trash2, Edit, CheckCircle, 
  XCircle, Clock, ExternalLink, RefreshCw, AlertCircle, Sparkles, Filter, Check, ArrowRight
} from 'lucide-react';

export const SocialAdsSection: React.FC = () => {
  const { 
    user, socialServices, socialCampaigns, 
    addSocialCampaign, updateSocialCampaignStatus, deleteSocialCampaign,
    addSocialService, updateSocialService, deleteSocialService 
  } = useStore();

  const [activeTab, setActiveTab] = useState<'order' | 'history' | 'admin_manage' | 'admin_services'>('order');
  const [selectedPlatform, setSelectedPlatform] = useState<SocialPlatform>('Instagram');
  const [selectedServiceId, setSelectedServiceId] = useState<string>('');
  const [targetLink, setTargetLink] = useState('');
  const [quantity, setQuantity] = useState<number>(1000);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Admin New Service State
  const [newSrvPlatform, setNewSrvPlatform] = useState<SocialPlatform>('Instagram');
  const [newSrvName, setNewSrvName] = useState('');
  const [newSrvType, setNewSrvType] = useState<SocialService['serviceType']>('Followers');
  const [newSrvPrice, setNewSrvPrice] = useState<number>(1.50);
  const [newSrvMin, setNewSrvMin] = useState<number>(100);
  const [newSrvMax, setNewSrvMax] = useState<number>(100000);
  const [newSrvDesc, setNewSrvDesc] = useState('');

  const [statusFilter, setStatusFilter] = useState<string>('all');

  const availablePlatforms: SocialPlatform[] = ['Instagram', 'TikTok', 'YouTube', 'Facebook', 'Twitter / X', 'Telegram', 'LinkedIn', 'Spotify'];

  const servicesForPlatform = socialServices.filter(s => s.platform === selectedPlatform && s.active);
  const currentService = socialServices.find(s => s.id === selectedServiceId) || servicesForPlatform[0];

  const calculatedCost = currentService ? (quantity / 1000) * currentService.pricePer1000 : 0;

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!currentService) {
      setErrorMsg('Please select a valid service.');
      return;
    }

    if (!targetLink.trim()) {
      setErrorMsg('Please enter your target profile or content link.');
      return;
    }

    if (quantity < currentService.minQuantity || quantity > currentService.maxQuantity) {
      setErrorMsg(`Quantity must be between ${currentService.minQuantity.toLocaleString()} and ${currentService.maxQuantity.toLocaleString()}.`);
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await addSocialCampaign({
        serviceId: currentService.id,
        targetLink,
        quantity
      });

      if (result.success) {
        setSuccessMsg(`🚀 Order placed successfully! ID #${Date.now().toString().slice(-6)} is in queue.`);
        setTargetLink('');
        setActiveTab('history');
      } else {
        setErrorMsg(result.message || 'Failed to place order.');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'An error occurred while placing order.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSrvName.trim()) return;

    addSocialService({
      platform: newSrvPlatform,
      serviceName: newSrvName,
      serviceType: newSrvType,
      pricePer1000: newSrvPrice,
      minQuantity: newSrvMin,
      maxQuantity: newSrvMax,
      estimatedMinutes: 30,
      description: newSrvDesc,
      active: true
    });

    setNewSrvName('');
    setNewSrvDesc('');
    setSuccessMsg('New social service added successfully!');
  };

  // User campaigns vs admin view
  const myCampaigns = socialCampaigns.filter(c => c.userId === user?.id);
  const displayCampaigns = user?.role === 'admin' && activeTab === 'admin_manage' ? socialCampaigns : myCampaigns;

  const filteredCampaigns = displayCampaigns.filter(c => {
    if (statusFilter === 'all') return true;
    return c.status === statusFilter;
  });

  const getPlatformIcon = (platform: SocialPlatform) => {
    switch (platform) {
      case 'Instagram':
        return <Instagram className="w-5 h-5 text-pink-500" />;
      case 'YouTube':
        return <Youtube className="w-5 h-5 text-red-500" />;
      case 'TikTok':
        return <Share2 className="w-5 h-5 text-teal-400" />;
      case 'Telegram':
        return <Send className="w-5 h-5 text-blue-400" />;
      default:
        return <Globe className="w-5 h-5 text-indigo-400" />;
    }
  };

  const getStatusBadge = (status: SocialCampaignStatus) => {
    switch (status) {
      case 'completed':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"><CheckCircle className="w-3.5 h-3.5" /> Completed</span>;
      case 'in_progress':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20"><RefreshCw className="w-3.5 h-3.5 animate-spin" /> In Progress</span>;
      case 'cancelled':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20"><XCircle className="w-3.5 h-3.5" /> Cancelled & Refunded</span>;
      default:
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20"><Clock className="w-3.5 h-3.5" /> Pending Review</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-900/60 via-indigo-900/60 to-slate-900/80 border border-purple-500/20 p-6 md:p-8 backdrop-blur-xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30 mb-3">
              <Sparkles className="w-3.5 h-3.5" /> Social Media Growth Marketplace
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Social Media Advertising & SMM Boost
            </h1>
            <p className="text-slate-300 text-sm md:text-base mt-2 max-w-2xl">
              Instantly grow followers, likes, high-retention video views, and post engagement across Instagram, TikTok, YouTube, Telegram & Facebook with guaranteed instant speed.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab('order')}
              className={`px-4 py-2.5 rounded-xl font-medium text-sm transition-all flex items-center gap-2 ${
                activeTab === 'order'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
              }`}
            >
              <Plus className="w-4 h-4" /> New Order
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-4 py-2.5 rounded-xl font-medium text-sm transition-all flex items-center gap-2 ${
                activeTab === 'history'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
              }`}
            >
              <Clock className="w-4 h-4" /> My Orders ({myCampaigns.length})
            </button>

            {user?.role === 'admin' && (
              <>
                <button
                  onClick={() => setActiveTab('admin_manage')}
                  className={`px-4 py-2.5 rounded-xl font-medium text-sm transition-all flex items-center gap-2 ${
                    activeTab === 'admin_manage'
                      ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
                      : 'bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 border border-amber-500/30'
                  }`}
                >
                  <Filter className="w-4 h-4" /> Admin Orders ({socialCampaigns.length})
                </button>
                <button
                  onClick={() => setActiveTab('admin_services')}
                  className={`px-4 py-2.5 rounded-xl font-medium text-sm transition-all flex items-center gap-2 ${
                    activeTab === 'admin_services'
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                      : 'bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 border border-emerald-500/30'
                  }`}
                >
                  <Edit className="w-4 h-4" /> Manage Services ({socialServices.length})
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 flex items-center gap-3 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 flex items-center gap-3 text-sm">
          <CheckCircle className="w-5 h-5 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* TAB 1: NEW ORDER FORM */}
      {activeTab === 'order' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-md shadow-xl">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Share2 className="w-5 h-5 text-purple-400" /> Choose Platform & Service
            </h2>

            <form onSubmit={handleCreateOrder} className="space-y-6">
              {/* 1. Select Platform Pills */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                  1. Select Social Platform
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {availablePlatforms.map((plt) => (
                    <button
                      key={plt}
                      type="button"
                      onClick={() => {
                        setSelectedPlatform(plt);
                        const first = socialServices.find(s => s.platform === plt && s.active);
                        if (first) setSelectedServiceId(first.id);
                      }}
                      className={`flex items-center gap-3 p-3 rounded-xl border text-sm font-medium transition-all ${
                        selectedPlatform === plt
                          ? 'bg-purple-600/20 border-purple-500 text-white shadow-md shadow-purple-500/10 ring-2 ring-purple-500/30'
                          : 'bg-slate-800/50 border-slate-700/80 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                      }`}
                    >
                      {getPlatformIcon(plt)}
                      <span>{plt}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Select Service */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  2. Select Package / Service
                </label>
                {servicesForPlatform.length === 0 ? (
                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs">
                    No active services listed for {selectedPlatform} right now. Please select another platform or contact admin.
                  </div>
                ) : (
                  <select
                    value={currentService?.id || ''}
                    onChange={(e) => setSelectedServiceId(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {servicesForPlatform.map((srv) => (
                      <option key={srv.id} value={srv.id}>
                        {srv.serviceName} — ${srv.pricePer1000.toFixed(2)} per 1,000 units
                      </option>
                    ))}
                  </select>
                )}

                {currentService?.description && (
                  <p className="mt-2 text-xs text-purple-300 bg-purple-500/10 border border-purple-500/20 p-2.5 rounded-lg">
                    💡 <strong>Package Info:</strong> {currentService.description}
                  </p>
                )}
              </div>

              {/* 3. Link */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  3. Link / Target URL
                </label>
                <div className="relative">
                  <input
                    type="url"
                    required
                    placeholder={
                      selectedPlatform === 'Instagram' ? 'https://instagram.com/p/your_post_or_username' :
                      selectedPlatform === 'TikTok' ? 'https://tiktok.com/@username/video/123456789' :
                      selectedPlatform === 'YouTube' ? 'https://youtube.com/watch?v=video_id' :
                      'https://...'
                    }
                    value={targetLink}
                    onChange={(e) => setTargetLink(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 pl-10"
                  />
                  <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                </div>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Ensure account or post is set to PUBLIC before submitting.
                </span>
              </div>

              {/* 4. Quantity */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    4. Order Quantity
                  </label>
                  {currentService && (
                    <span className="text-xs text-slate-400">
                      Min: {currentService.minQuantity.toLocaleString()} | Max: {currentService.maxQuantity.toLocaleString()}
                    </span>
                  )}
                </div>
                <input
                  type="number"
                  required
                  min={currentService?.minQuantity || 100}
                  max={currentService?.maxQuantity || 1000000}
                  step={100}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono"
                />

                {/* Quick quantity selector buttons */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {[1000, 2500, 5000, 10000, 25000, 50000].map((qty) => (
                    <button
                      key={qty}
                      type="button"
                      onClick={() => setQuantity(qty)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                        quantity === qty
                          ? 'bg-purple-600 text-white'
                          : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                      }`}
                    >
                      +{qty.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !currentService}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold py-3.5 px-6 rounded-xl shadow-lg shadow-purple-600/25 transition-all flex items-center justify-center gap-2 text-base disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" /> Processing Order...
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5" /> Confirm & Place Order (${calculatedCost.toFixed(2)})
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Order Summary & Wallet Card */}
          <div className="space-y-6">
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-md shadow-xl">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" /> Order Summary
              </h3>

              <div className="space-y-4 text-sm divide-y divide-slate-800">
                <div className="flex justify-between items-center pt-2">
                  <span className="text-slate-400">Platform</span>
                  <span className="font-semibold text-white flex items-center gap-1.5">
                    {getPlatformIcon(selectedPlatform)} {selectedPlatform}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-3">
                  <span className="text-slate-400">Service</span>
                  <span className="font-medium text-slate-200 text-right max-w-[180px] truncate">
                    {currentService?.serviceName || 'N/A'}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-3">
                  <span className="text-slate-400">Rate per 1,000</span>
                  <span className="font-mono text-white">
                    ${currentService ? currentService.pricePer1000.toFixed(2) : '0.00'}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-3">
                  <span className="text-slate-400">Quantity</span>
                  <span className="font-mono text-white font-bold">
                    {quantity.toLocaleString()} units
                  </span>
                </div>

                <div className="flex justify-between items-center pt-3">
                  <span className="text-slate-400">Est. Start Time</span>
                  <span className="text-xs text-purple-300 bg-purple-500/10 px-2 py-1 rounded">
                    ~{currentService?.estimatedMinutes || 30} mins
                  </span>
                </div>

                <div className="pt-4 border-t border-slate-700 flex justify-between items-center">
                  <span className="text-base font-bold text-white">Total Charge</span>
                  <span className="text-2xl font-black text-purple-400 font-mono">
                    ${calculatedCost.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Wallet Balance Status */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-purple-950/40 border border-purple-500/20 rounded-2xl p-6 shadow-xl">
              <span className="text-xs uppercase font-semibold tracking-wider text-slate-400">Your Wallet Balance</span>
              <div className="text-3xl font-extrabold text-emerald-400 font-mono mt-1 mb-2">
                ${(user?.walletBalance || 0).toFixed(2)}
              </div>
              <p className="text-xs text-slate-400 mb-4">
                Funds are deducted instantly upon placing an order.
              </p>
              {user && user.walletBalance < calculatedCost && (
                <div className="text-xs bg-rose-500/20 text-rose-300 p-2.5 rounded-lg border border-rose-500/30">
                  ⚠️ Insufficient balance! Please deposit funds in your wallet to complete this order.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2 & 3: ORDERS TABLE (MY ORDERS / ADMIN ORDERS) */}
      {(activeTab === 'history' || activeTab === 'admin_manage') && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-md shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-purple-400" />
                {activeTab === 'admin_manage' ? 'All Platform Social Orders (Admin)' : 'My Social Ad Campaign Orders'}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Real-time status updates and order details.
              </p>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              {['all', 'pending', 'in_progress', 'completed', 'cancelled'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize whitespace-nowrap transition-all ${
                    statusFilter === st
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  {st.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {filteredCampaigns.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-slate-800 rounded-xl">
              <Share2 className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h3 className="text-slate-300 font-semibold">No Social Ad Orders Found</h3>
              <p className="text-xs text-slate-500 mt-1">Place your first order to start boosting your social reach!</p>
              <button
                onClick={() => setActiveTab('order')}
                className="mt-4 px-4 py-2 bg-purple-600 text-white text-xs font-semibold rounded-lg hover:bg-purple-500 transition-all inline-flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Place Order Now
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-800/80 text-xs uppercase text-slate-400 font-semibold">
                  <tr>
                    <th className="p-3.5 rounded-l-lg">Order ID</th>
                    {user?.role === 'admin' && activeTab === 'admin_manage' && <th className="p-3.5">User</th>}
                    <th className="p-3.5">Platform & Service</th>
                    <th className="p-3.5">Target Link</th>
                    <th className="p-3.5">Quantity</th>
                    <th className="p-3.5">Cost</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 rounded-r-lg text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {filteredCampaigns.map((cmp) => (
                    <tr key={cmp.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-3.5 font-mono text-xs text-purple-300 font-semibold">
                        #{cmp.id.slice(-6)}
                      </td>

                      {user?.role === 'admin' && activeTab === 'admin_manage' && (
                        <td className="p-3.5 text-xs text-white">
                          {cmp.userName}
                        </td>
                      )}

                      <td className="p-3.5">
                        <div className="flex items-center gap-2">
                          {getPlatformIcon(cmp.platform)}
                          <div>
                            <div className="font-semibold text-white text-xs">{cmp.platform}</div>
                            <div className="text-[11px] text-slate-400 max-w-[200px] truncate">{cmp.serviceName}</div>
                          </div>
                        </div>
                      </td>

                      <td className="p-3.5">
                        <a
                          href={cmp.targetLink}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 underline max-w-[180px] truncate"
                        >
                          <ExternalLink className="w-3 h-3 shrink-0" /> Link
                        </a>
                      </td>

                      <td className="p-3.5 font-mono text-xs text-slate-200">
                        {cmp.quantity.toLocaleString()}
                      </td>

                      <td className="p-3.5 font-mono text-xs font-bold text-emerald-400">
                        ${cmp.totalCost.toFixed(2)}
                      </td>

                      <td className="p-3.5">
                        {getStatusBadge(cmp.status)}
                      </td>

                      <td className="p-3.5 text-right space-x-2">
                        {/* Admin Action Controls */}
                        {user?.role === 'admin' && activeTab === 'admin_manage' ? (
                          <div className="inline-flex items-center gap-1">
                            {cmp.status === 'pending' && (
                              <button
                                onClick={() => updateSocialCampaignStatus(cmp.id, 'in_progress', 'Started delivery')}
                                className="px-2.5 py-1 bg-blue-600/20 text-blue-300 hover:bg-blue-600/30 border border-blue-500/30 rounded text-xs transition-all"
                              >
                                Start
                              </button>
                            )}
                            {cmp.status !== 'completed' && cmp.status !== 'cancelled' && (
                              <button
                                onClick={() => updateSocialCampaignStatus(cmp.id, 'completed', 'Delivery finished successfully')}
                                className="px-2.5 py-1 bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600/30 border border-emerald-500/30 rounded text-xs transition-all"
                              >
                                Complete
                              </button>
                            )}
                            {cmp.status !== 'cancelled' && (
                              <button
                                onClick={() => deleteSocialCampaign(cmp.id)}
                                className="px-2.5 py-1 bg-rose-600/20 text-rose-300 hover:bg-rose-600/30 border border-rose-500/30 rounded text-xs transition-all"
                              >
                                Cancel & Refund
                              </button>
                            )}
                          </div>
                        ) : (
                          /* User Action Controls */
                          cmp.status === 'pending' && (
                            <button
                              onClick={() => deleteSocialCampaign(cmp.id)}
                              className="px-2.5 py-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded text-xs transition-all inline-flex items-center gap-1"
                              title="Cancel order and refund wallet balance"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Cancel
                            </button>
                          )
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: ADMIN SERVICES MANAGER */}
      {user?.role === 'admin' && activeTab === 'admin_services' && (
        <div className="space-y-6">
          {/* Add Service Card */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-md shadow-xl">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-emerald-400" /> Add New Social Media Service / Package
            </h2>

            <form onSubmit={handleAddService} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Platform</label>
                <select
                  value={newSrvPlatform}
                  onChange={(e) => setNewSrvPlatform(e.target.value as SocialPlatform)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white text-sm"
                >
                  {availablePlatforms.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Service Type</label>
                <select
                  value={newSrvType}
                  onChange={(e) => setNewSrvType(e.target.value as SocialService['serviceType'])}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white text-sm"
                >
                  <option value="Followers">Followers / Subscribers</option>
                  <option value="Likes">Likes / Engagement</option>
                  <option value="Views">Video / Reel Views</option>
                  <option value="Comments">Comments</option>
                  <option value="Shares">Shares / Reposts</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Service Package Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Instagram Real Followers [HQ Fast]"
                  value={newSrvName}
                  onChange={(e) => setNewSrvName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Price per 1,000 ($)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={newSrvPrice}
                  onChange={(e) => setNewSrvPrice(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white text-sm font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Min Order Qty</label>
                <input
                  type="number"
                  required
                  value={newSrvMin}
                  onChange={(e) => setNewSrvMin(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white text-sm font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Max Order Qty</label>
                <input
                  type="number"
                  required
                  value={newSrvMax}
                  onChange={(e) => setNewSrvMax(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white text-sm font-mono"
                />
              </div>

              <div className="md:col-span-3">
                <label className="block text-xs font-semibold text-slate-400 mb-1">Description / Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Non-drop 30-day refill guarantee. Instant start speed."
                  value={newSrvDesc}
                  onChange={(e) => setNewSrvDesc(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white text-sm"
                />
              </div>

              <div className="md:col-span-3">
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2.5 px-6 rounded-xl transition-all inline-flex items-center gap-2 text-sm shadow-lg shadow-emerald-600/20"
                >
                  <Plus className="w-4 h-4" /> Save Service Package
                </button>
              </div>
            </form>
          </div>

          {/* Active Services List */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-md shadow-xl">
            <h3 className="text-lg font-bold text-white mb-4">Active Social Packages ({socialServices.length})</h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-800/80 text-xs uppercase text-slate-400">
                  <tr>
                    <th className="p-3">Platform</th>
                    <th className="p-3">Title</th>
                    <th className="p-3">Price / 1k</th>
                    <th className="p-3">Min / Max</th>
                    <th className="p-3">Active</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {socialServices.map((srv) => (
                    <tr key={srv.id} className="hover:bg-slate-800/40">
                      <td className="p-3 font-semibold text-white flex items-center gap-1.5">
                        {getPlatformIcon(srv.platform)} {srv.platform}
                      </td>
                      <td className="p-3">{srv.serviceName}</td>
                      <td className="p-3 font-mono text-emerald-400 font-bold">${srv.pricePer1000.toFixed(2)}</td>
                      <td className="p-3 font-mono text-xs">{srv.minQuantity.toLocaleString()} / {srv.maxQuantity.toLocaleString()}</td>
                      <td className="p-3">
                        <button
                          onClick={() => updateSocialService(srv.id, { active: !srv.active })}
                          className={`px-2 py-0.5 rounded text-xs font-semibold ${
                            srv.active ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-700 text-slate-400'
                          }`}
                        >
                          {srv.active ? 'Active' : 'Disabled'}
                        </button>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => deleteSocialService(srv.id)}
                          className="p-1.5 text-rose-400 hover:bg-rose-500/20 rounded transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
