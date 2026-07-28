import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3, Globe, Activity, Download, Wallet, Eye,
  TrendingUp, Users, DollarSign, Target, MousePointer, Share2, Plus, Sparkles, AlertCircle, ArrowUpRight
} from 'lucide-react';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement,
  Title, Tooltip, Legend, ArcElement, PointElement, LineElement, Filler
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { useStore } from '../../lib/store';
import { exportToCSV, exportToExcel, exportToJSON, exportToPDF } from '../../lib/exportUtils';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement, Filler);

// Country Flag helper
const getCountryFlag = (country: string): string => {
  const c = country.toLowerCase();
  if (c.includes('united states') || c.includes('usa') || c.includes('us')) return '🇺🇸';
  if (c.includes('pakistan') || c.includes('pk')) return '🇵🇰';
  if (c.includes('india') || c.includes('in')) return '🇮🇳';
  if (c.includes('germany') || c.includes('de')) return '🇩🇪';
  if (c.includes('united kingdom') || c.includes('uk')) return '🇬🇧';
  if (c.includes('canada') || c.includes('ca')) return '🇨🇦';
  if (c.includes('australia') || c.includes('au')) return '🇦🇺';
  if (c.includes('france') || c.includes('fr')) return '🇫🇷';
  if (c.includes('brazil') || c.includes('br')) return '🇧🇷';
  if (c.includes('bangladesh') || c.includes('bd')) return '🇧🇩';
  return '🌐';
};

