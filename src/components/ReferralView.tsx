import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users, DollarSign, Copy, Check, Sparkles, Share2, TrendingUp, Gift, ArrowRight, ShieldCheck, Search, Award
} from 'lucide-react';
import { useStore } from '../lib/store';

export const ReferralView: React.FC = () => {
  const { user, referrals, allUsers, formatMoney } = useStore();
  const [copied, setCopied] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  if (!user) return null;

  // Referral code & link
  const refCode = user.referralCode || `REF-${user.id.slice(-6).toUpperCase()}`;
  const refLink = `${window.location.origin}/?ref=${refCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(refLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Calculate referral stats
  // Find users referred by current user
  const myReferredUsers = allUsers.filter(u => u.referredBy === user.id || u.referredBy === user.email);
  const myReferralLogs = referrals.filter(r => r.referrerId === user.id);

  const totalEarnings = user.totalReferralEarnings ?? myReferralLogs.reduce((acc, r) => acc + r.commissionAmount, 0);
  const totalReferredCount = myReferredUsers.length;
  const totalDepositsContributed = myReferralLogs.reduce((acc, r) => acc + r.depositAmount, 0);

  // Filter list
  const filteredUsers = myReferredUsers.filter(u =>
    u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 border border-indigo-500/20 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-[#DFFF2F]/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-[#DFFF2F] text-slate-950 uppercase tracking-wider">
              <Gift className="w-3.5 h-3.5" /> 5% Lifetime Commission Program
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Earn 5% Cash Bonus on Every Deposit
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Invite advertisers, publishers, and marketers to TrafficSell using your unique referral link. Whenever your referrals add funds to their wallet, you automatically receive <strong className="text-[#DFFF2F]">5% instant cash</strong> credited directly to your balance.
            </p>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl w-full lg:w-auto min-w-[280px]">
            <div className="text-xs text-slate-400 font-medium mb-1">Your Referral Code</div>
            <div className="text-xl font-mono font-black text-[#DFFF2F] tracking-wider mb-2">{refCode}</div>
            <button
              onClick={handleCopy}
              className="w-full py-2.5 px-4 bg-[#DFFF2F] hover:bg-[#cbe820] text-slate-950 font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-800" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Link Copied!' : 'Copy Referral Link'}
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Earnings</span>
            <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-xl">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {formatMoney(totalEarnings)}
          </div>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 font-medium">
            5% lifetime deposit commission
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Referred Users</span>
            <div className="p-2 bg-blue-500/10 text-blue-500 rounded-xl">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {totalReferredCount}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Users registered via your link
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Referral Volume</span>
            <div className="p-2 bg-purple-500/10 text-purple-500 rounded-xl">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {formatMoney(totalDepositsContributed)}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Total deposits by your referrals
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Commission Rate</span>
            <div className="p-2 bg-[#DFFF2F]/20 text-[#DFFF2F] dark:text-[#DFFF2F] rounded-xl">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            5.00%
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Instant automatic payout
          </p>
        </div>
      </div>

      {/* Referral Link Box */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Share2 className="w-4 h-4 text-[#111827] dark:text-[#DFFF2F]" />
            Your Unique Referral Link
          </h3>
          <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full">
            Active & Unlimited
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2">
          <input
            type="text"
            readOnly
            value={refLink}
            className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-900 dark:text-white focus:outline-none"
          />
          <button
            onClick={handleCopy}
            className="w-full sm:w-auto px-6 py-3 bg-[#111827] dark:bg-[#DFFF2F] hover:bg-slate-800 dark:hover:bg-[#cbe820] text-white dark:text-slate-950 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer shadow-md"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied' : 'Copy Link'}
          </button>
        </div>
      </div>

      {/* How it Works Section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">How the 5% Referral Program Works</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
            <div className="w-8 h-8 rounded-lg bg-[#111827] text-[#DFFF2F] dark:bg-[#DFFF2F] dark:text-slate-950 flex items-center justify-center text-xs font-extrabold">
              1
            </div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">Share Your Link</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Copy your referral link above and share it with colleagues, online communities, or marketing networks.
            </p>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
            <div className="w-8 h-8 rounded-lg bg-[#111827] text-[#DFFF2F] dark:bg-[#DFFF2F] dark:text-slate-950 flex items-center justify-center text-xs font-extrabold">
              2
            </div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">Friends Sign Up</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              When a new user clicks your referral link and registers an account, they are permanently tied to your profile.
            </p>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
            <div className="w-8 h-8 rounded-lg bg-[#111827] text-[#DFFF2F] dark:bg-[#DFFF2F] dark:text-slate-950 flex items-center justify-center text-xs font-extrabold">
              3
            </div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">Earn 5% Cash Payout</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Every time your referral makes a deposit, 5% of that deposit is instantly added to your wallet balance.
            </p>
          </div>
        </div>
      </div>

      {/* Referred Users List */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">My Referred Users ({myReferredUsers.length})</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">List of users who registered using your referral code</p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search referrals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
            />
          </div>
        </div>

        {filteredUsers.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
            <Users className="w-10 h-10 text-slate-400 mx-auto mb-2 opacity-50" />
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">No Referrals Yet</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Share your referral link with friends to start earning 5% commission on all their deposits!
            </p>
            <button
              onClick={handleCopy}
              className="mt-4 px-4 py-2 bg-[#111827] dark:bg-[#DFFF2F] text-white dark:text-slate-950 text-xs font-bold rounded-xl cursor-pointer"
            >
              Copy Referral Link
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Date Joined</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Deposits Made</th>
                  <th className="py-3 px-4 text-right">5% Earnings</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {filteredUsers.map((u) => {
                  const userLogs = myReferralLogs.filter(r => r.referredUserId === u.id);
                  const userTotalDep = userLogs.reduce((acc, r) => acc + r.depositAmount, 0);
                  const userCommEarned = userLogs.reduce((acc, r) => acc + r.commissionAmount, 0);

                  return (
                    <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={u.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250'}
                            alt={u.fullName}
                            className="w-7 h-7 rounded-full object-cover border border-slate-200 dark:border-slate-800"
                          />
                          <div>
                            <div className="font-bold text-slate-900 dark:text-white">{u.fullName}</div>
                            <div className="text-[10px] text-slate-400">{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-500 dark:text-slate-400">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                          <ShieldCheck className="w-3 h-3" /> Active
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-semibold text-slate-900 dark:text-white">
                        {formatMoney(userTotalDep)}
                      </td>
                      <td className="py-3 px-4 text-right font-black text-emerald-600 dark:text-[#DFFF2F]">
                        +{formatMoney(userCommEarned)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
