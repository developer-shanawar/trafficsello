import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from './supabase';
import {
  UserProfile, Campaign, PaymentDeposit, WalletTransaction,
  SupportTicket, AppNotification, PlatformSettings, CampaignStatus, UserRole, Testimonial,
  SocialService, SocialCampaign, CurrencyCode, CurrencyConfig, ReferralRecord,
  WithdrawalMethod, WithdrawalRequest, CommissionIncreaseRequest
} from '../types';
import {
  DEFAULT_SETTINGS, INITIAL_USERS, INITIAL_CAMPAIGNS,
  INITIAL_PAYMENTS, INITIAL_TRANSACTIONS, INITIAL_TICKETS, INITIAL_NOTIFICATIONS, INITIAL_TESTIMONIALS,
  INITIAL_SOCIAL_SERVICES, INITIAL_SOCIAL_CAMPAIGNS, INITIAL_WITHDRAWALS, INITIAL_COMMISSION_REQUESTS
} from './initialData';
import { sendNativeNotification, triggerToast } from './notifications';

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  USD: { code: 'USD', symbol: '$', name: 'US Dollar ($)', rateVsUSD: 1 },
  PKR: { code: 'PKR', symbol: 'Rs. ', name: 'Pakistani Rupee (PKR)', rateVsUSD: 278.5 },
  INR: { code: 'INR', symbol: '₹', name: 'Indian Rupee (INR)', rateVsUSD: 83.5 },
  BDT: { code: 'BDT', symbol: '৳', name: 'Bangladeshi Taka (BDT)', rateVsUSD: 117.2 },
};

