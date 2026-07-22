import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, ArrowRight, Zap, Globe, Smartphone, ShieldCheck, Check } from 'lucide-react';
import { TrafficCountry, DeviceType } from '../types';

interface TrafficCalculatorProps {
  onStartCampaign?: (details: { visitors: number; country: TrafficCountry; device: DeviceType; cpm: number; budget: number }) => void;
}

export const TrafficCalculator: React.FC<TrafficCalculatorProps> = ({ onStartCampaign }) => {
  const [visitors, setVisitors] = useState<number>(50000);
  const [country, setCountry] = useState<TrafficCountry>('United States');
  const [device, setDevice] = useState<DeviceType>('both');
  const [cpm, setCpm] = useState<number>(0.08);

  // Budget = (Visitors / 1000) * CPM
  const calculatedBudget = (visitors / 1000) * cpm;
  const estimatedDeliveryHours = Math.max(1, Math.round(visitors / 4000));

  const countryRates: Record<TrafficCountry, number> = {
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

  const handleCountryChange = (c: TrafficCountry) => {
    setCountry(c);
    setCpm(countryRates[c] || 0.08);
  };

  return (
    <div className="bg-white/90 dark:bg-slate-900/90 rounded-3xl p-6 md:p-8 relative overflow-hidden border border-white dark:border-slate-800 shadow-xl text-[#111827] dark:text-white">
      <div className="absolute -top-24 -right-24 w-60 h-60 bg-[#DFFF2F]/15 rounded-full blur-3xl pointer-events-none" />
      
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-[#111827] dark:bg-[#DFFF2F]/20 text-[#DFFF2F] rounded-2xl shadow-md">
          <Calculator className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl font-black text-[#111827] dark:text-white">Instant Traffic Estimator</h3>
          <p className="text-sm font-semibold text-[#111827]/80 dark:text-slate-300">Calculate real visitor costs & estimated delivery times</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Controls */}
        <div className="lg:col-span-7 space-y-6">
          {/* Visitor Slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-bold text-[#111827] dark:text-slate-300">
                Visitor Volume
              </label>
              <span className="text-base font-extrabold text-[#111827] dark:text-[#DFFF2F] bg-white dark:bg-slate-800/80 px-3.5 py-1 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm">
                {visitors.toLocaleString()} Visitors
              </span>
            </div>
            <input
              type="range"
              min={10000}
              max={1000000}
              step={10000}
              value={visitors}
              onChange={(e) => setVisitors(Number(e.target.value))}
              className="w-full h-3 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#111827] dark:accent-[#DFFF2F]"
            />
            <div className="flex justify-between text-xs font-bold text-[#111827]/70 dark:text-slate-400 mt-1">
              <span>10K</span>
              <span>250K</span>
              <span>500K</span>
              <span>1M+</span>
            </div>
          </div>

          {/* Geo Targeting */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Geo Targeting Location
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {(Object.keys(countryRates) as TrafficCountry[]).slice(0, 6).map((ctry) => (
                <button
                  key={ctry}
                  type="button"
                  onClick={() => handleCountryChange(ctry)}
                  className={`flex items-center gap-1.5 justify-center py-2 px-3 rounded-xl text-xs font-medium transition-all ${
                    country === ctry
                      ? 'bg-slate-900 text-white dark:bg-[#DFFF2F] dark:text-[#111827] shadow-md'
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
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Device Targeting
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'desktop', label: 'Desktop Only' },
                { id: 'mobile', label: 'Mobile Only' },
                { id: 'both', label: 'All Devices' },
              ].map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setDevice(d.id as DeviceType)}
                  className={`py-2 px-3 rounded-xl text-xs font-medium transition-all text-center ${
                    device === d.id
                      ? 'bg-slate-900 text-white dark:bg-[#DFFF2F] dark:text-[#111827]'
                      : 'bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Output Summary Card */}
        <div className="lg:col-span-5 bg-slate-900 dark:bg-slate-950 text-white rounded-2xl p-6 border border-slate-800 shadow-2xl relative">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
            <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Estimated Budget</span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#DFFF2F]/20 text-[#DFFF2F]">
              <Zap className="w-3 h-3" /> Live Rate
            </span>
          </div>

          <div className="mb-6">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-[#DFFF2F]">${calculatedBudget.toFixed(2)}</span>
              <span className="text-sm text-slate-400">USD total</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Effective CPM: <strong className="text-white">${cpm.toFixed(3)}</strong> per 1,000 visitors
            </p>
          </div>

          <div className="space-y-2.5 border-t border-slate-800 pt-4 mb-6 text-xs text-slate-300">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Target Volume:</span>
              <span className="font-semibold">{visitors.toLocaleString()} Visitors</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Geo Target:</span>
              <span className="font-semibold">{country}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Estimated Delivery:</span>
              <span className="font-semibold text-[#DFFF2F]">~{estimatedDeliveryHours} Hours</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Quality Guarantee:</span>
              <span className="font-semibold text-emerald-400 flex items-center gap-1">
                <Check className="w-3 h-3" /> 100% Real Humans
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onStartCampaign && onStartCampaign({ visitors, country, device, cpm, budget: calculatedBudget })}
            className="w-full py-3 px-4 bg-[#DFFF2F] hover:bg-[#cbe820] text-slate-900 font-bold rounded-xl transition-all shadow-lg hover:shadow-[#DFFF2F]/20 flex items-center justify-center gap-2 group cursor-pointer"
          >
            Launch This Campaign
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
