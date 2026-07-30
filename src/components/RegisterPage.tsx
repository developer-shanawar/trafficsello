import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Mail, Lock, User, Phone, Send, Sparkles, CheckCircle2, ArrowRight, Gift, AlertCircle
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

  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [telegram, setTelegram] = useState('');
  const [whatsApp, setWhatsApp] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Auto detect referral code from URL or localStorage
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlRef = urlParams.get('ref') || urlParams.get('referral') || urlParams.get('ref_id');
    const storedRef = localStorage.getItem('trafficsell_ref');
    const activeRef = urlRef || storedRef || '';

    if (activeRef) {
      setReferralCode(activeRef);
      if (urlRef) {
        localStorage.setItem('trafficsell_ref', urlRef);
      }
    }
  }, []);

  // Submit registration flow
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanEmail = email.trim().toLowerCase();

    // Gmail-only check
    if (!cleanEmail.endsWith('@gmail.com')) {
      setError('Only official Gmail addresses (@gmail.com) are permitted. Temporary or non-Gmail email addresses are blocked.');
      return;
    }

    if (password && confirmPassword && password !== confirmPassword) {
      setError('Passwords do not match. Please verify your password.');
      return;
    }

    setLoading(true);
    try {
      await register({
        fullName,
        email: cleanEmail,
        username: username || cleanEmail.split('@')[0],
        password,
        telegram,
        whatsApp,
        referralCode,
        provider: 'email'
      });

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
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-[#DFFF2F]" /> Gmail Accounts Allowed Only (@gmail.com)
            </p>
          </div>
        </motion.div>

        {/* Right Side: Direct Gmail Registration Form */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="lg:col-span-7 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-white dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative text-[#111827] dark:text-white"
        >
          <div className="mb-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-[#111827] text-[#DFFF2F] dark:bg-[#DFFF2F]/20 dark:text-[#DFFF2F] uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" /> Gmail Account Registration
            </span>
            <h2 className="text-2xl font-black text-[#111827] dark:text-white">Register with Gmail</h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              Sign up using your official @gmail.com email address.
            </p>
          </div>

          {referralCode && (
            <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-between">
              <span className="text-xs font-bold text-amber-700 dark:text-amber-300 flex items-center gap-1.5">
                <Gift className="w-4 h-4" /> Partner Referral Code Detected
              </span>
              <span className="text-xs font-mono font-bold text-amber-800 dark:text-amber-200 bg-amber-200/50 dark:bg-amber-900/50 px-2 py-0.5 rounded-lg">
                {referralCode}
              </span>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-400 text-xs font-semibold rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-[#111827] dark:text-slate-300 mb-1">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Shanawar Ali"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-2xl text-xs font-medium text-[#111827] dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 shadow-sm"
                />
              </div>
            </div>

            {/* Gmail Address */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-[#111827] dark:text-slate-300">
                  Gmail Address <span className="text-rose-500">*</span>
                </label>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-[#DFFF2F]">@gmail.com required</span>
              </div>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  placeholder="yourname@gmail.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (!username && e.target.value.includes('@')) {
                      setUsername(e.target.value.split('@')[0]);
                    }
                  }}
                  className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-2xl text-xs font-medium text-[#111827] dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 shadow-sm"
                />
              </div>
            </div>

            {/* Username */}
            <div>
              <label className="block text-xs font-bold text-[#111827] dark:text-slate-300 mb-1">
                Platform Username <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  placeholder="e.g. shanawar99"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-2xl text-xs font-medium text-[#111827] dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 shadow-sm"
                />
              </div>
            </div>

            {/* Password & Confirm Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#111827] dark:text-slate-300 mb-1">
                  Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-2xl text-xs font-medium text-[#111827] dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 shadow-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#111827] dark:text-slate-300 mb-1">
                  Confirm Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-2xl text-xs font-medium text-[#111827] dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 shadow-sm"
                  />
                </div>
              </div>
            </div>

            {/* Connect Social Accounts (Telegram or WhatsApp) */}
            <div className="p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3">
              <span className="text-xs font-bold text-[#111827] dark:text-white block">
                Social Accounts (Optional)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Telegram Handle</label>
                  <div className="relative">
                    <Send className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="@username"
                      value={telegram}
                      onChange={(e) => setTelegram(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl text-xs text-[#111827] dark:text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">WhatsApp Number</label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="+92 300 1234567"
                      value={whatsApp}
                      onChange={(e) => setWhatsApp(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl text-xs text-[#111827] dark:text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Referral Code */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-[#111827] dark:text-slate-300">
                  Referral Code
                </label>
                {referralCode && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
                    <Gift className="w-3 h-3" /> Pre-filled from Referral Link
                  </span>
                )}
              </div>
              <div className="relative">
                <Gift className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  placeholder="e.g. REF_A1B2C3"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-2xl text-xs font-mono uppercase font-bold text-[#111827] dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 shadow-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-3.5 bg-[#111827] dark:bg-[#DFFF2F] hover:bg-slate-800 dark:hover:bg-[#cbe820] text-white dark:text-[#111827] font-bold rounded-2xl text-sm transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Creating Account...' : 'Create Gmail Account'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Switch to Login */}
          <div className="pt-4 mt-6 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-600 dark:text-slate-400 font-medium">
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
