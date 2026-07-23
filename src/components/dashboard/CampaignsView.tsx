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
        /* CREATE / LAUNCH CAMPAIGN FORM */
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center gap-3">
            <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
            <div className="text-xs">
              <strong className="font-extrabold block text-amber-900 dark:text-amber-300">12-Hour Max Review Guarantee</strong>
              <span className="text-amber-800/80 dark:text-amber-400">Newly launched campaigns enter Pending status for quick quality & bot-check review before live visitor delivery.</span>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-400 text-xs font-semibold rounded-2xl flex items-center justify-between">
              <span>{error}</span>
              {!hasEnoughWallet && (
                <button
                  onClick={() => onNavigate('wallet')}
                  className="px-3 py-1.5 bg-[#111827] text-[#DFFF2F] dark:bg-[#DFFF2F] dark:text-[#111827] font-black rounded-xl text-xs"
                >
                  Deposit Funds
                </button>
              )}
            </div>
          )}

          {successMsg && (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs font-bold rounded-2xl">
              ✓ {successMsg}
            </div>
          )}

          <form onSubmit={handleCreateSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Form Inputs */}
            <div className="lg:col-span-7 space-y-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm">
              
              {/* Campaign Name */}
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider mb-1.5">Campaign Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. E-commerce Special SmartLink Promotion"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-2xl text-xs font-semibold text-[#111827] dark:text-white focus:outline-none focus:border-[#111827] dark:focus:border-[#DFFF2F]"
                />
              </div>

              {/* Target Website URL */}
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider mb-1.5">Target Destination URL</label>
                <input
                  type="url"
                  required
                  placeholder="https://yourwebsite.com/landing"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-2xl text-xs font-mono font-medium text-[#111827] dark:text-white focus:outline-none focus:border-[#111827] dark:focus:border-[#DFFF2F]"
                />
              </div>

              {/* Campaign Format Selection */}
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider mb-2">Campaign Format</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => handleFormatSelect('organic')}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                      format === 'organic'
                        ? 'bg-[#111827] text-white dark:bg-[#DFFF2F] dark:text-[#111827] border-[#111827] dark:border-[#DFFF2F] shadow-md'
                        : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-slate-400'
                    }`}
                  >
                    <Search className="w-5 h-5 mb-1.5 text-emerald-500 dark:text-slate-950" />
                    <strong className="block text-xs font-extrabold">Organic Search</strong>
                    <span className="text-[11px] opacity-80 block mt-0.5">$0.50 - $1.00 Search / CPM targeting</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleFormatSelect('smartlink')}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                      format === 'smartlink'
                        ? 'bg-[#111827] text-white dark:bg-[#DFFF2F] dark:text-[#111827] border-[#111827] dark:border-[#DFFF2F] shadow-md'
                        : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-slate-400'
                    }`}
                  >
                    <Sparkles className="w-5 h-5 mb-1.5" />
                    <strong className="block text-xs font-extrabold">Smart Link</strong>
                    <span className="text-[11px] opacity-80 block mt-0.5">Auto AI optimization matching highest converting offers</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleFormatSelect('popup')}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                      format === 'popup'
                        ? 'bg-[#111827] text-white dark:bg-[#DFFF2F] dark:text-[#111827] border-[#111827] dark:border-[#DFFF2F] shadow-md'
                        : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-slate-400'
                    }`}
                  >
                    <Layers className="w-5 h-5 mb-1.5" />
                    <strong className="block text-xs font-extrabold">Pop-Up / Popunder</strong>
                    <span className="text-[11px] opacity-80 block mt-0.5">Direct full browser window website landing impressions</span>
                  </button>
                </div>
              </div>

              {/* Organic Search Keywords Field */}
              {format === 'organic' && (
                <div className="p-4 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-2xl border border-emerald-500/30 space-y-2">
                  <label className="block text-xs font-extrabold uppercase text-emerald-900 dark:text-emerald-300">
                    Organic Search Keywords *
                  </label>
                  <p className="text-[11px] text-emerald-800/80 dark:text-emerald-400">
                    Enter the search terms for organic ranking. Visitors will search these exact keywords before clicking your website URL.
                  </p>
                  <input
                    type="text"
                    required
                    placeholder="e.g. website ranks on this keyword, buy cheap laptops 2026, travel guide"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    className="w-full px-4 py-3 bg-white dark:bg-slate-950 border border-emerald-500/40 rounded-2xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#DFFF2F]"
                  />
                  <div className="flex items-center justify-between text-[11px] font-bold text-emerald-700 dark:text-emerald-300 pt-1">
                    <span>Pricing: $0.50 USD Worldwide | $1.00 USD Premium Countries</span>
                  </div>
                </div>
              )}

              {/* Country & Tier Pricing Selection */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-extrabold uppercase tracking-wider">Geo Country Target & CPM Tier</label>
                  <span className="text-[11px] font-bold text-emerald-700 dark:text-[#DFFF2F]">Min CPM: ${minAllowedCpm.toFixed(2)}</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-56 overflow-y-auto p-1 border border-slate-200 dark:border-slate-800 rounded-2xl">
                  {countryList.map((item) => (
                    <button
                      key={item.name}
                      type="button"
                      onClick={() => handleCountrySelect(item.name)}
                      className={`p-2.5 rounded-xl text-left transition-all text-xs font-bold cursor-pointer ${
                        country === item.name
                          ? 'bg-[#111827] text-white dark:bg-[#DFFF2F] dark:text-[#111827] shadow-md'
                          : 'bg-slate-100 dark:bg-slate-800/60 hover:bg-slate-200 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span className="block truncate">{item.name}</span>
                      <span className="text-[10px] opacity-75 font-mono block mt-0.5">
                        {item.tier} • min ${item.minCpm.toFixed(2)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Device Targeting */}
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider mb-2">
                  Device Targeting {isAllCountries && <span className="text-amber-600 dark:text-amber-400 font-normal">(Locked to All Devices for Worldwide Cheap Traffic)</span>}
                </label>
                
                {isAllCountries ? (
                  <div className="p-3 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center gap-2">
                    <Monitor className="w-4 h-4 text-slate-500" />
                    <span>All Devices (Desktop & Mobile Traffic Included)</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'both', label: 'All Devices (Desktop & Mobile)', icon: Monitor },
                      { id: 'desktop', label: 'Desktop Only', icon: Monitor },
                      { id: 'mobile', label: 'Mobile Only', icon: Smartphone },
                    ].map((d) => (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() => setDeviceType(d.id as DeviceType)}
                        className={`p-3 rounded-xl text-xs font-extrabold transition-all cursor-pointer text-center ${
                          deviceType === d.id
                            ? 'bg-[#111827] text-white dark:bg-[#DFFF2F] dark:text-[#111827]'
                            : 'bg-slate-100 dark:bg-slate-800/60 hover:bg-slate-200 dark:hover:bg-slate-800'
                        }`}
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Visitor Quantity Slider */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-extrabold uppercase tracking-wider">Target Visitor Volume</label>
                  <span className="text-xs font-black bg-[#111827] text-[#DFFF2F] dark:bg-[#DFFF2F] dark:text-[#111827] px-3 py-1 rounded-full">
                    {visitorsTarget.toLocaleString()} Visitors
                  </span>
                </div>
                <input
                  type="range"
                  min={10000}
                  max={500000}
                  step={5000}
                  value={visitorsTarget}
                  onChange={(e) => setVisitorsTarget(Number(e.target.value))}
                  className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#DFFF2F]"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                  <span>10K</span>
                  <span>100K</span>
                  <span>250K</span>
                  <span>500K</span>
                </div>
              </div>

              {/* CPM Custom Bid */}
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider mb-1.5">
                  Your Custom CPM Bid (Min: ${minAllowedCpm.toFixed(2)})
                </label>
                <input
                  type="number"
                  step="0.01"
                  min={minAllowedCpm}
                  value={cpm}
                  onChange={(e) => setCpm(Math.max(minAllowedCpm, Number(e.target.value)))}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-2xl text-xs font-extrabold text-[#111827] dark:text-white focus:outline-none focus:border-[#111827] dark:focus:border-[#DFFF2F]"
                />
              </div>
            </div>

            {/* Right Summary Card */}
            <div className="lg:col-span-5 bg-[#111827] text-white rounded-3xl p-6 md:p-8 border border-slate-800 shadow-2xl flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#DFFF2F]/10 rounded-full blur-3xl pointer-events-none" />

              <div>
                <div className="pb-4 border-b border-slate-800 mb-6 flex justify-between items-center">
                  <span className="text-xs uppercase font-extrabold text-slate-400 tracking-wider">Order Budget Summary</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-[#DFFF2F] text-[#111827] uppercase">
                    {format}
                  </span>
                </div>

                <div className="mb-6">
                  <span className="text-xs text-slate-400 block mb-1">Total Campaign Budget</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-[#DFFF2F]">${budget.toFixed(2)}</span>
                    <span className="text-xs text-slate-400 font-bold">USD</span>
                  </div>
                </div>

                {/* Wallet Balance Card */}
                <div className={`p-4 rounded-2xl mb-6 border text-xs ${
                  hasEnoughWallet
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
                    : 'bg-rose-500/10 border-rose-500/20 text-rose-300'
                }`}>
                  <div className="flex justify-between items-center mb-1 font-bold">
                    <span>Available Wallet Balance:</span>
                    <span>${user?.walletBalance.toFixed(2)}</span>
                  </div>
                  <p className="text-[11px] opacity-80">
                    {hasEnoughWallet
                      ? '✓ Adequate balance available. Budget will be held upon order submission.'
                      : `⚠️ Need ${(budget - (user?.walletBalance || 0)).toFixed(2)} additional funds. Deposit to launch.`}
                  </p>
                </div>

                <div className="space-y-3 text-xs text-slate-300 border-t border-slate-800 pt-4 mb-6 font-medium">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Target Country:</span>
                    <span className="font-extrabold text-white">{country}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Visitor Target:</span>
                    <span className="font-extrabold text-white">{visitorsTarget.toLocaleString()} Hits</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Target Device:</span>
                    <span className="font-semibold text-white capitalize">{isAllCountries ? 'All Devices' : deviceType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Review Approval Time:</span>
                    <span className="font-bold text-amber-400">Max 12 Hours (Pending)</span>
                  </div>
                </div>
              </div>

              <div>
                {hasEnoughWallet ? (
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-[#DFFF2F] hover:bg-[#cbe820] text-[#111827] font-black rounded-2xl text-sm transition-all shadow-xl hover:scale-[1.01] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {loading ? 'Submitting Order...' : 'Launch Campaign Order'}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => onNavigate('wallet')}
                    className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-[#111827] font-black rounded-2xl text-sm transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer"
                  >
                    Deposit Wallet Funds
                    <Wallet className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </form>
        </motion.div>
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
