import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Percent, Sparkles, AlertCircle, Send } from 'lucide-react';
import { useStore } from '../../lib/store';

interface CommissionRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommissionRequestModal: React.FC<CommissionRequestModalProps> = ({ isOpen, onClose }) => {
  const { user, referrals, requestCommissionIncrease } = useStore();

  const myReferrals = referrals.filter(r => r.referrerId === user?.id);
  const currentRatePercent = Math.round(((user?.customReferralRate || 0.05) * 100));

  const [requestedRate, setRequestedRate] = useState<number>(8);
  const [referralsCount, setReferralsCount] = useState<number>(myReferrals.length || 5);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (requestedRate <= currentRatePercent) {
      setError(`Please request a commission rate higher than your current rate (${currentRatePercent}%).`);
      return;
    }

    if (!message.trim() || message.trim().length < 10) {
      setError('Please provide a short description of your traffic source or community.');
      return;
    }

    setLoading(true);
    const res = await requestCommissionIncrease({
      requestedRate,
      referralsCount,
      message: message.trim()
    });
    setLoading(false);

    if (res.success) {
      onClose();
    } else {
      setError(res.message);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-8"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-900 text-white">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-[#DFFF2F] text-slate-950 rounded-2xl font-black">
                <Percent className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-white">Request Commission Increase</h3>
                <p className="text-xs text-slate-400">Apply for VIP affiliate rates up to 15% commission</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="p-4 bg-slate-950 text-white rounded-2xl border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#DFFF2F]">Current Rate</span>
                <p className="text-2xl font-black text-white">{currentRatePercent}% Cash Commission</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400">Total Active Referrals</span>
                <p className="text-xl font-extrabold text-emerald-400">{myReferrals.length} Users</p>
              </div>
            </div>

            {error && (
              <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Target Rate (%)
                </label>
                <select
                  value={requestedRate}
                  onChange={(e) => setRequestedRate(parseInt(e.target.value))}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white font-black text-base focus:outline-none focus:border-[#DFFF2F]"
                >
                  <option value={8}>8% Commission</option>
                  <option value={10}>10% Commission</option>
                  <option value={12}>12% Commission</option>
                  <option value={15}>15% VIP Commission</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Estimated Monthly Active Referrals
                </label>
                <input
                  type="number"
                  min="1"
                  value={referralsCount}
                  onChange={(e) => setReferralsCount(parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white font-black text-base focus:outline-none focus:border-[#DFFF2F]"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Your Promotional Channels / Message
              </label>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us about your website, Telegram channel, YouTube audience, or media buying agency..."
                className="w-full p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-[#DFFF2F]"
                required
              />
            </div>

            {/* Submit */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-extrabold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 rounded-xl bg-slate-900 text-[#DFFF2F] dark:bg-[#DFFF2F] dark:text-slate-950 text-xs font-black hover:opacity-90 transition-all shadow-lg flex items-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {loading ? 'Submitting...' : 'Submit Rate Increase Request'}
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
