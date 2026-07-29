import React, { useState } from 'react';
import {
  Users, DollarSign, Share2, Copy, CheckCircle, Percent, ArrowUpRight,
  Gift, Wallet, Sparkles, ExternalLink, ShieldCheck, HelpCircle, Search, Info,
  RefreshCw, TrendingUp, Send, Clock
} from 'lucide-react';
import { useStore } from '../../lib/store';
import { triggerToast } from '../../lib/notifications';
import { WithdrawalModal } from '../modals/WithdrawalModal';
import { TransferModal } from '../modals/TransferModal';
import { CommissionRequestModal } from '../modals/CommissionRequestModal';

export const ReferralView: React.FC = () => {
  const { user, allUsers, referrals, withdrawalRequests, commissionRequests, getReferralLink, updateCustomReferralCode, formatMoney } = useStore();
  const [copied, setCopied] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'referred_users' | 'commissions' | 'withdrawals' | 'requests'>('referred_users');

  // Custom referral code state
  const [editingCode, setEditingCode] = useState(false);
  const [customCodeInput, setCustomCodeInput] = useState(user?.referralCode || '');
  const [updatingCode, setUpdatingCode] = useState(false);

  // Modals state
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [isCommissionReqOpen, setIsCommissionReqOpen] = useState(false);

  const referralLink = getReferralLink(user);

  // Filter users referred by current user
  const myReferredUsers = allUsers.filter(u => 
    (user?.id && (u.referredBy === user.id || (u as any).referred_by === user.id)) ||
    (user?.referralCode && (u.referredBy === user.referralCode || (u as any).referred_by === user.referralCode))
  );

  // Filter commission records for current user
  const myCommissions = referrals.filter(r => 
    (user?.id && r.referrerId === user.id) ||
    (user?.referralCode && r.referrerId === user.referralCode)
  );

  // Filter withdrawal requests for current user
  const myWithdrawals = withdrawalRequests.filter(w => w.userId === user?.id);

  // Filter commission rate increase requests for current user
  const myCommissionRequests = commissionRequests.filter(c => c.userId === user?.id);

  // Calculate total earnings
  const totalEarningsFromRecords = myCommissions.reduce((acc, r) => acc + r.commissionAmount, 0);
  const displayTotalEarnings = Math.max(user?.totalReferralEarnings || 0, totalEarningsFromRecords);
  const currentRatePercent = Math.round(((user?.customReferralRate || 0.05) * 100));

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    triggerToast('Referral Link Copied! 📋', `Share it with advertisers & webmasters to earn ${currentRatePercent}% cash commissions.`, 'success');
    setTimeout(() => setCopied(false), 3000);
  };

  const handleShareTelegram = () => {
    const text = encodeURIComponent(`🚀 Boost your website traffic with TrafficSell! Sign up using my referral link and get 20% bonus traffic: ${referralLink}`);
    window.open(`https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${text}`, '_blank');
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(`🚀 Join TrafficSell to get high quality website traffic & social ad growth! Register here: ${referralLink}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const filteredReferredUsers = myReferredUsers.filter(u =>
    u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCommissions = myCommissions.filter(c =>
    c.referredUserName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.referredUserEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fadeIn pb-12 max-w-7xl mx-auto">
      
      {/* Top Hero Banner - Synced with Platform Primary Colors */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-950 p-6 md:p-8 text-white shadow-2xl border border-slate-800 space-y-6">
        <div className="absolute -right-12 -top-12 h-80 w-80 rounded-full bg-[#DFFF2F]/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#DFFF2F]/10 border border-[#DFFF2F]/20 text-[#DFFF2F] text-xs font-bold uppercase tracking-wider">
              <Gift className="w-4 h-4 text-[#DFFF2F] animate-pulse" />
              <span>Lifetime {currentRatePercent}% Cash Commission</span>
            </div>

            <h1 className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tight text-white">
              Earn <span className="text-[#DFFF2F]">{currentRatePercent}% Passive Income</span> on Every Deposit
            </h1>

            <p className="text-slate-300 text-sm leading-relaxed max-w-xl">
              Invite webmasters, media buyers, agency owners, and affiliate marketers to TrafficSell.
              Whenever they make a deposit into their wallet, <strong className="text-[#DFFF2F]">{currentRatePercent}% of the deposited amount</strong> is automatically credited to your referral balance!
            </p>

            {/* Referral Link & Custom Code Box */}
            <div className="pt-2 space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                  Your Unique Referral Link & Custom Partner Code
                </label>
                <button
                  type="button"
                  onClick={() => setEditingCode(!editingCode)}
                  className="text-xs font-extrabold text-[#DFFF2F] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>{editingCode ? 'Cancel Custom Code' : '✏️ Edit Referral Code'}</span>
                </button>
              </div>

              {editingCode ? (
                <div className="p-3 bg-slate-900 border border-[#DFFF2F]/40 rounded-2xl space-y-2 max-w-xl animate-fadeIn">
                  <p className="text-[11px] text-slate-300">
                    Set a custom 4-12 character referral code (alphanumeric, e.g. <span className="text-[#DFFF2F] font-mono font-bold">PRO2026</span> or <span className="text-[#DFFF2F] font-mono font-bold">789012</span>):
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customCodeInput}
                      onChange={(e) => setCustomCodeInput(e.target.value.toUpperCase())}
                      placeholder="e.g. TRAFFIC100"
                      maxLength={12}
                      className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-[#DFFF2F] focus:outline-none focus:border-[#DFFF2F]"
                    />
                    <button
                      type="button"
                      disabled={updatingCode || !customCodeInput.trim()}
                      onClick={async () => {
                        setUpdatingCode(true);
                        const res = await updateCustomReferralCode(customCodeInput);
                        setUpdatingCode(false);
                        if (res.success) setEditingCode(false);
                      }}
                      className="px-4 py-2 bg-[#DFFF2F] hover:bg-[#cbe620] text-slate-950 font-black text-xs rounded-xl transition-all cursor-pointer disabled:opacity-50"
                    >
                      {updatingCode ? 'Saving...' : 'Save Code'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-2 max-w-xl">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      readOnly
                      value={referralLink}
                      className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-4 py-3 text-xs text-[#DFFF2F] font-mono focus:outline-none focus:border-[#DFFF2F] pr-10"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                      <Share2 className="w-4 h-4" />
                    </div>
                  </div>

                  <button
                    onClick={handleCopyLink}
                    className={`px-5 py-3 rounded-2xl font-black text-xs transition-all flex items-center justify-center gap-2 shrink-0 shadow-lg cursor-pointer ${
                      copied
                        ? 'bg-emerald-500 text-slate-950 shadow-emerald-950/30'
                        : 'bg-[#DFFF2F] hover:bg-[#cbe620] text-slate-950 shadow-slate-950/40 active:scale-95'
                    }`}
                  >
                    {copied ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copy Referral Link</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Quick Social Sharing */}
            <div className="flex items-center gap-3 pt-1 text-xs text-slate-400">
              <span className="font-bold">Quick Share:</span>
              <button
                onClick={handleShareTelegram}
                className="px-3 py-1.5 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/20 transition-colors flex items-center gap-1.5 font-bold cursor-pointer"
              >
                <span>Telegram</span>
                <ExternalLink className="w-3 h-3" />
              </button>
              <button
                onClick={handleShareWhatsApp}
                className="px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 transition-colors flex items-center gap-1.5 font-bold cursor-pointer"
              >
                <span>WhatsApp</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Quick Actions Panel */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-5 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-[#DFFF2F]/10 text-[#DFFF2F]">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Referral Wallet Balance</p>
                    <p className="text-xl font-black text-white">{formatMoney(user?.referralBalance || 0)}</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-black border border-emerald-500/20">
                  {currentRatePercent}% Rate
                </span>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={() => setIsWithdrawOpen(true)}
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ArrowUpRight className="w-4 h-4" />
                  <span>Withdraw Referral Earnings ($1 Min)</span>
                </button>

                <button
                  onClick={() => setIsTransferOpen(true)}
                  className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-xs rounded-xl border border-slate-700 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4 text-[#DFFF2F]" />
                  <span>Transfer to Deposit Wallet (0% Fee)</span>
                </button>

                <button
                  onClick={() => setIsCommissionReqOpen(true)}
                  className="w-full py-2.5 bg-slate-950 hover:bg-slate-900 text-[#DFFF2F] font-bold text-xs rounded-xl border border-slate-800 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Request Commission Rate Increase</span>
                </button>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400">
                💡 Payouts supported via <strong>JazzCash, EasyPaisa, USDT (TRC20/BEP20/ERC20) & PayPal</strong>.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4-Grid Stat Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat 1: Total Referrals */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Total Referrals</span>
            <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-[#DFFF2F]">
              <Users className="w-5 h-5 text-slate-900 dark:text-[#DFFF2F]" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 dark:text-white">
            {myReferredUsers.length}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Users registered via your link
          </p>
        </div>

        {/* Stat 2: Total Commission Earnings */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Lifetime Earnings</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-emerald-500">
            {formatMoney(displayTotalEarnings)}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Total lifetime commissions earned
          </p>
        </div>

        {/* Stat 3: Commission Rate */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Commission Rate</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Percent className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-amber-400">
            {currentRatePercent}%
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>Automated rate</span>
            <button onClick={() => setIsCommissionReqOpen(true)} className="text-[#DFFF2F] hover:underline font-bold">Request More</button>
          </p>
        </div>

        {/* Stat 4: Referral Balance */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Referral Balance</span>
            <div className="p-2 rounded-xl bg-slate-900 text-[#DFFF2F]">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 dark:text-[#DFFF2F]">
            {formatMoney(user?.referralBalance || 0)}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>Ready for withdrawal</span>
            <button onClick={() => setIsWithdrawOpen(true)} className="text-emerald-400 hover:underline font-extrabold">Withdraw</button>
          </p>
        </div>
      </div>

      {/* How It Works */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-6">
        <div>
          <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#DFFF2F]" />
            <span>How TrafficSell Referral Commissions Work</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Earn high lifetime commissions with transparent tracking and instant payout options
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 p-5 space-y-3">
            <div className="w-8 h-8 rounded-xl bg-slate-900 text-[#DFFF2F] font-black text-sm flex items-center justify-center">
              1
            </div>
            <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Share Your Link</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Copy your unique referral link and share it on Telegram, forums, YouTube, blogs, or directly with fellow digital marketers.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 p-5 space-y-3">
            <div className="w-8 h-8 rounded-xl bg-slate-900 text-[#DFFF2F] font-black text-sm flex items-center justify-center">
              2
            </div>
            <h3 className="font-extrabold text-slate-900 dark:text-white text-base">User Registers</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              When someone registers via your link, your referral code is automatically assigned to their account forever.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 p-5 space-y-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500 text-slate-950 font-black text-sm flex items-center justify-center">
              3
            </div>
            <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Earn & Withdraw</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Whenever your referral adds funds to run ads, {currentRatePercent}% is credited to your Referral Wallet. Withdraw to JazzCash/USDT or transfer to your Deposit Wallet!
            </p>
          </div>
        </div>
      </div>

      {/* Referrals & Commissions Data Tables */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden space-y-0">
        
        {/* Header Tabs & Search */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveTab('referred_users')}
              className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'referred_users'
                  ? 'bg-slate-900 text-[#DFFF2F] dark:bg-[#DFFF2F] dark:text-slate-950 shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Referred Users ({myReferredUsers.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('commissions')}
              className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'commissions'
                  ? 'bg-slate-900 text-[#DFFF2F] dark:bg-[#DFFF2F] dark:text-slate-950 shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <DollarSign className="w-4 h-4" />
              <span>Commission Logs ({myCommissions.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('withdrawals')}
              className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'withdrawals'
                  ? 'bg-slate-900 text-[#DFFF2F] dark:bg-[#DFFF2F] dark:text-slate-950 shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <ArrowUpRight className="w-4 h-4" />
              <span>Withdrawal History ({myWithdrawals.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('requests')}
              className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'requests'
                  ? 'bg-slate-900 text-[#DFFF2F] dark:bg-[#DFFF2F] dark:text-slate-950 shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Rate Increase Requests ({myCommissionRequests.length})</span>
            </button>
          </div>

          <div className="relative max-w-xs w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search referrals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:border-[#DFFF2F]"
            />
          </div>
        </div>

        {/* Tab 1: Referred Users Table */}
        {activeTab === 'referred_users' && (
          <div className="overflow-x-auto">
            {filteredReferredUsers.length > 0 ? (
              <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                <thead className="bg-slate-50 dark:bg-slate-950 text-slate-400 uppercase tracking-wider font-mono text-[10px] border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="px-6 py-3.5">User</th>
                    <th className="px-6 py-3.5">Email</th>
                    <th className="px-6 py-3.5">Joined Date</th>
                    <th className="px-6 py-3.5">Status</th>
                    <th className="px-6 py-3.5 text-right">Commissions Generated</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredReferredUsers.map((u) => {
                    const userCommissions = myCommissions
                      .filter(c => c.referredUserId === u.id)
                      .reduce((sum, c) => sum + c.commissionAmount, 0);

                    return (
                      <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="px-6 py-4 font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
                          <img
                            src={u.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250'}
                            alt={u.fullName}
                            className="w-7 h-7 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                          />
                          <span>{u.fullName}</span>
                        </td>
                        <td className="px-6 py-4 text-slate-500 dark:text-slate-400 font-mono">
                          {u.email}
                        </td>
                        <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                          {new Date(u.createdAt).toLocaleDateString(undefined, {
                            year: 'numeric', month: 'short', day: 'numeric'
                          })}
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <CheckCircle className="w-3 h-3" /> Active
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right font-black text-emerald-500 text-sm">
                          {formatMoney(userCommissions)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div className="p-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  No Referrals Registered Yet
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                  Copy your unique referral link above and share it with friends or on social media to start earning passive income!
                </p>
                <button
                  onClick={handleCopyLink}
                  className="px-4 py-2 rounded-xl bg-[#DFFF2F] text-slate-950 font-black text-xs inline-flex items-center gap-2 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Your Referral Link</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Commission History Table */}
        {activeTab === 'commissions' && (
          <div className="overflow-x-auto">
            {filteredCommissions.length > 0 ? (
              <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                <thead className="bg-slate-50 dark:bg-slate-950 text-slate-400 uppercase tracking-wider font-mono text-[10px] border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="px-6 py-3.5">Date</th>
                    <th className="px-6 py-3.5">Referred User</th>
                    <th className="px-6 py-3.5">User Deposit Amount</th>
                    <th className="px-6 py-3.5 text-right">Commission Earned</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredCommissions.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4 text-slate-500 dark:text-slate-400 font-mono">
                        {new Date(c.createdAt).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                        <div>{c.referredUserName}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{c.referredUserEmail}</div>
                      </td>
                      <td className="px-6 py-4 text-slate-700 dark:text-slate-300 font-bold">
                        {formatMoney(c.depositAmount)}
                      </td>
                      <td className="px-6 py-4 text-right font-black text-emerald-500 text-sm">
                        +{formatMoney(c.commissionAmount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
                  <DollarSign className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  No Commission Logs Yet
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                  When users who registered via your referral link make wallet deposits, commission logs will be listed here automatically!
                </p>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Withdrawal Requests History */}
        {activeTab === 'withdrawals' && (
          <div className="overflow-x-auto">
            {myWithdrawals.length > 0 ? (
              <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                <thead className="bg-slate-50 dark:bg-slate-950 text-slate-400 uppercase tracking-wider font-mono text-[10px] border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="px-6 py-3.5">Withdrawal ID</th>
                    <th className="px-6 py-3.5">Method</th>
                    <th className="px-6 py-3.5">Account / Address</th>
                    <th className="px-6 py-3.5">Amount</th>
                    <th className="px-6 py-3.5">Status</th>
                    <th className="px-6 py-3.5">Date</th>
                    <th className="px-6 py-3.5">Admin Note</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {myWithdrawals.map((w) => (
                    <tr key={w.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4 font-mono font-bold text-[#DFFF2F]">{w.id}</td>
                      <td className="px-6 py-4 font-extrabold text-slate-900 dark:text-white">{w.method}</td>
                      <td className="px-6 py-4 font-mono text-slate-400">
                        {w.accountNumber || w.cryptoAddress || w.accountTitle || '-'}
                      </td>
                      <td className="px-6 py-4 font-black text-emerald-400 text-sm">{formatMoney(w.amount)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          w.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                          w.status === 'in review' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                          'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}>
                          {w.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-400 font-mono text-[11px]">
                        {new Date(w.createdAt).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-slate-400 italic text-[11px]">
                        {w.adminNote || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
                  <ArrowUpRight className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  No Withdrawal Requests Yet
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                  Click the "Withdraw Referral Earnings" button above to request payout to JazzCash, EasyPaisa, USDT, or PayPal!
                </p>
                <button
                  onClick={() => setIsWithdrawOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-emerald-500 text-white font-black text-xs inline-flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <ArrowUpRight className="w-4 h-4" />
                  <span>Withdraw Now ($1 Minimum)</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Rate Increase Requests History */}
        {activeTab === 'requests' && (
          <div className="overflow-x-auto">
            {myCommissionRequests.length > 0 ? (
              <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                <thead className="bg-slate-50 dark:bg-slate-950 text-slate-400 uppercase tracking-wider font-mono text-[10px] border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="px-6 py-3.5">Request ID</th>
                    <th className="px-6 py-3.5">Requested Rate</th>
                    <th className="px-6 py-3.5">Target Volume</th>
                    <th className="px-6 py-3.5">Channel / Proof</th>
                    <th className="px-6 py-3.5">Status</th>
                    <th className="px-6 py-3.5">Date</th>
                    <th className="px-6 py-3.5">Admin Note</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {myCommissionRequests.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4 font-mono font-bold text-[#DFFF2F]">{c.id}</td>
                      <td className="px-6 py-4 font-black text-amber-400 text-sm">{c.requestedRate}%</td>
                      <td className="px-6 py-4 font-bold text-slate-300">{c.referralsCount} users/mo</td>
                      <td className="px-6 py-4 text-slate-300">
                        <div className="font-bold">{c.socialPlatform || 'Social Promotion'}</div>
                        {c.proofUrl && (
                          <a href={c.proofUrl} target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:underline text-[11px] flex items-center gap-1 font-mono mt-0.5">
                            <span>Proof Link</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          c.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                          c.status === 'in review' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse' :
                          'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-400 font-mono text-[11px]">
                        {new Date(c.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-slate-400 italic text-[11px]">
                        {c.adminNote || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  No Rate Increase Requests Submitted
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                  If you drive high traffic or run blogs/Telegram channels, submit a rate increase request to earn up to 15% cash commissions!
                </p>
                <button
                  onClick={() => setIsCommissionReqOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-[#DFFF2F] text-slate-950 font-black text-xs inline-flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <TrendingUp className="w-4 h-4" />
                  <span>Request Commission Increase</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      <WithdrawalModal
        isOpen={isWithdrawOpen}
        onClose={() => setIsWithdrawOpen(false)}
      />
      <TransferModal
        isOpen={isTransferOpen}
        onClose={() => setIsTransferOpen(false)}
      />
      <CommissionRequestModal
        isOpen={isCommissionReqOpen}
        onClose={() => setIsCommissionReqOpen(false)}
      />
    </div>
  );
};
