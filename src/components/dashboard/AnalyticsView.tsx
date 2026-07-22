import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Globe, Smartphone, Clock, ShieldCheck, Zap, Activity } from 'lucide-react';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement,
  Title, Tooltip, Legend, ArcElement, PointElement, LineElement
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement);

export const AnalyticsView: React.FC = () => {
  // Geo distribution data
  const geoData = {
    labels: ['United States', 'Germany', 'United Kingdom', 'Canada', 'Australia', 'Global / Other'],
    datasets: [
      {
        data: [42, 18, 15, 12, 8, 5],
        backgroundColor: [
          '#DFFF2F',
          '#38BDF8',
          '#818CF8',
          '#F472B6',
          '#34D399',
          '#94A3B8',
        ],
        borderWidth: 0,
      },
    ],
  };

  // Device data
  const deviceData = {
    labels: ['Mobile Devices', 'Desktop Workstations', 'Tablet Devices'],
    datasets: [
      {
        label: 'Traffic Share %',
        data: [64, 31, 5],
        backgroundColor: ['#DFFF2F', '#38BDF8', '#818CF8'],
        borderRadius: 8,
      },
    ],
  };

  // Hourly rate chart
  const hourlyData = {
    labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '23:59'],
    datasets: [
      {
        label: 'Visitor Clicks / Hour',
        data: [4200, 2100, 8900, 15400, 18200, 12900, 7800],
        borderColor: '#DFFF2F',
        backgroundColor: 'rgba(223, 255, 47, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#DFFF2F]/20 text-slate-900 dark:text-[#DFFF2F] uppercase tracking-wider mb-2">
          <Activity className="w-3.5 h-3.5" /> Real-time Analytics Engine
        </span>
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Traffic Performance Intelligence</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          In-depth traffic telemetry, geo-demographic breakdown, and real human verification metrics.
        </p>
      </div>

      {/* Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs text-slate-400 font-bold block mb-1">Avg Page Duration</span>
          <p className="text-2xl font-black text-slate-900 dark:text-white">1m 48s</p>
          <span className="text-[10px] text-emerald-400 font-semibold mt-1 block">✓ High Engagement</span>
        </div>
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs text-slate-400 font-bold block mb-1">Human Traffic Ratio</span>
          <p className="text-2xl font-black text-[#DFFF2F]">99.98%</p>
          <span className="text-[10px] text-slate-400 mt-1 block">FraudShield Filtered</span>
        </div>
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs text-slate-400 font-bold block mb-1">Bounce Rate</span>
          <p className="text-2xl font-black text-slate-900 dark:text-white">26.4%</p>
          <span className="text-[10px] text-emerald-400 font-semibold mt-1 block">↓ 4.2% lower than industry avg</span>
        </div>
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs text-slate-400 font-bold block mb-1">Network Pacing</span>
          <p className="text-2xl font-black text-slate-900 dark:text-white">18.2K / hr</p>
          <span className="text-[10px] text-indigo-400 font-semibold mt-1 block">High Capacity Supply</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Hourly Traffic Curve */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">24-Hour Delivery Curve</h3>
          <p className="text-xs text-slate-400 mb-6">Real-time visitor routing over 24 hours</p>
          <div className="h-64 w-full">
            <Line data={hourlyData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>

        {/* Device Breakdown */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">Device Type Breakdown</h3>
            <p className="text-xs text-slate-400 mb-4">Traffic split by hardware client</p>
            <div className="h-48 w-full flex items-center justify-center">
              <Bar data={deviceData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
            </div>
          </div>
        </div>
      </div>

      {/* Geo Distribution */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-5">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Global Geo Distribution</h3>
          <p className="text-xs text-slate-400 mb-6">Origin location of delivered visitors</p>
          <div className="h-56 w-full flex items-center justify-center">
            <Doughnut data={geoData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'right' } } }} />
          </div>
        </div>

        <div className="lg:col-span-7 space-y-3">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Top Origin Countries</h4>
          {[
            { country: 'United States', flag: '🇺🇸', share: '42%', cpm: '$0.08' },
            { country: 'Germany', flag: '🇩🇪', share: '18%', cpm: '$0.10' },
            { country: 'United Kingdom', flag: '🇬🇧', share: '15%', cpm: '$0.09' },
            { country: 'Canada', flag: '🇨🇦', share: '12%', cpm: '$0.08' },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 text-xs">
              <span className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>{item.flag}</span> {item.country}
              </span>
              <div className="flex items-center gap-4 font-mono">
                <span className="text-[#DFFF2F] font-bold">{item.share} Share</span>
                <span className="text-slate-400">CPM {item.cpm}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
