import React, { useState } from 'react';
import {
  Users, DollarSign, Share2, Copy, CheckCircle, Percent, ArrowUpRight,
  Gift, Wallet, Sparkles, ExternalLink, ShieldCheck, HelpCircle, Search, Info,
  RefreshCw, TrendingUp, Send, Clock, Edit3, MessageCircle, Twitter, Facebook
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
    (user?.referralCode && (u.referredBy === user.referralCode || (u as any).referred_by === user.referralCode || u.referredBy?.toUpperCase() === user.referralCode?.toUpperCase()))
  );

  // Filter commission records for current user
  const myCommissions = referrals.filter(r => 
    (user?.id && r.referrerId === user.id) ||
    (user?.referralCode && (r.referrerId === user.referralCode || r.referrerId?.toUpperCase() === user.referralCode?.toUpperCase()))
  );

  // Filter withdrawal requests for current user
  const myWithdrawals = withdrawalRequests.filter(w => w.userId === user?.id);

  // Filter commission rate increase requests for current user
  const myCommissionRequests = commissionRequests.filter(c => c.userId === user?.id);

  // Calculate total earnings
  const totalEarningsFromRecords = myCommissions.reduce((acc, r) => acc + (r.commissionAmount || 0), 0);
  const displayTotalEarnings = Math.max(user?.totalReferralEarnings || 0, totalEarningsFromRecords);
  
  // Calculate display referral balance so it is never 0 if commission records exist
  const rawRefBal = user?.referralBalance || 0;
  const displayReferralBalance = rawRefBal > 0 ? rawRefBal : (myWithdrawals.length === 0 ? totalEarningsFromRecords : rawRefBal);
  
  const currentRatePercent = Math.round(((user?.customReferralRate || 0.05) * 100));

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    triggerToast('Referral Link Copied! 📋', `Share it with advertisers & webmasters to earn ${currentRatePercent}% cash commissions.`, 'success');
    setTimeout(() => setCopied(false), 3000);
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(`🚀 Join TrafficSell to get high quality website traffic & social ad growth! Register here: ${referralLink}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleShareTelegram = () => {
    const text = encodeURIComponent(`🚀 Boost your website traffic with TrafficSell! Sign up using my referral link and get 20% bonus traffic: ${referralLink}`);
    window.open(`https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${text}`, '_blank');
  };

  const handleShareTwitter = () => {
    const text = encodeURIComponent(`🚀 Join TrafficSell for real human website traffic & social ad growth!`);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(referralLink)}`, '_blank');
  };

  const handleShareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`, '_blank');
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
      
      {/* Top Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-950 p-6 md:p-8 text-white shadow-2xl border border-slate-800 space-y-6">
        <div className="absolute -right-12 -top-12 h-80 w-80 rounded-full bg-[#DFFF2F]/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Left Column: Link & Share Controls */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#DFFF2F]/10 border border-[#DFFF2F]/20 text-[#DFFF2F] text-xs font-bold uppercase tracking-wider">
              <Gift className="w-4 h-4 text-[#DFFF2F] animate-pulse" />
              <span>Lifetime {currentRatePercent}% Cash Commission Program</span>
            </div>

            <h1 className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tight text-white">
              Earn <span className="text-[#DFFF2F]">{currentRatePercent}% Passive Income</span> on Every Deposit
            </h1>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-xl">
              Invite webmasters, media buyers, agency owners, and digital marketers. Whenever they deposit into their wallet, <strong className="text-[#DFFF2F]">{currentRatePercent}% cash bonus</strong> is instantly added to your referral balance!
            </p>

            {/* Referral Link Input & Custom Code Button */}
            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between max-w-xl">
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                  Your Referral Link & Partner Code
                </label>
                <button
                  type="button"
                  onClick={() => setEditingCode(!editingCode)}
                  className="text-xs font-black text-[#DFFF2F] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>{editingCode ? 'Cancel Editing' : 'Edit Referral Code (4-6 Chars)'}</span>
                </button>
              </div>

              {editingCode ? (
                <div className="p-3.5 bg-slate-900 border border-[#DFFF2F]/40 rounded-2xl space-y-2.5 max-w-xl animate-fadeIn">
                  <p className="text-xs text-slate-300">
                    Enter a custom 4 to 6 character code (e.g. <span className="text-[#DFFF2F] font-mono font-bold">VIP777</span> or <span className="text-[#DFFF2F] font-mono font-bold">ADS99</span>):
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customCodeInput}
                      onChange={(e) => setCustomCodeInput(e.target.value.toUpperCase())}
                      placeholder="e.g. TRAF01"
                      maxLength={6}
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

            {/* Easy-to-Use Social Quick Links (WhatsApp, Telegram, Twitter, Facebook) */}
            <div className="space-y-2 pt-1">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block">
                Quick Share Links:
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleShareWhatsApp}
                  className="px-3.5 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 font-extrabold text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
                >
                  <MessageCircle className="w-3.5 h-3.5 fill-emerald-400 text-slate-950" />
                  <span>WhatsApp</span>
                </button>

                <button
                  onClick={handleShareTelegram}
                  className="px-3.5 py-2 rounded-xl bg-sky-500/15 hover:bg-sky-500/25 text-sky-400 border border-sky-500/30 font-extrabold text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
                >
                  <Send className="w-3.5 h-3.5 fill-sky-400 text-slate-950" />
                  <span>Telegram</span>
                </button>

                <button
                  onClick={handleShareTwitter}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-extrabold text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
                >
                  <Twitter className="w-3.5 h-3.5 text-sky-400" />
                  <span>Twitter (X)</span>
                </button>

                <button
                  onClick={handleShareFacebook}
                  className="px-3.5 py-2 rounded-xl bg-blue-600/15 hover:bg-blue-600/25 text-blue-400 border border-blue-600/30 font-extrabold text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
                >
                  <Facebook className="w-3.5 h-3.5 text-blue-400" />
                  <span>Facebook</span>
                </button>

                <button
                  onClick={handleCopyLink}
                  className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 font-extrabold text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
                >
                  <Copy className="w-3.5 h-3.5 text-[#DFFF2F]" />
                  <span>Copy Link</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Compact Box for Referral Earnings & Action Pop-ups */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-sm rounded-2xl bg-slate-900/90 border border-slate-800 p-5 shadow-2xl space-y-4">
              
              {/* Balance Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-xl bg-[#DFFF2F]/10 text-[#DFFF2F] border border-[#DFFF2F]/20">
                    <Wallet className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Referral Earning Wallet</p>
                    <p className="text-2xl font-black text-white">{formatMoney(displayReferralBalance)}</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-black border border-emerald-500/20">
                  {currentRatePercent}% Rate
                </span>
              </div>

              {/* Action Buttons Box */}
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setIsWithdrawOpen(true)}
                    className="py-2.5 px-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <ArrowUpRight className="w-4 h-4 stroke-[3]" />
                    <span>Withdraw</span>
                  </button>

                  <button
                    onClick={() => setIsTransferOpen(true)}
                    className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-xs rounded-xl border border-slate-700 transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-[#DFFF2F]" />
                    <span>Transfer</span>
                  </button>
                </div>

                <button
                  onClick={() => setIsCommissionReqOpen(true)}
                  className="w-full py-2.5 px-3 bg-slate-950 hover:bg-slate-900 text-[#DFFF2F] font-bold text-xs rounded-xl border border-slate-800 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Request Commission Increase</span>
                </button>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 text-center">
                💳 Payouts via <strong>EasyPaisa, JazzCash, USDT TRC20 & PayPal</strong> ($1 Min).
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4-Grid Stat Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 shadow-lg">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Total Referred Users</span>
            <Users className="w-4 h-4 text-[#DFFF2F]" />
          </div>
          <p className="text-2xl font-black text-white">{myReferredUsers.length}</p>
          <p className="text-[11px] text-slate-400">Active registered affiliates</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 shadow-lg">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Referral Earning Wallet</span>
            <Wallet className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-emerald-400">{formatMoney(displayReferralBalance)}</p>
          <p className="text-[11px] text-slate-400">Available to withdraw or transfer</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 shadow-lg">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Total Commission Earned</span>
            <DollarSign className="w-4 h-4 text-[#DFFF2F]" />
          </div>
          <p className="text-2xl font-black text-white">{formatMoney(displayTotalEarnings)}</p>
          <p className="text-[11px] text-slate-400">Lifetime referral earnings</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 shadow-lg">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Commission Rate</span>
            <Percent className="w-4 h-4 text-sky-400" />
          </div>
          <p className="text-2xl font-black text-[#DFFF2F]">{currentRatePercent}%</p>
          <p className="text-[11px] text-slate-400">Custom partner commission level</p>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('referred_users')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                activeTab === 'referred_users'
                  ? 'bg-[#DFFF2F] text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              Referred Users ({myReferredUsers.length})
            </button>
            <button
              onClick={() => setActiveTab('commissions')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                activeTab === 'commissions'
                  ? 'bg-[#DFFF2F] text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              Commission Log ({myCommissions.length})
            </button>
            <button
              onClick={() => setActiveTab('withdrawals')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                activeTab === 'withdrawals'
                  ? 'bg-[#DFFF2F] text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              Withdrawals ({myWithdrawals.length})
            </button>
            <button
              onClick={() => setActiveTab('requests')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                activeTab === 'requests'
                  ? 'bg-[#DFFF2F] text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              Rate Requests ({myCommissionRequests.length})
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search referrals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#DFFF2F]"
            />
          </div>
        </div>

        {/* Tab 1: Referred Users List */}
        {activeTab === 'referred_users' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 text-slate-400 uppercase font-mono text-[10px]">
                <tr>
                  <th className="pb-3">User Name</th>
                  <th className="pb-3">Email Address</th>
                  <th className="pb-3">Registration Date</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredReferredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-slate-400">
                      No referred users found. Share your referral link to invite your first partner!
                    </td>
                  </tr>
                ) : (
                  filteredReferredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-800/40">
                      <td className="py-3.5 font-extrabold text-white flex items-center gap-2">
                        <img src={u.avatar} alt={u.fullName} className="w-6 h-6 rounded-full object-cover" />
                        <span>{u.fullName}</span>
                      </td>
                      <td className="py-3.5 text-slate-300 font-mono text-[11px]">{u.email}</td>
                      <td className="py-3.5 text-slate-400 font-mono text-[10px]">{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td className="py-3.5">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          Active Affiliate
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2: Commission History */}
        {activeTab === 'commissions' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 text-slate-400 uppercase font-mono text-[10px]">
                <tr>
                  <th className="pb-3">Referred User</th>
                  <th className="pb-3">Deposit Amount</th>
                  <th className="pb-3">Commission Earned</th>
                  <th className="pb-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredCommissions.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-slate-400">
                      No referral commission earnings recorded yet.
                    </td>
                  </tr>
                ) : (
                  filteredCommissions.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-800/40">
                      <td className="py-3.5">
                        <p className="font-extrabold text-white">{c.referredUserName}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{c.referredUserEmail}</p>
                      </td>
                      <td className="py-3.5 font-bold text-white">${c.depositAmount.toFixed(2)}</td>
                      <td className="py-3.5 font-black text-emerald-400 font-mono">+${c.commissionAmount.toFixed(2)}</td>
                      <td className="py-3.5 text-slate-400 font-mono text-[10px]">{new Date(c.createdAt).toLocaleString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 3: Withdrawals History */}
        {activeTab === 'withdrawals' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 text-slate-400 uppercase font-mono text-[10px]">
                <tr>
                  <th className="pb-3">ID</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Method</th>
                  <th className="pb-3">Account / Address</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {myWithdrawals.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      No withdrawal requests placed yet.
                    </td>
                  </tr>
                ) : (
                  myWithdrawals.map((w) => (
                    <tr key={w.id} className="hover:bg-slate-800/40">
                      <td className="py-3.5 font-mono text-[#DFFF2F] font-bold">{w.id}</td>
                      <td className="py-3.5 font-black text-white">${w.amount.toFixed(2)}</td>
                      <td className="py-3.5 font-bold text-amber-400">{w.method}</td>
                      <td className="py-3.5 font-mono text-slate-300">
                        {w.accountTitle && <div className="text-white font-bold">{w.accountTitle}</div>}
                        {w.accountNumber && <div>{w.accountNumber}</div>}
                        {w.cryptoAddress && <div className="text-[#DFFF2F] break-all max-w-xs">{w.cryptoAddress}</div>}
                      </td>
                      <td className="py-3.5 text-slate-400 font-mono text-[10px]">{new Date(w.createdAt).toLocaleString()}</td>
                      <td className="py-3.5">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                          w.status === 'approved' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                          (w.status === 'in review' || w.status === 'pending') ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse' :
                          'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        }`}>
                          {w.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 4: Commission Rate Requests */}
        {activeTab === 'requests' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 text-slate-400 uppercase font-mono text-[10px]">
                <tr>
                  <th className="pb-3">Requested Rate</th>
                  <th className="pb-3">Promotional Channel</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {myCommissionRequests.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-slate-400">
                      No rate increase applications submitted yet.
                    </td>
                  </tr>
                ) : (
                  myCommissionRequests.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-800/40">
                      <td className="py-3.5 font-black text-[#DFFF2F] text-sm">{c.requestedRate}%</td>
                      <td className="py-3.5 text-slate-300">
                        <div className="font-bold text-white">{c.socialPlatform || 'Promo Channel'}</div>
                        <div className="text-[11px] text-slate-400 line-clamp-1">{c.message}</div>
                      </td>
                      <td className="py-3.5 text-slate-400 font-mono text-[10px]">{new Date(c.createdAt).toLocaleDateString()}</td>
                      <td className="py-3.5">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                          c.status === 'approved' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                          (c.status === 'in review' || c.status === 'pending') ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse' :
                          'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        }`}>
                          {c.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Render Modals */}
      <WithdrawalModal isOpen={isWithdrawOpen} onClose={() => setIsWithdrawOpen(false)} />
      <TransferModal isOpen={isTransferOpen} onClose={() => setIsTransferOpen(false)} />
      <CommissionRequestModal isOpen={isCommissionReqOpen} onClose={() => setIsCommissionReqOpen(false)} />
    </div>
  );
};
