import React from 'react';
import { motion } from 'framer-motion';
import {
  Wallet, Layers, CheckCircle2, Users, DollarSign,
  TrendingUp, Plus, ArrowUpRight, ArrowRight, Zap, Play, Pause, Activity
} from 'lucide-react';
import { useStore } from '../../lib/store';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, Title, Tooltip, Legend, Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

interface OverviewViewProps {
  onNavigate: (tab: string) => void;
  onOpenReport: (campaign: any) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({ onNavigate, onOpenReport }) => {
  const { user, campaigns, transactions, getUserStats } = useStore();

  const userStats = getUserStats(user?.id);
  const userCampaigns = campaigns.filter(c => c.userId === user?.id || user?.role === 'admin');
  const activeCampaigns = userCampaigns.filter(c => c.status === 'running');
  const completedCampaigns = userCampaigns.filter(c => c.status === 'completed');
  const totalDelivered = userCampaigns.reduce((acc, c) => acc + c.visitorsDelivered, 0);
  const totalSpent = userCampaigns.reduce((acc, c) => acc + c.budget, 0);

  // Chart data
  const chartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        fill: true,
        label: 'Visitors Delivered',
        data: [12000, 28000, 45000, 62000, 88000, 115000, totalDelivered || 138450],
        borderColor: '#DFFF2F',
        backgroundColor: 'rgba(223, 255, 47, 0.12)',
        tension: 0.4,
        pointBackgroundColor: '#DFFF2F',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#0F172A',
        titleColor: '#FFFFFF',
        bodyColor: '#DFFF2F',
        borderColor: '#1E293B',
        borderWidth: 1,
      },
    },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { color: 'rgba(229, 231, 235, 0.1)' } },
    },
  };

  return (
    <div className="space-y-8">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl p-6 md:p-8 relative overflow-hidden border border-slate-800 shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#DFFF2F]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div>
            <span className="text-xs font-bold text-[#DFFF2F] uppercase tracking-wider flex items-center gap-1.5 mb-1">
              <Zap className="w-4 h-4" /> Live Traffic Network Active
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold">Welcome back, {user?.fullName}! 👋</h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              Your active campaigns are routing high-quality human visitors in real time. Wallet balance is ready for instant scaling.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate('buy-traffic')}
              className="py-3 px-5 bg-[#DFFF2F] hover:bg-[#cbe820] text-slate-950 font-extrabold rounded-2xl text-xs transition-all shadow-lg flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" /> Launch Campaign
            </button>
            <button
              onClick={() => onNavigate('wallet')}
              className="py-3 px-5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl text-xs transition-colors border border-slate-700 cursor-pointer"
            >
              Deposit Funds
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        
        {/* Wallet Balance */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Wallet Balance</span>
            <div className="p-2 rounded-xl bg-[#DFFF2F]/20 text-slate-900 dark:text-[#DFFF2F]">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">
            ${user?.walletBalance.toFixed(2)}
          </p>
          <button
            onClick={() => onNavigate('wallet')}
            className="text-[11px] font-bold text-[#DFFF2F] hover:underline flex items-center gap-1 mt-2 cursor-pointer"
          >
            + Deposit Funds <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Today Hits */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Today's Hits</span>
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-500">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-emerald-500">
            {userStats.todayHits.toLocaleString()}
          </p>
          <span className="text-[11px] text-emerald-500 font-semibold flex items-center gap-1 mt-2">
            <TrendingUp className="w-3 h-3" /> Live Delivery
          </span>
        </div>

        {/* Yesterday Hits */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Yesterday's Hits</span>
            <div className="p-2 rounded-xl bg-sky-500/20 text-sky-500">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">
            {userStats.yesterdayHits.toLocaleString()}
          </p>
          <span className="text-[11px] text-slate-400 mt-2 block">Verified Visitors</span>
        </div>

        {/* Active Campaigns */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Active Campaigns</span>
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">
            {activeCampaigns.length}
          </p>
          <span className="text-[11px] text-purple-400 font-semibold flex items-center gap-1 mt-2">
            <Activity className="w-3 h-3 animate-pulse" /> Live Pacing
          </span>
        </div>

        {/* Total Visitors */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Total Visitors</span>
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-500">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">
            {totalDelivered.toLocaleString()}
          </p>
          <span className="text-[11px] text-indigo-400 font-medium mt-2 block">All Time Delivered</span>
        </div>

        {/* Total Spent */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Total Spent</span>
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-500">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">
            ${totalSpent.toFixed(2)}
          </p>
          <span className="text-[11px] text-slate-400 mt-2 block">Low $0.05 CPM</span>
        </div>
      </div>

      {/* Analytics Chart & Recent Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Live Delivery Chart */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Live Traffic Delivery Rate</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Real-time visitor count routed to target URLs</p>
            </div>
            <button
              onClick={() => onNavigate('analytics')}
              className="text-xs font-bold text-[#DFFF2F] hover:underline flex items-center gap-1 cursor-pointer"
            >
              Full Analytics <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="h-64 w-full">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>

        {/* Live Active Campaigns Preview */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Active Campaigns</h3>
              <button
                onClick={() => onNavigate('campaigns')}
                className="text-xs text-[#DFFF2F] font-bold hover:underline"
              >
                View All
              </button>
            </div>

            <div className="space-y-3">
              {userCampaigns.slice(0, 3).map((cmp) => {
                const pct = Math.min(100, Math.round((cmp.visitorsDelivered / cmp.visitorsTarget) * 100));
                return (
                  <div
                    key={cmp.id}
                    onClick={() => onOpenReport(cmp)}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 hover:border-[#DFFF2F]/50 transition-all cursor-pointer"
                  >
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[160px]">{cmp.name}</p>
                      <span className="text-[10px] font-bold text-[#DFFF2F]">{pct}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mb-2">
                      <div className="h-full bg-[#DFFF2F] rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                      <span>{cmp.visitorsDelivered.toLocaleString()} hits</span>
                      <span className="uppercase">{cmp.country}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={() => onNavigate('buy-traffic')}
            className="w-full mt-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white text-xs font-bold rounded-xl transition-colors text-center cursor-pointer"
          >
            + Create New Campaign
          </button>
        </div>
      </div>

      {/* Recent Transactions Feed */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Recent Wallet Activity</h3>
          <button onClick={() => onNavigate('wallet')} className="text-xs font-bold text-[#DFFF2F] hover:underline">
            View Wallet
          </button>
        </div>

        <div className="space-y-2">
          {transactions.slice(0, 4).map((tx) => (
            <div key={tx.id} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 text-xs">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${tx.type === 'deposit' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-amber-500/20 text-amber-500'}`}>
                  <DollarSign className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">{tx.description}</p>
                  <p className="text-[10px] text-slate-400">{new Date(tx.createdAt).toLocaleString()}</p>
                </div>
              </div>
              <span className={`font-mono font-bold text-sm ${tx.type === 'deposit' ? 'text-emerald-500' : 'text-slate-400'}`}>
                {tx.type === 'deposit' ? '+' : '-'}${tx.amount.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
