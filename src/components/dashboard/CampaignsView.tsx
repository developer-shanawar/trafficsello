import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Layers, Play, Pause, Trash2, Eye, ExternalLink, Globe, Smartphone,
  Plus, Search, Filter, CheckCircle2, Clock, Zap, AlertTriangle, ShieldCheck,
  Wallet, ArrowRight, Sparkles, Monitor
} from 'lucide-react';
import { useStore } from '../../lib/store';
import { Campaign, CampaignFormat, TrafficCountry, DeviceType } from '../../types';
import confetti from 'canvas-confetti';
import { BuyTrafficView } from './BuyTrafficView';

interface CampaignsViewProps {
  onNavigate: (tab: string) => void;
  onOpenReport: (campaign: Campaign) => void;
}

export const CampaignsView: React.FC<CampaignsViewProps> = ({ onNavigate, onOpenReport }) => {
  const { user, campaigns, updateCampaignStatus, deleteCampaign, addCampaign } = useStore();
  
  const [activeSubTab, setActiveSubTab] = useState<'list' | 'create'>('list');
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState<string>('');

  // Creation Form State
  const [name, setName] = useState('');
  const [url, setUrl] = useState('https://');
  const [format, setFormat] = useState<CampaignFormat>('smartlink');
  const [keywords, setKeywords] = useState('');
  const [country, setCountry] = useState<TrafficCountry>('All Countries (Cheap)');
  const [deviceType, setDeviceType] = useState<DeviceType>('both');
  const [visitorsTarget, setVisitorsTarget] = useState<number>(20000);
  const [cpm, setCpm] = useState<number>(0.05);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Tier CPM Pricing Map
  const getMinCpmForCountry = (ctry: TrafficCountry, fmt: CampaignFormat): number => {
    if (fmt === 'organic') {
      if (ctry === 'All Countries (Cheap)' || ctry === 'Other Tier 3') {
        return 0.50; // $0.50 USD for worldwide
      }
      return 1.00; // $1.00 USD for all premium countries
    }
    if (ctry === 'All Countries (Cheap)') return 0.05;
    if (['United States', 'United Kingdom', 'Germany', 'Canada', 'Australia', 'France', 'Japan'].includes(ctry)) return 0.25;
    if (['Spain', 'Italy', 'Brazil', 'Mexico', 'Pakistan', 'India', 'Saudi Arabia', 'UAE'].includes(ctry)) return 0.20;
    return 0.05; // Tier 3
  };

  const handleCountrySelect = (ctry: TrafficCountry) => {
    setCountry(ctry);
    const minRate = getMinCpmForCountry(ctry, format);
    setCpm(minRate);
    if (ctry === 'All Countries (Cheap)') {
      setDeviceType('both');
    }
  };

  const handleFormatSelect = (fmt: CampaignFormat) => {
    setFormat(fmt);
    const minRate = getMinCpmForCountry(country, fmt);
    setCpm(minRate);
  };

  const minAllowedCpm = getMinCpmForCountry(country, format);
  const isAllCountries = country === 'All Countries (Cheap)';
  const budget = (visitorsTarget / 1000) * cpm;
  const estimatedDeliveryHours = Math.max(2, Math.round(visitorsTarget / 3000));
  const hasEnoughWallet = (user?.walletBalance || 0) >= budget;

  const userCampaigns = campaigns.filter(c => c.userId === user?.id || user?.role === 'admin');

  const filteredCampaigns = userCampaigns.filter(c => {
    const matchesFilter = filter === 'all' || c.status === filter;
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
                          c.url.toLowerCase().includes(search.toLowerCase()) ||
                          (c.keywords && c.keywords.toLowerCase().includes(search.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!url || !url.startsWith('http')) {
      setError('Please enter a valid target URL starting with http:// or https://');
      return;
    }

    if (format === 'organic' && (!keywords || keywords.trim().length === 0)) {
      setError('Please enter target organic search keywords (e.g. website ranks on this keyword)');
      return;
    }

    if (cpm < minAllowedCpm) {
      setError(`Minimum CPM for ${country} (${format === 'organic' ? 'Organic Traffic' : 'Standard Traffic'}) is $${minAllowedCpm.toFixed(2)} USD.`);
      return;
    }

    if (!hasEnoughWallet) {
      setError(`Insufficient wallet balance (${user?.walletBalance.toFixed(2)}). Required budget is $${budget.toFixed(2)}. Please deposit funds first.`);
      return;
    }

    setLoading(true);
    const result = await addCampaign({
      name: name || `${format === 'organic' ? 'Organic Search' : format === 'smartlink' ? 'SmartLink' : 'Pop-Up'} Traffic Campaign`,
      url,
      keywords: format === 'organic' ? keywords : undefined,
      format,
      country,
      deviceType: isAllCountries ? 'both' : deviceType,
      visitorsTarget,
      cpm,
      budget,
      estimatedDeliveryHours,
    });

    setLoading(false);

    if (result.success) {
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
      setSuccessMsg('Campaign order created! Status set to Pending Admin Review (Max 12 Hours Review Time).');
      setName('');
      setUrl('https://');
      setKeywords('');
      setTimeout(() => {
        setActiveSubTab('list');
      }, 1500);
    } else {
      setError(result.message || 'Failed to submit campaign');
    }
  };

  const countryList: { name: TrafficCountry; tier: string; minCpm: number }[] = [
    { name: 'All Countries (Cheap)', tier: 'Worldwide Baseline', minCpm: 0.05 },
    { name: 'United States', tier: 'Tier 1', minCpm: 0.25 },
    { name: 'United Kingdom', tier: 'Tier 1', minCpm: 0.25 },
    { name: 'Germany', tier: 'Tier 1', minCpm: 0.25 },
    { name: 'Canada', tier: 'Tier 1', minCpm: 0.25 },
    { name: 'Australia', tier: 'Tier 1', minCpm: 0.25 },
    { name: 'France', tier: 'Tier 1', minCpm: 0.25 },
    { name: 'Japan', tier: 'Tier 1', minCpm: 0.25 },
    { name: 'Spain', tier: 'Tier 2', minCpm: 0.20 },
    { name: 'Italy', tier: 'Tier 2', minCpm: 0.20 },
    { name: 'Brazil', tier: 'Tier 2', minCpm: 0.20 },
    { name: 'Mexico', tier: 'Tier 2', minCpm: 0.20 },
    { name: 'Pakistan', tier: 'Tier 2', minCpm: 0.20 },
    { name: 'India', tier: 'Tier 2', minCpm: 0.20 },
    { name: 'Saudi Arabia', tier: 'Tier 2', minCpm: 0.20 },
    { name: 'UAE', tier: 'Tier 2', minCpm: 0.20 },
    { name: 'Other Tier 3', tier: 'Tier 3', minCpm: 0.05 },
  ];

  return (
    <div className="space-y-6 text-[#111827] dark:text-white">
      
      {/* Header & Main Tab Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Campaign Management & Traffic Purchasing</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Launch high-converting SmartLink or Pop-Up campaigns, configure geo-targeting, and monitor visitor traffic.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-200/80 dark:bg-slate-800/80 p-1.5 rounded-2xl border border-slate-300 dark:border-slate-700">
          <button
            onClick={() => setActiveSubTab('list')}
            className={`py-2 px-4 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              activeSubTab === 'list'
                ? 'bg-[#111827] text-white dark:bg-[#DFFF2F] dark:text-[#111827] shadow-md'
                : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            My Campaigns ({userCampaigns.length})
          </button>
          <button
            onClick={() => setActiveSubTab('create')}
            className={`py-2 px-4 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'create'
                ? 'bg-[#111827] text-white dark:bg-[#DFFF2F] dark:text-[#111827] shadow-md'
                : 'bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-500/30'
            }`}
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" /> Launch Campaign
          </button>
        </div>
      </div>

      {activeSubTab === 'create' ? (
        <BuyTrafficView
          onSuccess={() => setActiveSubTab('list')}
          onGoDeposit={() => onNavigate('wallet')}
        />
      ) : (
        /* CAMPAIGN LIST VIEW */
        <div className="space-y-6">
          {/* Filter Tabs & Search Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3">
            {/* Status Filters */}
            <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
              {['all', 'pending', 'running', 'completed', 'paused'].map((st) => (
                <button
                  key={st}
                  onClick={() => setFilter(st)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize whitespace-nowrap transition-all cursor-pointer ${
                    filter === st
                      ? 'bg-[#111827] text-white dark:bg-[#DFFF2F] dark:text-[#111827] shadow'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search campaign..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#DFFF2F]"
              />
            </div>
          </div>

          {/* Campaign Cards List */}
          <div className="space-y-4">
            {filteredCampaigns.length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8">
                <Layers className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">No campaigns found</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                  Launch your first high-volume SmartLink or Pop-Up campaign with verified human traffic starting at $0.05 CPM.
                </p>
                <button
                  onClick={() => setActiveSubTab('create')}
                  className="mt-4 py-2.5 px-5 bg-[#111827] text-white dark:bg-[#DFFF2F] dark:text-[#111827] font-black rounded-xl text-xs shadow cursor-pointer"
                >
                  Launch Campaign
                </button>
              </div>
            ) : (
              filteredCampaigns.map((cmp) => {
                const pct = Math.min(100, Math.round((cmp.visitorsDelivered / cmp.visitorsTarget) * 100));

                return (
                  <motion.div
                    key={cmp.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 md:p-6 shadow-sm hover:border-[#DFFF2F]/50 transition-all text-[#111827] dark:text-white"
                  >
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                            cmp.status === 'running' ? 'bg-emerald-500/20 text-emerald-800 dark:text-emerald-300' :
                            cmp.status === 'pending' ? 'bg-amber-500/20 text-amber-900 dark:text-amber-300' :
                            cmp.status === 'completed' ? 'bg-blue-500/20 text-blue-800 dark:text-blue-300' :
                            'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                          }`}>
                            {cmp.status === 'pending' ? '⏳ Pending Review (12h Max)' : cmp.status}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-extrabold uppercase text-slate-600 dark:text-slate-300">
                            Format: {cmp.format || 'SmartLink'}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">ID: {cmp.id}</span>
                        </div>

                        <h3 className="text-base font-extrabold text-[#111827] dark:text-white">{cmp.name}</h3>
                        <a
                          href={cmp.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-emerald-600 dark:text-[#DFFF2F] hover:underline font-mono truncate max-w-md block flex items-center gap-1 mt-0.5"
                        >
                          {cmp.url} <ExternalLink className="w-3 h-3" />
                        </a>
                        {cmp.keywords && (
                          <div className="mt-1.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
                            <Search className="w-3 h-3" />
                            <span>Keywords: "{cmp.keywords}"</span>
                          </div>
                        )}
                      </div>

                      {/* Actions: User can view details/report */}
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => onOpenReport(cmp)}
                          className="py-2 px-4 bg-[#111827] text-white dark:bg-[#DFFF2F] dark:text-[#111827] rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer shadow"
                        >
                          <Eye className="w-3.5 h-3.5" /> View Report
                        </button>
                      </div>
                    </div>

                    {/* Delivery Progress Bar */}
                    <div className="space-y-1.5 bg-slate-50 dark:bg-slate-950 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                          Delivered: <strong className="text-[#111827] dark:text-white font-black">{cmp.visitorsDelivered.toLocaleString()}</strong> / {cmp.visitorsTarget.toLocaleString()} Hits
                        </span>
                        <span className="font-black text-emerald-600 dark:text-[#DFFF2F]">{pct}% Target</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-[#DFFF2F] transition-all duration-500 rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <div className="flex flex-wrap justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1 font-mono">
                        <span className="flex items-center gap-1 font-bold">
                          <Globe className="w-3 h-3 text-emerald-600 dark:text-[#DFFF2F]" /> {cmp.country}
                        </span>
                        <span className="flex items-center gap-1 capitalize font-bold">
                          <Smartphone className="w-3 h-3 text-emerald-600 dark:text-[#DFFF2F]" /> {cmp.deviceType}
                        </span>
                        <span>CPM: ${cmp.cpm.toFixed(2)}</span>
                        <span>Budget: ${cmp.budget.toFixed(2)} USD</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
