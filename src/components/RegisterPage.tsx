import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Mail, Lock, User, Phone, Send, Sparkles, CheckCircle2, ArrowRight
} from 'lucide-react';
import { useStore } from '../lib/store';

interface RegisterPageProps {
  onNavigateHome: () => void;
  onNavigateLogin: () => void;
  onRegisterSuccess: () => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({
  onNavigateHome,
  onNavigateLogin,
  onRegisterSuccess,
}) => {
  const { register } = useStore();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [telegram, setTelegram] = useState('');
  const [whatsApp, setWhatsApp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password && confirmPassword && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await register({ fullName, email, password, telegram, whatsApp });
      setLoading(false);
      onRegisterSuccess();
    } catch (err: any) {
      setError(err.message || 'Registration failed');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-120px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Soft Glow Orbs */}
      <div className="absolute top-1/3 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#DFFF2F]/15 dark:bg-[#DFFF2F]/10 rounded-full blur-[110px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        
        {/* Left Side: Benefits */}
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
              Create Your <span className="text-emerald-600 dark:text-[#DFFF2F]">Advertiser Account</span>
            </h1>
            <p className="text-sm text-[#111827]/80 dark:text-slate-300 mt-2 leading-relaxed">
              Join thousands of digital marketers buying 100% verified human website traffic starting at $0.05 CPM.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-800/70 border border-white dark:border-slate-700 shadow-md">
            <span className="text-xs font-bold text-emerald-700 dark:text-[#DFFF2F] uppercase tracking-wider block mb-1">
              🎁 First Deposit Offer
            </span>
            <p className="text-sm font-black text-[#111827] dark:text-white">
              Get 20% Extra Wallet Balance
            </p>
            <p className="text-xs text-[#111827]/70 dark:text-slate-400 mt-1">
              Deposit funds to launch your campaign and receive 20% extra balance automatically.
            </p>
          </div>

          <div className="space-y-2.5 text-xs font-semibold text-[#111827]/80 dark:text-slate-300">
            <p className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-[#DFFF2F]" /> $1 Minimum Wallet Deposit
            </p>
            <p className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-[#DFFF2F]" /> 120+ Geo-Targeting Countries
            </p>
            <p className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-[#DFFF2F]" /> Fast Manual Payment Approvals
            </p>
          </div>
        </motion.div>

        {/* Right Side: Register Form */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="lg:col-span-7 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-white dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative text-[#111827] dark:text-white"
        >
          <div className="mb-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-[#111827] text-[#DFFF2F] dark:bg-[#DFFF2F]/20 dark:text-[#DFFF2F] uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" /> Instant Account Setup
            </span>
            <h2 className="text-2xl font-bold text-[#111827] dark:text-white">Register Account</h2>
            <p className="text-xs text-[#111827]/70 dark:text-slate-400 mt-1">
              Fill in your details below to create your TrafficSell account
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-400 text-xs font-semibold rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-[#111827] dark:text-slate-300 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  placeholder="Alex Vance"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-2xl text-xs font-medium text-[#111827] dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#111827] dark:focus:border-[#DFFF2F] shadow-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#111827] dark:text-slate-300 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  placeholder="name@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-2xl text-xs font-medium text-[#111827] dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#111827] dark:focus:border-[#DFFF2F] shadow-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#111827] dark:text-slate-300 mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-2xl text-xs font-medium text-[#111827] dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#111827] dark:focus:border-[#DFFF2F] shadow-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#111827] dark:text-slate-300 mb-1">Confirm Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-2xl text-xs font-medium text-[#111827] dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#111827] dark:focus:border-[#DFFF2F] shadow-sm"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-bold text-[#111827] dark:text-slate-300 mb-1">Telegram Handle (Optional)</label>
                <div className="relative">
                  <Send className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    placeholder="@username"
                    value={telegram}
                    onChange={(e) => setTelegram(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-2xl text-xs font-medium text-[#111827] dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#111827] dark:focus:border-[#DFFF2F] shadow-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#111827] dark:text-slate-300 mb-1">WhatsApp No (Optional)</label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    placeholder="+92 300 1234567"
                    value={whatsApp}
                    onChange={(e) => setWhatsApp(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-2xl text-xs font-medium text-[#111827] dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#111827] dark:focus:border-[#DFFF2F] shadow-sm"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-3 py-3.5 bg-[#111827] dark:bg-[#DFFF2F] hover:bg-slate-800 dark:hover:bg-[#cbe820] text-white dark:text-[#111827] font-bold rounded-2xl text-sm transition-all shadow-lg hover:scale-[1.01] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Registering Account...' : 'Register Account'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Switch to Login */}
          <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-[#111827]/80 dark:text-slate-400 font-medium">
            Already have a TrafficSell account?{' '}
            <button
              type="button"
              onClick={onNavigateLogin}
              className="text-[#111827] dark:text-[#DFFF2F] font-extrabold underline hover:opacity-80 cursor-pointer ml-1"
            >
              Sign in here
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
