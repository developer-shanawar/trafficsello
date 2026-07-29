import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, DollarSign, Wallet, ShieldCheck, ArrowRight, AlertCircle, CheckCircle2, Lock } from 'lucide-react';
import { useStore } from '../../lib/store';
import { WithdrawalMethod } from '../../types';

interface WithdrawalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WithdrawalModal: React.FC<WithdrawalModalProps> = ({ isOpen, onClose }) => {
  const { user, requestWithdrawal, formatMoney } = useStore();

  const [method, setMethod] = useState<WithdrawalMethod>('JazzCash');
  const [amount, setAmount] = useState<number>(10);
  const [accountTitle, setAccountTitle] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [cryptoAddress, setCryptoAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const currentRefBal = user?.referralBalance || 0;

  const isFiat = method === 'JazzCash' || method === 'EasyPaisa' || method === 'PayPal';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (amount < 1.00) {
      setError('Minimum withdrawal amount is $1.00 USD.');
      return;
    }

    if (amount > currentRefBal) {
      setError(`Insufficient referral balance. Available: $${currentRefBal.toFixed(2)}`);
      return;
    }

    if (isFiat) {
      if (method !== 'PayPal' && (!accountTitle.trim() || !accountNumber.trim())) {
        setError('Please enter both your Account Name and Account Number.');
        return;
      }
      if (method === 'PayPal' && !accountNumber.trim().includes('@')) {
        setError('Please enter a valid PayPal email address.');
        return;
      }
    } else {
      if (!cryptoAddress.trim() || cryptoAddress.trim().length < 10) {
        setError(`Please enter a valid ${method} wallet address.`);
        return;
      }
    }

    setLoading(true);
    const res = await requestWithdrawal({
      amount,
      method,
      accountTitle: accountTitle.trim() || undefined,
      accountNumber: accountNumber.trim() || undefined,
      cryptoAddress: cryptoAddress.trim() || undefined
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
                <Wallet className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-white">Withdraw Referral Earnings</h3>
                <p className="text-xs text-slate-400">Request payout directly to your bank, mobile wallet or crypto address</p>
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
            {/* Balance Badge */}
            <div className="p-4 bg-slate-950 text-white rounded-2xl border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#DFFF2F]">Available Referral Balance</span>
                <p className="text-2xl font-black text-white">{formatMoney(currentRefBal)}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 font-medium">Minimum Payout</span>
                <p className="text-sm font-extrabold text-emerald-400">$1.00 USD</p>
              </div>
            </div>

            {error && (
              <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Select Method */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                1. Select Withdrawal Gateway
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {(['JazzCash', 'EasyPaisa', 'USDT TRC20', 'USDT BEP20', 'USDT ERC20', 'PayPal'] as WithdrawalMethod[]).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => {
                      setMethod(m);
                      setError('');
                    }}
                    className={`p-3 rounded-2xl border text-xs font-extrabold transition-all text-center cursor-pointer ${
                      method === m
                        ? 'bg-slate-900 text-[#DFFF2F] dark:bg-[#DFFF2F] dark:text-slate-950 border-slate-900 dark:border-[#DFFF2F] shadow-md scale-[1.02]'
                        : 'bg-slate-50 dark:bg-slate-950/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-[#DFFF2F]/50'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Amount Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  2. Withdrawal Amount ($)
                </label>
                <button
                  type="button"
                  onClick={() => setAmount(Math.max(1, currentRefBal))}
                  className="text-[11px] font-extrabold text-[#DFFF2F] hover:underline cursor-pointer"
                >
                  Withdraw Max (${currentRefBal.toFixed(2)})
                </button>
              </div>
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="number"
                  step="0.01"
                  min="1.00"
                  max={currentRefBal || 999999}
                  value={amount || ''}
                  onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white font-black text-lg focus:outline-none focus:border-[#DFFF2F]"
                  placeholder="10.00"
                  required
                />
              </div>
            </div>

            {/* Dynamic Account Details Fields */}
            {isFiat ? (
              <div className="space-y-3 p-4 bg-slate-50 dark:bg-slate-950/80 rounded-2xl border border-slate-200 dark:border-slate-800">
                <h4 className="text-xs font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" /> 3. Enter {method} Account Details
                </h4>

                {method === 'PayPal' ? (
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                      PayPal Email Address
                    </label>
                    <input
                      type="email"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      placeholder="your.paypal@email.com"
                      className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-[#DFFF2F]"
                      required
                    />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                        Account Title (Name)
                      </label>
                      <input
                        type="text"
                        value={accountTitle}
                        onChange={(e) => setAccountTitle(e.target.value)}
                        placeholder="e.g. Shanawar Ali"
                        className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-[#DFFF2F]"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                        Account Number
                      </label>
                      <input
                        type="text"
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                        placeholder="e.g. 03001234567"
                        className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-[#DFFF2F]"
                        required
                      />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3 p-4 bg-slate-50 dark:bg-slate-950/80 rounded-2xl border border-slate-200 dark:border-slate-800">
                <h4 className="text-xs font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" /> 3. Enter {method} Wallet Address
                </h4>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                    Crypto Receiving Address
                  </label>
                  <input
                    type="text"
                    value={cryptoAddress}
                    onChange={(e) => setCryptoAddress(e.target.value)}
                    placeholder={`Paste your ${method} deposit address`}
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-[#DFFF2F]"
                    required
                  />
                </div>
              </div>
            )}

            {/* Note & Processing Info */}
            <div className="text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
              <p className="flex items-center gap-1">
                <Lock className="w-3 h-3 text-emerald-500" /> All payouts are manually reviewed by Admin for fraud prevention.
              </p>
              <p>• Request status will show as <strong className="text-amber-400 font-extrabold">in review</strong> until approved.</p>
            </div>

            {/* Submit Button */}
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
                disabled={loading || currentRefBal < 1.00}
                className="px-6 py-3 rounded-xl bg-slate-900 text-[#DFFF2F] dark:bg-[#DFFF2F] dark:text-slate-950 text-xs font-black hover:opacity-90 transition-all shadow-lg flex items-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {loading ? 'Submitting...' : 'Submit Withdrawal Request'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
