import { UserProfile, Campaign, PaymentDeposit, WalletTransaction, SupportTicket, AppNotification, PlatformSettings } from '../types';

export const DEFAULT_SETTINGS: PlatformSettings = {
  minDeposit: 1.00,
  minCPM: 0.05,
  announcement: "🚀 Welcome to TrafficSell! Flash Promo: Get 10% bonus on deposits above $50 using USDT or JazzCash/EasyPaisa!",
  paymentAccounts: {
    jazzCashAccount: "0301-8899221",
    jazzCashTitle: "TrafficSell Corp",
    easyPaisaAccount: "0345-7722110",
    easyPaisaTitle: "TrafficSell Official",
    payPalEmail: "payments@trafficsell.com",
    usdtTrc20Address: "TQ9z8MvK4pL2x3n1Y8B5cV7w0qR1s2T3u4",
    usdtErc20Address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
    usdtBep20Address: "0x9522D8870F78A2359281716A5E5C9A7c8e9d10F2"
  }
};

export const INITIAL_USERS: UserProfile[] = [
  {
    id: 'usr_demo',
    email: 'demo@trafficsell.com',
    fullName: 'Alex Vance',
    telegram: '@alex_vance',
    whatsApp: '+1 555-0192',
    walletBalance: 245.80,
    role: 'user',
    createdAt: '2026-06-15T10:00:00Z',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'
  },
  {
    id: 'usr_admin',
    email: 'admin@trafficsell.com',
    fullName: 'TrafficSell Admin',
    telegram: '@trafficsell_official',
    whatsApp: '+1 800-872-334',
    walletBalance: 12500.00,
    role: 'admin',
    createdAt: '2026-01-01T00:00:00Z',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250'
  }
];

export const INITIAL_CAMPAIGNS: Campaign[] = [];

export const INITIAL_PAYMENTS: PaymentDeposit[] = [];

export const INITIAL_TRANSACTIONS: WalletTransaction[] = [];

export const INITIAL_TICKETS: SupportTicket[] = [];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [];
