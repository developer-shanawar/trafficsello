import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart, Globe, Smartphone, Zap, Calculator, Wallet, ArrowRight,
  CheckCircle2, AlertTriangle, ShieldCheck, X, Plus, Layers, Clock, Sparkles
} from 'lucide-react';
import { useStore } from '../../lib/store';
import { TrafficCountry, DeviceType } from '../../types';
import confetti from 'canvas-confetti';

interface BuyTrafficViewProps {
  onSuccess: () => void;
  onGoDeposit: () => void;
}

const AVAILABLE_COUNTRIES = [
  { code: 'PK', name: 'Pakistan', flag: '🇵🇰', tier: 2 },
  { code: 'US', name: 'United States', flag: '🇺🇸', tier: 1 },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', tier: 1 },
  { code: 'DE', name: 'Germany', flag: '🇩🇪', tier: 1 },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', tier: 1 },
  { code: 'AU', name: 'Australia', flag: '🇦🇺', tier: 1 },
  { code: 'FR', name: 'France', flag: '🇫🇷', tier: 1 },
  { code: 'JP', name: 'Japan', flag: '🇯🇵', tier: 1 },
  { code: 'ES', name: 'Spain', flag: '🇪🇸', tier: 2 },
  { code: 'IT', name: 'Italy', flag: '🇮🇹', tier: 2 },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷', tier: 2 },
  { code: 'MX', name: 'Mexico', flag: '🇲🇽', tier: 2 },
  { code: 'IN', name: 'India', flag: '🇮🇳', tier: 2 },
  { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦', tier: 2 },
  { code: 'AE', name: 'UAE', flag: '🇦🇪', tier: 2 },
  { code: 'TR', name: 'Turkey', flag: '🇹🇷', tier: 2 },
  { code: 'BD', name: 'Bangladesh', flag: '🇧🇩', tier: 3 },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱', tier: 1 },
  { code: 'SE', name: 'Sweden', flag: '🇸🇪', tier: 1 }
];

const TRAFFIC_TYPES = [
  { id: 'Popunder Direct Traffic', label: 'Popunder Direct Traffic', desc: 'High Volume & Highest Conversion CTR', minCpm: 0.05 },
  { id: 'Organic Search Engine Traffic', label: 'Organic Search Engine Traffic', desc: 'Google & Bing Organic Keyword Referrals', minCpm: 0.50 },
  { id: 'Social Media Referral Traffic', label: 'Social Media Referral Traffic', desc: 'Facebook, Instagram, X/Twitter & TikTok Hits', minCpm: 0.20 },
  { id: 'Native Content Recommendation', label: 'Native Content Recommendation', desc: 'Native Article Widget Placements', minCpm: 0.15 },
  { id: 'Push Notification & SmartLink', label: 'Push Notification & SmartLink', desc: 'Direct Push Subscribers & High Speed SmartLinks', minCpm: 0.10 }
];

export const BuyTrafficView: React.FC<BuyTrafficViewProps> = ({ onSuccess, onGoDeposit }) => {
  const { user, addCampaign, platformSettings, formatMoney } = useStore();

  const [name, setName] = useState('');
  const [url, setUrl] = useState('https://');
  const [trafficType, setTrafficType] = useState('Popunder Direct Traffic');
  
  // Geo targeting state: 'all' vs 'selected'
  const [geoMode, setGeoMode] = useState<'all' | 'selected'>('all');
  const [selectedCountries, setSelectedCountries] = useState<string[]>(['Pakistan', 'United States']);
  
  const [deviceType, setDeviceType] = useState<DeviceType>('both');
  
  // Volume: Manual input, range 1,000 to 100,000
  const [visitorsTarget, setVisitorsTarget] = useState<number>(10000);
  
  // Duration: Days
  const [campaignDays, setCampaignDays] = useState<number>(7);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // User Custom CPM & Max CPM state
  const [customCpmInput, setCustomCpmInput] = useState<string>('');
  const [maxCpmInput, setMaxCpmInput] = useState<string>('');

  // Calculate dynamic minimum CPM based on traffic type and geo selection
  const selectedTypeObj = TRAFFIC_TYPES.find(t => t.id === trafficType) || TRAFFIC_TYPES[0];
  let minCpm = selectedTypeObj.minCpm;
  
  if (geoMode === 'selected' && selectedCountries.length > 0) {
    const hasTier1 = selectedCountries.some(c => {
      const match = AVAILABLE_COUNTRIES.find(ac => ac.name === c);
      return match && match.tier === 1;
    });
    if (hasTier1) {
      minCpm = Math.max(minCpm, 0.25);
    } else {
      minCpm = Math.max(minCpm, 0.20);
    }
  } else if (geoMode === 'all') {
    minCpm = Math.max(minCpm, 0.05);
  }

  const parsedCustomCpm = parseFloat(customCpmInput);
  const effectiveCpm = !isNaN(parsedCustomCpm) && parsedCustomCpm > 0 ? Math.max(minCpm, parsedCustomCpm) : minCpm;

  const budget = (visitorsTarget / 1000) * effectiveCpm;
  const estimatedDeliveryHours = campaignDays * 24;
  const dailyPace = Math.round(visitorsTarget / Math.max(1, campaignDays));
  const dailyBudget = budget / Math.max(1, campaignDays);
  const hasEnoughWallet = (user?.walletBalance || 0) >= budget;

  const handleAddCountry = (countryName: string) => {
    if (!countryName) return;
    if (!selectedCountries.includes(countryName)) {
      setSelectedCountries(prev => [...prev, countryName]);
    }
  };

  const handleRemoveCountry = (countryName: string) => {
    setSelectedCountries(prev => prev.filter(c => c !== countryName));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!url || !url.startsWith('http')) {
      setError('Please enter a valid website URL starting with http:// or https://');
      return;
    }

    if (visitorsTarget < 1000 || visitorsTarget > 100000) {
      setError('Traffic volume must be between 1,000 and 100,000 visitors per campaign.');
      return;
    }

    if (geoMode === 'selected' && selectedCountries.length === 0) {
      setError('Please select at least one target country from the dropdown.');
      return;
    }

    if (!hasEnoughWallet) {
      setError(`Insufficient wallet balance. Required: $${budget.toFixed(2)}, Available: $${(user?.walletBalance || 0).toFixed(2)}. Please deposit funds.`);
      return;
    }

    setLoading(true);

    const countryDisplayString = geoMode === 'all' 
      ? 'All Countries (Cheap)' 
      : selectedCountries.join(', ');

    const result = await addCampaign({
      name: name || `${trafficType} - ${countryDisplayString}`,
      url,
      country: countryDisplayString as any,
      deviceType,
      visitorsTarget,
      cpm: effectiveCpm,
      budget,
      estimatedDeliveryHours,
      trafficType,
      durationDays: campaignDays
    });

    setLoading(false);

    if (result.success) {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      onSuccess();
    } else {
      setError(result.message || 'Failed to launch campaign');
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[#DFFF2F] text-slate-950 border border-slate-900 shadow-sm mb-2">
            <Zap className="w-3.5 h-3.5" /> High Precision Traffic Engine
          </span>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white">Create Website Traffic Campaign</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Route targeted human traffic with custom visitor volume (1,000–100,000), geo-targeting, and duration control.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-950 px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800">
          <Wallet className="w-5 h-5 text-[#DFFF2F]" />
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Deposit Wallet</span>
            <strong className="text-sm font-black text-slate-900 dark:text-white">{formatMoney(user?.walletBalance || 0)}</strong>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-bold rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
          {!hasEnoughWallet && (
            <button
              type="button"
              onClick={onGoDeposit}
              className="px-3 py-1.5 bg-[#DFFF2F] text-slate-950 font-black rounded-xl text-xs hover:scale-105 transition-all shadow cursor-pointer"
            >
              Deposit Funds Now
            </button>
          )}
        </div>
      )}

      {/* Campaign Form Grid */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Form Controls */}
        <div className="lg:col-span-7 space-y-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm">
          
          {/* 1. Campaign Name */}
          <div>
            <label className="block text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider mb-1.5">
              1. Campaign Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Traffic Blitz Campaign - High Speed"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs text-slate-900 dark:text-white font-medium focus:outline-none focus:border-[#DFFF2F]"
            />
          </div>

          {/* 2. Target Website URL */}
          <div>
            <label className="block text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider mb-1.5">
              2. Target Website URL
            </label>
            <input
              type="url"
              required
              placeholder="https://yourwebsite.com/landing"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:border-[#DFFF2F]"
            />
          </div>

          {/* 3. Traffic Type Selector */}
          <div>
            <label className="block text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider mb-2">
              3. Select Traffic Type & Category
            </label>
            <div className="space-y-2">
              {TRAFFIC_TYPES.map((t) => (
                <div
                  key={t.id}
                  onClick={() => setTrafficType(t.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    trafficType === t.id
                      ? 'bg-slate-900 text-white dark:bg-[#DFFF2F]/10 border-[#DFFF2F] shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      trafficType === t.id ? 'border-[#DFFF2F] bg-[#DFFF2F]' : 'border-slate-400'
                    }`}>
                      {trafficType === t.id && <div className="w-1.5 h-1.5 bg-slate-950 rounded-full" />}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-slate-900 dark:text-white">{t.label}</h4>
                      <p className="text-[10px] text-slate-400">{t.desc}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                    From {formatMoney(t.minCpm)} CPM
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Geo-Traffic Target Dropdown & Selected Countries */}
          <div className="space-y-3">
            <label className="block text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
              4. Geo-Traffic Location Targeting
            </label>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Dropdown 1: Mode (All vs Selected) */}
              <div>
                <span className="text-[10px] font-bold text-slate-400 block mb-1">Targeting Mode:</span>
                <select
                  value={geoMode}
                  onChange={(e) => setGeoMode(e.target.value as 'all' | 'selected')}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#DFFF2F] cursor-pointer"
                >
                  <option value="all">🌍 All Countries (Global Cheap Rate)</option>
                  <option value="selected">🎯 Selected Countries (Custom Geo Target)</option>
                </select>
              </div>

              {/* Dropdown 2: Country picker (only if selected mode) */}
              {geoMode === 'selected' && (
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block mb-1">Add Country to Target List:</span>
                  <select
                    onChange={(e) => {
                      handleAddCountry(e.target.value);
                      e.target.value = '';
                    }}
                    defaultValue=""
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#DFFF2F] cursor-pointer"
                  >
                    <option value="" disabled>-- Pick a country to add --</option>
                    {AVAILABLE_COUNTRIES.map((ac) => (
                      <option key={ac.code} value={ac.name}>
                        {ac.flag} {ac.name} (Tier {ac.tier})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Selected Countries Display Badge List */}
            {geoMode === 'selected' && (
              <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase">
                  <span>Selected Target Countries ({selectedCountries.length}):</span>
                  {selectedCountries.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setSelectedCountries([])}
                      className="text-rose-500 hover:underline cursor-pointer"
                    >
                      Clear All
                    </button>
                  )}
                </div>

                {selectedCountries.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No country selected yet. Choose from the dropdown above to add countries (e.g. Pakistan, USA, UK).</p>
                ) : (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {selectedCountries.map((c) => {
                      const match = AVAILABLE_COUNTRIES.find(ac => ac.name === c);
                      return (
                        <span
                          key={c}
                          className="px-3 py-1.5 rounded-xl bg-slate-900 text-white dark:bg-slate-800 dark:text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
                        >
                          <span>{match?.flag || '🌐'}</span>
                          <span>{c}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveCountry(c)}
                            className="text-slate-400 hover:text-rose-400 ml-1 cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 5. Traffic Quantity (Manual Input, 1,000 to 100,000 per campaign) */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                5. Enter Target Traffic Quantity (Visitors / Hits)
              </label>
              <span className="text-[10px] text-slate-400 font-mono">Min 1,000 — Max 100,000</span>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="number"
                required
                min={1000}
                max={100000}
                step={1000}
                value={visitorsTarget}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  if (!isNaN(val)) {
                    setVisitorsTarget(val);
                  }
                }}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-mono font-black text-slate-900 dark:text-[#DFFF2F] focus:outline-none focus:border-[#DFFF2F]"
              />
              <span className="text-xs font-bold text-slate-500 uppercase shrink-0">Hits</span>
            </div>

            {/* Presets */}
            <div className="flex flex-wrap gap-2 pt-1">
              {[1000, 5000, 10000, 20000, 50000, 100000].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setVisitorsTarget(preset)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                    visitorsTarget === preset
                      ? 'bg-slate-900 text-white dark:bg-[#DFFF2F] dark:text-slate-950 shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {preset.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          {/* 6. Campaign Duration (Days) */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                6. Campaign Duration (Total Days)
              </label>
              <span className="text-[10px] text-slate-400 font-mono">Paced Traffic Delivery</span>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="number"
                required
                min={1}
                max={90}
                value={campaignDays}
                onChange={(e) => setCampaignDays(Math.max(1, Math.min(90, Number(e.target.value))))}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-mono font-black text-slate-900 dark:text-[#DFFF2F] focus:outline-none focus:border-[#DFFF2F]"
              />
              <span className="text-xs font-bold text-slate-500 uppercase shrink-0">Days</span>
            </div>

            {/* Quick Days Selector */}
            <div className="flex flex-wrap gap-2 pt-1">
              {[
                { days: 1, label: '1 Day (Fast Delivery)' },
                { days: 3, label: '3 Days' },
                { days: 5, label: '5 Days' },
                { days: 7, label: '7 Days' },
                { days: 14, label: '14 Days' },
                { days: 30, label: '30 Days' },
              ].map((item) => (
                <button
                  key={item.days}
                  type="button"
                  onClick={() => setCampaignDays(item.days)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    campaignDays === item.days
                      ? 'bg-slate-900 text-white dark:bg-[#DFFF2F] dark:text-slate-950 shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* 7. Device Targeting */}
          <div>
            <label className="block text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider mb-2">
              7. Device Targeting
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'desktop', label: 'Desktop Only' },
                { id: 'mobile', label: 'Mobile Only' },
                { id: 'both', label: 'Desktop & Mobile' },
              ].map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setDeviceType(d.id as DeviceType)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold text-center transition-all cursor-pointer ${
                    deviceType === d.id
                      ? 'bg-slate-900 text-white dark:bg-[#DFFF2F] dark:text-slate-950 shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* 8. Minimum & Custom CPM Control */}
          <div className="p-4 bg-slate-50 dark:bg-slate-950/80 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <Calculator className="w-4 h-4 text-[#DFFF2F]" />
                8. CPM Rate & Custom Bid Controls
              </label>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                System Min: ${minCpm.toFixed(2)} CPM
              </span>
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
              Minimum CPM for your selected target geo is <strong>${minCpm.toFixed(2)}</strong>. You can enter a custom higher CPM bid to get priority ad delivery speed.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              <div>
                <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase block mb-1">
                  Custom CPM Bid ($ USD)
                </span>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-xs text-slate-400 font-mono font-bold">$</span>
                  <input
                    type="number"
                    step="0.01"
                    min={minCpm}
                    max={10.00}
                    placeholder={`Min $${minCpm.toFixed(2)}`}
                    value={customCpmInput}
                    onChange={(e) => setCustomCpmInput(e.target.value)}
                    className="w-full pl-7 pr-3 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#DFFF2F]"
                  />
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase block mb-1">
                  Max CPM Budget Cap ($ USD)
                </span>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-xs text-slate-400 font-mono font-bold">$</span>
                  <input
                    type="number"
                    step="0.05"
                    placeholder="e.g. $1.00 Max"
                    value={maxCpmInput}
                    onChange={(e) => setMaxCpmInput(e.target.value)}
                    className="w-full pl-7 pr-3 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#DFFF2F]"
                  />
                </div>
              </div>
            </div>

            <div className="text-[10px] text-slate-400 font-mono flex items-center justify-between pt-1">
              <span>Effective CPM Bid: <strong className="text-[#DFFF2F]">${effectiveCpm.toFixed(2)}</strong></span>
              <span>Real-Time Total: <strong className="text-white">${budget.toFixed(2)}</strong></span>
            </div>
          </div>
        </div>

        {/* Right Summary Card & Automated Budget Alert */}
        <div className="lg:col-span-5 bg-slate-900 text-white rounded-3xl p-6 md:p-8 border border-slate-800 shadow-2xl flex flex-col justify-between relative overflow-hidden space-y-6">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#DFFF2F]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">Campaign Cost Breakdown</span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#DFFF2F]/20 text-[#DFFF2F]">
                CPM ${effectiveCpm.toFixed(2)} / 1K
              </span>
            </div>

            <div>
              <span className="text-xs text-slate-400 block mb-1">Total Calculated Budget</span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-[#DFFF2F]">{formatMoney(budget)}</span>
                <span className="text-xs text-slate-400 font-mono">({formatMoney(dailyBudget)}/Day)</span>
              </div>
            </div>

            {/* Wallet Check & Auto Budget Stop Notice */}
            <div className={`p-4 rounded-2xl border text-xs space-y-2 ${
              hasEnoughWallet
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
                : 'bg-rose-500/10 border-rose-500/20 text-rose-300'
            }`}>
              <div className="flex justify-between items-center font-bold">
                <span>Available Wallet Balance:</span>
                <span className="font-mono">{formatMoney(user?.walletBalance || 0)}</span>
              </div>
              <p className="text-[11px] leading-relaxed opacity-90">
                {hasEnoughWallet
                  ? '✓ Sufficient funds available in your Deposit Wallet.'
                  : `⚠️ Wallet balance is short by ${formatMoney(budget - (user?.walletBalance || 0))}.`}
              </p>
              
              {/* Automated Budget Depletion Rules Note */}
              <div className="pt-2 border-t border-slate-800/60 text-[10px] text-amber-300/90 flex items-start gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-400" />
                <span>
                  <strong>Automated Safety Protection:</strong> When your deposit wallet runs out of funds, campaign traffic will automatically stop and trigger a <em>"Please deposit funds"</em> alert.
                </span>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-300 border-t border-slate-800 pt-4">
              <div className="flex justify-between">
                <span className="text-slate-400">Total Traffic Volume:</span>
                <span className="font-bold text-white font-mono">{visitorsTarget.toLocaleString()} Visitors</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Traffic Category:</span>
                <span className="font-semibold text-slate-200">{trafficType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Geo Location:</span>
                <span className="font-semibold text-slate-200">
                  {geoMode === 'all' ? '🌍 All Countries' : `🎯 ${selectedCountries.length} Country(s)`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Duration & Daily Pace:</span>
                <span className="font-semibold text-[#DFFF2F] font-mono">
                  {campaignDays} {campaignDays === 1 ? 'Day' : 'Days'} (~{dailyPace.toLocaleString()} Hits/Day)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Target URL:</span>
                <span className="font-mono truncate max-w-[150px]">{url}</span>
              </div>
            </div>
          </div>

          <div>
            {hasEnoughWallet ? (
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-[#DFFF2F] hover:bg-[#cbe820] text-slate-950 font-black rounded-2xl text-sm transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Initializing Campaign...' : 'Launch Traffic Campaign Now'}
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={onGoDeposit}
                className="w-full py-4 bg-emerald-400 hover:bg-emerald-500 text-slate-950 font-black rounded-2xl text-sm transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                Deposit Funds ({formatMoney(budget - (user?.walletBalance || 0))} needed)
                <Wallet className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};
