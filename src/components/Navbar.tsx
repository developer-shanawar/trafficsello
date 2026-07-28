import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity, Sun, Moon, Wallet, User as UserIcon, LogOut, LayoutDashboard,
  ShieldAlert, ChevronDown, Sparkles, Plus, Bell, HelpCircle, Menu, X
} from 'lucide-react';
import { useStore } from '../lib/store';

interface NavbarProps {
  onOpenAuth: (mode: 'login' | 'register') => void;
  onNavigateView?: (view: string) => void;
  currentView?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAuth, onNavigateView, currentView }) => {
  const { user, currency, setCurrency, formatMoney, theme, toggleTheme, logout, notifications, platformSettings } = useStore();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const siteName = platformSettings?.siteName || 'TrafficSell';
  const siteIconUrl = platformSettings?.siteIconUrl || '/logo.png';
  const brandDisplayMode = platformSettings?.brandDisplayMode || 'both';

  const isAdmin = user?.email?.toLowerCase() === 'developershanawar@gmail.com' || user?.role === 'admin';

  const handleNavClick = (viewOrHash: string) => {
    setMobileMenuOpen(false);
    if (viewOrHash.startsWith('#')) {
      if (currentView !== 'landing' && onNavigateView) {
        onNavigateView('landing');
        setTimeout(() => {
          const el = document.querySelector(viewOrHash);
          el?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        const el = document.querySelector(viewOrHash);
        el?.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      if (onNavigateView) onNavigateView(viewOrHash);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/80 dark:bg-slate-900/90 border-b border-slate-200/80 dark:border-slate-800 text-[#111827] dark:text-white transition-all shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-2">
        
        {/* Brand Logo & Name */}
        <div
          onClick={() => handleNavClick('landing')}
          className="flex items-center gap-2.5 cursor-pointer group shrink-0"
        >
          {(brandDisplayMode === 'both' || brandDisplayMode === 'icon') && (
            siteIconUrl ? (
              <img
                src={siteIconUrl}
                alt={siteName}
                onError={(e) => { (e.target as HTMLImageElement).src = '/logo.png'; }}
                className="h-10 w-10 rounded-xl object-cover shadow-md border-2 border-[#DFFF2F] group-hover:scale-105 transition-transform"
              />
            ) : (
              <div className="h-9 w-9 rounded-xl bg-[#111827] dark:bg-[#DFFF2F] text-[#DFFF2F] dark:text-[#111827] flex items-center justify-center font-black text-xl uppercase shadow-md group-hover:scale-105 transition-transform">
                {siteName.charAt(0)}
              </div>
            )
          )}

          {(brandDisplayMode === 'both' || brandDisplayMode === 'text') && (
            <div className="hidden xs:block">
              <span className="text-lg sm:text-xl font-bold tracking-tight text-[#111827] dark:text-white flex items-center gap-1.5">
                {siteName}
              </span>
              <span className="block text-[9px] tracking-widest font-bold uppercase opacity-70 text-[#111827] dark:text-slate-400 -mt-1">
                Traffic Marketplace
              </span>
            </div>
          )}
        </div>

        {/* Center Nav Items (Desktop) */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-sm font-semibold opacity-90 text-[#111827] dark:text-slate-200">
          <button
            onClick={() => handleNavClick('landing')}
            className={`hover:opacity-100 transition-opacity cursor-pointer ${currentView === 'landing' ? 'font-bold text-[#111827] dark:text-[#DFFF2F]' : ''}`}
          >
            Home
          </button>
          <button onClick={() => handleNavClick('about')} className="hover:opacity-100 transition-opacity cursor-pointer font-bold text-[#111827] dark:text-[#DFFF2F]">
            About Us
          </button>
          <button onClick={() => handleNavClick('#smm-services')} className="hover:opacity-100 transition-opacity cursor-pointer flex items-center gap-1 text-amber-500 dark:text-[#DFFF2F] font-extrabold">
            <Sparkles className="w-3.5 h-3.5" /> SMM Ads
          </button>
          <button onClick={() => handleNavClick('#features')} className="hover:opacity-100 transition-opacity cursor-pointer">
            Features
          </button>
          <button onClick={() => handleNavClick('#estimator')} className="hover:opacity-100 transition-opacity cursor-pointer">
            Calculator
          </button>
          <button onClick={() => handleNavClick('#payment-methods')} className="hover:opacity-100 transition-opacity cursor-pointer">
            Payments
          </button>
          <button onClick={() => handleNavClick('#faq')} className="hover:opacity-100 transition-opacity cursor-pointer">
            FAQ
          </button>
        </nav>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          
          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            className="p-2 sm:p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#111827] dark:text-slate-300 hover:scale-105 transition-all cursor-pointer shadow-sm"
            title="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-[#111827]" />}
          </button>

          {/* User Logged In State */}
          {user ? (
            <div className="flex items-center gap-2 relative">
              {/* Wallet Balance Badge */}
              <button
                onClick={() => handleNavClick('wallet')}
                className="hidden md:flex items-center gap-2 py-2 px-3 bg-[#111827] dark:bg-slate-800 hover:bg-slate-800 border border-slate-700 rounded-xl text-xs font-bold text-white transition-all shadow-sm"
              >
                <Wallet className="w-3.5 h-3.5 text-[#DFFF2F]" />
                <span>{formatMoney(user.walletBalance)}</span>
                <span className="text-[10px] bg-[#DFFF2F] text-slate-900 px-1.5 py-0.2 rounded font-black">+ Deposit</span>
              </button>

              {/* Profile Menu Trigger */}
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="hidden sm:flex items-center gap-2 p-1.5 pl-2 rounded-xl bg-white/80 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer text-[#111827] dark:text-white"
              >
                <img
                  src={user.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250"}
                  alt={user.fullName}
                  className="w-7 h-7 rounded-lg object-cover border border-slate-300 dark:border-slate-600"
                />
                <span className="text-xs font-bold max-w-[90px] truncate">{user.fullName}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {/* Profile Dropdown Menu */}
              {profileDropdownOpen && (
                <div className="absolute right-0 top-14 w-60 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-2 z-50 text-xs text-[#111827] dark:text-white">
                  <div className="p-3 border-b border-slate-100 dark:border-slate-800">
                    <p className="font-bold truncate">{user.fullName}</p>
                    <p className="text-slate-500 dark:text-slate-400 truncate text-[11px]">{user.email}</p>
                  </div>

                  <div className="py-1 space-y-0.5">
                    <button
                      onClick={() => { handleNavClick('dashboard'); setProfileDropdownOpen(false); }}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 font-bold cursor-pointer"
                    >
                      <LayoutDashboard className="w-4 h-4 text-[#111827] dark:text-[#DFFF2F]" /> Dashboard
                    </button>
                    {isAdmin && (
                      <button
                        onClick={() => { handleNavClick('admin'); setProfileDropdownOpen(false); }}
                        className="w-full text-left px-3 py-2 rounded-xl hover:bg-amber-500/10 text-amber-700 dark:text-amber-300 flex items-center gap-2 font-bold cursor-pointer"
                      >
                        <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400" /> Admin Control Panel
                      </button>
                    )}
                    <button
                      onClick={() => { handleNavClick('wallet'); setProfileDropdownOpen(false); }}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 font-bold cursor-pointer"
                    >
                      <Wallet className="w-4 h-4 text-emerald-600 dark:text-[#DFFF2F]" /> Wallet ({formatMoney(user.walletBalance)})
                    </button>
                  </div>

                  <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => {
                        logout();
                        setProfileDropdownOpen(false);
                        handleNavClick('landing');
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center gap-2 font-bold cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Logged Out Buttons (Desktop) */
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={() => handleNavClick('login')}
                className="py-2 px-3.5 text-xs font-bold text-[#111827] dark:text-white hover:opacity-80 transition-opacity cursor-pointer bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm"
              >
                Sign In
              </button>
              <button
                onClick={() => handleNavClick('register')}
                className="py-2 px-4 bg-[#111827] dark:bg-[#DFFF2F] hover:bg-slate-800 dark:hover:bg-[#cbe820] text-white dark:text-[#111827] text-xs font-extrabold rounded-xl transition-all shadow-md hover:scale-105 cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#DFFF2F] dark:text-[#111827]" /> Get Started
              </button>
            </div>
          )}

          {/* Mobile / Tablet 3-Line Hamburger Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-2 sm:p-2.5 rounded-xl bg-[#111827] text-[#DFFF2F] dark:bg-[#DFFF2F] dark:text-[#111827] hover:scale-105 transition-all cursor-pointer shadow-md shrink-0"
            aria-label="Open Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mobile Top Drop-Down Menu Panel */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-950/75 backdrop-blur-md z-[99998]"
            />

            {/* Top Drop-Down Menu Panel */}
            <motion.div
              initial={{ y: '-100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '-100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed top-0 left-0 right-0 w-full max-h-[92vh] bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 z-[99999] shadow-2xl p-6 flex flex-col justify-between overflow-y-auto text-[#111827] dark:text-white rounded-b-3xl"
            >
              <div>
                {/* Drawer Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2.5">
                    {siteIconUrl ? (
                      <img
                        src={siteIconUrl}
                        alt={siteName}
                        onError={(e) => { (e.target as HTMLImageElement).src = '/logo.png'; }}
                        className="h-8 w-8 rounded-xl object-cover border border-[#DFFF2F]"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-xl bg-[#111827] dark:bg-[#DFFF2F] text-[#DFFF2F] dark:text-[#111827] flex items-center justify-center font-black text-base">
                        {siteName.charAt(0)}
                      </div>
                    )}
                    <span className="text-base font-black tracking-tight flex items-center gap-1.5">
                      {siteName}
                    </span>
                  </div>

                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-[#111827] dark:text-white hover:opacity-80 transition-opacity cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Logged-In User Quick Header */}
                {user ? (
                  <div className="mt-4 p-3.5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-3">
                      <img
                        src={user.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250"}
                        alt={user.fullName}
                        className="w-10 h-10 rounded-xl object-cover border border-slate-300 dark:border-slate-600"
                      />
                      <div className="overflow-hidden">
                        <p className="font-extrabold text-xs text-[#111827] dark:text-white truncate">{user.fullName}</p>
                        <p className="text-[11px] text-[#111827]/70 dark:text-slate-400 truncate">{user.email}</p>
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center text-xs">
                      <span className="font-bold text-[#111827]/70 dark:text-slate-400">Wallet Balance</span>
                      <span className="font-black text-emerald-600 dark:text-[#DFFF2F]">{formatMoney(user.walletBalance)}</span>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleNavClick('login')}
                      className="py-2.5 text-center text-xs font-bold bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-[#111827] dark:text-white"
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => handleNavClick('register')}
                      className="py-2.5 text-center text-xs font-extrabold bg-[#111827] dark:bg-[#DFFF2F] text-white dark:text-slate-950 rounded-xl"
                    >
                      Get Started
                    </button>
                  </div>
                )}

                {/* Navigation Links */}
                <div className="mt-5 space-y-1 font-bold text-sm">
                  <button
                    onClick={() => handleNavClick('landing')}
                    className="w-full text-left py-2.5 px-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-between"
                  >
                    <span>Home</span>
                  </button>
                  <button
                    onClick={() => handleNavClick('about')}
                    className="w-full text-left py-2.5 px-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors font-bold text-[#111827] dark:text-[#DFFF2F]"
                  >
                    About Us
                  </button>
                  <button
                    onClick={() => handleNavClick('#smm-services')}
                    className="w-full text-left py-2.5 px-3 rounded-xl bg-amber-500/10 text-amber-600 dark:text-[#DFFF2F] flex items-center justify-between font-extrabold"
                  >
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4" /> SMM & Social Ads
                    </span>
                    <span className="text-[10px] bg-[#DFFF2F] text-slate-950 px-1.5 py-0.5 rounded uppercase font-black">Hot</span>
                  </button>
                  <button
                    onClick={() => handleNavClick('#features')}
                    className="w-full text-left py-2.5 px-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    Features
                  </button>
                  <button
                    onClick={() => handleNavClick('#estimator')}
                    className="w-full text-left py-2.5 px-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    Calculator
                  </button>
                  <button
                    onClick={() => handleNavClick('#payment-methods')}
                    className="w-full text-left py-2.5 px-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    Payment Gateways
                  </button>
                  <button
                    onClick={() => handleNavClick('#faq')}
                    className="w-full text-left py-2.5 px-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    FAQ
                  </button>

                  {user && (
                    <div className="pt-3 mt-3 border-t border-slate-200 dark:border-slate-800 space-y-1">
                      <button
                        onClick={() => handleNavClick('dashboard')}
                        className="w-full text-left py-2.5 px-3 rounded-xl bg-slate-900 text-white dark:bg-[#DFFF2F] dark:text-slate-950 flex items-center gap-2.5 font-extrabold"
                      >
                        <LayoutDashboard className="w-4 h-4" /> Go to Dashboard
                      </button>
                      {isAdmin && (
                        <button
                          onClick={() => handleNavClick('admin')}
                          className="w-full text-left py-2.5 px-3 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-300 flex items-center gap-2.5 font-bold"
                        >
                          <ShieldAlert className="w-4 h-4" /> Admin Control Panel
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
                {user && (
                  <button
                    onClick={() => { logout(); setMobileMenuOpen(false); handleNavClick('landing'); }}
                    className="w-full py-2.5 bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500 hover:text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};
