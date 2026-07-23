import React, { useState } from 'react';
import { StoreProvider, useStore } from './lib/store';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingPage } from './components/LandingPage';
import { LoginPage } from './components/LoginPage';
import { RegisterPage } from './components/RegisterPage';
import { AuthModal } from './components/AuthModal';
import { ReportModal } from './components/ReportModal';
import { LegalPages } from './components/LegalPages';
import { StandalonePage } from './components/StandalonePage';
import { DashboardLayout } from './components/DashboardLayout';

import { OverviewView } from './components/dashboard/OverviewView';
import { BuyTrafficView } from './components/dashboard/BuyTrafficView';
import { CampaignsView } from './components/dashboard/CampaignsView';
import { WalletView } from './components/dashboard/WalletView';
import { AnalyticsView } from './components/dashboard/AnalyticsView';
import { SupportTicketsView } from './components/dashboard/SupportTicketsView';
import { ProfileView } from './components/dashboard/ProfileView';
import { SettingsView } from './components/dashboard/SettingsView';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { Campaign } from './types';

function AppContent() {
  const { user, platformSettings } = useStore();

  const [currentView, setCurrentView] = useState<string>('landing');
  const [dashboardTab, setDashboardTab] = useState<string>('overview');

  // Modals state
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [reportCampaign, setReportCampaign] = useState<Campaign | null>(null);
  const [legalType, setLegalType] = useState<'privacy' | 'terms' | 'refund' | null>(null);

  // Sync favicon and document title with platformSettings siteIconUrl and siteName
  React.useEffect(() => {
    if (platformSettings?.siteName) {
      document.title = `${platformSettings.siteName} - Premium Organic & SmartLink Traffic Marketplace`;
    }
    if (platformSettings?.siteIconUrl) {
      let favicon = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
      if (!favicon) {
        favicon = document.createElement('link');
        favicon.rel = 'shortcut icon';
        document.getElementsByTagName('head')[0].appendChild(favicon);
      }
      favicon.href = platformSettings.siteIconUrl;
    }
  }, [platformSettings?.siteName, platformSettings?.siteIconUrl]);

  // Auto redirect on user signout
  React.useEffect(() => {
    if (!user && currentView === 'dashboard') {
      setCurrentView('landing');
      if (window.location.hash !== '#landing') {
        window.history.replaceState(null, '', '#landing');
      }
    }
  }, [user, currentView]);

  // SEO Friendly URL slug/hash sync
  React.useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      if (!hash || hash === 'landing' || hash === 'home') {
        setCurrentView('landing');
      } else if (hash === 'login') {
        setCurrentView('login');
      } else if (hash === 'register') {
        setCurrentView('register');
      } else if (hash === 'about') {
        setCurrentView('standalone-about');
      } else if (hash === 'privacy') {
        setCurrentView('standalone-privacy');
      } else if (hash === 'terms') {
        setCurrentView('standalone-terms');
      } else if (hash === 'refund') {
        setCurrentView('standalone-refund');
      } else if (hash === 'admin') {
        if (user) {
          setCurrentView('dashboard');
          setDashboardTab('admin');
        } else {
          setCurrentView('login');
        }
      } else if (['overview', 'buy-traffic', 'campaigns', 'wallet', 'analytics', 'support', 'profile', 'settings'].includes(hash)) {
        if (user) {
          setCurrentView('dashboard');
          setDashboardTab(hash);
        } else {
          setCurrentView('login');
        }
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [user]);

  // Update hash when view or tab changes
  const changeViewWithHash = (view: string, tab?: string) => {
    setCurrentView(view);
    if (view.startsWith('standalone-')) {
      const pageKey = view.replace('standalone-', '');
      window.history.pushState(null, '', `#${pageKey}`);
    } else if (view === 'landing' || view === 'login' || view === 'register' || view === 'about') {
      window.history.pushState(null, '', `#${view}`);
    } else if (view === 'dashboard' && tab) {
      setDashboardTab(tab);
      window.history.pushState(null, '', `#${tab}`);
    }
  };

  const handleOpenAuth = (mode: 'login' | 'register') => {
    changeViewWithHash(mode);
  };

  const handleNavigateView = (view: string) => {
    if (view === 'about') {
      changeViewWithHash('standalone-about');
    } else if (view === 'privacy') {
      changeViewWithHash('standalone-privacy');
    } else if (view === 'terms') {
      changeViewWithHash('standalone-terms');
    } else if (view === 'refund') {
      changeViewWithHash('standalone-refund');
    } else if (view === 'landing' || view === 'login' || view === 'register') {
      changeViewWithHash(view);
    } else {
      if (!user) {
        changeViewWithHash('login');
        return;
      }
      changeViewWithHash('dashboard', view);
    }
  };

  const handleStartCalculatorCampaign = (details: any) => {
    if (!user) {
      changeViewWithHash('register');
    } else {
      changeViewWithHash('dashboard', 'campaigns');
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#CFE7FF] dark:bg-[#0F172A] text-[#111827] dark:text-slate-100 selection:bg-[#DFFF2F] selection:text-[#111827] transition-colors duration-300">
      
      {/* Platform Global Announcement Bar */}
      <div className="bg-[#111827] text-white dark:bg-[#DFFF2F] dark:text-slate-950 px-4 py-2 text-xs font-bold text-center flex items-center justify-center gap-2 shadow-sm">
        <span>🚀 Flash Promo: Get 10% bonus on wallet deposits above $50 using JazzCash, EasyPaisa or USDT!</span>
      </div>

      {currentView === 'landing' ? (
        <div className="flex-1 flex flex-col">
          <Navbar
            onOpenAuth={handleOpenAuth}
            onNavigateView={handleNavigateView}
            currentView="landing"
          />

          <main className="flex-1">
            <LandingPage
              onGetStarted={() => {
                if (user) {
                  setCurrentView('dashboard');
                  setDashboardTab('campaigns');
                } else {
                  setCurrentView('register');
                }
              }}
              onViewPricing={() => {
                const el = document.getElementById('pricing');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              onStartCalculatorCampaign={handleStartCalculatorCampaign}
            />
          </main>

          <Footer onOpenLegal={(type) => handleNavigateView(type)} />
        </div>
      ) : currentView.startsWith('standalone-') ? (
        <div className="flex-1 flex flex-col">
          <Navbar
            onOpenAuth={handleOpenAuth}
            onNavigateView={handleNavigateView}
            currentView={currentView}
          />
          <main className="flex-1">
            <StandalonePage
              page={currentView.replace('standalone-', '') as 'about' | 'privacy' | 'terms' | 'refund'}
              onNavigateHome={() => changeViewWithHash('landing')}
            />
          </main>
          <Footer onOpenLegal={(type) => handleNavigateView(type)} />
        </div>
      ) : currentView === 'login' ? (
        <div className="flex-1 flex flex-col">
          <Navbar
            onOpenAuth={handleOpenAuth}
            onNavigateView={handleNavigateView}
            currentView="login"
          />
          <main className="flex-1 flex items-center justify-center">
            <LoginPage
              onNavigateHome={() => setCurrentView('landing')}
              onNavigateRegister={() => setCurrentView('register')}
              onLoginSuccess={() => {
                setCurrentView('dashboard');
                setDashboardTab('overview');
              }}
            />
          </main>
          <Footer onOpenLegal={(type) => handleNavigateView(type)} />
        </div>
      ) : currentView === 'register' ? (
        <div className="flex-1 flex flex-col">
          <Navbar
            onOpenAuth={handleOpenAuth}
            onNavigateView={handleNavigateView}
            currentView="register"
          />
          <main className="flex-1 flex items-center justify-center">
            <RegisterPage
              onNavigateHome={() => setCurrentView('landing')}
              onNavigateLogin={() => setCurrentView('login')}
              onRegisterSuccess={() => {
                setCurrentView('dashboard');
                setDashboardTab('overview');
              }}
            />
          </main>
          <Footer onOpenLegal={(type) => handleNavigateView(type)} />
        </div>
      ) : (
        <DashboardLayout
          currentTab={dashboardTab}
          onSelectTab={(tab) => {
            if (tab === 'landing') {
              setCurrentView('landing');
            } else {
              setDashboardTab(tab);
            }
          }}
        >
          {dashboardTab === 'overview' && (
            <OverviewView
              onNavigate={(tab) => setDashboardTab(tab)}
              onOpenReport={(cmp) => setReportCampaign(cmp)}
            />
          )}

          {(dashboardTab === 'campaigns' || dashboardTab === 'buy-traffic') && (
            <CampaignsView
              onNavigate={(tab) => setDashboardTab(tab)}
              onOpenReport={(cmp) => setReportCampaign(cmp)}
            />
          )}

          {dashboardTab === 'wallet' && <WalletView />}

          {dashboardTab === 'analytics' && <AnalyticsView />}

          {dashboardTab === 'support' && <SupportTicketsView />}

          {dashboardTab === 'profile' && <ProfileView />}

          {dashboardTab === 'settings' && <SettingsView />}

          {dashboardTab === 'admin' && <AdminDashboard />}
        </DashboardLayout>
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        initialMode={authModalMode}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={() => {
          setAuthModalOpen(false);
          setCurrentView('dashboard');
          setDashboardTab('overview');
        }}
      />

      {/* Campaign Report Modal */}
      <ReportModal
        campaign={reportCampaign}
        onClose={() => setReportCampaign(null)}
      />

      {/* Legal Overlay Modal */}
      <LegalPages
        type={legalType}
        onClose={() => setLegalType(null)}
      />
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
