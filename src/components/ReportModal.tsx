import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Activity, Globe, Smartphone, Gauge, CheckCircle2, PauseCircle, Clock } from 'lucide-react';
import { Campaign } from '../types';

interface ReportModalProps {
  campaign: Campaign | null;
  onClose: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({ campaign, onClose }) => {
  if (!campaign) return null;

  const percentage = Math.min(100, Math.round((campaign.visitorsDelivered / campaign.visitorsTarget) * 100));

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 max-w-2xl w-full shadow-2xl relative overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${
                  campaign.status === 'running' ? 'bg-emerald-500/10 text-emerald-500' :
                  campaign.status === 'completed' ? 'bg-blue-500/10 text-blue-500' :
                  'bg-amber-500/10 text-amber-500'
                }`}>
                  {campaign.status}
                </span>
                <span className="text-xs text-slate-400 font-mono">ID: {campaign.id}</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{campaign.name}</h2>
              <a href={campaign.url} target="_blank" rel="noreferrer" className="text-xs text-[#DFFF2F] hover:underline font-mono truncate max-w-md block">
                {campaign.url}
              </a>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-full bg-slate-100 dark:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Progress Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Delivered / Target</span>
              <p className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                {campaign.visitorsDelivered.toLocaleString()} <span className="text-xs text-slate-400 font-normal">/ {campaign.visitorsTarget.toLocaleString()}</span>
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Progress</span>
              <p className="text-lg font-bold text-[#DFFF2F] mt-1">{percentage}% Completed</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Cost</span>
              <p className="text-lg font-bold text-slate-900 dark:text-white mt-1">${campaign.budget.toFixed(2)} USD</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-xs text-slate-500 mb-1">
              <span>Traffic Delivery Progress</span>
              <span>{percentage}%</span>
            </div>
            <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-400 to-[#DFFF2F] transition-all duration-500 rounded-full"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>

          {/* Details Breakdown */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-slate-900 text-white text-xs mb-6">
            <div>
              <span className="text-slate-400 block mb-0.5">Target Geo</span>
              <span className="font-semibold flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-[#DFFF2F]" /> {campaign.country}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Device Filter</span>
              <span className="font-semibold capitalize flex items-center gap-1">
                <Smartphone className="w-3.5 h-3.5 text-[#DFFF2F]" /> {campaign.deviceType}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">CPM Rate</span>
              <span className="font-semibold">${campaign.cpm.toFixed(3)}</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Pacing Speed</span>
              <span className="font-semibold text-emerald-400 flex items-center gap-1">
                <Gauge className="w-3.5 h-3.5" /> High Speed
              </span>
            </div>
          </div>

          {/* Simulated Activity Stream */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#DFFF2F]" /> Live Delivery Activity Log
            </h4>
            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
              {[
                { time: 'Just now', event: `+45 visitors routed from ${campaign.country}` },
                { time: '2 mins ago', event: `+120 desktop clicks verified by FraudShield` },
                { time: '5 mins ago', event: `Pacing engine optimized for ${campaign.deviceType}` },
                { time: '12 mins ago', event: `Campaign initialized with CPM $${campaign.cpm}` },
              ].map((act, i) => (
                <div key={i} className="flex justify-between items-center text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                  <span className="text-slate-700 dark:text-slate-300 font-medium">{act.event}</span>
                  <span className="text-slate-400 font-mono text-[10px]">{act.time}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-slate-900 text-white dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl text-sm font-semibold transition-colors"
            >
              Close Report
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
