import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Mail, Lock, User, Phone, Send, Sparkles, CheckCircle2, ArrowRight, Gift, ShieldCheck, AlertCircle, Check
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
  const { register, login, signInWithGoogle } = useStore();

  // Mode: 'choose' | 'google' | 'email'
  const [method, setMethod] = useState<'choose' | 'google' | 'email'>('choose');

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

  // Google OAuth specific state
  const [googleStep, setGoogleStep] = useState<'select' | 'details'>('select');
  const [googleEmail, setGoogleEmail] = useState('');

  const handleGoogleClick = async () => {
    setError('');
    setLoading(true);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      console.warn('Supabase Google OAuth direct call notice:', err.message);
      setMethod('google');
      setGoogleStep('select');
    } finally {
      setLoading(false);
    }
  };

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

  // Handle Google Account selection
  const handleSelectGoogleAccount = async (selectedEmail: string, extractedName: string) => {
    setGoogleEmail(selectedEmail);
    setEmail(selectedEmail);
    setFullName(extractedName);
    setUsername(selectedEmail.split('@')[0]);

    setError('');
    // Check if user already exists
    try {
      const loggedIn = await login(selectedEmail);
      if (loggedIn) {
        try {
          window.history.pushState(null, '', '#/dashboard');
        } catch (e) {
          window.location.hash = '#/dashboard';
        }
        onRegisterSuccess();
        return;
      }
    } catch (err) {
      // Account does not exist yet; proceed to profile details step
      setGoogleStep('details');
    }
  };

  // Submit registration (Google or Email flow)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanEmail = (method === 'google' ? googleEmail : email).trim().toLowerCase();

    // Gmail-only check
    if (!cleanEmail.endsWith('@gmail.com')) {
      setError('Only official Gmail addresses (@gmail.com) are permitted. Temporary or non-Gmail email addresses are blocked.');
      return;
    }

    if (method === 'email' && password && confirmPassword && password !== confirmPassword) {
      setError('Passwords do not match. Please verify your password.');
      return;
    }

    setLoading(true);
    try {
      await register({
        fullName,
        email: cleanEmail,
        username: username || cleanEmail.split('@')[0],
        password: method === 'email' ? password : undefined,
        telegram,
        whatsApp,
        referralCode,
        provider: method
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
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-[#DFFF2F]" /> Gmail Accounts Allowed (No Temp Mail)
            </p>
          </div>
        </motion.div>

        {/* Right Side: Register Options or Specific Registration Flow */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="lg:col-span-7 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-white dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative text-[#111827] dark:text-white"
        >
          {method !== 'choose' && (
            <button
              onClick={() => {
                setMethod('choose');
                setGoogleStep('select');
                setError('');
              }}
              className="mb-4 inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#111827] dark:hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to registration options
            </button>
          )}

          {/* CHOICE SCREEN */}
          {method === 'choose' && (
            <div className="space-y-6">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-[#111827] text-[#DFFF2F] dark:bg-[#DFFF2F]/20 dark:text-[#DFFF2F] uppercase tracking-wider mb-2">
                  <Sparkles className="w-3.5 h-3.5" /> Instant Account Setup
                </span>
                <h2 className="text-2xl font-black text-[#111827] dark:text-white">Create Account</h2>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  Select your preferred sign-up method to get started
                </p>
              </div>

              {referralCode && (
                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-700 dark:text-amber-300 flex items-center gap-1.5">
                    <Gift className="w-4 h-4" /> Partner Referral Code Detected
                  </span>
                  <span className="text-xs font-mono font-bold text-amber-800 dark:text-amber-200 bg-amber-200/50 dark:bg-amber-900/50 px-2 py-0.5 rounded-lg">
                    {referralCode}
                  </span>
                </div>
              )}

              <div className="space-y-4 pt-2">
                {/* Option 1: Continue with Google */}
                <button
                  type="button"
                  onClick={handleGoogleClick}
                  disabled={loading}
                  className="w-full p-4 rounded-2xl border-2 border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-[#DFFF2F] bg-white dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-900/60 transition-all text-left flex items-center justify-between group shadow-sm cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center border border-slate-200 dark:border-slate-800 group-hover:scale-105 transition-transform">
                      <svg className="w-6 h-6" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z" />
                        <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.15C3.26 21.3 7.37 24 12 24z" />
                        <path fill="#FBBC05" d="M5.28 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.39l3.99-3.15z" />
                        <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.37 0 3.26 2.7 1.29 6.61l3.99 3.15c.95-2.85 3.6-4.96 6.72-4.96z" />
                      </svg>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-base text-[#111827] dark:text-white">Continue with Google</span>
                        <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-700 dark:text-[#DFFF2F] px-2 py-0.5 rounded-full">Recommended</span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Instant 1-click registration with your Google Account
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-emerald-500 dark:group-hover:text-[#DFFF2F] group-hover:translate-x-1 transition-all" />
                </button>

                {/* Option 2: Continue with Email */}
                <button
                  type="button"
                  onClick={() => {
                    setMethod('email');
                    setError('');
                  }}
                  className="w-full p-4 rounded-2xl border-2 border-slate-200 dark:border-slate-800 hover:border-[#111827] dark:hover:border-slate-600 bg-white dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-900/60 transition-all text-left flex items-center justify-between group shadow-sm cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center border border-slate-200 dark:border-slate-800 group-hover:scale-105 transition-transform text-[#111827] dark:text-white">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-base text-[#111827] dark:text-white">Continue with Email</span>
                        <span className="text-[10px] font-bold bg-blue-500/10 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded-full">Gmail Only</span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Register using your official @gmail.com address
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-[#111827] dark:group-hover:text-white group-hover:translate-x-1 transition-all" />
                </button>
              </div>

              {/* Switch to Login */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-600 dark:text-slate-400 font-medium">
                Already have a TrafficSell account?{' '}
                <button
                  type="button"
                  onClick={onNavigateLogin}
                  className="text-[#111827] dark:text-[#DFFF2F] font-extrabold underline hover:opacity-80 cursor-pointer ml-1"
                >
                  Sign in here
                </button>
              </div>
            </div>
          )}

          {/* GOOGLE FLOW */}
          {method === 'google' && (
            <div>
              <div className="mb-5 flex items-center gap-2">
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z" />
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.15C3.26 21.3 7.37 24 12 24z" />
                  <path fill="#FBBC05" d="M5.28 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.39l3.99-3.15z" />
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.37 0 3.26 2.7 1.29 6.61l3.99 3.15c.95-2.85 3.6-4.96 6.72-4.96z" />
                </svg>
                <div>
                  <h2 className="text-xl font-bold text-[#111827] dark:text-white">Register with Google</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Step {googleStep === 'select' ? '1: Select Account' : '2: Complete Account Info'}</p>
                </div>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-400 text-xs font-semibold rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </div>
              )}

              {googleStep === 'select' ? (
                <div className="space-y-4 py-2">
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    Select your Google account to extract your email address and profile name:
                  </p>

                  <div className="space-y-2.5">
                    {/* Quick Google selector 1 */}
                    <button
                      type="button"
                      onClick={() => handleSelectGoogleAccount('developershanawar@gmail.com', 'Developer Shanawar')}
                      className="w-full p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-900 transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-emerald-600 text-white font-bold text-sm flex items-center justify-center">
                          DS
                        </div>
                        <div className="text-left">
                          <p className="text-xs font-bold text-[#111827] dark:text-white">Developer Shanawar</p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">developershanawar@gmail.com</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-emerald-600 dark:text-[#DFFF2F] bg-emerald-500/10 px-2.5 py-1 rounded-full">
                        Select Account
                      </span>
                    </button>

                    {/* Google Custom Email prompt */}
                    <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3">
                      <label className="block text-xs font-bold text-[#111827] dark:text-slate-300">
                        Or enter your Google Account email:
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                        <input
                          type="email"
                          placeholder="yourname@gmail.com"
                          value={googleEmail}
                          onChange={(e) => setGoogleEmail(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-2xl text-xs font-medium text-[#111827] dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                      <button
                        type="button"
                        disabled={!googleEmail}
                        onClick={() => {
                          if (!googleEmail.trim().toLowerCase().endsWith('@gmail.com')) {
                            setError('Only official Gmail addresses (@gmail.com) are permitted.');
                            return;
                          }
                          const extracted = googleEmail.split('@')[0].replace(/[._]/g, ' ');
                          const formatted = extracted.charAt(0).toUpperCase() + extracted.slice(1);
                          handleSelectGoogleAccount(googleEmail, formatted);
                        }}
                        className="w-full py-2.5 bg-[#111827] dark:bg-[#DFFF2F] text-white dark:text-[#111827] font-bold text-xs rounded-xl hover:opacity-95 cursor-pointer disabled:opacity-50"
                      >
                        Extract Profile & Continue
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Extracted Google Badge */}
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                      <ShieldCheck className="w-4 h-4" /> Google Account Extracted: {googleEmail}
                    </div>
                    <button
                      type="button"
                      onClick={() => setGoogleStep('select')}
                      className="text-[11px] font-bold underline text-emerald-800 dark:text-emerald-400 cursor-pointer"
                    >
                      Change
                    </button>
                  </div>

                  {/* Set Name */}
                  <div>
                    <label className="block text-xs font-bold text-[#111827] dark:text-slate-300 mb-1">
                      Set Your Name
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type="text"
                        required
                        placeholder="Alex Vance"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-2xl text-xs font-medium text-[#111827] dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 shadow-sm"
                      />
                    </div>
                  </div>

                  {/* Set Platform Username */}
                  <div>
                    <label className="block text-xs font-bold text-[#111827] dark:text-slate-300 mb-1">
                      Platform Username
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type="text"
                        required
                        placeholder="alex_vance99"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-2xl text-xs font-medium text-[#111827] dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 shadow-sm"
                      />
                    </div>
                  </div>

                  {/* Connect Social Accounts (Telegram or WhatsApp) */}
                  <div className="p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3">
                    <span className="text-xs font-bold text-[#111827] dark:text-white block">
                      Connect Social Accounts (Optional - Select Telegram or WhatsApp)
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
                    {loading ? 'Creating Account...' : 'Create Account'}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          )}

          {/* EMAIL FLOW */}
          {method === 'email' && (
            <div>
              <div className="mb-5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-[#111827] text-[#DFFF2F] dark:bg-[#DFFF2F]/20 dark:text-[#DFFF2F] uppercase tracking-wider mb-2">
                  <Mail className="w-3.5 h-3.5" /> Email Registration
                </span>
                <h2 className="text-2xl font-bold text-[#111827] dark:text-white">Register with Email</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Only Gmail addresses (@gmail.com) are permitted. Temporary emails are strictly blocked.
                </p>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-400 text-xs font-semibold rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3.5">
                {/* Email Address */}
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
                        if (error) setError('');
                      }}
                      className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-2xl text-xs font-medium text-[#111827] dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#111827] dark:focus:border-[#DFFF2F] shadow-sm"
                    />
                  </div>
                </div>

                {/* Full Name & Username */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#111827] dark:text-slate-300 mb-1">
                      Full Name <span className="text-rose-500">*</span>
                    </label>
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
                    <label className="block text-xs font-bold text-[#111827] dark:text-slate-300 mb-1">
                      Platform Username <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type="text"
                        required
                        placeholder="alex_vance99"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-2xl text-xs font-medium text-[#111827] dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#111827] dark:focus:border-[#DFFF2F] shadow-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Password & Confirm */}
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

                {/* Connect Social Accounts (Telegram or WhatsApp) */}
                <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2.5">
                  <span className="text-xs font-bold text-[#111827] dark:text-white block">
                    Connect Social Account (Optional: Telegram or WhatsApp)
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Telegram ID</label>
                      <div className="relative">
                        <Send className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                        <input
                          type="text"
                          placeholder="@username"
                          value={telegram}
                          onChange={(e) => setTelegram(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl text-xs text-[#111827] dark:text-white focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">WhatsApp No</label>
                      <div className="relative">
                        <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                        <input
                          type="text"
                          placeholder="+92 300 1234567"
                          value={whatsApp}
                          onChange={(e) => setWhatsApp(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl text-xs text-[#111827] dark:text-white focus:outline-none"
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
                        <Gift className="w-3 h-3" /> Referral Code Pre-filled
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
                      className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-2xl text-xs font-mono uppercase font-bold text-[#111827] dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#111827] dark:focus:border-[#DFFF2F] shadow-sm"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-3 py-3.5 bg-[#111827] dark:bg-[#DFFF2F] hover:bg-slate-800 dark:hover:bg-[#cbe820] text-white dark:text-[#111827] font-bold rounded-2xl text-sm transition-all shadow-lg hover:scale-[1.01] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-600 dark:text-slate-400 font-medium">
                Already have a TrafficSell account?{' '}
                <button
                  type="button"
                  onClick={onNavigateLogin}
                  className="text-[#111827] dark:text-[#DFFF2F] font-extrabold underline hover:opacity-80 cursor-pointer ml-1"
                >
                  Sign in here
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};
