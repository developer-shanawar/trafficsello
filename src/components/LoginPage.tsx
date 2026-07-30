import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Mail, Lock, User, ShieldCheck, Sparkles, Activity, CheckCircle2, ArrowRight, RefreshCw, MailCheck
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
  const { login, signInWithGoogle, resendConfirmationEmail } = useStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendStatus, setResendStatus] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setResendStatus('');
    setLoading(true);

    try {
      if (!email) {
        setError('Please enter your email address');
        setLoading(false);
        return;
      }
      await login(email, password);
      setLoading(false);
      try {
        window.history.pushState(null, '', '#/dashboard');
      } catch (e) {
        window.location.hash = '#/dashboard';
      }
      onLoginSuccess();
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check credentials.');
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      setError('Please enter your email address above to resend the confirmation link.');
      return;
    }
    setResending(true);
    setResendStatus('');
    const result = await resendConfirmationEmail(email);
    setResending(false);
    setResendStatus(result.message);
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
            <div className="mb-4 p-3.5 bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-400 text-xs font-semibold rounded-2xl space-y-2">
              <p>{error}</p>
              {(error.toLowerCase().includes('not confirmed') || error.toLowerCase().includes('not verified')) && (
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resending}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-800 dark:text-rose-200 text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${resending ? 'animate-spin' : ''}`} />
                  {resending ? 'Resending Link...' : 'Resend Confirmation Email Now'}
                </button>
              )}
            </div>
          )}

          {resendStatus && (
            <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/20 text-blue-700 dark:text-blue-300 text-xs font-semibold rounded-xl">
              {resendStatus}
            </div>
          )}

          {/* Continue with Google (Supabase Auth) */}
          <button
            type="button"
            onClick={async () => {
              try {
                setError('');
                setLoading(true);
                await signInWithGoogle();
              } catch (err: any) {
                setError(err.message || 'Google authentication failed');
              } finally {
                setLoading(false);
              }
            }}
            disabled={loading}
            className="w-full mb-4 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-[#DFFF2F] bg-white dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all text-left flex items-center justify-between group shadow-sm cursor-pointer disabled:opacity-50"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center border border-slate-200 dark:border-slate-800">
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z" />
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.15C3.26 21.3 7.37 24 12 24z" />
                  <path fill="#FBBC05" d="M5.28 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.39l3.99-3.15z" />
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.37 0 3.26 2.7 1.29 6.61l3.99 3.15c.95-2.85 3.6-4.96 6.72-4.96z" />
                </svg>
              </div>
              <div>
                <span className="font-extrabold text-xs text-[#111827] dark:text-white block">Continue with Google</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Supabase Auth Google Login</span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-500 dark:group-hover:text-[#DFFF2F] transition-colors" />
          </button>

          <div className="relative mb-4 flex items-center justify-center">
            <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
            <span className="absolute bg-white dark:bg-slate-900 px-3 text-[10px] uppercase font-bold text-slate-400">or sign in with email</span>
          </div>

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
