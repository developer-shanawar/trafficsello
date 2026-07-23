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
  const { user, theme, toggleTheme, logout, notifications, platformSettings } = useStore();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const siteName = platformSettings?.siteName || 'TrafficSell';
  const siteIconUrl = platformSettings?.siteIconUrl || 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&q=80&w=250';
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
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/70 dark:bg-slate-900/90 border-b border-white/60 dark:border-slate-800 text-[#111827] dark:text-white transition-all shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo & Name */}
        <div
          onClick={() => handleNavClick('landing')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          {(brandDisplayMode === 'both' || brandDisplayMode === 'icon') && (
            siteIconUrl ? (
              <img
                src={siteIconUrl}
                alt={siteName}
                className="h-10 w-10 rounded-xl object-cover shadow-md border-2 border-[#DFFF2F] group-hover:scale-105 transition-transform"
              />
            ) : (
              <div className="h-9 w-9 rounded-xl bg-[#111827] dark:bg-[#DFFF2F] text-[#DFFF2F] dark:text-[#111827] flex items-center justify-center font-black text-xl uppercase shadow-md group-hover:scale-105 transition-transform">
                {siteName.charAt(0)}
              </div>
            )
          )}

          {(brandDisplayMode === 'both' || brandDisplayMode === 'text') && (
            <div>
              <span className="text-xl font-bold tracking-tight text-[#111827] dark:text-white flex items-center gap-1.5">
                {siteName}
              </span>
              <span className="block text-[9px] tracking-widest font-bold uppercase opacity-70 text-[#111827] dark:text-slate-400 -mt-1">
                Traffic Marketplace
              </span>
            </div>
          )}
        </div>

        {/* Center Nav Items (Desktop) */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold opacity-90 text-[#111827] dark:text-slate-200">
          <button
            onClick={() => handleNavClick('landing')}
            className={`hover:opacity-100 transition-opacity cursor-pointer ${currentView === 'landing' ? 'font-bold text-[#111827] dark:text-[#DFFF2F]' : ''}`}
          >
            Home
          </button>
          <button onClick={() => handleNavClick('about')} className="hover:opacity-100 transition-opacity cursor-pointer font-bold text-[#111827] dark:text-[#DFFF2F]">
            About Us
          </button>
          <button onClick={() => handleNavClick('#features')} className="hover:opacity-100 transition-opacity cursor-pointer">
            Features
          </button>
          <button onClick={() => handleNavClick('#estimator')} className="hover:opacity-100 transition-opacity cursor-pointer">
            Calculator
          </button>
          <button onClick={() => handleNavClick('#payment-methods')} className="hover:opacity-100 transition-opacity cursor-pointer">
            Payment Methods
          </button>
          <button onClick={() => handleNavClick('#faq')} className="hover:opacity-100 transition-opacity cursor-pointer">
            FAQ
          </button>
        </nav>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          
          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-white/60 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#111827] dark:text-slate-300 hover:scale-105 transition-all cursor-pointer shadow-sm"
            title="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-[#111827]" />}
          </button>

          {/* User Logged In State */}
          {user ? (
            <div className="flex items-center gap-2.5 relative">
              {/* Wallet Balance Badge */}
              <button
                onClick={() => handleNavClick('wallet')}
                className="hidden sm:flex items-center gap-2 py-2 px-3.5 bg-[#111827] dark:bg-slate-800 hover:bg-slate-800 border border-slate-700 rounded-xl text-xs font-bold text-white transition-all shadow-sm"
              >
                <Wallet className="w-3.5 h-3.5 text-[#DFFF2F]" />
                <span>${user.walletBalance.toFixed(2)}</span>
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
                  className="w-8 h-8 rounded-lg object-cover border border-slate-300 dark:border-slate-600"
                />
                <span className="text-xs font-bold max-w-[100px] truncate">{user.fullName}</span>
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
                      <Wallet className="w-4 h-4 text-emerald-600 dark:text-[#DFFF2F]" /> Wallet (${user.walletBalance.toFixed(2)})
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
            <div className="hidden sm:flex items-center gap-2.5">
              <button
                onClick={() => handleNavClick('login')}
                className="py-2.5 px-4 text-xs font-bold text-[#111827] dark:text-white hover:opacity-80 transition-opacity cursor-pointer bg-white/80 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm"
              >
                Sign In
              </button>
              <button
                onClick={() => handleNavClick('register')}
                className="py-2.5 px-5 bg-[#111827] dark:bg-[#DFFF2F] hover:bg-slate-800 dark:hover:bg-[#cbe820] text-white dark:text-[#111827] text-xs font-extrabold rounded-xl transition-all shadow-md hover:scale-105 cursor-pointer flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#DFFF2F] dark:text-[#111827]" /> Get Started
              </button>
            </div>
          )}

          {/* Mobile Hamburger Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden p-2.5 rounded-xl bg-[#111827] text-[#DFFF2F] dark:bg-[#DFFF2F] dark:text-[#111827] hover:scale-105 transition-all cursor-pointer shadow-md"
            aria-label="Open Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mobile Right Slide-Over Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-950/70 backdrop-blur-md z-[998]"
            />

            {/* Slide Down Drawer Panel */}
            <motion.div
              initial={{ y: '-100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '-100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 24, stiffness: 220 }}
              className="fixed top-0 left-0 right-0 max-h-[92vh] bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 z-[999] shadow-2xl p-6 rounded-b-3xl flex flex-col justify-between overflow-y-auto text-[#111827] dark:text-white"
            >
              <div>
                {/* Drawer Header */}
                <div className="flex items-center justify-between pb-5 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2.5">
                    {siteIconUrl ? (
                      <img
                        src={siteIconUrl}
                        alt={siteName}
                        className="h-9 w-9 rounded-xl object-cover border border-[#DFFF2F]"
                      />
                    ) : (
                      <div className="h-9 w-9 rounded-xl bg-[#111827] dark:bg-[#DFFF2F] text-[#DFFF2F] dark:text-[#111827] flex items-center justify-center font-black text-lg">
                        {siteName.charAt(0)}
                      </div>
                    )}
                    <span className="text-lg font-black tracking-tight flex items-center gap-1.5">
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
                {user && (
                  <div className="mt-5 p-3.5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700">
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
                      <span className="font-black text-emerald-600 dark:text-[#DFFF2F]">${user.walletBalance.toFixed(2)}</span>
                    </div>
                  </div>
                )}

                {/* Navigation Links */}
                <div className="mt-6 space-y-1.5 font-bold text-sm">
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
                    <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-1.5">
                      <button
                        onClick={() => handleNavClick('dashboard')}
                        className="w-full text-left py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-[#111827] dark:text-white flex items-center gap-2.5 font-extrabold"
                      >
                        <LayoutDashboard className="w-4 h-4 text-[#111827] dark:text-[#DFFF2F]" /> Dashboard
                      </button>
                      {isAdmin && (
                        <button
                          onClick={() => handleNavClick('admin')}
                          className="w-full text-left py-2.5 px-3 rounded-xl bg-amber-500/10 text-amber-900 dark:text-amber-300 border border-amber-500/20 flex items-center gap-2.5 font-extrabold"
                        >
                          <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400" /> Admin Panel
                        </button>
                      )}
                      <button
                        onClick={() => handleNavClick('wallet')}
                        className="w-full text-left py-2.5 px-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-emerald-600 dark:text-[#DFFF2F] flex items-center gap-2.5 font-extrabold"
                      >
                        <Wallet className="w-4 h-4" /> Wallet & Deposit
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Drawer Bottom Actions */}
              <div className="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-3">
                {user ? (
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                      handleNavClick('landing');
                    }}
                    className="w-full py-3 px-4 bg-rose-500/10 hover:bg-rose-500/20 text-rose-700 dark:text-rose-400 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out Account
                  </button>
                ) : (
                  <div className="space-y-2">
                    <button
                      onClick={() => handleNavClick('login')}
                      className="w-full py-3 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-[#111827] dark:text-white rounded-2xl font-bold text-xs transition-colors cursor-pointer"
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => handleNavClick('register')}
                      className="w-full py-3.5 px-4 bg-[#111827] dark:bg-[#DFFF2F] hover:bg-slate-800 dark:hover:bg-[#cbe820] text-white dark:text-[#111827] rounded-2xl font-black text-xs transition-colors shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4 text-[#DFFF2F] dark:text-[#111827]" /> Get Started
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};
