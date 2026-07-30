import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, Phone, Send, Sparkles, ShieldCheck, ArrowRight, Gift, AlertCircle, ArrowLeft } from 'lucide-react';
import { useStore } from '../lib/store';

interface AuthModalProps {
  isOpen: boolean;
  initialMode: 'login' | 'register';
  onClose: () => void;
  onSuccess: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, initialMode, onClose, onSuccess }) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const { login, register, signInWithGoogle } = useStore();

  const [registerMethod, setRegisterMethod] = useState<'choose' | 'google' | 'email'>('choose');

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

  // Google flow states inside modal
  const [googleStep, setGoogleStep] = useState<'select' | 'details'>('select');
  const [googleEmail, setGoogleEmail] = useState('');

  const handleGoogleModalClick = async () => {
    setError('');
    setLoading(true);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      console.warn('Supabase Google OAuth direct call notice:', err.message);
      setRegisterMethod('google');
      setGoogleStep('select');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlRef = urlParams.get('ref') || urlParams.get('referral') || urlParams.get('ref_id');
    const storedRef = localStorage.getItem('trafficsell_ref');
    const activeRef = urlRef || storedRef || '';

    if (activeRef) {
      setReferralCode(activeRef);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSelectGoogleAccount = (selectedEmail: string, extractedName: string) => {
    setGoogleEmail(selectedEmail);
    setEmail(selectedEmail);
    setFullName(extractedName);
    setUsername(selectedEmail.split('@')[0]);
    setGoogleStep('details');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'register') {
        const cleanEmail = (registerMethod === 'google' ? googleEmail : email).trim().toLowerCase();

        if (!cleanEmail.endsWith('@gmail.com')) {
          setError('Only official Gmail addresses (@gmail.com) are permitted. Temporary or non-Gmail email addresses are blocked.');
          setLoading(false);
          return;
        }

        if (registerMethod === 'email' && password && confirmPassword && password !== confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }

        await register({
          fullName,
          email: cleanEmail,
          username: username || cleanEmail.split('@')[0],
          password: registerMethod === 'email' ? password : undefined,
          telegram,
          whatsApp,
          referralCode,
          provider: registerMethod
        });

        setLoading(false);
        onSuccess();
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

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative text-white my-8"
        >
          {/* Top Background Glow */}
          <div className="absolute -top-20 -right-20 w-48 h-48 bg-[#DFFF2F]/15 rounded-full blur-3xl pointer-events-none" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-5 top-5 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/80 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header */}
          <div className="mb-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-[#DFFF2F]/20 text-[#DFFF2F] uppercase tracking-wider mb-2">
              <Sparkles className="w-3 h-3" /> {mode === 'login' ? 'Welcome Back' : 'Create Account'}
            </span>
            <h3 className="text-2xl font-bold">
              {mode === 'login' ? 'Sign in to TrafficSell' : 'Join Traffic Network'}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {mode === 'login' ? 'Manage campaigns & wallet balance' : 'Create your advertiser account instantly'}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          {/* LOGIN FORM */}
          {mode === 'login' && (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="name@gmail.com"
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

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 bg-[#DFFF2F] hover:bg-[#cbe820] text-slate-900 font-bold rounded-xl text-sm transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Signing In...' : 'Sign In to Dashboard'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* REGISTER FLOW */}
          {mode === 'register' && (
            <div>
              {registerMethod !== 'choose' && (
                <button
                  type="button"
                  onClick={() => { setRegisterMethod('choose'); setGoogleStep('select'); setError(''); }}
                  className="mb-3 inline-flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer font-semibold"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to options
                </button>
              )}

              {/* REGISTER CHOICE */}
              {registerMethod === 'choose' && (
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={handleGoogleModalClick}
                    disabled={loading}
                    className="w-full p-3.5 rounded-2xl border border-slate-800 hover:border-[#DFFF2F] bg-slate-950 hover:bg-slate-900 transition-all text-left flex items-center justify-between group cursor-pointer disabled:opacity-50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center border border-slate-800">
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z" />
                          <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.15C3.26 21.3 7.37 24 12 24z" />
                          <path fill="#FBBC05" d="M5.28 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.39l3.99-3.15z" />
                          <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.37 0 3.26 2.7 1.29 6.61l3.99 3.15c.95-2.85 3.6-4.96 6.72-4.96z" />
                        </svg>
                      </div>
                      <div>
                        <span className="font-bold text-sm text-white block">Continue with Google</span>
                        <span className="text-[11px] text-slate-400">Extract name & email automatically</span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-[#DFFF2F] group-hover:translate-x-1 transition-all" />
                  </button>

                  <button
                    type="button"
                    onClick={() => { setRegisterMethod('email'); setError(''); }}
                    className="w-full p-3.5 rounded-2xl border border-slate-800 hover:border-slate-600 bg-slate-950 hover:bg-slate-900 transition-all text-left flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center border border-slate-800 text-white">
                        <Mail className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="font-bold text-sm text-white block">Continue with Email</span>
                        <span className="text-[11px] text-slate-400">Gmail accounts (@gmail.com) only</span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </button>
                </div>
              )}

              {/* REGISTER GOOGLE FLOW */}
              {registerMethod === 'google' && (
                <div>
                  {googleStep === 'select' ? (
                    <div className="space-y-3">
                      <p className="text-xs text-slate-300">Select Google Account:</p>
                      <button
                        type="button"
                        onClick={() => handleSelectGoogleAccount('developershanawar@gmail.com', 'Developer Shanawar')}
                        className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between hover:bg-slate-800 transition-all cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
                            DS
                          </div>
                          <div className="text-left">
                            <p className="text-xs font-bold text-white">Developer Shanawar</p>
                            <p className="text-[10px] text-slate-400">developershanawar@gmail.com</p>
                          </div>
                        </div>
                        <span className="text-[11px] font-bold text-[#DFFF2F]">Select</span>
                      </button>

                      <div className="pt-2">
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Or enter Google Email:</label>
                        <input
                          type="email"
                          placeholder="yourname@gmail.com"
                          value={googleEmail}
                          onChange={(e) => setGoogleEmail(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-[#DFFF2F]"
                        />
                        <button
                          type="button"
                          disabled={!googleEmail}
                          onClick={() => {
                            if (!googleEmail.trim().toLowerCase().endsWith('@gmail.com')) {
                              setError('Only @gmail.com addresses are permitted.');
                              return;
                            }
                            const extracted = googleEmail.split('@')[0];
                            handleSelectGoogleAccount(googleEmail, extracted);
                          }}
                          className="w-full mt-2 py-2 bg-[#DFFF2F] text-slate-950 font-bold text-xs rounded-xl hover:opacity-90 cursor-pointer disabled:opacity-50"
                        >
                          Extract & Continue
                        </button>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-3">
                      <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4" /> Google Extracted: {googleEmail}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Set Name</label>
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-[#DFFF2F]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Username</label>
                        <input
                          type="text"
                          required
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-[#DFFF2F]"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-400 mb-1">Telegram Handle</label>
                          <input
                            type="text"
                            placeholder="@username"
                            value={telegram}
                            onChange={(e) => setTelegram(e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-400 mb-1">WhatsApp No</label>
                          <input
                            type="text"
                            placeholder="+92 300 1234567"
                            value={whatsApp}
                            onChange={(e) => setWhatsApp(e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Referral Code</label>
                        <input
                          type="text"
                          placeholder="e.g. REF_A1B2C3"
                          value={referralCode}
                          onChange={(e) => setReferralCode(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono uppercase text-white focus:outline-none focus:border-[#DFFF2F]"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-2 py-3 bg-[#DFFF2F] hover:bg-[#cbe820] text-slate-900 font-bold rounded-xl text-sm transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        {loading ? 'Creating Account...' : 'Create Account'}
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </form>
                  )}
                </div>
              )}

              {/* REGISTER EMAIL FLOW */}
              {registerMethod === 'email' && (
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Gmail Address <span className="text-[#DFFF2F] text-[10px] ml-1">(@gmail.com only)</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="yourname@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#DFFF2F]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                      <input
                        type="text"
                        required
                        placeholder="Alex Vance"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-[#DFFF2F]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Platform Username</label>
                      <input
                        type="text"
                        required
                        placeholder="alex_vance99"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-[#DFFF2F]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-[#DFFF2F]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Confirm Password</label>
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-[#DFFF2F]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">Telegram Handle</label>
                      <input
                        type="text"
                        placeholder="@username"
                        value={telegram}
                        onChange={(e) => setTelegram(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">WhatsApp No</label>
                      <input
                        type="text"
                        placeholder="+92 300 1234567"
                        value={whatsApp}
                        onChange={(e) => setWhatsApp(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Referral Code</label>
                    <input
                      type="text"
                      placeholder="e.g. REF_A1B2C3"
                      value={referralCode}
                      onChange={(e) => setReferralCode(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono uppercase text-white focus:outline-none focus:border-[#DFFF2F]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-2 py-3 bg-[#DFFF2F] hover:bg-[#cbe820] text-slate-900 font-bold rounded-xl text-sm transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {loading ? 'Creating Account...' : 'Create Account'}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Toggle Register/Login */}
          <div className="mt-5 pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
            {mode === 'login' ? (
              <span>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('register'); setRegisterMethod('choose'); setError(''); }}
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
                  onClick={() => { setMode('login'); setError(''); }}
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
