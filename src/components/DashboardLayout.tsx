import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, ShoppingCart, Layers, Wallet, BarChart3,
  Ticket, User, Settings, ShieldAlert, LogOut, Bell, Sun, Moon,
  Activity, Plus, Check, ChevronRight, ChevronLeft, Menu, X, ArrowUpRight, Users, Share2,
  PanelLeftClose, PanelLeftOpen
} from 'lucide-react';
import { useStore } from '../lib/store';

interface DashboardLayoutProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ currentTab, onSelectTab, children }) => {
  const { user, currency, setCurrency, formatMoney, theme, toggleTheme, logout, notifications, markNotificationRead, platformSettings } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [launchModalOpen, setLaunchModalOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const siteName = platformSettings?.siteName || 'TrafficSell';
  const siteIconUrl = platformSettings?.siteIconUrl || '/logo.png';

  const unreadNotifs = notifications.filter(n => !n.read);
  const isAdmin = user?.email?.toLowerCase() === 'developershanawar@gmail.com' || user?.role === 'admin';

  const navItems = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'campaigns', label: 'Campaigns & Traffic', icon: Layers },
    { id: 'social_ads', label: 'Social Ads SMM', icon: Share2 },
    { id: 'wallet', label: 'Wallet & Deposit', icon: Wallet },
    { id: 'referrals', label: 'Referral Program', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'support', label: 'Support Tickets', icon: Ticket },
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  if (isAdmin) {
    navItems.splice(1, 0, { id: 'admin', label: 'Admin Panel', icon: ShieldAlert });
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 flex flex-col md:flex-row transition-colors">
      
      {/* Sidebar for Desktop */}
      <aside className={`hidden md:flex flex-col ${isSidebarCollapsed ? 'w-20 p-3' : 'w-64 p-5'} bg-white dark:bg-slate-900/90 border-r border-slate-200 dark:border-slate-800/80 shrink-0 justify-between sticky top-0 h-screen z-30 transition-all duration-300 relative`}>
        <div>
          {/* Top Header Row with Logo & Collapse Toggle Arrow Button */}
          <div className="flex items-center justify-between mb-8 gap-2">
            {isSidebarCollapsed ? (
              /* When compressed, logo is removed and replaced by expand button */
              <button
                onClick={() => setIsSidebarCollapsed(false)}
                className="w-full py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 hover:text-slate-950 dark:hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-sm"
                title="Expand Menu Bar"
              >
                <PanelLeftOpen className="w-5 h-5 text-[#DFFF2F]" />
              </button>
            ) : (
              /* Expanded state: website logo, site name, details + collapse button */
              <>
                <div
                  onClick={() => onSelectTab('overview')}
                  className="flex items-center gap-3 cursor-pointer group overflow-hidden"
                  title={siteName}
                >
                  {siteIconUrl ? (
                    <img
                      src={siteIconUrl}
                      alt={siteName}
                      onError={(e) => { (e.target as HTMLImageElement).src = '/logo.png'; }}
                      className="w-10 h-10 rounded-xl object-cover shadow-md border-2 border-[#DFFF2F] group-hover:scale-105 transition-transform shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-2xl bg-[#DFFF2F] text-slate-900 flex items-center justify-center font-black shadow-md shrink-0">
                      <Activity className="w-5 h-5 stroke-[2.5]" />
                    </div>
                  )}
                  <div className="truncate">
                    <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-0.5 truncate">
                      {siteName}
                    </span>
                    <span className="block text-[9px] font-bold tracking-widest uppercase text-slate-400 -mt-0.5 truncate">
                      Ad Network Dashboard
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setIsSidebarCollapsed(true)}
                  className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-all cursor-pointer shadow-sm shrink-0"
                  title="Compress Menu Bar"
                >
                  <PanelLeftClose className="w-4 h-4" />
                </button>
              </>
            )}
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
                  title={item.label}
                  className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center p-3' : 'justify-between px-3.5 py-2.5'} rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#DFFF2F] text-slate-950 font-black shadow-md'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3 shrink-0">
                    <Icon className="w-4.5 h-4.5" />
                    {!isSidebarCollapsed && <span>{item.label}</span>}
                  </div>
                  {!isSidebarCollapsed && item.id === 'wallet' && user && (
                    <span className="text-[10px] font-mono font-extrabold px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 dark:text-[#DFFF2F]">
                      {formatMoney(user.walletBalance)}
                    </span>
                  )}
                  {!isSidebarCollapsed && item.id === 'admin' && (
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
          <div className={`p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center ${isSidebarCollapsed ? 'justify-center flex-col gap-2' : 'justify-between'}`}>
            <div className="flex items-center gap-2.5 overflow-hidden">
              <img
                src={user?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250"}
                alt={user?.fullName}
                className="w-8 h-8 rounded-xl object-cover shrink-0"
              />
              {!isSidebarCollapsed && (
                <div className="truncate">
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{user?.fullName}</p>
                  <p className="text-[10px] text-slate-400 truncate">{user ? formatMoney(user.walletBalance) : '$0.00'}</p>
                </div>
              )}
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
        </div>
      </aside>

      {/* Main Content Container */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header */}
        <header className="h-16 bg-white dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-20 backdrop-blur-md">
          {/* Mobile menu trigger & brand */}
          <div className="flex items-center gap-2.5 md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <div
              onClick={() => onSelectTab('overview')}
              className="flex items-center gap-2 cursor-pointer"
            >
              <img
                src={siteIconUrl}
                alt={siteName}
                onError={(e) => { (e.target as HTMLImageElement).src = '/logo.png'; }}
                className="w-8 h-8 rounded-lg object-cover border-2 border-[#DFFF2F] shadow-sm"
              />
              <span className="font-extrabold text-sm text-slate-900 dark:text-white tracking-tight">{siteName}</span>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-500">
            <span>Dashboard</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-slate-900 dark:text-white capitalize">{currentTab.replace('-', ' ')}</span>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            {/* Action: Launch Campaign Modal Prompt */}
            <button
              onClick={() => setLaunchModalOpen(true)}
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

        {/* Mobile Drop-Down Menu Bar (Appears and Animates from Top) */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <div className="md:hidden fixed inset-0 z-[99999]">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-slate-950/75 backdrop-blur-md"
                onClick={() => setMobileMenuOpen(false)}
              />
              {/* Animated Top Drop-Down Panel */}
              <motion.div
                initial={{ y: '-100%', opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: '-100%', opacity: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                className="relative w-full max-h-[90vh] bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 rounded-b-3xl p-6 shadow-2xl flex flex-col justify-between z-10 overflow-y-auto text-[#111827] dark:text-white"
              >
                <div>
                  <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 mb-6">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={siteIconUrl}
                        alt={siteName}
                        onError={(e) => { (e.target as HTMLImageElement).src = '/logo.png'; }}
                        className="w-8 h-8 rounded-lg object-cover border-2 border-[#DFFF2F]"
                      />
                      <span className="font-extrabold text-sm text-slate-900 dark:text-white">{siteName}</span>
                    </div>
                    <button
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-1.5">
                    {navItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = currentTab === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => { onSelectTab(item.id); setMobileMenuOpen(false); }}
                          className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                            isActive
                              ? 'bg-slate-900 text-white dark:bg-[#DFFF2F] dark:text-slate-950 shadow-md'
                              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Icon className="w-4 h-4" />
                            <span>{item.label}</span>
                          </div>
                          {item.id === 'wallet' && user && (
                            <span className="text-[10px] font-mono font-black px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[#DFFF2F]">
                              {formatMoney(user.walletBalance)}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3 mt-6">
                  <div className="flex justify-between items-center bg-slate-100 dark:bg-slate-800 p-3 rounded-xl text-xs font-bold">
                    <span>Display Currency</span>
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value as any)}
                      className="bg-transparent text-xs font-bold text-[#DFFF2F] focus:outline-none cursor-pointer"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="PKR">PKR (Rs)</option>
                      <option value="INR">INR (₹)</option>
                      <option value="BDT">BDT (৳)</option>
                    </select>
                  </div>
                  <button
                    onClick={() => { logout(); setMobileMenuOpen(false); onSelectTab('landing'); }}
                    className="w-full py-3 bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white font-bold rounded-2xl text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Launch Campaign Selector Modal */}
        {launchModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl relative animate-in zoom-in-95">
              <button
                onClick={() => setLaunchModalOpen(false)}
                className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white bg-slate-100 dark:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>

              <span className="inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-[#DFFF2F]/20 text-slate-900 dark:text-[#DFFF2F] mb-3">
                New Campaign Launcher
              </span>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">Choose Campaign Targeting</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-6">
                What type of campaign would you like to launch today?
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Traffic Campaign Option */}
                <button
                  onClick={() => {
                    setLaunchModalOpen(false);
                    onSelectTab('campaigns');
                  }}
                  className="p-5 rounded-2xl border-2 border-slate-200 dark:border-slate-800 hover:border-[#DFFF2F] bg-slate-50 dark:bg-slate-800/50 hover:bg-[#DFFF2F]/10 text-left transition-all group cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-900 dark:bg-[#DFFF2F] text-white dark:text-slate-950 flex items-center justify-center mb-3 font-bold group-hover:scale-110 transition-transform">
                    <Layers className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-black text-slate-900 dark:text-white group-hover:text-[#DFFF2F]">
                    Website Traffic
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    Organic website hits, GEO targeting, AdSense safe, custom CPM & daily limits.
                  </p>
                </button>

                {/* Social Ads Option */}
                <button
                  onClick={() => {
                    setLaunchModalOpen(false);
                    onSelectTab('social_ads');
                  }}
                  className="p-5 rounded-2xl border-2 border-slate-200 dark:border-slate-800 hover:border-[#DFFF2F] bg-slate-50 dark:bg-slate-800/50 hover:bg-[#DFFF2F]/10 text-left transition-all group cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center mb-3 font-bold group-hover:scale-110 transition-transform">
                    <Share2 className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-black text-slate-900 dark:text-white group-hover:text-[#DFFF2F]">
                    Social Ads (SMM)
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    Followers, Likes, Views & Watch Time for YouTube, TikTok, Instagram & Facebook.
                  </p>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Dynamic View Body */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {user?.isSuspended && (
            <div className="mb-6 p-5 bg-rose-500/10 border-2 border-rose-500/30 rounded-3xl text-rose-400 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-500 text-slate-950 font-black text-[10px] uppercase">
                    Account Suspended
                  </span>
                  <p className="font-extrabold text-sm text-white">Your TrafficSell Account is Currently Suspended</p>
                </div>
                <p className="text-xs text-rose-200">
                  Reason: <strong className="text-white">{user.suspendedReason || 'Terms or quality policy compliance review'}</strong>
                </p>
                <p className="text-[11px] text-slate-300">
                  While suspended, new campaign creation and balance withdrawals are disabled. You can appeal this decision by emailing our compliance team.
                </p>
              </div>

              <a
                href={`mailto:developershanawar@gmail.com?subject=Appeal%20Suspension%20-%20User%20${user.email}&body=Hello%20TrafficSell%20Compliance%20Team,%0A%0AI%20would%20like%20to%20appeal%20the%20suspension%20of%20my%20account%20(${user.email}).%0A%0AReason:%20${encodeURIComponent(user.suspendedReason || '')}%0A%0AThank%20you.`}
                className="py-2.5 px-5 bg-rose-500 hover:bg-rose-600 text-slate-950 font-black text-xs rounded-xl flex items-center gap-2 transition-all shrink-0 cursor-pointer shadow-md"
              >
                📩 Appeal Suspension via Email
              </a>
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  );
};
