import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Wallet, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useStore } from '../../lib/store';

interface TransferModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TransferModal: React.FC<TransferModalProps> = ({ isOpen, onClose }) => {
  const { user, transferReferralToDeposit, formatMoney } = useStore();

  const [amount, setAmount] = useState<number>(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const currentRefBal = user?.referralBalance || 0;
  const currentWalletBal = user?.walletBalance || 0;

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (amount <= 0) {
      setError('Please enter a valid transfer amount.');
      return;
    }

    if (amount > currentRefBal) {
      setError(`Insufficient referral balance. Available: $${currentRefBal.toFixed(2)}`);
      return;
    }

    setLoading(true);
    const res = await transferReferralToDeposit(amount);
    setLoading(false);

    if (res.success) {
      onClose();
    } else {
      setError(res.message);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-900 text-white">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-[#DFFF2F] text-slate-950 rounded-2xl font-black">
                <RefreshCw className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-white">Transfer to Deposit Wallet</h3>
                <p className="text-xs text-slate-400">Convert referral commission directly into advertising budget</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleTransfer} className="p-6 space-y-6">
            {/* Balances Flow Visual */}
            <div className="grid grid-cols-2 gap-3 p-4 bg-slate-950 rounded-2xl border border-slate-800 text-white text-center relative">
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold uppercase text-amber-400">Referral Wallet</span>
                <p className="text-xl font-black text-white">{formatMoney(currentRefBal)}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold uppercase text-[#DFFF2F]">Deposit Wallet</span>
                <p className="text-xl font-black text-[#DFFF2F]">{formatMoney(currentWalletBal)}</p>
              </div>
            </div>

            {error && (
              <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Transfer Amount ($)
                </label>
                <button
                  type="button"
                  onClick={() => setAmount(currentRefBal)}
                  className="text-[11px] font-extrabold text-[#DFFF2F] hover:underline cursor-pointer"
                >
                  Transfer Max (${currentRefBal.toFixed(2)})
                </button>
              </div>
              <input
                type="number"
                step="0.01"
                min="0.01"
                max={currentRefBal || 99999}
                value={amount || ''}
                onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white font-black text-xl focus:outline-none focus:border-[#DFFF2F]"
                placeholder="10.00"
                required
              />
            </div>

            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Instant Transfer • 0% Transaction Fee • Available immediately for ad campaigns!</span>
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
                disabled={loading || currentRefBal <= 0}
                className="px-6 py-3 rounded-xl bg-slate-900 text-[#DFFF2F] dark:bg-[#DFFF2F] dark:text-slate-950 text-xs font-black hover:opacity-90 transition-all shadow-lg flex items-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {loading ? 'Processing...' : 'Confirm Instant Transfer'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
