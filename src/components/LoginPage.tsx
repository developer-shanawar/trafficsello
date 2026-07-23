import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Mail, Lock, User, ShieldCheck, Sparkles, Activity, CheckCircle2, ArrowRight
} from 'lucide-react';
import { useStore } from '../lib/store';

interface LoginPageProps {
  onNavigateHome: () => void;
  onNavigateRegister: () => void;
  onLoginSuccess: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onNavigateHome,
  onNavigateRegister,
  onLoginSuccess,
}) => {
  const { login } = useStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!email) {
        setError('Please enter your email address');
        setLoading(false);
        return;
      }
      await login(email, password);
      setLoading(false);
      onLoginSuccess();
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check credentials.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-120px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Soft Glow Orbs */}
      <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#DFFF2F]/15 dark:bg-[#DFFF2F]/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-blue-500/10 rounded-full blur-[90px] pointer-events-none" />

      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        
        {/* Left Side: Brand Highlights */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="lg:col-span-5 space-y-6 text-[#111827] dark:text-white"
        >
          <button
            onClick={onNavigateHome}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/70 dark:bg-slate-800/80 border border-white/80 dark:border-slate-700 text-xs font-bold text-[#111827] dark:text-white hover:scale-105 transition-all shadow-sm cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-[#111827] dark:text-[#DFFF2F]" />
            Back to TrafficSell
          </button>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="h-8 w-8 rounded-lg bg-[#111827] dark:bg-[#DFFF2F] text-[#DFFF2F] dark:text-[#111827] flex items-center justify-center font-black text-lg">
                T
              </div>
              <span className="text-xl font-black tracking-tight">TrafficSell</span>
            </div>
            <h1 className="text-3xl font-extrabold leading-tight">
              Sign In to Your <span className="text-emerald-600 dark:text-[#DFFF2F]">Traffic Dashboard</span>
            </h1>
            <p className="text-sm text-[#111827]/80 dark:text-slate-300 mt-2 leading-relaxed">
              Manage your real human traffic campaigns, track real-time analytics, and fund your wallet instantly.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/60 dark:bg-slate-800/60 border border-white/60 dark:border-slate-700/60 shadow-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-[#DFFF2F] shrink-0" />
              <div>
                <strong className="block text-xs font-bold text-[#111827] dark:text-white">Real-Time Visitor Telemetry</strong>
                <span className="text-[11px] text-[#111827]/70 dark:text-slate-400">Live hourly traffic breakdown & country maps</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/60 dark:bg-slate-800/60 border border-white/60 dark:border-slate-700/60 shadow-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-[#DFFF2F] shrink-0" />
              <div>
                <strong className="block text-xs font-bold text-[#111827] dark:text-white">Instant Wallet Funding</strong>
                <span className="text-[11px] text-[#111827]/70 dark:text-slate-400">JazzCash, EasyPaisa, PayPal & USDT TRC20</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Side: Login Form Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="lg:col-span-7 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-white dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative text-[#111827] dark:text-white"
        >
          <div className="mb-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-[#111827] text-[#DFFF2F] dark:bg-[#DFFF2F]/20 dark:text-[#DFFF2F] uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" /> Client Portal Sign In
            </span>
            <h2 className="text-2xl font-bold text-[#111827] dark:text-white">Welcome Back</h2>
            <p className="text-xs text-[#111827]/70 dark:text-slate-400 mt-1">
              Enter your email and password to access your account dashboard
            </p>
          </div>

          {/* Deposit Bonus Offer Banner */}
          <div className="p-3.5 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-2xl border border-emerald-500/30 mb-6 flex items-center gap-3">
            <div className="p-2 bg-emerald-600 text-white dark:bg-[#DFFF2F] dark:text-[#111827] rounded-xl font-extrabold text-xs shrink-0">
              20% BONUS
            </div>
            <div>
              <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 block">
                20% Extra Balance on First Deposit!
              </span>
              <span className="text-[11px] text-emerald-700/80 dark:text-emerald-400 font-medium">
                Get 20% additional traffic budget credited automatically on approval.
              </span>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-400 text-xs font-semibold rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#111827] dark:text-slate-300 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  placeholder="yourname@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-2xl text-xs font-medium text-[#111827] dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#111827] dark:focus:border-[#DFFF2F] shadow-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#111827] dark:text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-2xl text-xs font-medium text-[#111827] dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#111827] dark:focus:border-[#DFFF2F] shadow-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 bg-[#111827] dark:bg-[#DFFF2F] hover:bg-slate-800 dark:hover:bg-[#cbe820] text-white dark:text-[#111827] font-bold rounded-2xl text-sm transition-all shadow-lg hover:scale-[1.01] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Signing In...' : 'Sign In to Dashboard'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Switch to Register */}
          <div className="mt-6 pt-5 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-[#111827]/80 dark:text-slate-400 font-medium">
            Don't have an account yet?{' '}
            <button
              type="button"
              onClick={onNavigateRegister}
              className="text-[#111827] dark:text-[#DFFF2F] font-extrabold underline hover:opacity-80 cursor-pointer ml-1"
            >
              Create a New Account
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
