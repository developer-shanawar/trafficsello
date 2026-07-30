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
import { SocialAdsSection } from './components/SocialAdsSection';
import { ToastContainer } from './components/ToastContainer';

import { OverviewView } from './components/dashboard/OverviewView';
import { BuyTrafficView } from './components/dashboard/BuyTrafficView';
import { CampaignsView } from './components/dashboard/CampaignsView';
import { WalletView } from './components/dashboard/WalletView';
import { AnalyticsView } from './components/dashboard/AnalyticsView';
import { SupportTicketsView } from './components/dashboard/SupportTicketsView';
import { ProfileView } from './components/dashboard/ProfileView';
import { SettingsView } from './components/dashboard/SettingsView';
import { ReferralView } from './components/dashboard/ReferralView';
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
    const iconUrl = platformSettings?.siteIconUrl || '/logo.png';
    const relTypes = ['icon', 'shortcut icon', 'apple-touch-icon'];
    relTypes.forEach((rel) => {
      let favicon = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;
      if (!favicon) {
        favicon = document.createElement('link');
        favicon.rel = rel;
        document.head.appendChild(favicon);
      }
      if (favicon.getAttribute('href') !== iconUrl) {
        favicon.href = iconUrl;
      }
    });
  }, [platformSettings?.siteName, platformSettings?.siteIconUrl]);

  // Route parser & hash listener with robust Fallback strategy for unknown routes
  React.useEffect(() => {
    const parseUrlRoute = () => {
      // Catch referral query parameter from URL
      const urlParams = new URLSearchParams(window.location.search);
      const refParam = urlParams.get('ref') || urlParams.get('referral') || urlParams.get('ref_id');
      if (refParam) {
        localStorage.setItem('trafficsell_ref', refParam.trim());
      }

      let rawPath = window.location.pathname.toLowerCase();
      let rawHash = window.location.hash.replace('#', '').replace('/', '').toLowerCase();

      // Normalize target route key from pathname or hash
      let routeKey = rawHash || rawPath.replace('/', '');

      // Sanitize standard path prefixes
      if (routeKey.startsWith('advertiser')) routeKey = 'overview';

      // If user comes via a referral link and is not logged in, take them to register page directly
      if (refParam && !user) {
        setCurrentView('register');
        return;
      }

      if (routeKey === '' || routeKey === 'landing' || routeKey === 'home') {
        setCurrentView('landing');
      } else if (routeKey === 'login') {
        if (user) {
          const savedTab = localStorage.getItem('trafficsell_last_tab') || 'overview';
          setCurrentView('dashboard');
          setDashboardTab(savedTab);
        } else {
          setCurrentView('login');
        }
      } else if (routeKey === 'register') {
        if (user) {
          const savedTab = localStorage.getItem('trafficsell_last_tab') || 'overview';
          setCurrentView('dashboard');
          setDashboardTab(savedTab);
        } else {
          setCurrentView('register');
        }
      } else if (routeKey === 'about-us' || routeKey === 'about') {
        setCurrentView('standalone-about');
      } else if (routeKey === 'privacy') {
        setCurrentView('standalone-privacy');
      } else if (routeKey === 'terms') {
        setCurrentView('standalone-terms');
      } else if (routeKey === 'refund') {
        setCurrentView('standalone-refund');
      } else if (routeKey === 'dashboard' || routeKey === 'overview') {
        if (user) {
          setCurrentView('dashboard');
          setDashboardTab('overview');
          localStorage.setItem('trafficsell_last_tab', 'overview');
        } else {
          setCurrentView('login');
        }
      } else if (routeKey === 'campaigns') {
        if (user) {
          setCurrentView('dashboard');
          setDashboardTab('campaigns');
          localStorage.setItem('trafficsell_last_tab', 'campaigns');
        } else {
          setCurrentView('login');
        }
      } else if (routeKey === 'buy-traffic' || routeKey === 'buy_traffic' || routeKey === 'buy') {
        if (user) {
          setCurrentView('dashboard');
          setDashboardTab('buy-traffic');
          localStorage.setItem('trafficsell_last_tab', 'buy-traffic');
        } else {
          setCurrentView('login');
        }
      } else if (routeKey === 'social-ads' || routeKey === 'social_ads' || routeKey === 'smm') {
        if (user) {
          setCurrentView('dashboard');
          setDashboardTab('social_ads');
          localStorage.setItem('trafficsell_last_tab', 'social_ads');
        } else {
          setCurrentView('login');
        }
      } else if (routeKey === 'wallet' || routeKey === 'deposit') {
        if (user) {
          setCurrentView('dashboard');
          setDashboardTab('wallet');
          localStorage.setItem('trafficsell_last_tab', 'wallet');
        } else {
          setCurrentView('login');
        }
      } else if (routeKey === 'referral' || routeKey === 'referrals') {
        if (user) {
          setCurrentView('dashboard');
          setDashboardTab('referrals');
          localStorage.setItem('trafficsell_last_tab', 'referrals');
        } else {
          setCurrentView('login');
        }
      } else if (routeKey === 'analytics') {
        if (user) {
          setCurrentView('dashboard');
          setDashboardTab('analytics');
          localStorage.setItem('trafficsell_last_tab', 'analytics');
        } else {
          setCurrentView('login');
        }
      } else if (routeKey === 'support') {
        if (user) {
          setCurrentView('dashboard');
          setDashboardTab('support');
          localStorage.setItem('trafficsell_last_tab', 'support');
        } else {
          setCurrentView('login');
        }
      } else if (routeKey === 'profile') {
        if (user) {
          setCurrentView('dashboard');
          setDashboardTab('profile');
          localStorage.setItem('trafficsell_last_tab', 'profile');
        } else {
          setCurrentView('login');
        }
      } else if (routeKey === 'settings') {
        if (user) {
          setCurrentView('dashboard');
          setDashboardTab('settings');
          localStorage.setItem('trafficsell_last_tab', 'settings');
        } else {
          setCurrentView('login');
        }
      } else if (routeKey === 'admin') {
        if (user) {
          setCurrentView('dashboard');
          setDashboardTab('admin');
          localStorage.setItem('trafficsell_last_tab', 'admin');
        } else {
          setCurrentView('login');
        }
      } else {
        // UNKNOWN ROUTE FALLBACK: Check saved tab or default safely
        if (user) {
          const savedTab = localStorage.getItem('trafficsell_last_tab') || 'overview';
          setCurrentView('dashboard');
          setDashboardTab(savedTab);
        } else {
          setCurrentView('landing');
        }
      }
    };

    parseUrlRoute();
    window.addEventListener('popstate', parseUrlRoute);
    window.addEventListener('hashchange', parseUrlRoute);
    return () => {
      window.removeEventListener('popstate', parseUrlRoute);
      window.removeEventListener('hashchange', parseUrlRoute);
    };
  }, [user]);

  // Clean navigation helper with history & hash sync
  const navigateToRoute = (view: string, tab?: string) => {
    setCurrentView(view);
    let targetHash = '';

    if (view === 'landing') {
      targetHash = '#/';
    } else if (view === 'login') {
      targetHash = '#/login';
    } else if (view === 'register') {
      targetHash = '#/register';
    } else if (view === 'standalone-about') {
      targetHash = '#/about';
    } else if (view === 'standalone-privacy') {
      targetHash = '#/privacy';
    } else if (view === 'standalone-terms') {
      targetHash = '#/terms';
    } else if (view === 'standalone-refund') {
      targetHash = '#/refund';
    } else if (view === 'dashboard' && tab) {
      setDashboardTab(tab);
      localStorage.setItem('trafficsell_last_tab', tab);
      targetHash = `#/${tab.replace('_', '-')}`;
    }

    try {
      window.location.hash = targetHash;
      if (window.history && window.history.pushState) {
        window.history.pushState(null, '', targetHash);
      }
    } catch (e) {
      window.location.hash = targetHash;
    }
  };

  const handleOpenAuth = (mode: 'login' | 'register') => {
    navigateToRoute(mode);
  };

  const handleNavigateView = (view: string) => {
    if (view === 'about') {
      navigateToRoute('standalone-about');
    } else if (view === 'privacy') {
      navigateToRoute('standalone-privacy');
    } else if (view === 'terms') {
      navigateToRoute('standalone-terms');
    } else if (view === 'refund') {
      navigateToRoute('standalone-refund');
    } else if (view === 'landing' || view === 'login' || view === 'register') {
      navigateToRoute(view);
    } else {
      if (!user) {
        navigateToRoute('login');
        return;
      }
      navigateToRoute('dashboard', view);
    }
  };

  const handleStartCalculatorCampaign = (details: any) => {
    if (!user) {
      navigateToRoute('register');
    } else {
      navigateToRoute('dashboard', 'campaigns');
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
              onNavigateHome={() => navigateToRoute('landing')}
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
              navigateToRoute('landing');
            } else {
              navigateToRoute('dashboard', tab);
            }
          }}
        >
          {dashboardTab === 'overview' && (
            <OverviewView
              onNavigate={(tab) => navigateToRoute('dashboard', tab)}
              onOpenReport={(cmp) => setReportCampaign(cmp)}
            />
          )}

          {dashboardTab === 'campaigns' && (
            <CampaignsView
              onNavigate={(tab) => navigateToRoute('dashboard', tab)}
              onOpenReport={(cmp) => setReportCampaign(cmp)}
            />
          )}

          {dashboardTab === 'buy-traffic' && (
            <BuyTrafficView
              onSuccess={() => navigateToRoute('dashboard', 'campaigns')}
              onGoDeposit={() => navigateToRoute('dashboard', 'wallet')}
            />
          )}

          {dashboardTab === 'social_ads' && <SocialAdsSection />}

          {dashboardTab === 'wallet' && <WalletView />}

          {(dashboardTab === 'referrals' || dashboardTab === 'referral') && <ReferralView />}

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

      {/* Toast Notification Container */}
      <ToastContainer />

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
