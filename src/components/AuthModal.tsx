import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, Phone, Send, Sparkles, ShieldCheck, ArrowRight, MailCheck, RefreshCw } from 'lucide-react';
import { useStore } from '../lib/store';

interface AuthModalProps {
  isOpen: boolean;
  initialMode: 'login' | 'register';
  onClose: () => void;
  onSuccess: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, initialMode, onClose, onSuccess }) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const { login, register, resendConfirmationEmail } = useStore();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [telegram, setTelegram] = useState('');
  const [whatsApp, setWhatsApp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Email Confirmation State
  const [confirmationSent, setConfirmationSent] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');
  const [resending, setResending] = useState(false);
  const [resendStatus, setResendStatus] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'register') {
        if (password && confirmPassword && password !== confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }
        const res = await register({ fullName, email, password, telegram, whatsApp });
        setLoading(false);

        if (res.requiresEmailConfirmation) {
          setSubmittedEmail(res.email);
          setConfirmationSent(true);
        } else {
          onSuccess();
        }
      } else {
        await login(email, password);
        setLoading(false);
        onSuccess();
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!submittedEmail) return;
    setResending(true);
    setResendStatus('');
    const result = await resendConfirmationEmail(submittedEmail);
    setResending(false);
    setResendStatus(result.message);
  };

  const handleDemoUser = async () => {
    setLoading(true);
    await login('demo@trafficsell.com');
    setLoading(false);
    onSuccess();
  };

  const handleDemoAdmin = async () => {
    setLoading(true);
    await login('admin@trafficsell.com');
    setLoading(false);
    onSuccess();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative text-white overflow-hidden"
        >
          {/* Top Background Glow */}
          <div className="absolute -top-20 -right-20 w-48 h-48 bg-[#DFFF2F]/15 rounded-full blur-3xl pointer-events-none" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-5 top-5 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/80 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {confirmationSent ? (
            <div className="text-center py-2 space-y-4">
              <div className="w-14 h-14 bg-[#DFFF2F]/20 text-[#DFFF2F] rounded-full flex items-center justify-center mx-auto border-2 border-[#DFFF2F] animate-pulse">
                <MailCheck className="w-7 h-7" />
              </div>

              <div>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 uppercase tracking-wider mb-2">
                  <Sparkles className="w-3 h-3" /> Confirmation Link Sent
                </span>
                <h3 className="text-xl font-bold text-white">Check Your Email</h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  We sent a confirmation link to <strong className="text-[#DFFF2F] font-bold">{submittedEmail}</strong>. Please click the link in your email to verify your account and complete registration.
                </p>
              </div>

              <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-xl text-left text-xs text-slate-400 space-y-1">
                <p className="font-semibold text-slate-200">✨ Automatic Sign In:</p>
                <p>After clicking the link in your email, your account will be verified automatically by Supabase.</p>
              </div>

              {resendStatus && (
                <div className="p-2.5 bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-medium rounded-xl">
                  {resendStatus}
                </div>
              )}

              <div className="pt-1 space-y-2">
                <button
                  onClick={handleResend}
                  disabled={resending}
                  className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${resending ? 'animate-spin' : ''}`} />
                  {resending ? 'Resending Link...' : 'Resend Confirmation Email'}
                </button>

                <button
                  onClick={() => { setConfirmationSent(false); setMode('login'); }}
                  className="w-full py-2.5 bg-[#DFFF2F] hover:bg-[#cbe820] text-slate-950 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer"
                >
                  Back to Sign In
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="mb-6">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-[#DFFF2F]/20 text-[#DFFF2F] uppercase tracking-wider mb-2">
                  <Sparkles className="w-3 h-3" /> {mode === 'login' ? 'Welcome Back' : 'Create Account'}
                </span>
                <h3 className="text-2xl font-bold">
                  {mode === 'login' ? 'Sign in to TrafficSell' : 'Join Premium Traffic Network'}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  {mode === 'login' ? 'Manage campaigns, wallet balance & analytics' : 'Create your account to start buying traffic'}
                </p>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-xl">
                  {error}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-3">
                {mode === 'register' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                      <input
                        type="text"
                        required
                        placeholder="Alex Vance"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#DFFF2F]"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      placeholder="name@domain.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#DFFF2F]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#DFFF2F]"
                    />
                  </div>
                </div>

                {mode === 'register' && (
                  <>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Telegram Handle</label>
                        <div className="relative">
                          <Send className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
                          <input
                            type="text"
                            placeholder="@username"
                            value={telegram}
                            onChange={(e) => setTelegram(e.target.value)}
                            className="w-full pl-8 pr-2 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#DFFF2F]"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">WhatsApp No</label>
                        <div className="relative">
                          <Phone className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
                          <input
                            type="text"
                            placeholder="+1 555-0192"
                            value={whatsApp}
                            onChange={(e) => setWhatsApp(e.target.value)}
                            className="w-full pl-8 pr-2 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#DFFF2F]"
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 py-3 bg-[#DFFF2F] hover:bg-[#cbe820] text-slate-900 font-bold rounded-xl text-sm transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? 'Processing...' : mode === 'login' ? 'Sign In to Dashboard' : 'Create Account'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </>
          )}

          {/* Toggle Register/Login */}
          <div className="mt-5 pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
            {mode === 'login' ? (
              <span>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className="text-[#DFFF2F] font-bold hover:underline cursor-pointer"
                >
                  Create one now
                </button>
              </span>
            ) : (
              <span>
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-[#DFFF2F] font-bold hover:underline cursor-pointer"
                >
                  Sign in here
                </button>
              </span>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
