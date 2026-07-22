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
  const { user, addCampaign, platformSettings } = useStore();

  const [name, setName] = useState('');
  const [url, setUrl] = useState('https://');
  const [country, setCountry] = useState<TrafficCountry>('All Countries (Cheap)');
  const [deviceType, setDeviceType] = useState<DeviceType>('both');
  const [visitorsTarget, setVisitorsTarget] = useState<number>(50000);
  const [cpm, setCpm] = useState<number>(0.05);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const budget = (visitorsTarget / 1000) * cpm;
  const estimatedDeliveryHours = Math.max(1, Math.round(visitorsTarget / 4000));
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

          {/* Visitor Target Slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Total Visitors Required
              </label>
              <span className="text-sm font-extrabold text-[#111827] dark:text-[#DFFF2F] bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                {visitorsTarget.toLocaleString()} Hits
              </span>
            </div>
            <input
              type="range"
              min={5000}
              max={1000000}
              step={5000}
              value={visitorsTarget}
              onChange={(e) => setVisitorsTarget(Number(e.target.value))}
              className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#DFFF2F]"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
              <span>5K</span>
              <span>250K</span>
              <span>500K</span>
              <span>1M+</span>
            </div>
          </div>
        </div>

        {/* Right Summary Card */}
        <div className="lg:col-span-5 bg-slate-900 text-white rounded-3xl p-6 md:p-8 border border-slate-800 shadow-2xl flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#DFFF2F]/10 rounded-full blur-3xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
              <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">Campaign Summary</span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#DFFF2F]/20 text-[#DFFF2F]">
                CPM ${cpm.toFixed(3)}
              </span>
            </div>

            <div className="mb-6">
              <span className="text-xs text-slate-400 block mb-1">Total Campaign Cost</span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-extrabold text-[#DFFF2F]">${budget.toFixed(2)}</span>
                <span className="text-xs text-slate-400">USD</span>
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
                <span>${user?.walletBalance.toFixed(2)} USD</span>
              </div>
              <p className="text-[11px] opacity-80">
                {hasEnoughWallet
                  ? '✓ Sufficient funds available. Budget will be deducted upon launch.'
                  : `⚠️ Short by $${(budget - (user?.walletBalance || 0)).toFixed(2)}. Deposit funds first.`}
              </p>
            </div>

            <div className="space-y-3 text-xs text-slate-300 border-t border-slate-800 pt-4 mb-6">
              <div className="flex justify-between">
                <span className="text-slate-400">Target URL:</span>
                <span className="font-mono truncate max-w-[150px]">{url}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Geo Target:</span>
                <span className="font-semibold">{country}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Delivery Window:</span>
                <span className="font-semibold text-[#DFFF2F]">~{estimatedDeliveryHours} Hours</span>
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
                Deposit Funds (${budget.toFixed(2)} needed)
                <Wallet className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};
