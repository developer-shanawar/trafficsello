import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, ShoppingCart, Layers, Wallet, BarChart3,
  Ticket, User, Settings, ShieldAlert, LogOut, Bell, Sun, Moon,
  Activity, Plus, Check, ChevronRight, Menu, X, ArrowUpRight
} from 'lucide-react';
import { useStore } from '../lib/store';

interface DashboardLayoutProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ currentTab, onSelectTab, children }) => {
  const { user, theme, toggleTheme, logout, notifications, markNotificationRead, switchUserRole } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  const unreadNotifs = notifications.filter(n => !n.read);
  const isAdmin = user?.email?.toLowerCase() === 'developershanawar@gmail.com' || user?.role === 'admin';

  const navItems = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'campaigns', label: 'Campaigns & Traffic', icon: Layers, highlight: true },
    { id: 'wallet', label: 'Wallet & Deposit', icon: Wallet },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'support', label: 'Support Tickets', icon: Ticket },
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  if (isAdmin) {
    navItems.splice(1, 0, { id: 'admin', label: 'Admin Panel', icon: ShieldAlert, highlight: false });
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 flex flex-col md:flex-row transition-colors">
      
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-slate-900/90 border-r border-slate-200 dark:border-slate-800/80 p-5 shrink-0 justify-between sticky top-0 h-screen z-30">
        <div>
          {/* Logo */}
          <div
            onClick={() => onSelectTab('overview')}
            className="flex items-center gap-3 cursor-pointer mb-8"
          >
            <div className="w-10 h-10 rounded-2xl bg-[#DFFF2F] text-slate-900 flex items-center justify-center font-black shadow-md">
              <Activity className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-0.5">
                Traffic<span className="text-slate-900 dark:text-[#DFFF2F]">Sell</span>
              </span>
              <span className="block text-[9px] font-bold tracking-widest uppercase text-slate-400 -mt-1">
                Ad Network Dashboard
              </span>
            </div>
          </div>

          {/* Nav List */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-slate-900 text-white dark:bg-[#DFFF2F] dark:text-slate-950 shadow-md'
                      : item.highlight
                      ? 'bg-[#DFFF2F]/20 text-slate-900 dark:text-[#DFFF2F] hover:bg-[#DFFF2F]/30'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.id === 'wallet' && user && (
                    <span className="text-[10px] font-mono font-extrabold px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 dark:text-[#DFFF2F]">
                      ${user.walletBalance.toFixed(0)}
                    </span>
                  )}
                  {item.id === 'admin' && (
                    <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-500 uppercase">
                      Admin
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Quick Info Footer */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <img
                src={user?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250"}
                alt={user?.fullName}
                className="w-8 h-8 rounded-xl object-cover shrink-0"
              />
              <div className="truncate">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{user?.fullName}</p>
                <p className="text-[10px] text-slate-400 truncate">${user?.walletBalance.toFixed(2)} USD</p>
              </div>
            </div>
            <button
              onClick={() => {
                logout();
                onSelectTab('landing');
              }}
              className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Role Switcher */}
          <div className="flex justify-between items-center text-[10px] text-slate-400 px-1">
            <span>Role: <strong className="uppercase text-slate-700 dark:text-slate-300">{user?.role}</strong></span>
            <button
              onClick={() => switchUserRole(user?.role === 'admin' ? 'user' : 'admin')}
              className="text-[#DFFF2F] font-bold hover:underline cursor-pointer"
            >
              Switch to {user?.role === 'admin' ? 'User' : 'Admin'}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Container */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header */}
        <header className="h-16 bg-white dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-20 backdrop-blur-md">
          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-600 dark:text-slate-300"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-500">
            <span>Dashboard</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-slate-900 dark:text-white capitalize">{currentTab.replace('-', ' ')}</span>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            
            {/* Action: Buy Traffic / Create Campaign */}
            <button
              onClick={() => onSelectTab('campaigns')}
              className="py-1.5 px-3 bg-[#111827] text-white dark:bg-[#DFFF2F] dark:text-slate-950 text-xs font-extrabold rounded-xl shadow transition-all flex items-center gap-1.5 cursor-pointer hover:scale-105"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span className="hidden sm:inline">Launch Campaign</span>
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 relative cursor-pointer"
              >
                <Bell className="w-4 h-4" />
                {unreadNotifs.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[9px] font-black flex items-center justify-center">
                    {unreadNotifs.length}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {notifDropdownOpen && (
                <div className="absolute right-0 top-12 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-3 z-50 text-xs">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800 mb-2">
                    <span className="font-bold text-slate-900 dark:text-white">Notifications</span>
                    <span className="text-[10px] text-slate-400">{unreadNotifs.length} unread</span>
                  </div>
                  <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                    {notifications.length === 0 ? (
                      <p className="text-center text-slate-400 py-4">No notifications yet</p>
                    ) : (
                      notifications.slice(0, 5).map((n) => (
                        <div
                          key={n.id}
                          onClick={() => markNotificationRead(n.id)}
                          className={`p-2.5 rounded-xl transition-colors cursor-pointer ${
                            n.read ? 'bg-slate-50 dark:bg-slate-800/40 text-slate-500' : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-semibold'
                          }`}
                        >
                          <p className="text-xs font-bold text-[#111827] dark:text-[#DFFF2F]">{n.title}</p>
                          <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">{n.message}</p>
                          <span className="text-[9px] text-slate-400 block mt-1">{new Date(n.createdAt).toLocaleTimeString()}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 cursor-pointer"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </header>

        {/* Mobile Sidebar Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 space-y-2 z-30">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => { onSelectTab(item.id); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-bold ${
                    currentTab === item.id ? 'bg-[#DFFF2F] text-slate-950' : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Dynamic View Body */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
