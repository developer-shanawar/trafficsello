import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Globe, Smartphone, Zap, Calculator, Wallet, ArrowRight, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useStore } from '../../lib/store';
import { TrafficCountry, DeviceType } from '../../types';
import confetti from 'canvas-confetti';

interface BuyTrafficViewProps {
  onSuccess: () => void;
  onGoDeposit: () => void;
}

export const BuyTrafficView: React.FC<BuyTrafficViewProps> = ({ onSuccess, onGoDeposit }) => {
  const { user, addCampaign, platformSettings, formatMoney } = useStore();

  const [name, setName] = useState('');
  const [url, setUrl] = useState('https://');
  const [country, setCountry] = useState<TrafficCountry>('All Countries (Cheap)');
  const [deviceType, setDeviceType] = useState<DeviceType>('both');
  const [visitorsTarget, setVisitorsTarget] = useState<number>(10000);
  const [campaignDays, setCampaignDays] = useState<number>(1);
  const [cpm, setCpm] = useState<number>(0.05);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const budget = (visitorsTarget / 1000) * cpm;
  const estimatedDeliveryHours = campaignDays * 24;
  const dailyPace = Math.round(visitorsTarget / Math.max(1, campaignDays));
  const hasEnoughWallet = (user?.walletBalance || 0) >= budget;

  const countryOptions: TrafficCountry[] = [
    'All Countries (Cheap)', 'United States', 'United Kingdom', 'Germany',
    'Canada', 'Australia', 'France', 'Japan', 'Spain', 'Italy', 'Brazil',
    'Mexico', 'Pakistan', 'India', 'Saudi Arabia', 'UAE', 'Other Tier 3'
  ];

  const handleCountryChange = (c: TrafficCountry) => {
    setCountry(c);
    const rates: Record<TrafficCountry, number> = {
      'All Countries (Cheap)': 0.05,
      'United States': 0.25,
      'United Kingdom': 0.25,
      'Germany': 0.25,
      'Canada': 0.25,
      'Australia': 0.25,
      'France': 0.25,
      'Japan': 0.25,
      'Spain': 0.20,
      'Italy': 0.20,
      'Brazil': 0.20,
      'Mexico': 0.20,
      'Pakistan': 0.20,
      'India': 0.20,
      'Saudi Arabia': 0.20,
      'UAE': 0.20,
      'Other Tier 3': 0.05,
    };
    setCpm(rates[c] || 0.05);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!url || !url.startsWith('http')) {
      setError('Please enter a valid website URL starting with http:// or https://');
      return;
    }

    if (!hasEnoughWallet) {
      setError(`Insufficient wallet balance. Required: $${budget.toFixed(2)}, Available: $${user?.walletBalance.toFixed(2)}.`);
      return;
    }

    setLoading(true);
    const result = await addCampaign({
      name: name || `${country} Traffic Campaign`,
      url,
      country,
      deviceType,
      visitorsTarget,
      cpm,
      budget,
      estimatedDeliveryHours,
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
    <div className="max-w-4xl mx-auto space-y-8">
      
      {/* Header */}
      <div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#DFFF2F]/20 text-slate-900 dark:text-[#DFFF2F] uppercase tracking-wider mb-2">
          <Zap className="w-3.5 h-3.5" /> High Precision Targeting
        </span>
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Create Website Traffic Campaign</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Route genuine human visitors to your website at an unbeatable baseline CPM rate of ${platformSettings.minCPM.toFixed(2)}.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
          {!hasEnoughWallet && (
            <button
              onClick={onGoDeposit}
              className="px-3 py-1 bg-[#DFFF2F] text-slate-900 font-bold rounded-lg text-xs"
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
          
          {/* Campaign Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Campaign Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Summer E-Commerce Traffic Blitz"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#DFFF2F]"
            />
          </div>

          {/* Website Target URL */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Target Website URL
            </label>
            <input
              type="url"
              required
              placeholder="https://yourwebsite.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:border-[#DFFF2F]"
            />
          </div>

          {/* Country Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Geo Location Target
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {countryOptions.map((ctry) => (
                <button
                  key={ctry}
                  type="button"
                  onClick={() => handleCountryChange(ctry)}
                  className={`flex items-center gap-2 justify-center py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                    country === ctry
                      ? 'bg-slate-900 text-white dark:bg-[#DFFF2F] dark:text-slate-950 shadow-md'
                      : 'bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5 opacity-70" />
                  {ctry}
                </button>
              ))}
            </div>
          </div>

          {/* Device Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Device Targeting
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
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold text-center transition-all ${
                    deviceType === d.id
                      ? 'bg-slate-900 text-white dark:bg-[#DFFF2F] dark:text-slate-950'
                      : 'bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Visitor Target Selector (Custom Quantity 1,000 to 1,000,000) */}
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Total Traffic Quantity (Visitors)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={1000}
                    max={1000000}
                    step={1000}
                    value={visitorsTarget}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (!isNaN(val)) setVisitorsTarget(Math.max(1000, Math.min(1000000, val)));
                    }}
                    className="w-36 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono font-bold text-[#111827] dark:text-[#DFFF2F] text-right focus:outline-none focus:border-[#DFFF2F]"
                  />
                  <span className="text-xs font-bold text-slate-500">Hits</span>
                </div>
              </div>

              <input
                type="range"
                min={1000}
                max={1000000}
                step={1000}
                value={visitorsTarget}
                onChange={(e) => setVisitorsTarget(Number(e.target.value))}
                className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#DFFF2F]"
              />
              
              <div className="flex justify-between text-[10px] font-bold text-slate-400 mt-1">
                <span>1,000 Min</span>
                <span>250,000</span>
                <span>500,000</span>
                <span>1,000,000 Max (1M)</span>
              </div>
            </div>

            {/* Campaign Duration (Days) */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Campaign Duration (Days)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    max={90}
                    value={campaignDays}
                    onChange={(e) => setCampaignDays(Math.max(1, Math.min(90, Number(e.target.value))))}
                    className="w-20 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono font-bold text-[#111827] dark:text-[#DFFF2F] text-center focus:outline-none focus:border-[#DFFF2F]"
                  />
                  <span className="text-xs font-bold text-slate-500">Days</span>
                </div>
              </div>

              {/* Quick Days Selector */}
              <div className="flex flex-wrap gap-2">
                {[
                  { days: 1, label: '1 Day (Instant)' },
                  { days: 3, label: '3 Days' },
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

            <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <span>Estimated Delivery Rate:</span>
              <strong className="text-slate-900 dark:text-[#DFFF2F] font-mono">
                ~{dailyPace.toLocaleString()} Visitors / Day ({campaignDays} {campaignDays === 1 ? 'Day' : 'Days'})
              </strong>
            </p>
          </div>
        </div>

        {/* Right Summary Card */}
        <div className="lg:col-span-5 bg-slate-900 text-white rounded-3xl p-6 md:p-8 border border-slate-800 shadow-2xl flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#DFFF2F]/10 rounded-full blur-3xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
              <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">Campaign Summary</span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#DFFF2F]/20 text-[#DFFF2F]">
                CPM {formatMoney(cpm)} / 1K
              </span>
            </div>

            <div className="mb-6">
              <span className="text-xs text-slate-400 block mb-1">Total Campaign Cost</span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-extrabold text-[#DFFF2F]">{formatMoney(budget)}</span>
              </div>
            </div>

            {/* Wallet Check Card */}
            <div className={`p-4 rounded-2xl mb-6 border text-xs ${
              hasEnoughWallet
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
                : 'bg-rose-500/10 border-rose-500/20 text-rose-300'
            }`}>
              <div className="flex justify-between items-center mb-1 font-bold">
                <span>Wallet Balance:</span>
                <span>{formatMoney(user?.walletBalance || 0)}</span>
              </div>
              <p className="text-[11px] opacity-80">
                {hasEnoughWallet
                  ? '✓ Sufficient funds available. Budget will be deducted upon launch.'
                  : `⚠️ Short by ${formatMoney(budget - (user?.walletBalance || 0))}. Deposit funds first.`}
              </p>
            </div>

            <div className="space-y-3 text-xs text-slate-300 border-t border-slate-800 pt-4 mb-6">
              <div className="flex justify-between">
                <span className="text-slate-400">Total Traffic:</span>
                <span className="font-bold text-white font-mono">{visitorsTarget.toLocaleString()} Hits</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Target URL:</span>
                <span className="font-mono truncate max-w-[150px]">{url}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Geo Target:</span>
                <span className="font-semibold">{country}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Campaign Duration:</span>
                <span className="font-semibold text-[#DFFF2F]">{campaignDays} {campaignDays === 1 ? 'Day' : 'Days'} (~{dailyPace.toLocaleString()} Hits/Day)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Bot Shield:</span>
                <span className="font-semibold text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> 100% Real Visitors
                </span>
              </div>
            </div>
          </div>

          <div>
            {hasEnoughWallet ? (
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-[#DFFF2F] hover:bg-[#cbe820] text-slate-950 font-black rounded-2xl text-sm transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Initializing Campaign...' : 'Launch Campaign Now'}
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={onGoDeposit}
                className="w-full py-3.5 bg-emerald-400 hover:bg-emerald-500 text-slate-950 font-black rounded-2xl text-sm transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
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
