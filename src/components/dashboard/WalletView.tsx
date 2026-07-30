import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet, ShieldCheck, DollarSign, Layers, Clock, Zap, UserCheck, ArrowUpRight, ArrowDownLeft, CheckCircle2 } from 'lucide-react';
import { useStore } from '../../lib/store';
import { WithdrawalModal } from '../modals/WithdrawalModal';
import { TransferModal } from '../modals/TransferModal';

export const WalletView: React.FC = () => {
  const { user, transactions, campaigns, formatMoney } = useStore();

  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [isTransferOpen, setIsTransferOpen] = useState(false);

  // User campaigns & budget calculations
  const userCampaigns = campaigns.filter(c => c.userId === user?.id || user?.role === 'admin');
  const activeCampaigns = userCampaigns.filter(c => c.status === 'running' || c.status === 'pending');
  const totalCampaignBudget = userCampaigns.reduce((sum, c) => sum + (c.budget || 0), 0);
  const totalHitsDelivered = userCampaigns.reduce((sum, c) => sum + (c.visitorsDelivered || 0), 0);
  
  const userTx = transactions.filter(t => t.userId === user?.id || user?.role === 'admin');

  return (
    <div className="max-w-5xl mx-auto space-y-8 text-[#111827] dark:text-white">
      
      {/* Primary Campaign Balance & Traffic Budget Hero Box */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white rounded-3xl p-6 md:p-8 border border-slate-800 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#DFFF2F]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-[#DFFF2F] uppercase tracking-wider flex items-center gap-1.5 px-3 py-1 bg-[#DFFF2F]/10 border border-[#DFFF2F]/20 rounded-full">
                <Wallet className="w-3.5 h-3.5" /> Campaign Balance & Budget
              </span>
              <span className="text-xs font-extrabold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5" /> Role: {user?.role ? user.role.toUpperCase() : 'ADVERTISER'}
              </span>
            </div>

            <h2 className="text-2xl md:text-3xl font-black text-white">Campaign Balance & Traffic Summary</h2>
            <p className="text-xs text-slate-300 max-w-lg leading-relaxed">
              Real-time campaign wallet balance, allocated traffic budget, and delivery stats. All approved campaigns feature <strong>1-Hour Express Traffic Delivery</strong>.
            </p>
          </div>

          {/* Balance Cards Display */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full lg:w-auto">
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shrink-0 min-w-[200px] shadow-lg">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Available Campaign Balance
              </span>
              <p className="text-3xl font-black text-[#DFFF2F] font-mono">
                {formatMoney(user?.walletBalance || 0)}
              </p>
              <div className="mt-2 flex items-center gap-1.5 text-[11px] font-bold text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" /> Ready for Traffic Orders
              </div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shrink-0 min-w-[200px] shadow-lg">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Total Campaign Budget Spent
              </span>
              <p className="text-3xl font-black text-white font-mono">
                {formatMoney(totalCampaignBudget)}
              </p>
              <div className="mt-2 flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
                <Layers className="w-3.5 h-3.5 text-[#DFFF2F]" /> {userCampaigns.length} Total Campaigns
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 4 Stat Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">Active Campaigns</span>
            <span className="text-2xl font-black text-slate-900 dark:text-white mt-1 block">{activeCampaigns.length}</span>
          </div>
          <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl">
            <Layers className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">Delivered Traffic</span>
            <span className="text-2xl font-black text-slate-900 dark:text-white mt-1 block">{totalHitsDelivered.toLocaleString()}</span>
          </div>
          <div className="p-3 bg-sky-500/10 text-sky-500 rounded-xl">
            <Zap className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">Delivery Speed</span>
            <span className="text-2xl font-black text-[#111827] dark:text-[#DFFF2F] mt-1 block">1 Hour Est.</span>
          </div>
          <div className="p-3 bg-[#DFFF2F]/20 text-[#111827] dark:text-[#DFFF2F] rounded-xl">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">Assigned User Role</span>
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1 block capitalize">
              {user?.role || 'Advertiser'}
            </span>
          </div>
          <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-xl">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* 1-Hour Express Traffic Guarantee Card */}
      <div className="p-6 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 text-[#111827] dark:text-white flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-emerald-500 text-slate-950 font-black shrink-0">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-extrabold text-sm sm:text-base">Express 1-Hour Traffic Delivery System</h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
              Once approved by the backend team, traffic delivery starts immediately and completes within <strong>1 hour</strong>.
            </p>
          </div>
        </div>
        <div className="px-4 py-2 bg-emerald-500/20 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 rounded-xl text-xs font-black uppercase tracking-wider shrink-0">
          ⚡ ~1h Express Completion
        </div>
      </div>

      {/* Campaign Budget Transactions History */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Campaign & Wallet Activity History</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">All campaign budget allocations, referral commissions, and wallet transactions</p>
          </div>
          <span className="text-xs font-bold text-slate-400 font-mono">
            {userTx.length} Entries
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-mono text-[10px]">
              <tr>
                <th className="pb-3">Transaction ID</th>
                <th className="pb-3">Type</th>
                <th className="pb-3">Description</th>
                <th className="pb-3">Amount</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {userTx.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">No activity history recorded yet. Launch a campaign to see transactions here.</td>
                </tr>
              ) : (
                userTx.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-3.5 font-mono text-[11px] font-bold text-[#DFFF2F]">{tx.id}</td>
                    <td className="py-3.5 font-bold uppercase text-slate-900 dark:text-white">{tx.type}</td>
                    <td className="py-3.5 text-slate-600 dark:text-slate-300 font-medium">{tx.description}</td>
                    <td className={`py-3.5 font-bold ${tx.amount > 0 ? 'text-emerald-500' : 'text-slate-900 dark:text-white'}`}>
                      {formatMoney(tx.amount)}
                    </td>
                    <td className="py-3.5">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                        {tx.status || 'completed'}
                      </span>
                    </td>
                    <td className="py-3.5 text-slate-400 font-mono text-[11px]">
                      {new Date(tx.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
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
    </div>
  );
};
