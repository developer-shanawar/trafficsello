import React, { useState } from 'react';
import {
  Users, DollarSign, Share2, Copy, CheckCircle, Percent, ArrowUpRight,
  Gift, Wallet, Sparkles, ExternalLink, ShieldCheck, HelpCircle, Search, Info
} from 'lucide-react';
import { useStore } from '../../lib/store';
import { triggerToast } from '../../lib/notifications';

export const ReferralView: React.FC = () => {
  const { user, allUsers, referrals, getReferralLink, formatMoney } = useStore();
  const [copied, setCopied] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'referred_users' | 'commissions'>('referred_users');

  const referralLink = getReferralLink(user);

  // Filter users referred by current user
  const myReferredUsers = allUsers.filter(u => u.referredBy === user?.id || (u as any).referred_by === user?.id);

  // Filter commission records for current user
  const myCommissions = referrals.filter(r => r.referrerId === user?.id);

  // Calculate total earnings
  const totalEarningsFromRecords = myCommissions.reduce((acc, r) => acc + r.commissionAmount, 0);
  const displayTotalEarnings = Math.max(user?.totalReferralEarnings || 0, totalEarningsFromRecords);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    triggerToast('Referral Link Copied! 📋', 'Share it with advertisers & webmasters to earn 5% cash commissions.', 'success');
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
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Top Banner / Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-900 via-slate-900 to-purple-950 p-6 md:p-8 text-white shadow-2xl border border-indigo-500/20">
        <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-12 -bottom-12 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
              <Gift className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>Lifetime 5% Cash Commission</span>
            </div>

            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-white">
              Earn <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 bg-clip-text text-transparent">5% Passive Income</span> on Every Deposit
            </h1>

            <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-xl">
              Invite webmasters, media buyers, agency owners, and affiliate marketers to TrafficSell.
              Whenever they make a deposit into their wallet, <strong className="text-amber-300">5% of the deposited amount is automatically credited</strong> to your account!
            </p>

            {/* Referral Link Box */}
            <div className="pt-2">
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Your Unique Referral Link
              </label>
              <div className="flex flex-col sm:flex-row gap-2 max-w-xl">
                <div className="relative flex-1">
                  <input
                    type="text"
                    readOnly
                    value={referralLink}
                    className="w-full bg-slate-950/80 border border-indigo-500/30 rounded-xl px-4 py-3 text-sm text-indigo-200 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-10 selection:bg-indigo-500/40"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-400">
                    <Share2 className="w-4 h-4" />
                  </div>
                </div>

                <button
                  onClick={handleCopyLink}
                  className={`px-5 py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 shrink-0 shadow-lg ${
                    copied
                      ? 'bg-emerald-600 text-white shadow-emerald-900/30'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-900/40 active:scale-95'
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
            </div>

            {/* Quick Social Sharing */}
            <div className="flex items-center gap-3 pt-1 text-xs text-slate-400">
              <span>Quick Share:</span>
              <button
                onClick={handleShareTelegram}
                className="px-3 py-1.5 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/20 transition-colors flex items-center gap-1.5 font-medium"
              >
                <span>Telegram</span>
                <ExternalLink className="w-3 h-3" />
              </button>
              <button
                onClick={handleShareWhatsApp}
                className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 transition-colors flex items-center gap-1.5 font-medium"
              >
                <span>WhatsApp</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Banner Graphic Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-sm rounded-xl bg-slate-900/80 border border-indigo-500/30 p-5 backdrop-blur-md shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Commission Program</p>
                    <p className="text-sm font-bold text-white">5% Automated Cash Back</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-400 text-xs font-semibold border border-emerald-500/30">
                  Active
                </span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Referral Level:</span>
                  <span className="font-semibold text-white">Tier 1 Direct</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Payout Rate:</span>
                  <span className="font-semibold text-emerald-400">5.0% on ALL deposits</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Payout Frequency:</span>
                  <span className="font-semibold text-indigo-300">Instant Wallet Auto-Credit</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Minimum Deposit:</span>
                  <span className="font-semibold text-white">No minimum</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-indigo-950/50 border border-indigo-800/40 text-xs text-indigo-200">
                💡 Example: If your referral deposits <strong>$1,000</strong>, you instantly receive <strong>$50.00</strong> added to your wallet!
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4-Grid Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat 1: Total Referrals */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-medium uppercase tracking-wider">Total Referrals</span>
            <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">
            {myReferredUsers.length}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Users registered with your link
          </p>
        </div>

        {/* Stat 2: Total Commission Earnings */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-medium uppercase tracking-wider">Total Earnings</span>
            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {formatMoney(displayTotalEarnings)}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            5% commission payouts earned
          </p>
        </div>

        {/* Stat 3: Commission Rate */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-medium uppercase tracking-wider">Commission Rate</span>
            <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400">
              <Percent className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
            5.0%
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Lifetime automated rate
          </p>
        </div>

        {/* Stat 4: Available Wallet Balance */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-medium uppercase tracking-wider">Available Balance</span>
            <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {formatMoney(user?.walletBalance || 0)}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Ready to spend on traffic ads
          </p>
        </div>
      </div>

      {/* How It Works - 3 Step Section */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-indigo-500" />
              <span>How the Referral Program Works</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Three simple steps to build passive income from your referral network
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="relative rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 p-5 space-y-3">
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-sm flex items-center justify-center">
              1
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-white text-base">Share Your Link</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Copy your unique referral link and share it on Telegram, forums, YouTube, blogs, or directly with fellow digital marketers.
            </p>
          </div>

          {/* Step 2 */}
          <div className="relative rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 p-5 space-y-3">
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-sm flex items-center justify-center">
              2
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-white text-base">Friend Creates Account</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              When someone clicks your link and signs up for a TrafficSell account, our system links them as your direct referral.
            </p>
          </div>

          {/* Step 3 */}
          <div className="relative rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 p-5 space-y-3">
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold text-sm flex items-center justify-center">
              3
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-white text-base">Get 5% Automated Cash</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Every time your referred user approves a deposit to buy traffic or social ads, 5% of their deposit is instantly credited to your wallet balance.
            </p>
          </div>
        </div>
      </div>

      {/* Referrals & Commissions Data Table */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden space-y-0">
        {/* Header Tabs & Search */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 md:border-b-0 pb-2 md:pb-0">
            <button
              onClick={() => setActiveTab('referred_users')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 ${
                activeTab === 'referred_users'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Referred Users ({myReferredUsers.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('commissions')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 ${
                activeTab === 'commissions'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <DollarSign className="w-4 h-4" />
              <span>Commission Logs ({myCommissions.length})</span>
            </button>
          </div>

          <div className="relative max-w-xs w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Tab 1: Referred Users Table */}
        {activeTab === 'referred_users' && (
          <div className="overflow-x-auto">
            {filteredReferredUsers.length > 0 ? (
              <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="px-6 py-3.5">User</th>
                    <th className="px-6 py-3.5">Email</th>
                    <th className="px-6 py-3.5">Joined Date</th>
                    <th className="px-6 py-3.5">Status</th>
                    <th className="px-6 py-3.5 text-right">Commissions Generated</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {filteredReferredUsers.map((u) => {
                    const userCommissions = myCommissions
                      .filter(c => c.referredUserId === u.id)
                      .reduce((sum, c) => sum + c.commissionAmount, 0);

                    return (
                      <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="px-6 py-4 font-medium text-slate-900 dark:text-white flex items-center gap-2.5">
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
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-300/40">
                            <CheckCircle className="w-3 h-3" />
                            <span>Active Referral</span>
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right font-semibold text-emerald-600 dark:text-emerald-400 text-sm">
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
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                  No Referrals Registered Yet
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                  Copy your unique referral link above and share it with friends or on social media to start earning 5% passive income!
                </p>
                <button
                  onClick={handleCopyLink}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors inline-flex items-center gap-2"
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
                <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="px-6 py-3.5">Date</th>
                    <th className="px-6 py-3.5">Referred User</th>
                    <th className="px-6 py-3.5">User Deposit Amount</th>
                    <th className="px-6 py-3.5 text-right">5% Commission Earned</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {filteredCommissions.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                        {new Date(c.createdAt).toLocaleString(undefined, {
                          year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                        })}
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                        <div>{c.referredUserName}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{c.referredUserEmail}</div>
                      </td>
                      <td className="px-6 py-4 text-slate-700 dark:text-slate-300 font-medium">
                        {formatMoney(c.depositAmount)}
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-emerald-600 dark:text-emerald-400 text-sm">
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
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                  No Commission Logs Yet
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                  When users who registered via your referral link make wallet deposits, 5% commission logs will be listed here automatically!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