interface StoreContextType {
  user: UserProfile | null;
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
  formatMoney: (amountInUSD: number, customCode?: CurrencyCode) => string;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  login: (email: string, password?: string) => Promise<boolean>;
  register: (data: { fullName: string; email: string; password?: string; telegram?: string; whatsApp?: string }) => Promise<{ success: boolean; requiresEmailConfirmation: boolean; email: string }>;
  resendConfirmationEmail: (email: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  switchUserRole: (role: UserRole) => void;
  
  // Campaigns
  campaigns: Campaign[];
  addCampaign: (data: Omit<Campaign, 'id' | 'userId' | 'userName' | 'visitorsDelivered' | 'status' | 'createdAt'>) => Promise<{ success: boolean; message?: string }>;
  updateCampaignStatus: (id: string, status: CampaignStatus) => void;
  deleteCampaign: (id: string) => void;

  // Social Advertising
  socialServices: SocialService[];
  socialCampaigns: SocialCampaign[];
  addSocialService: (data: Omit<SocialService, 'id'>) => void;
  updateSocialService: (id: string, data: Partial<SocialService>) => void;
  deleteSocialService: (id: string) => void;
  addSocialCampaign: (data: { serviceId: string; targetLink: string; quantity: number }) => Promise<{ success: boolean; message?: string }>;
  updateSocialCampaignStatus: (id: string, status: SocialCampaign['status'], adminNote?: string) => void;
  deleteSocialCampaign: (id: string) => Promise<{ success: boolean; message?: string }>;

  // Payments & Wallet
  walletDeposits: PaymentDeposit[];
  requestDeposit: (data: Omit<PaymentDeposit, 'id' | 'userId' | 'userName' | 'userEmail' | 'status' | 'createdAt'>) => Promise<void>;
  approveDeposit: (depositId: string, adminNote?: string) => void;
  rejectDeposit: (depositId: string, adminNote?: string) => void;
  transactions: WalletTransaction[];

  // Support
  supportTickets: SupportTicket[];
  createTicket: (data: { subject: string; category: SupportTicket['category']; priority: SupportTicket['priority']; message: string }) => void;
  createTicketForUser: (userId: string, data: { subject: string; category: SupportTicket['category']; priority: SupportTicket['priority']; message: string }) => void;
  addTicketMessage: (ticketId: string, text: string) => void;
  updateTicketStatus: (ticketId: string, status: SupportTicket['status']) => void;

  // Notifications
  notifications: AppNotification[];
  markNotificationRead: (id: string) => void;
  sendAdminNotification: (data: { userId: string; title: string; message: string; type?: AppNotification['type'] }) => void;

  // Platform Settings & Pages Content
  platformSettings: PlatformSettings;
  updatePlatformSettings: (settings: PlatformSettings) => void;

  // Testimonials
  testimonials: Testimonial[];
  addTestimonial: (data: Omit<Testimonial, 'id' | 'createdAt'>) => void;
  updateTestimonial: (id: string, data: Partial<Testimonial>) => void;
  deleteTestimonial: (id: string) => void;

  // Profile & User Stats
  updateProfile: (data: Partial<UserProfile>) => void;
  allUsers: UserProfile[];
  updateUserBalanceByAdmin: (userId: string, newBalance: number) => void;
  toggleUserSuspension: (userId: string, isSuspended: boolean, reason?: string) => void;
  getUserStats: (userId: string) => {
    todayHits: number;
    yesterdayHits: number;
    activeCampaignsCount: number;
    totalSpent: number;
    currentBalance: number;
  };

  // Referral System & Withdrawals
  referrals: ReferralRecord[];
  withdrawalRequests: WithdrawalRequest[];
  commissionRequests: CommissionIncreaseRequest[];
  getReferralLink: (user?: UserProfile | null) => string;
  transferReferralToDeposit: (amount: number) => Promise<{ success: boolean; message: string }>;
  requestWithdrawal: (data: { amount: number; method: WithdrawalMethod; accountTitle?: string; accountNumber?: string; cryptoAddress?: string }) => Promise<{ success: boolean; message: string }>;
  approveWithdrawal: (id: string, adminNote?: string) => Promise<void>;
  rejectWithdrawal: (id: string, adminNote?: string) => Promise<void>;
  requestCommissionIncrease: (data: { requestedRate: number; referralsCount: number; message: string }) => Promise<{ success: boolean; message: string }>;
  approveCommissionIncrease: (id: string, customRate: number, adminNote?: string) => Promise<void>;
  rejectCommissionIncrease: (id: string, adminNote?: string) => Promise<void>;

  resetToInitialData: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Client IP state
  const [clientIp, setClientIp] = useState<string>('182.185.120.44');

  // Currency state
  const [currency, setCurrencyState] = useState<CurrencyCode>(() => {
    const saved = localStorage.getItem('trafficsell_currency');
    return (saved as CurrencyCode) || 'USD';
  });

  const setCurrency = (code: CurrencyCode) => {
    setCurrencyState(code);
    localStorage.setItem('trafficsell_currency', code);
    if (user) {
      setUser(prev => prev ? { ...prev, currency: code } : null);
      setAllUsers(prev => prev.map(u => u.id === user.id ? { ...u, currency: code } : u));
    }
  };

  const formatMoney = (amountInUSD: number, _customCode?: CurrencyCode): string => {
    const val = Number(amountInUSD) || 0;
    return `$${val.toFixed(2)}`;
  };

  // Theme state
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('trafficsell_theme');
    return (saved as 'dark' | 'light') || 'dark';
  });

  // Load state from localStorage or initial fallback
  const [allUsers, setAllUsers] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem('trafficsell_users');
    let usersList: UserProfile[] = saved ? JSON.parse(saved) : [];
    
    // Merge INITIAL_USERS to ensure all sample users exist
    const merged = [...usersList];
    for (const seedUser of INITIAL_USERS) {
      if (!merged.some(u => u.id === seedUser.id || u.email.toLowerCase() === seedUser.email.toLowerCase())) {
        merged.push(seedUser);
      }
    }
    return merged.length > 0 ? merged : INITIAL_USERS;
  });

  const [user, setUser] = useState<UserProfile | null>(() => {
    const savedActive = localStorage.getItem('trafficsell_active_user');
    if (savedActive) {
      try {
        return JSON.parse(savedActive);
      } catch (e) {
        // fallback
      }
    }
    return null; // Visitor mode by default
  });

  const [campaigns, setCampaigns] = useState<Campaign[]>(() => {
    const saved = localStorage.getItem('trafficsell_campaigns');
    let list: Campaign[] = saved ? JSON.parse(saved) : [];
    const merged = [...list];
    for (const seedCmp of INITIAL_CAMPAIGNS) {
      if (!merged.some(c => c.id === seedCmp.id)) {
        merged.push(seedCmp);
      }
    }
    return merged.length > 0 ? merged : INITIAL_CAMPAIGNS;
  });

  const [walletDeposits, setWalletDeposits] = useState<PaymentDeposit[]>(() => {
    const saved = localStorage.getItem('trafficsell_payments');
    let list: PaymentDeposit[] = saved ? JSON.parse(saved) : [];
    const merged = [...list];
    for (const seedDep of INITIAL_PAYMENTS) {
      if (!merged.some(p => p.id === seedDep.id)) {
        merged.push(seedDep);
      }
    }
    return merged.length > 0 ? merged : INITIAL_PAYMENTS;
  });

  const [transactions, setTransactions] = useState<WalletTransaction[]>(() => {
    const saved = localStorage.getItem('trafficsell_transactions');
    let list: WalletTransaction[] = saved ? JSON.parse(saved) : [];
    const merged = [...list];
    for (const seedTx of INITIAL_TRANSACTIONS) {
      if (!merged.some(t => t.id === seedTx.id)) {
        merged.push(seedTx);
      }
    }
    return merged.length > 0 ? merged : INITIAL_TRANSACTIONS;
  });

  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>(() => {
    const saved = localStorage.getItem('trafficsell_tickets');
    let list: SupportTicket[] = saved ? JSON.parse(saved) : [];
    const merged = [...list];
    for (const seedTkt of INITIAL_TICKETS) {
      if (!merged.some(t => t.id === seedTkt.id)) {
        merged.push(seedTkt);
      }
    }
    return merged.length > 0 ? merged : INITIAL_TICKETS;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('trafficsell_notifications');
    let list: AppNotification[] = saved ? JSON.parse(saved) : [];
    const merged = [...list];
    for (const seedNtf of INITIAL_NOTIFICATIONS) {
      if (!merged.some(n => n.id === seedNtf.id)) {
        merged.push(seedNtf);
      }
    }
    return merged.length > 0 ? merged : INITIAL_NOTIFICATIONS;
  });

  const [platformSettings, setPlatformSettings] = useState<PlatformSettings>(() => {
    const saved = localStorage.getItem('trafficsell_settings');
    if (saved !== null) {
      try {
        const parsed = JSON.parse(saved);
        if (!parsed.pageContent) {
          parsed.pageContent = DEFAULT_SETTINGS.pageContent;
        }
        if (!parsed.siteIconUrl || parsed.siteIconUrl.includes('unsplash.com') || parsed.siteIconUrl.includes('/src/assets/images')) {
          parsed.siteIconUrl = '/logo.png';
        }
        return parsed;
      } catch (e) {
        return DEFAULT_SETTINGS;
      }
    }
    return DEFAULT_SETTINGS;
  });

  const [testimonials, setTestimonials] = useState<Testimonial[]>(() => {
    const saved = localStorage.getItem('trafficsell_testimonials');
    return saved !== null ? JSON.parse(saved) : INITIAL_TESTIMONIALS;
  });

  const [socialServices, setSocialServices] = useState<SocialService[]>(() => {
    const saved = localStorage.getItem('trafficsell_social_services');
    return saved ? JSON.parse(saved) : INITIAL_SOCIAL_SERVICES;
  });

  const [socialCampaigns, setSocialCampaigns] = useState<SocialCampaign[]>(() => {
    const saved = localStorage.getItem('trafficsell_social_campaigns');
    return saved ? JSON.parse(saved) : INITIAL_SOCIAL_CAMPAIGNS;
  });

  const [referrals, setReferrals] = useState<ReferralRecord[]>(() => {
    const saved = localStorage.getItem('trafficsell_referrals');
    return saved ? JSON.parse(saved) : [];
  });

  const [withdrawalRequests, setWithdrawalRequests] = useState<WithdrawalRequest[]>(() => {
    const saved = localStorage.getItem('trafficsell_withdrawals');
    let list: WithdrawalRequest[] = saved ? JSON.parse(saved) : [];
    const merged = [...list];
    for (const seed of INITIAL_WITHDRAWALS) {
      if (!merged.some(w => w.id === seed.id)) {
        merged.push(seed);
      }
    }
    return merged.length > 0 ? merged : INITIAL_WITHDRAWALS;
  });

  const [commissionRequests, setCommissionRequests] = useState<CommissionIncreaseRequest[]>(() => {
    const saved = localStorage.getItem('trafficsell_commission_requests');
    let list: CommissionIncreaseRequest[] = saved ? JSON.parse(saved) : [];
    const merged = [...list];
    for (const seed of INITIAL_COMMISSION_REQUESTS) {
      if (!merged.some(c => c.id === seed.id)) {
        merged.push(seed);
      }
    }
    return merged.length > 0 ? merged : INITIAL_COMMISSION_REQUESTS;
  });

  useEffect(() => {
    localStorage.setItem('trafficsell_referrals', JSON.stringify(referrals));
  }, [referrals]);

  useEffect(() => {
    localStorage.setItem('trafficsell_withdrawals', JSON.stringify(withdrawalRequests));
  }, [withdrawalRequests]);

  useEffect(() => {
    localStorage.setItem('trafficsell_commission_requests', JSON.stringify(commissionRequests));
  }, [commissionRequests]);

  // Capture referral parameter from URL on load
  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      let refCode = urlParams.get('ref') || urlParams.get('ref_code') || urlParams.get('referrer');
      if (!refCode && window.location.hash.includes('ref=')) {
        const match = window.location.hash.match(/ref=([^&]+)/);
        if (match) refCode = match[1];
      }
      if (refCode) {
        const cleanRef = refCode.trim();
        localStorage.setItem('trafficsell_ref', cleanRef);
        console.log('📌 Captured referral parameter:', cleanRef);
      }
    } catch (e) {
      // ignore
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('trafficsell_testimonials', JSON.stringify(testimonials));
  }, [testimonials]);

  useEffect(() => {
    localStorage.setItem('trafficsell_social_services', JSON.stringify(socialServices));
  }, [socialServices]);

  useEffect(() => {
    localStorage.setItem('trafficsell_social_campaigns', JSON.stringify(socialCampaigns));
  }, [socialCampaigns]);

  // Sync site title and favicon icon tab from platformSettings
  useEffect(() => {
    if (platformSettings?.siteName) {
      document.title = `${platformSettings.siteName} - Website Traffic Marketplace & Ad Network`;
    }
    const iconUrl = platformSettings?.siteIconUrl || '/logo.png';
    const relTypes = ['icon', 'shortcut icon', 'apple-touch-icon'];
    relTypes.forEach((rel) => {
      let link: HTMLLinkElement | null = document.querySelector(`link[rel="${rel}"]`);
      if (!link) {
        link = document.createElement('link');
        link.rel = rel;
        document.head.appendChild(link);
      }
      link.href = iconUrl;
    });
  }, [platformSettings?.siteName, platformSettings?.siteIconUrl]);

  // Sync theme to localStorage and DOM
  useEffect(() => {
    localStorage.setItem('trafficsell_theme', theme);
    const root = document.documentElement;
    const body = document.body;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
      body.classList.add('dark');
      body.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
      body.classList.remove('dark');
      body.classList.add('light');
    }
  }, [theme]);

  // Load initial data from Supabase
  const loadSupabaseData = async () => {
    try {
      // 1. Users
      const { data: dbUsers } = await supabase.from('users').select('*');
      if (dbUsers && dbUsers.length > 0) {
        const mappedUsers: UserProfile[] = dbUsers.map(u => ({
          id: u.id,
          email: u.email,
          password: u.password || '',
          fullName: u.full_name || u.email,
          telegram: u.telegram || '',
          whatsApp: u.whats_app || u.whatsapp || '',
          walletBalance: Number(u.wallet_balance || 0),
          role: u.role || 'user',
          country: u.country || '',
          city: u.city || '',
          postalCode: u.postal_code || '',
          isVerified: u.is_verified ?? true,
          isSuspended: u.is_suspended ?? false,
          suspendedReason: u.suspended_reason || '',
          avatar: u.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250',
          createdAt: u.created_at || new Date().toISOString(),
          referralCode: u.referral_code || u.referral_id || `REF_${u.id.replace(/[^a-zA-Z0-9]/g, '').substring(0, 6).toUpperCase()}`,
          referredBy: u.referred_by || '',
          totalReferralEarnings: Number(u.total_referral_earnings || 0)
        }));
        setAllUsers(mappedUsers);

        if (user) {
          const refreshedUser = mappedUsers.find(u => u.id === user.id || u.email.toLowerCase() === user.email.toLowerCase());
          if (refreshedUser) {
            setUser(refreshedUser);
          }
        }
      }

      // 2. Campaigns
      const { data: dbCampaigns } = await supabase.from('campaigns').select('*');
      if (dbCampaigns && dbCampaigns.length > 0) {
        const mappedCamps: Campaign[] = dbCampaigns.map(c => ({
          id: c.id,
          userId: c.user_id,
          userName: c.user_name || 'Advertiser',
          name: c.name || 'Campaign',
          url: c.url,
          keywords: c.keywords || '',
          format: c.format || 'popup',
          country: c.country || 'Global',
          deviceType: c.device_type || 'both',
          visitorsTarget: Number(c.visitors_target || 100000),
          visitorsDelivered: Number(c.visitors_delivered || 0),
          cpm: Number(c.cpm || 0.05),
          budget: Number(c.budget || 5.00),
          status: c.status || 'pending',
          estimatedDeliveryHours: c.estimated_delivery_hours || 24,
          createdAt: c.created_at || new Date().toISOString()
        }));
        setCampaigns(mappedCamps);
      }

      // 3. Payment Deposits
      let { data: dbDeposits } = await supabase.from('payment_deposits').select('*');
      if (!dbDeposits || dbDeposits.length === 0) {
        const res = await supabase.from('deposits').select('*');
        if (res.data) dbDeposits = res.data;
      }
      if (dbDeposits && dbDeposits.length > 0) {
        const mappedDeposits: PaymentDeposit[] = dbDeposits.map(d => ({
          id: d.id,
          userId: d.user_id,
          userName: d.user_name || 'User',
          userEmail: d.user_email || '',
          method: d.method,
          amount: Number(d.amount),
          trxRef: d.trx_ref,
          screenshotUrl: d.screenshot_url || '',
          status: d.status || 'pending',
          adminNote: d.admin_note,
          createdAt: d.created_at || new Date().toISOString()
        }));
        setWalletDeposits(mappedDeposits);
      }

      // 4. Transactions
      const { data: dbTxs } = await supabase.from('transactions').select('*');
      if (dbTxs && dbTxs.length > 0) {
        const mappedTxs: WalletTransaction[] = dbTxs.map(t => ({
          id: t.id,
          userId: t.user_id,
          type: t.type,
          amount: Number(t.amount),
          description: t.description || '',
          status: t.status || 'completed',
          createdAt: t.created_at || new Date().toISOString()
        }));
        setTransactions(mappedTxs);
      }

      // 5. Support Tickets
      let { data: dbTickets } = await supabase.from('support_tickets').select('*');
      if (!dbTickets || dbTickets.length === 0) {
        const res = await supabase.from('tickets').select('*');
        if (res.data) dbTickets = res.data;
      }
      if (dbTickets && dbTickets.length > 0) {
        const mappedTickets: SupportTicket[] = dbTickets.map(t => ({
          id: t.id,
          userId: t.user_id,
          userName: t.user_name || 'User',
          userEmail: t.user_email || '',
          subject: t.subject,
          category: t.category || 'general',
          priority: t.priority || 'medium',
          status: t.status || 'open',
          createdAt: t.created_at || new Date().toISOString(),
          messages: Array.isArray(t.messages) ? t.messages : []
        }));
        setSupportTickets(mappedTickets);
      }

      // 6. Notifications
      const { data: dbNotifs } = await supabase.from('notifications').select('*');
      if (dbNotifs && dbNotifs.length > 0) {
        const mappedNotifs: AppNotification[] = dbNotifs.map(n => ({
          id: n.id,
          userId: n.user_id,
          title: n.title,
          message: n.message,
          type: n.type || 'system',
          read: Boolean(n.read),
          createdAt: n.created_at || new Date().toISOString()
        }));
        setNotifications(mappedNotifs);
      }

      // 7. Platform Settings
      const { data: dbSettings } = await supabase.from('platform_settings').select('*').limit(1);
      if (dbSettings && dbSettings.length > 0) {
        const s = dbSettings[0];
        setPlatformSettings({
          siteName: s.site_name || 'TrafficSell',
          siteIconUrl: s.site_icon_url || '/logo.svg',
          brandDisplayMode: s.brand_display_mode || 'both',
          minCPM: Number(s.default_cpm || 0.05),
          minDeposit: Number(s.min_deposit_amount || 10.00),
          announcement: DEFAULT_SETTINGS.announcement,
          paymentAccounts: {
            easyPaisaAccount: s.easypaisa_number || DEFAULT_SETTINGS.paymentAccounts.easyPaisaAccount,
            easyPaisaTitle: s.easypaisa_title || DEFAULT_SETTINGS.paymentAccounts.easyPaisaTitle,
            jazzCashAccount: s.jazzcash_number || DEFAULT_SETTINGS.paymentAccounts.jazzCashAccount,
            jazzCashTitle: s.jazzcash_title || DEFAULT_SETTINGS.paymentAccounts.jazzCashTitle,
            payPalEmail: DEFAULT_SETTINGS.paymentAccounts.payPalEmail,
            usdtTrc20Address: s.usdt_trc20_address || DEFAULT_SETTINGS.paymentAccounts.usdtTrc20Address,
            usdtErc20Address: DEFAULT_SETTINGS.paymentAccounts.usdtErc20Address,
            usdtBep20Address: DEFAULT_SETTINGS.paymentAccounts.usdtBep20Address,
          },
          pageContent: s.page_content || DEFAULT_SETTINGS.pageContent
        });
      }

      // 8. Testimonials
      const { data: dbTestimonials } = await supabase.from('testimonials').select('*');
      if (dbTestimonials && dbTestimonials.length > 0) {
        const mappedT: Testimonial[] = dbTestimonials.map(t => ({
          id: t.id,
          name: t.name,
          role: t.role || '',
          company: t.company || '',
          avatar: t.avatar || '',
          content: t.content,
          rating: Number(t.rating || 5),
          active: Boolean(t.active ?? true),
          createdAt: t.created_at || new Date().toISOString()
        }));
        setTestimonials(mappedT);
      }

      // 9. Social Services
      const { data: dbSocServices } = await supabase.from('social_services').select('*');
      if (dbSocServices && dbSocServices.length > 0) {
        const mappedServices: SocialService[] = dbSocServices.map(s => ({
          id: s.id,
          platform: s.platform,
          serviceName: s.service_name,
          serviceType: s.service_type,
          pricePer1000: Number(s.price_per_1000),
          minQuantity: Number(s.min_quantity || 100),
          maxQuantity: Number(s.max_quantity || 100000),
          estimatedMinutes: Number(s.estimated_minutes || 30),
          description: s.description || '',
          active: Boolean(s.active)
        }));
        setSocialServices(mappedServices);
      }

      // 10. Social Campaigns
      const { data: dbSocCampaigns } = await supabase.from('social_campaigns').select('*');
      if (dbSocCampaigns && dbSocCampaigns.length > 0) {
        const mappedSocCampaigns: SocialCampaign[] = dbSocCampaigns.map(c => ({
          id: c.id,
          userId: c.user_id,
          userName: c.user_name || 'User',
          serviceId: c.service_id,
          platform: c.platform,
          serviceName: c.service_name,
          targetLink: c.target_link,
          quantity: Number(c.quantity),
          pricePer1000: Number(c.price_per_1000),
          totalCost: Number(c.total_cost),
          estimatedMinutes: Number(c.estimated_minutes || 30),
          status: c.status || 'pending',
          adminNote: c.admin_note,
          createdAt: c.created_at || new Date().toISOString()
        }));
        setSocialCampaigns(mappedSocCampaigns);
      }

      // 11. Referrals
      const { data: dbRefs } = await supabase.from('referrals').select('*');
      if (dbRefs && dbRefs.length > 0) {
        const mappedRefs: ReferralRecord[] = dbRefs.map(r => ({
          id: r.id,
          referrerId: r.referrer_id,
          referredUserId: r.referred_user_id,
          referredUserName: r.referred_user_name || 'User',
          referredUserEmail: r.referred_user_email || '',
          depositAmount: Number(r.deposit_amount || 0),
          commissionAmount: Number(r.commission_amount || 0),
          createdAt: r.created_at || new Date().toISOString()
        }));
        setReferrals(mappedRefs);
      }
    } catch (err) {
      console.warn('Supabase initial load notice:', err);
    }
  };

  useEffect(() => {
    loadSupabaseData();

    // Set up Supabase Realtime listener for live sync across all tabs and users
    const realtimeChannel = supabase
      .channel('trafficsell-realtime-sync')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public'
        },
        (payload) => {
          console.log('⚡ Realtime update received from Supabase:', payload.table, payload.eventType);
          loadSupabaseData();
        }
      )
      .subscribe();

    // Set up Supabase Auth Listener to automatically verify user upon email confirmation link click
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('⚡ Supabase Auth Event:', event, session?.user?.email);

      if ((event === 'SIGNED_IN' || event === 'USER_UPDATED' || event === 'TOKEN_REFRESHED') && session?.user) {
        const authUser = session.user;
        const cleanEmail = authUser.email?.trim().toLowerCase();
        if (!cleanEmail) return;

        // Check if coming directly from confirmation link
        const isConfirmationLinkClick = window.location.hash.includes('access_token') ||
                                        window.location.search.includes('code=') ||
                                        window.location.hash.includes('type=signup') ||
                                        window.location.hash.includes('type=email_confirmation');

        // Query database table for user profile
        const { data: dbUsers } = await supabase.from('users').select('*').eq('email', cleanEmail);
        let userRecord = dbUsers && dbUsers.length > 0 ? dbUsers[0] : null;

        const isMasterAdmin = cleanEmail === 'developershanawar@gmail.com';
        const wasUnverifiedBefore = userRecord ? userRecord.is_verified === false : false;

        if (!userRecord) {
          const meta = authUser.user_metadata || {};
          const newProfile: UserProfile = {
            id: authUser.id || `usr_${Date.now()}`,
            email: cleanEmail,
            password: '',
            fullName: meta.full_name || cleanEmail.split('@')[0],
            telegram: meta.telegram || '',
            whatsApp: meta.whats_app || meta.whatsApp || '',
            walletBalance: 0.00,
            role: isMasterAdmin ? 'admin' : (meta.role || 'user'),
            createdAt: new Date().toISOString(),
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250',
            ipAddress: clientIp,
            registrationIp: clientIp,
            lastLoginIp: clientIp,
            isVerified: true,
            isSuspended: false
          };

          await supabase.from('users').upsert([{
            id: newProfile.id,
            email: newProfile.email,
            password: '',
            full_name: newProfile.fullName,
            telegram: newProfile.telegram,
            whats_app: newProfile.whatsApp,
            wallet_balance: 0,
            role: newProfile.role,
            avatar: newProfile.avatar,
            is_verified: true,
            is_suspended: false,
            created_at: newProfile.createdAt
          }], { onConflict: 'email' });

          userRecord = {
            id: newProfile.id,
            email: newProfile.email,
            full_name: newProfile.fullName,
            telegram: newProfile.telegram,
            whats_app: newProfile.whatsApp,
            wallet_balance: 0,
            role: newProfile.role,
            avatar: newProfile.avatar,
            is_verified: true,
            is_suspended: false,
            created_at: newProfile.createdAt
          };
        } else if (userRecord.is_verified === false) {
          // Mark account verified in Supabase
          await supabase.from('users').update({ is_verified: true }).eq('email', cleanEmail);
          userRecord.is_verified = true;
        }

        const activeProfile: UserProfile = {
          id: userRecord.id,
          email: userRecord.email,
          password: userRecord.password || '',
          fullName: userRecord.full_name || userRecord.email,
          telegram: userRecord.telegram || '',
          whatsApp: userRecord.whats_app || userRecord.whatsapp || '',
          walletBalance: Number(userRecord.wallet_balance || 0),
          role: isMasterAdmin ? 'admin' : (userRecord.role || 'user'),
          country: userRecord.country || '',
          city: userRecord.city || '',
          postalCode: userRecord.postal_code || '',
          isVerified: true,
          isSuspended: userRecord.is_suspended ?? false,
          suspendedReason: userRecord.suspended_reason || '',
          avatar: userRecord.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250',
          createdAt: userRecord.created_at || new Date().toISOString(),
          ipAddress: clientIp,
          lastLoginIp: clientIp,
          referralCode: userRecord.referral_code || userRecord.referral_id || `REF_${userRecord.id.replace(/[^a-zA-Z0-9]/g, '').substring(0, 6).toUpperCase()}`,
          referredBy: userRecord.referred_by || '',
          totalReferralEarnings: Number(userRecord.total_referral_earnings || 0)
        };

        setUser(activeProfile);
        setAllUsers(prev => [...prev.filter(u => u.id !== activeProfile.id), activeProfile]);

        // ONLY trigger account verified toast IF user actually clicked a confirmation link OR was unverified in DB, and hasn't been notified yet in this browser session
        if ((isConfirmationLinkClick || wasUnverifiedBefore) && !sessionStorage.getItem('trafficsell_email_verified_notified')) {
          triggerToast('🎉 Account Verified!', 'Your email has been confirmed successfully. Welcome to TrafficSell!', 'success');
          sessionStorage.setItem('trafficsell_email_verified_notified', 'true');
        }

        // Clean up verification hash/query params from URL
        if (window.location.hash.includes('access_token') || window.location.search.includes('code=')) {
          try {
            window.history.replaceState(null, '', window.location.pathname);
          } catch (e) {
            // ignore fallback
          }
        }
      }
    });

    return () => {
      supabase.removeChannel(realtimeChannel);
      authListener.subscription.unsubscribe();
    };
  }, [clientIp]);

  useEffect(() => {
    localStorage.setItem('trafficsell_users', JSON.stringify(allUsers));
  }, [allUsers]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('trafficsell_active_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('trafficsell_active_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('trafficsell_campaigns', JSON.stringify(campaigns));
  }, [campaigns]);

  useEffect(() => {
    localStorage.setItem('trafficsell_payments', JSON.stringify(walletDeposits));
  }, [walletDeposits]);

  useEffect(() => {
    localStorage.setItem('trafficsell_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('trafficsell_tickets', JSON.stringify(supportTickets));
  }, [supportTickets]);

  useEffect(() => {
    localStorage.setItem('trafficsell_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('trafficsell_settings', JSON.stringify(platformSettings));
  }, [platformSettings]);

  // Real-time Traffic Simulator Tick
  useEffect(() => {
    const interval = setInterval(() => {
      setCampaigns(prevCampaigns => {
        let updated = false;
        const newCampaigns = prevCampaigns.map(cmp => {
          if (cmp.status === 'running' && cmp.visitorsDelivered < cmp.visitorsTarget) {
            updated = true;
            const increment = Math.floor(Math.random() * 85) + 35; // deliver 35 - 120 visitors per tick
            const nextDelivered = Math.min(cmp.visitorsTarget, cmp.visitorsDelivered + increment);
            const isFinished = nextDelivered >= cmp.visitorsTarget;

            if (isFinished) {
              // Add completed notification
              const newNotification: AppNotification = {
                id: `ntf_${Date.now()}`,
                userId: cmp.userId,
                title: 'Campaign Complete 🎉',
                message: `Your campaign "${cmp.name}" has successfully reached its target of ${cmp.visitorsTarget.toLocaleString()} visitors!`,
                type: 'campaign',
                read: false,
                createdAt: new Date().toISOString()
              };
              setNotifications(prev => [newNotification, ...prev]);

              sendNativeNotification('TrafficSell Campaign Complete 🎉', `Your campaign "${cmp.name}" reached target ${cmp.visitorsTarget.toLocaleString()} visitors!`);
            }

            return {
              ...cmp,
              visitorsDelivered: nextDelivered,
              status: isFinished ? ('completed' as CampaignStatus) : cmp.status
            };
          }
          return cmp;
        });

        return updated ? newCampaigns : prevCampaigns;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  useEffect(() => {
    fetch('https://api.ipify.org?format=json')
      .then(res => res.json())
      .then(data => {
        if (data && data.ip) {
          setClientIp(data.ip);
          if (user) {
            setUser(prev => prev ? { ...prev, ipAddress: data.ip } : null);
            setAllUsers(prev => prev.map(u => u.id === user.id ? { ...u, ipAddress: data.ip } : u));
          }
        }
      })
      .catch(() => {
        // Fallback IP if external IP service is unreachable
      });
  }, []);

  const resendConfirmationEmail = async (email: string): Promise<{ success: boolean; message: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    try {
      const redirectUrl = window.location.origin;
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: cleanEmail,
        options: {
          emailRedirectTo: redirectUrl
        }
      });

      if (error) {
        throw error;
      }

      triggerToast('Confirmation Email Resent 📩', `A fresh verification link has been sent to ${cleanEmail}. Check your inbox or spam folder.`, 'success');
      return { success: true, message: `Verification link resent to ${cleanEmail}.` };
    } catch (err: any) {
      const msg = err.message || 'Failed to resend confirmation email';
      triggerToast('Resend Notice', msg, 'warning');
      return { success: false, message: msg };
    }
  };

  const login = async (email: string, password?: string): Promise<boolean> => {
    const isMasterAdmin = email.toLowerCase() === 'developershanawar@gmail.com';
    const cleanEmail = email.trim().toLowerCase();

    // 1. Try Supabase Auth signin if password provided
    if (password) {
      try {
        const { error: authErr } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password
        });
        if (authErr && authErr.message?.toLowerCase().includes('email not confirmed')) {
          throw new Error(`Email address not confirmed yet. Please check your inbox for the confirmation link sent to ${cleanEmail}.`);
        }
      } catch (authErr: any) {
        if (authErr.message?.toLowerCase().includes('not confirmed')) {
          throw authErr;
        }
        console.warn('Supabase Auth signin attempt:', authErr);
      }
    }

    // 2. Query Supabase users table
    const { data: dbUsers } = await supabase
      .from('users')
      .select('*')
      .eq('email', cleanEmail);

    let foundUser = dbUsers && dbUsers.length > 0 ? dbUsers[0] : null;

    if (!foundUser) {
      const localFound = allUsers.find(u => u.email.toLowerCase() === cleanEmail);
      if (localFound) {
        foundUser = {
          id: localFound.id,
          email: localFound.email,
          password: localFound.password,
          full_name: localFound.fullName,
          telegram: localFound.telegram,
          whats_app: localFound.whatsApp,
          wallet_balance: localFound.walletBalance,
          role: localFound.role,
          avatar: localFound.avatar,
          is_verified: localFound.isVerified,
          created_at: localFound.createdAt
        };
      }
    }

    if (!foundUser) {
      throw new Error(`No account found registered with email "${email}". Please register an account first.`);
    }

    if (foundUser.is_verified === false) {
      throw new Error(`Your email address (${foundUser.email}) is not verified yet. Please check your inbox for the confirmation link.`);
    }

    if (foundUser.password && password && foundUser.password !== password) {
      throw new Error('Invalid password. Please check your credentials and try again.');
    }

    const updatedFound: UserProfile = {
      id: foundUser.id,
      email: foundUser.email,
      password: foundUser.password || password || '',
      fullName: foundUser.full_name || foundUser.email,
      telegram: foundUser.telegram || '',
      whatsApp: foundUser.whats_app || foundUser.whatsapp || '',
      walletBalance: Number(foundUser.wallet_balance || 0),
      role: isMasterAdmin ? 'admin' : (foundUser.role || 'user'),
      country: foundUser.country || '',
      city: foundUser.city || '',
      postalCode: foundUser.postal_code || '',
      isVerified: true,
      isSuspended: foundUser.is_suspended ?? false,
      suspendedReason: foundUser.suspended_reason || '',
      avatar: foundUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250',
      createdAt: foundUser.created_at || new Date().toISOString(),
      ipAddress: clientIp,
      lastLoginIp: clientIp,
    };

    // Sync role and password in Supabase
    supabase.from('users').update({
      role: updatedFound.role,
      password: updatedFound.password,
      is_verified: true
    }).eq('id', updatedFound.id).then();

    setAllUsers(prev => [...prev.filter(u => u.id !== updatedFound.id), updatedFound]);
    setUser(updatedFound);
    return true;
  };

  const register = async (data: { fullName: string; email: string; password?: string; telegram?: string; whatsApp?: string; referralCode?: string }): Promise<{ success: boolean; requiresEmailConfirmation: boolean; email: string }> => {
    const isMasterAdmin = data.email.toLowerCase() === 'developershanawar@gmail.com';
    const cleanEmail = data.email.trim().toLowerCase();

    // Check existing user in Supabase
    const { data: dbUsers } = await supabase.from('users').select('*').eq('email', cleanEmail);
    if (dbUsers && dbUsers.length > 0 && dbUsers[0].is_verified !== false) {
      throw new Error(`An account with email "${data.email}" already exists. Please sign in instead.`);
    }

    let requiresConfirmation = true;

    // Try Supabase Auth Sign Up
    if (data.password) {
      try {
        const redirectUrl = window.location.origin;
        const { data: authData, error: authErr } = await supabase.auth.signUp({
          email: cleanEmail,
          password: data.password,
          options: {
            emailRedirectTo: redirectUrl,
            data: {
              full_name: data.fullName,
              telegram: data.telegram || '',
              whats_app: data.whatsApp || '',
              role: isMasterAdmin ? 'admin' : 'user'
            }
          }
        });

        if (authErr) {
          if (authErr.message?.toLowerCase().includes('already registered')) {
            throw new Error(`An account with email "${data.email}" is already registered. Please sign in.`);
          }
          console.warn('Supabase Auth signup notice:', authErr);
        }

        if (authData?.session || authData?.user?.email_confirmed_at) {
          requiresConfirmation = false;
        }
      } catch (authErr: any) {
        if (authErr.message?.toLowerCase().includes('already registered')) {
          throw authErr;
        }
        console.warn('Supabase Auth signup notice:', authErr);
      }
    }

    // Generate unique referral code & check provided or stored referrer
    const newRefCode = `REF_${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const targetRefCode = (data.referralCode || localStorage.getItem('trafficsell_ref') || '').trim();
    let referrerId = '';

    if (targetRefCode) {
      // 1. Check local state
      const foundReferrer = allUsers.find(
        u => u.id === targetRefCode ||
             (u.referralCode && u.referralCode.toLowerCase() === targetRefCode.toLowerCase()) ||
             u.email.toLowerCase() === targetRefCode.toLowerCase()
      );

      if (foundReferrer && foundReferrer.email.toLowerCase() !== cleanEmail) {
        referrerId = foundReferrer.id;
      } else {
        // 2. Query Supabase directly
        try {
          const { data: dbRefUser } = await supabase
            .from('users')
            .select('id, email')
            .or(`referral_code.ilike.${targetRefCode},id.eq.${targetRefCode},email.ilike.${targetRefCode}`)
            .limit(1);

          if (dbRefUser && dbRefUser.length > 0 && dbRefUser[0].email.toLowerCase() !== cleanEmail) {
            referrerId = dbRefUser[0].id;
          }
        } catch (e) {
          console.warn('Referrer lookup notice:', e);
        }
      }
    }

    const newUser: UserProfile = {
      id: `usr_${Date.now()}`,
      email: cleanEmail,
      password: data.password || '',
      fullName: data.fullName,
      telegram: data.telegram || '',
      whatsApp: data.whatsApp || '',
      walletBalance: 0.00,
      role: isMasterAdmin ? 'admin' : 'user',
      createdAt: new Date().toISOString(),
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250',
      ipAddress: clientIp,
      registrationIp: clientIp,
      lastLoginIp: clientIp,
      isVerified: !requiresConfirmation,
      isSuspended: false,
      referralCode: newRefCode,
      referredBy: referrerId,
      totalReferralEarnings: 0
    };

    const { error: dbErr } = await supabase.from('users').upsert([{
      id: newUser.id,
      email: newUser.email,
      password: newUser.password,
      full_name: newUser.fullName,
      telegram: newUser.telegram,
      whats_app: newUser.whatsApp,
      wallet_balance: newUser.walletBalance,
      role: newUser.role,
      avatar: newUser.avatar,
      is_verified: !requiresConfirmation,
      is_suspended: false,
      created_at: newUser.createdAt,
      referral_code: newUser.referralCode,
      referred_by: newUser.referredBy || null,
      total_referral_earnings: 0
    }], { onConflict: 'email' });

    if (dbErr) {
      console.error('Error creating user profile in Supabase:', dbErr);
    }

    setAllUsers(prev => [...prev.filter(u => u.email.toLowerCase() !== newUser.email.toLowerCase()), newUser]);

    if (!requiresConfirmation) {
      setUser(newUser);
    } else {
      triggerToast(
        'Confirmation Email Sent ✉️',
        `Verification email sent to ${cleanEmail}. Please click the confirmation link to complete registration.`,
        'info'
      );
    }

    return {
      success: true,
      requiresEmailConfirmation: requiresConfirmation,
      email: cleanEmail
    };
  };

  const logout = () => {
    setUser(null);
  };

  const switchUserRole = (role: UserRole) => {
    if (!user) return;
    const updatedUser = { ...user, role };
    setUser(updatedUser);
    setAllUsers(prev => prev.map(u => u.id === user.id ? updatedUser : u));
  };

  const addCampaign = async (data: Omit<Campaign, 'id' | 'userId' | 'userName' | 'visitorsDelivered' | 'status' | 'createdAt'>) => {
    if (!user) return { success: false, message: 'User not authenticated' };
    
    if (user.walletBalance < data.budget) {
      return {
        success: false,
        message: `Insufficient wallet balance (${user.walletBalance.toFixed(2)}). Required budget is ${data.budget.toFixed(2)}. Please deposit funds first.`
      };
    }

    // Deduct budget from user wallet balance
    const newBalance = user.walletBalance - data.budget;
    const updatedUser = { ...user, walletBalance: newBalance };
    setUser(updatedUser);
    setAllUsers(prev => prev.map(u => u.id === user.id ? updatedUser : u));

    // Update user balance in Supabase
    supabase.from('users').update({ wallet_balance: newBalance }).eq('id', user.id).then();

    // Create campaign - default status is pending admin approval (max 12 hours)
    const uniqueCampaignId = `CMP-${Math.floor(100000 + Math.random() * 900000)}-${Date.now().toString(36).toUpperCase()}`;
    const newCampaign: Campaign = {
      ...data,
      id: uniqueCampaignId,
      userId: user.id,
      userName: user.fullName,
      visitorsDelivered: 0,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    setCampaigns(prev => [newCampaign, ...prev]);

    // Insert campaign to Supabase
    supabase.from('campaigns').insert([{
      id: newCampaign.id,
      user_id: newCampaign.userId,
      user_name: newCampaign.userName,
      name: newCampaign.name,
      url: newCampaign.url,
      keywords: newCampaign.keywords,
      format: newCampaign.format,
      country: newCampaign.country,
      device_type: newCampaign.deviceType,
      visitors_target: newCampaign.visitorsTarget,
      visitors_delivered: newCampaign.visitorsDelivered,
      cpm: newCampaign.cpm,
      budget: newCampaign.budget,
      status: newCampaign.status,
      estimated_delivery_hours: newCampaign.estimatedDeliveryHours,
      created_at: newCampaign.createdAt
    }]).then(({ error }) => {
      if (error) console.error('Error inserting campaign into Supabase:', error);
    });

    // Add spend transaction log
    const newTx: WalletTransaction = {
      id: `tx_${Date.now()}`,
      userId: user.id,
      type: 'spend',
      amount: data.budget,
      description: `Campaign Order: ${data.name} (${data.visitorsTarget.toLocaleString()} visitors - Pending Review)`,
      status: 'completed',
      createdAt: new Date().toISOString()
    };

    setTransactions(prev => [newTx, ...prev]);

    // Insert transaction to Supabase
    supabase.from('transactions').insert([{
      id: newTx.id,
      user_id: newTx.userId,
      type: newTx.type,
      amount: newTx.amount,
      description: newTx.description,
      status: newTx.status,
      created_at: newTx.createdAt
    }]).then();

    // Add notification
    const newNotif: AppNotification = {
      id: `ntf_${Date.now()}`,
      userId: user.id,
      title: 'Campaign Order Submitted ⏳',
      message: `Your campaign "${data.name}" was created and submitted for admin review (Max approval time: 12 Hours).`,
      type: 'campaign',
      read: false,
      createdAt: new Date().toISOString()
    };
    setNotifications(prev => [newNotif, ...prev]);

    supabase.from('notifications').insert([{
      id: newNotif.id,
      user_id: newNotif.userId,
      title: newNotif.title,
      message: newNotif.message,
      type: newNotif.type,
      read: false,
      created_at: newNotif.createdAt
    }]).then();

    return { success: true };
  };

  const updateCampaignStatus = (id: string, status: CampaignStatus) => {
    setCampaigns(prev => prev.map(c => c.id === id ? { ...c, status } : c));
    supabase.from('campaigns').update({ status }).eq('id', id).then();
  };

  const deleteCampaign = (id: string) => {
    setCampaigns(prev => prev.filter(c => c.id !== id));
    supabase.from('campaigns').delete().eq('id', id).then();
  };

  const requestDeposit = async (data: Omit<PaymentDeposit, 'id' | 'userId' | 'userName' | 'userEmail' | 'status' | 'createdAt'>) => {
    if (!user) return;
    const newDeposit: PaymentDeposit = {
      ...data,
      id: `pay_${Date.now()}`,
      userId: user.id,
      userName: user.fullName,
      userEmail: user.email,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    setWalletDeposits(prev => [newDeposit, ...prev]);

    // Insert deposit to Supabase
    supabase.from('deposits').insert([{
      id: newDeposit.id,
      user_id: newDeposit.userId,
      user_name: newDeposit.userName,
      user_email: newDeposit.userEmail,
      method: newDeposit.method,
      amount: newDeposit.amount,
      trx_ref: newDeposit.trxRef,
      screenshot_url: newDeposit.screenshotUrl,
      status: newDeposit.status,
      created_at: newDeposit.createdAt
    }]).then(({ error }) => {
      if (error) console.error('Error inserting deposit to Supabase:', error);
    });

    // Notification
    const notif: AppNotification = {
      id: `ntf_${Date.now()}`,
      userId: user.id,
      title: 'Deposit Submitted 💳',
      message: `Your ${data.method} deposit request of $${data.amount.toFixed(2)} was submitted and is pending verification.`,
      type: 'payment',
      read: false,
      createdAt: new Date().toISOString()
    };
    setNotifications(prev => [notif, ...prev]);

    supabase.from('notifications').insert([{
      id: notif.id,
      user_id: notif.userId,
      title: notif.title,
      message: notif.message,
      type: notif.type,
      read: false,
      created_at: notif.createdAt
    }]).then();

    sendNativeNotification('TrafficSell Deposit Submitted 💳', `Your ${data.method} deposit request of $${data.amount.toFixed(2)} was submitted and is pending verification.`);
  };

  const approveDeposit = (depositId: string, adminNote?: string) => {
    const deposit = walletDeposits.find(p => p.id === depositId);
    if (!deposit || deposit.status !== 'pending') return;

    // 20% extra balance bonus calculation
    const bonusAmount = deposit.amount * 0.20;
    const totalCredited = deposit.amount + bonusAmount;

    // Update deposit status
    setWalletDeposits(prev => prev.map(p => p.id === depositId ? { ...p, status: 'approved', adminNote } : p));

    supabase.from('deposits').update({ status: 'approved', admin_note: adminNote }).eq('id', depositId).then();

    // Calculate updated balance for target user
    const targetUser = allUsers.find(u => u.id === deposit.userId);
    const prevBalance = targetUser ? targetUser.walletBalance : 0;
    const newBal = prevBalance + totalCredited;

    // Update user balance in local state
    setAllUsers(prev => prev.map(u => u.id === deposit.userId ? { ...u, walletBalance: newBal } : u));

    if (user && user.id === deposit.userId) {
      setUser(prev => prev ? { ...prev, walletBalance: newBal } : null);
    }

    // Persist new balance to Supabase users table
    supabase.from('users').update({ wallet_balance: newBal }).eq('id', deposit.userId).then(({ error }) => {
      if (error) console.error('Error updating user wallet_balance in Supabase:', error);
    });

    // Add completion transaction log
    const tx: WalletTransaction = {
      id: `tx_${Date.now()}`,
      userId: deposit.userId,
      type: 'deposit',
      amount: totalCredited,
      description: `${deposit.method} Deposit Approved: ${deposit.amount.toFixed(2)} + ${bonusAmount.toFixed(2)} (20% Extra Bonus)`,
      status: 'completed',
      createdAt: new Date().toISOString()
    };
    setTransactions(prev => [tx, ...prev]);

    supabase.from('transactions').insert([{
      id: tx.id,
      user_id: tx.userId,
      type: tx.type,
      amount: tx.amount,
      description: tx.description,
      status: tx.status,
      created_at: tx.createdAt
    }]).then();

    // Send notification
    const notif: AppNotification = {
      id: `ntf_${Date.now()}`,
      userId: deposit.userId,
      title: 'Deposit Approved! 🎉 (+20% Bonus Added)',
      message: `${deposit.amount.toFixed(2)} deposit + ${bonusAmount.toFixed(2)} (20% Extra Bonus) = ${totalCredited.toFixed(2)} has been credited to your TrafficSell wallet!`,
      type: 'payment',
      read: false,
      createdAt: new Date().toISOString()
    };
    setNotifications(prev => [notif, ...prev]);

    supabase.from('notifications').insert([{
      id: notif.id,
      user_id: notif.userId,
      title: notif.title,
      message: notif.message,
      type: notif.type,
      read: false,
      created_at: notif.createdAt
    }]).then();

    sendNativeNotification('TrafficSell Deposit Approved! 🎉', `$${deposit.amount.toFixed(2)} deposit + ${bonusAmount.toFixed(2)} bonus credited to your TrafficSell wallet!`);

    // --- REFERRAL COMMISSION PROCESSING ---
    if (targetUser && (targetUser.referredBy || (targetUser as any).referred_by)) {
      const referrerId = targetUser.referredBy || (targetUser as any).referred_by;
      const referrer = allUsers.find(u => u.id === referrerId || u.referralCode === referrerId);

      if (referrer && referrer.id !== targetUser.id) {
        const refRate = referrer.customReferralRate || 0.05;
        const refCommission = deposit.amount * refRate;
        const referrerNewRefBal = (referrer.referralBalance || 0) + refCommission;
        const referrerNewEarnings = (referrer.totalReferralEarnings || 0) + refCommission;

        // Update referrer in state
        setAllUsers(prev => prev.map(u => u.id === referrer.id ? {
          ...u,
          referralBalance: referrerNewRefBal,
          totalReferralEarnings: referrerNewEarnings
        } : u));

        if (user && user.id === referrer.id) {
          setUser(prev => prev ? {
            ...prev,
            referralBalance: referrerNewRefBal,
            totalReferralEarnings: referrerNewEarnings
          } : null);
        }

        // Persist to Supabase users table
        supabase.from('users').update({
          referral_balance: referrerNewRefBal,
          total_referral_earnings: referrerNewEarnings
        }).eq('id', referrer.id).then();

        // Add commission transaction log
        const refTx: WalletTransaction = {
          id: `tx_ref_${Date.now()}`,
          userId: referrer.id,
          type: 'referral_commission',
          amount: refCommission,
          description: `🎁 ${(refRate * 100).toFixed(0)}% Referral Commission from $${deposit.amount.toFixed(2)} deposit by ${deposit.userName}`,
          status: 'completed',
          createdAt: new Date().toISOString()
        };
        setTransactions(prev => [refTx, ...prev]);

        supabase.from('transactions').insert([{
          id: refTx.id,
          user_id: refTx.userId,
          type: refTx.type,
          amount: refTx.amount,
          description: refTx.description,
          status: refTx.status,
          created_at: refTx.createdAt
        }]).then();

        // Create Referral Record
        const refRecord: ReferralRecord = {
          id: `ref_${Date.now()}`,
          referrerId: referrer.id,
          referredUserId: targetUser.id,
          referredUserName: targetUser.fullName || deposit.userName,
          referredUserEmail: targetUser.email || deposit.userEmail,
          depositAmount: deposit.amount,
          commissionAmount: refCommission,
          createdAt: new Date().toISOString()
        };
        setReferrals(prev => [refRecord, ...prev]);

        supabase.from('referrals').insert([{
          id: refRecord.id,
          referrer_id: refRecord.referrerId,
          referred_user_id: refRecord.referredUserId,
          referred_user_name: refRecord.referredUserName,
          referred_user_email: refRecord.referredUserEmail,
          deposit_amount: refRecord.depositAmount,
          commission_amount: refRecord.commissionAmount,
          created_at: refRecord.createdAt
        }]).then();

        // Send App Notification to Referrer
        const refNotif: AppNotification = {
          id: `ntf_ref_${Date.now()}`,
          userId: referrer.id,
          title: '🎁 5% Referral Bonus Earned!',
          message: `You earned a $${refCommission.toFixed(2)} referral bonus (5%) from ${deposit.userName}'s deposit of $${deposit.amount.toFixed(2)}.`,
          type: 'payment',
          read: false,
          createdAt: new Date().toISOString()
        };
        setNotifications(prev => [refNotif, ...prev]);

        supabase.from('notifications').insert([{
          id: refNotif.id,
          user_id: refNotif.userId,
          title: refNotif.title,
          message: refNotif.message,
          type: refNotif.type,
          read: false,
          created_at: refNotif.createdAt
        }]).then();
      }
    }
  };

  const rejectDeposit = (depositId: string, adminNote?: string) => {
    const deposit = walletDeposits.find(p => p.id === depositId);
    if (!deposit) return;

    setWalletDeposits(prev => prev.map(p => p.id === depositId ? { ...p, status: 'rejected', adminNote } : p));

    supabase.from('deposits').update({ status: 'rejected', admin_note: adminNote }).eq('id', depositId).then();

    const notif: AppNotification = {
      id: `ntf_${Date.now()}`,
      userId: deposit.userId,
      title: 'Deposit Declined ⚠️',
      message: `Your deposit request of $${deposit.amount.toFixed(2)} was declined. Reason: ${adminNote || 'Transaction verification failed'}`,
      type: 'payment',
      read: false,
      createdAt: new Date().toISOString()
    };
    setNotifications(prev => [notif, ...prev]);

    supabase.from('notifications').insert([{
      id: notif.id,
      user_id: notif.userId,
      title: notif.title,
      message: notif.message,
      type: notif.type,
      read: false,
      created_at: notif.createdAt
    }]).then();

    sendNativeNotification('TrafficSell Deposit Declined ⚠️', `Deposit request of $${deposit.amount.toFixed(2)} was declined. ${adminNote ? 'Reason: ' + adminNote : ''}`);
  };

  const createTicket = (data: { subject: string; category: SupportTicket['category']; priority: SupportTicket['priority']; message: string }) => {
    if (!user) return;
    const newTicket: SupportTicket = {
      id: `tkt_${Date.now()}`,
      userId: user.id,
      userName: user.fullName,
      userEmail: user.email,
      subject: data.subject,
      category: data.category,
      priority: data.priority,
      status: 'open',
      createdAt: new Date().toISOString(),
      messages: [
        {
          id: `msg_${Date.now()}`,
          sender: 'user',
          senderName: user.fullName,
          text: data.message,
          createdAt: new Date().toISOString()
        }
      ]
    };

    setSupportTickets(prev => [newTicket, ...prev]);

    supabase.from('tickets').insert([{
      id: newTicket.id,
      user_id: newTicket.userId,
      user_name: newTicket.userName,
      user_email: newTicket.userEmail,
      subject: newTicket.subject,
      category: newTicket.category,
      priority: newTicket.priority,
      status: newTicket.status,
      created_at: newTicket.createdAt,
      messages: newTicket.messages
    }]).then(({ error }) => {
      if (error) console.error('Error inserting ticket to Supabase:', error);
    });
  };

  const createTicketForUser = (targetUserId: string, data: { subject: string; category: SupportTicket['category']; priority: SupportTicket['priority']; message: string }) => {
    const targetUser = allUsers.find(u => u.id === targetUserId);
    if (!targetUser) return;

    const newTicket: SupportTicket = {
      id: `tkt_${Date.now()}`,
      userId: targetUser.id,
      userName: targetUser.fullName,
      userEmail: targetUser.email,
      subject: data.subject,
      category: data.category,
      priority: data.priority,
      status: 'open',
      createdAt: new Date().toISOString(),
      messages: [
        {
          id: `msg_${Date.now()}`,
          sender: 'admin',
          senderName: user?.fullName || 'Support Desk',
          text: data.message,
          createdAt: new Date().toISOString()
        }
      ]
    };

    setSupportTickets(prev => [newTicket, ...prev]);

    supabase.from('tickets').insert([{
      id: newTicket.id,
      user_id: newTicket.userId,
      user_name: newTicket.userName,
      user_email: newTicket.userEmail,
      subject: newTicket.subject,
      category: newTicket.category,
      priority: newTicket.priority,
      status: newTicket.status,
      created_at: newTicket.createdAt,
      messages: newTicket.messages
    }]).then(({ error }) => {
      if (error) console.error('Error inserting ticket to Supabase:', error);
    });
  };

  const addTicketMessage = (ticketId: string, text: string) => {
    if (!user) return;
    const isUserAdmin = user.role === 'admin';
    const newMessage = {
      id: `msg_${Date.now()}`,
      sender: isUserAdmin ? ('admin' as const) : ('user' as const),
      senderName: user.fullName,
      text,
      createdAt: new Date().toISOString()
    };

    let updatedTicket: SupportTicket | null = null;

    setSupportTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        updatedTicket = {
          ...t,
          status: isUserAdmin ? 'in_progress' : t.status,
          messages: [...t.messages, newMessage]
        };
        return updatedTicket;
      }
      return t;
    }));

    setTimeout(() => {
      const ticketToSave = supportTickets.find(t => t.id === ticketId);
      const msgs = ticketToSave ? [...ticketToSave.messages, newMessage] : [newMessage];
      supabase.from('tickets').update({
        status: isUserAdmin ? 'in_progress' : undefined,
        messages: msgs
      }).eq('id', ticketId).then();
    }, 100);
  };

  const updateTicketStatus = (ticketId: string, status: SupportTicket['status']) => {
    setSupportTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status } : t));
    supabase.from('tickets').update({ status }).eq('id', ticketId).then();
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const sendAdminNotification = (dataOrUserId: any, titleArg?: string, messageArg?: string, typeArg?: AppNotification['type']) => {
    let targetUserId: string;
    let notifTitle: string;
    let notifMessage: string;
    let notifType: AppNotification['type'];

    if (typeof dataOrUserId === 'object' && dataOrUserId !== null) {
      targetUserId = dataOrUserId.userId;
      notifTitle = dataOrUserId.title;
      notifMessage = dataOrUserId.message;
      notifType = dataOrUserId.type || 'system';
    } else {
      targetUserId = dataOrUserId;
      notifTitle = titleArg || 'Notification';
      notifMessage = messageArg || '';
      notifType = typeArg || 'system';
    }

    if (targetUserId === 'all') {
      const newNotifs: AppNotification[] = allUsers.map(u => ({
        id: `ntf_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        userId: u.id,
        title: notifTitle,
        message: notifMessage,
        type: notifType,
        read: false,
        createdAt: new Date().toISOString()
      }));
      setNotifications(prev => [...newNotifs, ...prev]);
      sendNativeNotification(notifTitle, notifMessage);

      // Persist broadcast to Supabase
      const dbRows = newNotifs.map(n => ({
        id: n.id,
        user_id: n.userId,
        title: n.title,
        message: n.message,
        type: n.type,
        read: false,
        created_at: n.createdAt
      }));
      supabase.from('notifications').insert(dbRows).then(({ error }) => {
        if (error) console.error('Error inserting broadcast notifications to Supabase:', error);
      });
    } else {
      const newNotif: AppNotification = {
        id: `ntf_${Date.now()}`,
        userId: targetUserId,
        title: notifTitle,
        message: notifMessage,
        type: notifType,
        read: false,
        createdAt: new Date().toISOString()
      };
      setNotifications(prev => [newNotif, ...prev]);
      sendNativeNotification(notifTitle, notifMessage);

      // Persist to Supabase
      supabase.from('notifications').insert([{
        id: newNotif.id,
        user_id: newNotif.userId,
        title: newNotif.title,
        message: newNotif.message,
        type: newNotif.type,
        read: false,
        created_at: newNotif.createdAt
      }]).then(({ error }) => {
        if (error) console.error('Error inserting notification to Supabase:', error);
      });
    }
  };

  const updatePlatformSettings = (settings: PlatformSettings) => {
    setPlatformSettings(settings);
    try {
      localStorage.setItem('trafficsell_platform_settings', JSON.stringify(settings));
    } catch (e) {}

    supabase.from('platform_settings').upsert([{
      id: 'main',
      site_name: settings.siteName,
      site_icon_url: settings.siteIconUrl,
      brand_display_mode: settings.brandDisplayMode,
      default_cpm: settings.minCPM,
      min_deposit_amount: settings.minDeposit,
      easypaisa_number: settings.paymentAccounts?.easyPaisaAccount,
      easypaisa_title: settings.paymentAccounts?.easyPaisaTitle,
      jazzcash_number: settings.paymentAccounts?.jazzCashAccount,
      jazzcash_title: settings.paymentAccounts?.jazzCashTitle,
      usdt_trc20_address: settings.paymentAccounts?.usdtTrc20Address,
      page_content: settings.pageContent
    }]).then(({ error }) => {
      if (error) console.error('Error saving platform_settings to Supabase:', error);
    });
  };

  const addTestimonial = (data: Omit<Testimonial, 'id' | 'createdAt'>) => {
    const newT: Testimonial = {
      ...data,
      id: 'tstm_' + Date.now(),
      createdAt: new Date().toISOString()
    };
    setTestimonials(prev => [newT, ...prev]);
    supabase.from('testimonials').insert([{
      id: newT.id,
      name: newT.name,
      role: newT.role,
      company: newT.company,
      avatar: newT.avatar,
      content: newT.content,
      rating: newT.rating,
      active: newT.active,
      created_at: newT.createdAt
    }]).then();
  };

  const updateTestimonial = (id: string, data: Partial<Testimonial>) => {
    setTestimonials(prev => prev.map(t => t.id === id ? { ...t, ...data } : t));
    supabase.from('testimonials').update(data).eq('id', id).then();
  };

  const deleteTestimonial = (id: string) => {
    setTestimonials(prev => prev.filter(t => t.id !== id));
    supabase.from('testimonials').delete().eq('id', id).then();
  };

  // Social Ads Handlers
  const addSocialService = (data: Omit<SocialService, 'id'>) => {
    const newService: SocialService = {
      ...data,
      id: `soc_srv_${Date.now()}`
    };
    setSocialServices(prev => [newService, ...prev]);
    supabase.from('social_services').insert([{
      id: newService.id,
      platform: newService.platform,
      service_name: newService.serviceName,
      service_type: newService.serviceType,
      price_per_1000: newService.pricePer1000,
      min_quantity: newService.minQuantity,
      max_quantity: newService.maxQuantity,
      estimated_minutes: newService.estimatedMinutes,
      description: newService.description,
      active: newService.active
    }]).then();
  };

  const updateSocialService = (id: string, data: Partial<SocialService>) => {
    setSocialServices(prev => prev.map(s => s.id === id ? { ...s, ...data } : s));
    const payload: any = {};
    if (data.serviceName) payload.service_name = data.serviceName;
    if (data.pricePer1000 !== undefined) payload.price_per_1000 = data.pricePer1000;
    if (data.minQuantity !== undefined) payload.min_quantity = data.minQuantity;
    if (data.maxQuantity !== undefined) payload.max_quantity = data.maxQuantity;
    if (data.estimatedMinutes !== undefined) payload.estimated_minutes = data.estimatedMinutes;
    if (data.description !== undefined) payload.description = data.description;
    if (data.active !== undefined) payload.active = data.active;

    supabase.from('social_services').update(payload).eq('id', id).then();
  };

  const deleteSocialService = (id: string) => {
    setSocialServices(prev => prev.filter(s => s.id !== id));
    supabase.from('social_services').delete().eq('id', id).then();
  };

  const addSocialCampaign = async (data: { serviceId: string; targetLink: string; quantity: number }): Promise<{ success: boolean; message?: string }> => {
    if (!user) return { success: false, message: 'User not logged in.' };

    const service = socialServices.find(s => s.id === data.serviceId);
    if (!service) return { success: false, message: 'Selected social service not found.' };

    if (data.quantity < service.minQuantity || data.quantity > service.maxQuantity) {
      return { success: false, message: `Quantity must be between ${service.minQuantity.toLocaleString()} and ${service.maxQuantity.toLocaleString()}.` };
    }

    const totalCost = (data.quantity / 1000) * service.pricePer1000;
    if (user.walletBalance < totalCost) {
      return { success: false, message: `Insufficient wallet balance ($${user.walletBalance.toFixed(2)} available). You need $${totalCost.toFixed(2)} to place this order.` };
    }

    // Deduct cost from wallet balance
    const newBalance = user.walletBalance - totalCost;
    const updatedUser = { ...user, walletBalance: newBalance };
    setUser(updatedUser);
    setAllUsers(prev => prev.map(u => u.id === user.id ? updatedUser : u));
    supabase.from('users').update({ wallet_balance: newBalance }).eq('id', user.id).then();

    // Create transaction record
    const newTx: WalletTransaction = {
      id: `tx_${Date.now()}`,
      userId: user.id,
      type: 'spend',
      amount: totalCost,
      description: `Social Ad Order: ${data.quantity.toLocaleString()} ${service.serviceType} for ${service.platform}`,
      status: 'completed',
      createdAt: new Date().toISOString()
    };
    setTransactions(prev => [newTx, ...prev]);
    supabase.from('transactions').insert([{
      id: newTx.id,
      user_id: newTx.userId,
      type: newTx.type,
      amount: newTx.amount,
      description: newTx.description,
      status: newTx.status,
      created_at: newTx.createdAt
    }]).then();

    // Create social campaign with unique campaign ID
    const uniqueSocialId = `SMM-${Math.floor(100000 + Math.random() * 900000)}-${Date.now().toString(36).toUpperCase()}`;
    const newCmp: SocialCampaign = {
      id: uniqueSocialId,
      userId: user.id,
      userName: user.fullName || user.email,
      serviceId: service.id,
      platform: service.platform,
      serviceName: service.serviceName,
      targetLink: data.targetLink,
      quantity: data.quantity,
      pricePer1000: service.pricePer1000,
      totalCost,
      estimatedMinutes: service.estimatedMinutes,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    setSocialCampaigns(prev => [newCmp, ...prev]);
    supabase.from('social_campaigns').insert([{
      id: newCmp.id,
      user_id: newCmp.userId,
      user_name: newCmp.userName,
      service_id: newCmp.serviceId,
      platform: newCmp.platform,
      service_name: newCmp.serviceName,
      target_link: newCmp.targetLink,
      quantity: newCmp.quantity,
      price_per_1000: newCmp.pricePer1000,
      total_cost: newCmp.totalCost,
      estimated_minutes: newCmp.estimatedMinutes,
      status: newCmp.status,
      created_at: newCmp.createdAt
    }]).then();

    // Trigger Admin Native Notification
    sendNativeNotification('📲 New Social Ad Campaign!', `${user.fullName} ordered ${data.quantity.toLocaleString()} ${service.serviceType} for ${service.platform}`);

    return { success: true };
  };

  const updateSocialCampaignStatus = (id: string, status: SocialCampaign['status'], adminNote?: string) => {
    setSocialCampaigns(prev => prev.map(c => c.id === id ? { ...c, status, adminNote } : c));
    supabase.from('social_campaigns').update({ status, admin_note: adminNote }).eq('id', id).then();
  };

  const deleteSocialCampaign = async (id: string): Promise<{ success: boolean; message?: string }> => {
    const cmp = socialCampaigns.find(c => c.id === id);
    if (!cmp) return { success: false, message: 'Campaign not found' };

    if (cmp.status !== 'pending' && cmp.status !== 'cancelled') {
      return { success: false, message: 'You cannot delete or cancel an approved/active campaign. Please contact support.' };
    }

    // Refund user if pending
    if (cmp.status === 'pending' && user) {
      const newBalance = user.walletBalance + cmp.totalCost;
      const updatedUser = { ...user, walletBalance: newBalance };
      setUser(updatedUser);
      setAllUsers(prev => prev.map(u => u.id === user.id ? updatedUser : u));
      supabase.from('users').update({ wallet_balance: newBalance }).eq('id', user.id).then();

      // Add refund transaction
      const refundTx: WalletTransaction = {
        id: `tx_${Date.now()}`,
        userId: user.id,
        type: 'refund',
        amount: cmp.totalCost,
        description: `Refund for deleted Social Ad Campaign #${cmp.id}`,
        status: 'completed',
        createdAt: new Date().toISOString()
      };
      setTransactions(prev => [refundTx, ...prev]);
      supabase.from('transactions').insert([{
        id: refundTx.id,
        user_id: refundTx.userId,
        type: refundTx.type,
        amount: refundTx.amount,
        description: refundTx.description,
        status: refundTx.status,
        created_at: refundTx.createdAt
      }]).then();
    }

    setSocialCampaigns(prev => prev.filter(c => c.id !== id));
    supabase.from('social_campaigns').delete().eq('id', id).then();
    return { success: true };
  };

  const getUserStats = (userId: string) => {
    const userCampaigns = campaigns.filter(c => c.userId === userId);
    const activeCampaignsCount = userCampaigns.filter(c => c.status === 'running').length;
    
    const userSpends = transactions.filter(t => t.userId === userId && t.type === 'spend');
    const totalSpent = userSpends.reduce((acc, t) => acc + t.amount, 0);

    const totalDelivered = userCampaigns.reduce((acc, c) => acc + c.visitorsDelivered, 0);
    const todayHits = Math.round(totalDelivered * 0.45);
    const yesterdayHits = Math.round(totalDelivered * 0.35);

    const targetUser = allUsers.find(u => u.id === userId);
    const currentBalance = targetUser ? targetUser.walletBalance : 0;

    return {
      todayHits,
      yesterdayHits,
      activeCampaignsCount,
      totalSpent,
      currentBalance
    };
  };

  const updateProfile = (data: Partial<UserProfile>) => {
    if (!user) return;
    const merged = { ...user, ...data };
    
    // Profile is verified when name, email, country, city, postal code, and at least one contact method exist
    const hasName = Boolean(merged.fullName && merged.fullName.trim().length > 1);
    const hasEmail = Boolean(merged.email && merged.email.includes('@'));
    const hasContact = Boolean((merged.telegram && merged.telegram.trim().length > 0) || (merged.whatsApp && merged.whatsApp.trim().length > 0) || (merged.username && merged.username.trim().length > 0));
    const hasLocation = Boolean(merged.country && merged.city && merged.postalCode);

    const isVerified = hasName && hasEmail && hasContact && hasLocation;
    const updated = { ...merged, isVerified };

    setUser(updated);
    setAllUsers(prev => prev.map(u => u.id === user.id ? updated : u));

    supabase.from('users').update({
      full_name: updated.fullName,
      telegram: updated.telegram,
      whats_app: updated.whatsApp,
      country: updated.country,
      city: updated.city,
      postal_code: updated.postalCode,
      is_verified: updated.isVerified,
      avatar: updated.avatar
    }).eq('id', updated.id).then();
  };

  const updateUserBalanceByAdmin = (userId: string, newBalance: number) => {
    setAllUsers(prev => prev.map(u => u.id === userId ? { ...u, walletBalance: newBalance } : u));
    if (user && user.id === userId) {
      setUser(prev => prev ? { ...prev, walletBalance: newBalance } : null);
    }
    supabase.from('users').update({ wallet_balance: newBalance }).eq('id', userId).then();
  };

  const toggleUserSuspension = (userId: string, isSuspended: boolean, reason?: string) => {
    setAllUsers(prev => prev.map(u => u.id === userId ? { ...u, isSuspended, suspendedReason: reason } : u));
    if (user && user.id === userId) {
      setUser(prev => prev ? { ...prev, isSuspended, suspendedReason: reason } : null);
    }
    supabase.from('users').update({ is_suspended: isSuspended }).eq('id', userId).then();
  };

  const transferReferralToDeposit = async (amount: number): Promise<{ success: boolean; message: string }> => {
    if (!user) return { success: false, message: 'Please log in first.' };
    const currentRefBal = user.referralBalance || 0;
    if (amount <= 0 || amount > currentRefBal) {
      return { success: false, message: `Insufficient referral balance. Available: $${currentRefBal.toFixed(2)}` };
    }

    const newRefBal = currentRefBal - amount;
    const newWalletBal = (user.walletBalance || 0) + amount;

    const updatedUser = {
      ...user,
      referralBalance: newRefBal,
      walletBalance: newWalletBal
    };

    setUser(updatedUser);
    setAllUsers(prev => prev.map(u => u.id === user.id ? updatedUser : u));

    // Transaction log
    const tx: WalletTransaction = {
      id: `tx_trf_${Date.now()}`,
      userId: user.id,
      type: 'referral_transfer',
      amount,
      description: `🔄 Instant Transfer from Referral Balance to Wallet Deposit Balance`,
      status: 'completed',
      createdAt: new Date().toISOString()
    };
    setTransactions(prev => [tx, ...prev]);

    // Supabase update
    supabase.from('users').update({
      wallet_balance: newWalletBal,
      referral_balance: newRefBal
    }).eq('id', user.id).then();

    triggerToast('Balance Transferred! 🚀', `$${amount.toFixed(2)} has been added to your Deposit Wallet. You can now use it for advertising!`, 'success');
    return { success: true, message: 'Successfully transferred referral earnings to deposit balance!' };
  };

  const requestWithdrawal = async (data: {
    amount: number;
    method: WithdrawalMethod;
    accountTitle?: string;
    accountNumber?: string;
    cryptoAddress?: string;
  }): Promise<{ success: boolean; message: string }> => {
    if (!user) return { success: false, message: 'Please log in to request a withdrawal.' };
    if (data.amount < 1.00) {
      return { success: false, message: 'Minimum withdrawal amount is $1.00 USD.' };
    }

    const currentRefBal = user.referralBalance || 0;
    if (data.amount > currentRefBal) {
      return { success: false, message: `Insufficient referral balance. Available: $${currentRefBal.toFixed(2)}` };
    }

    // Deduct from referral balance during pending request
    const newRefBal = currentRefBal - data.amount;
    const updatedUser = { ...user, referralBalance: newRefBal };
    setUser(updatedUser);
    setAllUsers(prev => prev.map(u => u.id === user.id ? updatedUser : u));

    const reqId = `wth_${Date.now()}`;
    const newRequest: WithdrawalRequest = {
      id: reqId,
      userId: user.id,
      userName: user.fullName || 'User',
      userEmail: user.email,
      amount: data.amount,
      method: data.method,
      accountTitle: data.accountTitle,
      accountNumber: data.accountNumber,
      cryptoAddress: data.cryptoAddress,
      status: 'in review',
      createdAt: new Date().toISOString()
    };

    setWithdrawalRequests(prev => [newRequest, ...prev]);

    // Add transaction record
    const tx: WalletTransaction = {
      id: `tx_wth_${Date.now()}`,
      userId: user.id,
      type: 'withdrawal',
      amount: data.amount,
      description: `💸 Referral Withdrawal via ${data.method} (${data.accountNumber || data.cryptoAddress || data.accountTitle || ''})`,
      status: 'in review',
      createdAt: new Date().toISOString()
    };
    setTransactions(prev => [tx, ...prev]);

    // Notification
    const notif: AppNotification = {
      id: `ntf_${Date.now()}`,
      userId: user.id,
      title: 'Withdrawal Request Submitted ⏳',
      message: `Your $${data.amount.toFixed(2)} withdrawal via ${data.method} is now in review. Our admin team will process it shortly.`,
      type: 'payment',
      read: false,
      createdAt: new Date().toISOString()
    };
    setNotifications(prev => [notif, ...prev]);

    // Sync to Supabase
    supabase.from('users').update({ referral_balance: newRefBal }).eq('id', user.id).then();
    supabase.from('withdrawal_requests').insert([{
      id: newRequest.id,
      user_id: newRequest.userId,
      user_name: newRequest.userName,
      user_email: newRequest.userEmail,
      amount: newRequest.amount,
      method: newRequest.method,
      account_title: newRequest.accountTitle,
      account_number: newRequest.accountNumber,
      crypto_address: newRequest.cryptoAddress,
      status: newRequest.status,
      created_at: newRequest.createdAt
    }]).then();

    triggerToast('Withdrawal Requested! 💸', `$${data.amount.toFixed(2)} via ${data.method} is now in review by Admin.`, 'success');
    return { success: true, message: 'Withdrawal request submitted successfully.' };
  };

  const approveWithdrawal = async (id: string, adminNote?: string) => {
    const req = withdrawalRequests.find(w => w.id === id);
    if (!req) return;

    setWithdrawalRequests(prev => prev.map(w => w.id === id ? { ...w, status: 'approved', adminNote } : w));

    // Update transaction status
    setTransactions(prev => prev.map(t => {
      if (t.userId === req.userId && t.type === 'withdrawal' && Math.abs(t.amount - req.amount) < 0.01 && t.status === 'in review') {
        return { ...t, status: 'completed' };
      }
      return t;
    }));

    // Notification
    const notif: AppNotification = {
      id: `ntf_${Date.now()}`,
      userId: req.userId,
      title: 'Withdrawal Approved & Paid! 🎉',
      message: `Your withdrawal of $${req.amount.toFixed(2)} via ${req.method} has been sent! ${adminNote ? 'Note: ' + adminNote : ''}`,
      type: 'payment',
      read: false,
      createdAt: new Date().toISOString()
    };
    setNotifications(prev => [notif, ...prev]);

    triggerToast('Withdrawal Approved! ✅', `$${req.amount.toFixed(2)} payout sent to ${req.userName}`, 'success');
    supabase.from('withdrawal_requests').update({ status: 'approved', admin_note: adminNote }).eq('id', id).then();
  };

  const rejectWithdrawal = async (id: string, adminNote?: string) => {
    const req = withdrawalRequests.find(w => w.id === id);
    if (!req) return;

    setWithdrawalRequests(prev => prev.map(w => w.id === id ? { ...w, status: 'rejected', adminNote } : w));

    // Refund back to user's referral balance
    setAllUsers(prev => prev.map(u => {
      if (u.id === req.userId) {
        const newRefBal = (u.referralBalance || 0) + req.amount;
        return { ...u, referralBalance: newRefBal };
      }
      return u;
    }));

    if (user && user.id === req.userId) {
      setUser(prev => prev ? { ...prev, referralBalance: (prev.referralBalance || 0) + req.amount } : null);
    }

    // Update transaction
    setTransactions(prev => prev.map(t => {
      if (t.userId === req.userId && t.type === 'withdrawal' && Math.abs(t.amount - req.amount) < 0.01 && t.status === 'in review') {
        return { ...t, status: 'rejected' };
      }
      return t;
    }));

    // Notification
    const notif: AppNotification = {
      id: `ntf_${Date.now()}`,
      userId: req.userId,
      title: 'Withdrawal Request Rejected',
      message: `Your $${req.amount.toFixed(2)} withdrawal request was rejected and refunded back to your Referral Balance. Reason: ${adminNote || 'Invalid account details.'}`,
      type: 'payment',
      read: false,
      createdAt: new Date().toISOString()
    };
    setNotifications(prev => [notif, ...prev]);

    const targetU = allUsers.find(u => u.id === req.userId);
    if (targetU) {
      const newBal = (targetU.referralBalance || 0) + req.amount;
      supabase.from('users').update({ referral_balance: newBal }).eq('id', req.userId).then();
    }
    supabase.from('withdrawal_requests').update({ status: 'rejected', admin_note: adminNote }).eq('id', id).then();
    triggerToast('Withdrawal Rejected', `Refunded $${req.amount.toFixed(2)} back to user's referral balance.`, 'info');
  };

  const requestCommissionIncrease = async (data: {
    requestedRate: number;
    referralsCount: number;
    message: string;
  }): Promise<{ success: boolean; message: string }> => {
    if (!user) return { success: false, message: 'Please log in first.' };

    const req: CommissionIncreaseRequest = {
      id: `cmreq_${Date.now()}`,
      userId: user.id,
      userName: user.fullName || 'User',
      userEmail: user.email,
      referralsCount: data.referralsCount,
      requestedRate: data.requestedRate,
      message: data.message,
      status: 'in review',
      createdAt: new Date().toISOString()
    };

    setCommissionRequests(prev => [req, ...prev]);

    triggerToast('Request Submitted! 🚀', `Your application for ${data.requestedRate}% commission rate is now in review by Admin.`, 'success');
    return { success: true, message: 'Request submitted successfully.' };
  };

  const approveCommissionIncrease = async (id: string, customRate: number, adminNote?: string) => {
    const req = commissionRequests.find(c => c.id === id);
    if (!req) return;

    setCommissionRequests(prev => prev.map(c => c.id === id ? { ...c, status: 'approved', adminNote } : c));

    // Set user's custom referral rate (e.g. customRate = 8 => 0.08)
    const rateMultiplier = customRate / 100;
    setAllUsers(prev => prev.map(u => u.id === req.userId ? { ...u, customReferralRate: rateMultiplier } : u));
    if (user && user.id === req.userId) {
      setUser(prev => prev ? { ...prev, customReferralRate: rateMultiplier } : null);
    }

    const notif: AppNotification = {
      id: `ntf_${Date.now()}`,
      userId: req.userId,
      title: 'Commission Rate Increased! 🎉',
      message: `Congratulations! Your referral commission rate has been upgraded to ${customRate}% on all invited deposits!`,
      type: 'system',
      read: false,
      createdAt: new Date().toISOString()
    };
    setNotifications(prev => [notif, ...prev]);

    supabase.from('users').update({ custom_referral_rate: rateMultiplier }).eq('id', req.userId).then();
    triggerToast('Commission Approved! 🎉', `Updated ${req.userName}'s commission rate to ${customRate}%.`, 'success');
  };

  const rejectCommissionIncrease = async (id: string, adminNote?: string) => {
    const req = commissionRequests.find(c => c.id === id);
    if (!req) return;

    setCommissionRequests(prev => prev.map(c => c.id === id ? { ...c, status: 'rejected', adminNote } : c));

    const notif: AppNotification = {
      id: `ntf_${Date.now()}`,
      userId: req.userId,
      title: 'Commission Rate Increase Update',
      message: `Your request for ${req.requestedRate}% commission rate was not approved at this time. ${adminNote ? 'Note: ' + adminNote : ''}`,
      type: 'system',
      read: false,
      createdAt: new Date().toISOString()
    };
    setNotifications(prev => [notif, ...prev]);

    triggerToast('Request Rejected', `Commission increase request for ${req.userName} rejected.`, 'info');
  };

  const getReferralLink = (targetUser?: UserProfile | null) => {
    const u = targetUser || user;
    if (!u) return `${window.location.origin}/?ref=join`;
    const code = u.referralCode || u.id;
    return `${window.location.origin}/?ref=${code}`;
  };

  const resetToInitialData = () => {
    setAllUsers(INITIAL_USERS);
    setCampaigns(INITIAL_CAMPAIGNS);
    setWalletDeposits(INITIAL_PAYMENTS);
    setTransactions(INITIAL_TRANSACTIONS);
    setSupportTickets(INITIAL_TICKETS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setTestimonials(INITIAL_TESTIMONIALS);
    setPlatformSettings(DEFAULT_SETTINGS);
    setReferrals([]);
    setWithdrawalRequests(INITIAL_WITHDRAWALS);
    setCommissionRequests(INITIAL_COMMISSION_REQUESTS);
    localStorage.setItem('trafficsell_users', JSON.stringify(INITIAL_USERS));
    localStorage.setItem('trafficsell_campaigns', JSON.stringify(INITIAL_CAMPAIGNS));
    localStorage.setItem('trafficsell_payments', JSON.stringify(INITIAL_PAYMENTS));
    localStorage.setItem('trafficsell_transactions', JSON.stringify(INITIAL_TRANSACTIONS));
    localStorage.setItem('trafficsell_tickets', JSON.stringify(INITIAL_TICKETS));
    localStorage.setItem('trafficsell_notifications', JSON.stringify(INITIAL_NOTIFICATIONS));
    localStorage.setItem('trafficsell_testimonials', JSON.stringify(INITIAL_TESTIMONIALS));
    localStorage.setItem('trafficsell_settings', JSON.stringify(DEFAULT_SETTINGS));
    localStorage.setItem('trafficsell_withdrawals', JSON.stringify(INITIAL_WITHDRAWALS));
    localStorage.setItem('trafficsell_commission_requests', JSON.stringify(INITIAL_COMMISSION_REQUESTS));
    localStorage.removeItem('trafficsell_referrals');
  };

  return (
    <StoreContext.Provider value={{
      user, currency, setCurrency, formatMoney, theme, toggleTheme, login, register, resendConfirmationEmail, logout, switchUserRole,
      campaigns, addCampaign, updateCampaignStatus, deleteCampaign,
      socialServices, socialCampaigns, addSocialService, updateSocialService, deleteSocialService,
      addSocialCampaign, updateSocialCampaignStatus, deleteSocialCampaign,
      walletDeposits, requestDeposit, approveDeposit, rejectDeposit, transactions,
      supportTickets, createTicket, createTicketForUser, addTicketMessage, updateTicketStatus,
      notifications, markNotificationRead, sendAdminNotification,
      platformSettings, updatePlatformSettings,
      testimonials, addTestimonial, updateTestimonial, deleteTestimonial,
      updateProfile, allUsers, updateUserBalanceByAdmin, toggleUserSuspension, getUserStats,
      referrals, withdrawalRequests, commissionRequests, getReferralLink,
      transferReferralToDeposit, requestWithdrawal, approveWithdrawal, rejectWithdrawal,
      requestCommissionIncrease, approveCommissionIncrease, rejectCommissionIncrease,
      resetToInitialData
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