export const AnalyticsView: React.FC<{ onNavigateToCampaigns?: () => void }> = ({ onNavigateToCampaigns }) => {
  const { user, campaigns, socialCampaigns, transactions, allUsers, formatMoney } = useStore();

  const [selectedUserId, setSelectedUserId] = useState<string>('all');

  // Filter campaigns and transactions based on selection
  const activeUserFilterId = selectedUserId === 'all'
    ? (user?.role === 'admin' ? 'all' : user?.id)
    : selectedUserId;

  const filteredCampaigns = campaigns.filter(c => {
    if (activeUserFilterId !== 'all' && c.userId !== activeUserFilterId) return false;
    return true;
  });

  const filteredSocialCampaigns = socialCampaigns.filter(sc => {
    if (activeUserFilterId !== 'all' && sc.userId !== activeUserFilterId) return false;
    return true;
  });

  const filteredSpends = transactions.filter(t => {
    if (t.type !== 'spend') return false;
    if (activeUserFilterId !== 'all' && t.userId !== activeUserFilterId) return false;
    return true;
  });

  // Calculate Real Metrics
  const totalDeliveredHits = filteredCampaigns.reduce((acc, c) => acc + (c.visitorsDelivered || 0), 0);
  const totalTargetHits = filteredCampaigns.reduce((acc, c) => acc + (c.visitorsTarget || 0), 0);
  
  const campaignSpentTotal = filteredCampaigns.reduce((acc, c) => acc + (c.spentAmount || c.budget || 0), 0);
  const socialSpentTotal = filteredSocialCampaigns.reduce((acc, sc) => acc + (sc.totalCost || 0), 0);
  const totalRealSpending = campaignSpentTotal + socialSpentTotal;

  // Real Wallet balance calculation
  const displayedWalletBalance = activeUserFilterId === 'all'
    ? allUsers.reduce((acc, u) => acc + u.walletBalance, 0)
    : (allUsers.find(u => u.id === activeUserFilterId)?.walletBalance || user?.walletBalance || 0);

  // Effective CPM ($ per 1,000 visitors)
  const averageRealCPM = totalDeliveredHits > 0 
    ? (totalRealSpending / (totalDeliveredHits / 1000))
    : (filteredCampaigns.length > 0 ? (filteredCampaigns.reduce((acc, c) => acc + c.cpm, 0) / filteredCampaigns.length) : 0);

  // Effective CPC ($ per visitor hit)
  const averageRealCPC = totalDeliveredHits > 0 ? (totalRealSpending / totalDeliveredHits) : 0;

  // Group Real Data by Country
  const countryMap: Record<string, { country: string; deliveredHits: number; targetHits: number; spent: number; campaignCount: number }> = {};

  filteredCampaigns.forEach(c => {
    const countryName = c.country || 'Global / Tier 3';
    if (!countryMap[countryName]) {
      countryMap[countryName] = { country: countryName, deliveredHits: 0, targetHits: 0, spent: 0, campaignCount: 0 };
    }
    countryMap[countryName].deliveredHits += (c.visitorsDelivered || 0);
    countryMap[countryName].targetHits += (c.visitorsTarget || 0);
    countryMap[countryName].spent += (c.spentAmount || c.budget || 0);
    countryMap[countryName].campaignCount += 1;
  });

  const realCountryList = Object.values(countryMap).map(c => {
    const share = totalDeliveredHits > 0 ? ((c.deliveredHits / totalDeliveredHits) * 100).toFixed(1) + '%' : '0%';
    const cpm = c.deliveredHits > 0 ? (c.spent / (c.deliveredHits / 1000)) : 0;
    return {
      ...c,
      flag: getCountryFlag(c.country),
      share,
      cpm
    };
  });

  // Group Real Data by Traffic Type / Method (Popunder, Direct/SmartLink, Native, Search Organic, Social SMM)
  const trafficTypeMap: Record<string, number> = {};
  filteredCampaigns.forEach(c => {
    const type = c.trafficType || 'Popunder Traffic';
    trafficTypeMap[type] = (trafficTypeMap[type] || 0) + (c.visitorsDelivered || c.visitorsTarget || 0);
  });

  if (filteredSocialCampaigns.length > 0) {
    const socialHits = filteredSocialCampaigns.reduce((acc, sc) => acc + (sc.deliveredQuantity || sc.quantity || 0), 0);
    trafficTypeMap['Social Ads SMM'] = (trafficTypeMap['Social Ads SMM'] || 0) + socialHits;
  }

  const trafficTypeLabels = Object.keys(trafficTypeMap);
  const trafficTypeValues = Object.values(trafficTypeMap);

  const trafficSourcesChartData = {
    labels: trafficTypeLabels.length > 0 ? trafficTypeLabels : ['No Active Campaigns'],
    datasets: [
      {
        data: trafficTypeValues.length > 0 ? trafficTypeValues : [1],
        backgroundColor: [
          '#10B981', '#38BDF8', '#6366F1', '#F59E0B', '#EC4899', '#8B5CF6'
        ],
        borderWidth: 0,
      }
    ]
  };

  const handleExportData = (type: 'pdf' | 'excel' | 'csv' | 'json') => {
    const title = 'TrafficSell Real Analytics Telemetry Report';
    const headers = ['Country', 'Delivered Hits', 'Target Hits', 'Global Share', 'Real Spend ($)', 'Effective CPM'];
    const rows = realCountryList.map(c => [
      c.country,
      c.deliveredHits.toLocaleString(),
      c.targetHits.toLocaleString(),
      c.share,
      `$${c.spent.toFixed(2)}`,
      `$${c.cpm.toFixed(3)}`
    ]);

    if (type === 'csv') exportToCSV('TrafficSell_Real_Analytics_Report', headers, rows);
    if (type === 'excel') exportToExcel('TrafficSell_Real_Analytics_Report', headers, rows);
    if (type === 'json') exportToJSON('TrafficSell_Real_Analytics_Report', { summary: { totalDeliveredHits, totalRealSpending, displayedWalletBalance }, countries: realCountryList, campaigns: filteredCampaigns });
    if (type === 'pdf') exportToPDF(title, headers, rows);
  };

  const hasData = filteredCampaigns.length > 0 || filteredSocialCampaigns.length > 0;

  return (
    <div className="space-y-8">
      
      {/* Analytics Control Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-[#DFFF2F] text-slate-950 border border-slate-900 shadow-sm flex items-center gap-1">
              <Activity className="w-3.5 h-3.5" /> Real-Time Telemetry
            </span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Live Campaign Analytics & Traffic Reports</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            100% Real data from your active ad campaigns: targeted countries, CPM rates, SmartLinks, Organic Search, and hit delivery.
          </p>
        </div>

        {/* Filters & Export Toolbar */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* User selector for admin */}
          {user?.role === 'admin' && (
            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                className="bg-transparent text-slate-900 dark:text-white font-bold focus:outline-none cursor-pointer"
              >
                <option value="all" className="bg-white dark:bg-slate-900">All Advertisers Combined</option>
                {allUsers.map((u) => (
                  <option key={u.id} value={u.id} className="bg-white dark:bg-slate-900">
                    {u.fullName} ({u.email})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Export menu button */}
          {hasData && (
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
              <span className="text-[10px] text-slate-400 uppercase font-mono px-2 font-bold flex items-center gap-1">
                <Download className="w-3.5 h-3.5 text-[#DFFF2F]" /> Export:
              </span>
              <button
                onClick={() => handleExportData('csv')}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded text-[10px] font-bold cursor-pointer"
              >
                CSV
              </button>
              <button
                onClick={() => handleExportData('excel')}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded text-[10px] font-bold cursor-pointer"
              >
                Excel
              </button>
              <button
                onClick={() => handleExportData('pdf')}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[10px] font-bold cursor-pointer"
              >
                PDF
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Core Key Real Metric Display Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        
        {/* Total Wallet Balance */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-950 text-white border border-slate-800 shadow-md space-y-1">
          <span className="text-[11px] font-bold text-[#DFFF2F] uppercase tracking-wider flex items-center gap-1">
            <Wallet className="w-3.5 h-3.5" /> Wallet Balance
          </span>
          <p className="text-2xl font-black text-white">{formatMoney(displayedWalletBalance)}</p>
          <span className="text-[10px] text-slate-400 block">Available Funds</span>
        </div>

        {/* Real Delivered Hits */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Eye className="w-3.5 h-3.5 text-sky-500" /> Hits Delivered
          </span>
          <p className="text-2xl font-black text-slate-900 dark:text-white">{totalDeliveredHits.toLocaleString()}</p>
          <span className="text-[10px] text-slate-400 block">Out of {totalTargetHits.toLocaleString()} Target</span>
        </div>

        {/* Real Campaign Spend */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <DollarSign className="w-3.5 h-3.5 text-amber-500" /> Real Spend
          </span>
          <p className="text-2xl font-black text-amber-600 dark:text-amber-400">{formatMoney(totalRealSpending)}</p>
          <span className="text-[10px] text-slate-400 block">Campaign Budget Used</span>
        </div>

        {/* Real Effective CPM */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Target className="w-3.5 h-3.5 text-indigo-500" /> Average CPM
          </span>
          <p className="text-2xl font-black text-slate-900 dark:text-white">{formatMoney(averageRealCPM)}</p>
          <span className="text-[10px] text-slate-400 block">Per 1,000 Visitors</span>
        </div>

        {/* Real Active Campaigns */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <BarChart3 className="w-3.5 h-3.5 text-emerald-500" /> Campaigns
          </span>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{filteredCampaigns.length + filteredSocialCampaigns.length}</p>
          <span className="text-[10px] text-slate-400 block">Total Active & Past</span>
        </div>
      </div>

      {/* NO DATA EMPTY STATE */}
      {!hasData ? (
        <div className="p-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-[#DFFF2F]/20 text-slate-900 dark:text-[#DFFF2F] flex items-center justify-center mx-auto">
            <BarChart3 className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-xl font-black text-slate-900 dark:text-white">No Campaign Analytics Data Yet</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Launch your first traffic campaign or SMM order to view live visitor counts, country breakdowns, CPM rates, and delivery reports.
            </p>
          </div>
          {onNavigateToCampaigns && (
            <button
              onClick={onNavigateToCampaigns}
              className="py-3 px-6 bg-[#DFFF2F] text-slate-950 font-black rounded-xl text-xs inline-flex items-center gap-2 hover:scale-105 transition-all shadow cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Launch First Campaign Now
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Main Traffic Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Traffic Types Breakdown */}
            <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-indigo-500" /> Real Traffic Methods & Types
                </h3>
                <p className="text-xs text-slate-400">Distribution by traffic category chosen in your campaigns.</p>
              </div>

              <div className="h-56 w-full flex items-center justify-center">
                <Doughnut
                  data={trafficSourcesChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { position: 'bottom', labels: { font: { size: 10, weight: 'bold' } } } }
                  }}
                />
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                {Object.entries(trafficTypeMap).map(([type, hits], i) => (
                  <div key={type} className="flex justify-between items-center text-slate-600 dark:text-slate-300">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{type}</span>
                    <strong className="text-slate-900 dark:text-white font-mono">{hits.toLocaleString()} hits</strong>
                  </div>
                ))}
              </div>
            </div>

            {/* Country Telemetry Breakdown */}
            <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Globe className="w-4 h-4 text-emerald-500" /> Targeted Countries Breakdown
                </h3>
                <p className="text-xs text-slate-400">Real delivered traffic volume and budget spend by geographic region.</p>
              </div>

              <div className="space-y-3">
                {realCountryList.length === 0 ? (
                  <p className="text-xs text-slate-500 italic">No country data recorded yet.</p>
                ) : (
                  realCountryList.map((c, i) => (
                    <div key={i} className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{c.flag}</span>
                        <div>
                          <h4 className="font-black text-slate-900 dark:text-white text-sm">{c.country}</h4>
                          <p className="text-[10px] text-slate-400">{c.campaignCount} active campaign(s)</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="font-mono font-bold text-slate-900 dark:text-white text-sm">
                          {c.deliveredHits.toLocaleString()} <span className="text-[10px] text-slate-400 font-sans">/ {c.targetHits.toLocaleString()}</span>
                        </p>
                        <p className="text-[11px] text-amber-500 font-extrabold font-mono">
                          Spent: {formatMoney(c.spent)}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Real Campaign Performance Table */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-[#DFFF2F]" /> Campaign Telemetry Log
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Real-time status, targeted countries, CPM rates, and hits delivery progress.</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-mono text-[10px]">
                  <tr>
                    <th className="pb-3">Campaign / URL</th>
                    <th className="pb-3">Target Country</th>
                    <th className="pb-3">Traffic Type</th>
                    <th className="pb-3">CPM Rate</th>
                    <th className="pb-3">Delivered / Target</th>
                    <th className="pb-3">Spent</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredCampaigns.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-3.5">
                        <p className="font-extrabold text-slate-900 dark:text-white text-sm">{c.name}</p>
                        <p className="text-[10px] font-mono text-slate-400 truncate max-w-xs">{c.targetUrl}</p>
                      </td>
                      <td className="py-3.5 font-bold text-slate-900 dark:text-white flex items-center gap-1.5 pt-4">
                        <span>{getCountryFlag(c.country)}</span>
                        <span>{c.country}</span>
                      </td>
                      <td className="py-3.5">
                        <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-[10px]">
                          {c.trafficType || 'Popunder'}
                        </span>
                      </td>
                      <td className="py-3.5 font-mono font-bold text-slate-900 dark:text-white">
                        {formatMoney(c.cpm)}
                      </td>
                      <td className="py-3.5 font-mono">
                        <span className="font-bold text-emerald-500">{c.visitorsDelivered.toLocaleString()}</span> / {c.visitorsTarget.toLocaleString()}
                      </td>
                      <td className="py-3.5 font-mono font-bold text-amber-500">
                        {formatMoney(c.spentAmount || c.budget)}
                      </td>
                      <td className="py-3.5">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                          c.status === 'running' ? 'bg-emerald-500/20 text-emerald-500' :
                          c.status === 'pending' ? 'bg-amber-500/20 text-amber-500' :
                          c.status === 'completed' ? 'bg-blue-500/20 text-blue-500' :
                          'bg-slate-500/20 text-slate-400'
                        }`}>
                          {c.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
