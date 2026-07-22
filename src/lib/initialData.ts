import { UserProfile, Campaign, PaymentDeposit, WalletTransaction, SupportTicket, AppNotification, PlatformSettings } from '../types';

export const DEFAULT_SETTINGS: PlatformSettings = {
  minDeposit: 1.00,
  minCPM: 0.05,
  announcement: "🚀 Welcome to TrafficSell! Flash Promo: Get 20% EXTRA bonus balance on all deposits automatically credited upon approval!",
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
    id: 'usr_master_admin',
    email: 'developershanawar@gmail.com',
    fullName: 'Shanawar Admin',
    telegram: '@developershanawar',
    whatsApp: '+92 300-1234567',
    walletBalance: 1250.00,
    role: 'admin',
    createdAt: '2026-01-01T00:00:00Z',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'
  },
  {
    id: 'usr_demo',
    email: 'demo@trafficsell.com',
    fullName: 'Alex Vance',
    telegram: '@alex_vance',
    whatsApp: '+1 555-0192',
    walletBalance: 245.80,
    role: 'user',
    createdAt: '2026-06-15T10:00:00Z',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250'
  },
  {
    id: 'usr_john',
    email: 'john.advertiser@gmail.com',
    fullName: 'John Miller',
    telegram: '@john_m',
    whatsApp: '+1 555-0842',
    walletBalance: 150.00,
    role: 'user',
    createdAt: '2026-07-01T12:00:00Z',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=250'
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

export const INITIAL_CAMPAIGNS: Campaign[] = [
  {
    id: 'cmp_101',
    userId: 'usr_demo',
    userName: 'Alex Vance',
    name: 'US E-commerce SmartLink Drive',
    url: 'https://trafficsell.com/landing/deals',
    format: 'smartlink',
    country: 'United States',
    deviceType: 'both',
    visitorsTarget: 50000,
    visitorsDelivered: 18420,
    cpm: 0.25,
    budget: 12.50,
    estimatedDeliveryHours: 12,
    status: 'running',
    createdAt: '2026-07-20T14:30:00Z'
  },
  {
    id: 'cmp_102',
    userId: 'usr_john',
    userName: 'John Miller',
    name: 'Global Pop-Up Traffic Surge',
    url: 'https://trafficsell.com/offers/special',
    format: 'popup',
    country: 'All Countries (Cheap)',
    deviceType: 'both',
    visitorsTarget: 100000,
    visitorsDelivered: 0,
    cpm: 0.05,
    budget: 5.00,
    estimatedDeliveryHours: 24,
    status: 'pending',
    createdAt: '2026-07-22T02:15:00Z'
  },
  {
    id: 'cmp_103',
    userId: 'usr_demo',
    userName: 'Alex Vance',
    name: 'UK Mobile SmartLink Promo',
    url: 'https://trafficsell.com/app/download',
    format: 'smartlink',
    country: 'United Kingdom',
    deviceType: 'mobile',
    visitorsTarget: 20000,
    visitorsDelivered: 8900,
    cpm: 0.25,
    budget: 5.00,
    estimatedDeliveryHours: 6,
    status: 'running',
    createdAt: '2026-07-21T09:00:00Z'
  }
];

export const INITIAL_PAYMENTS: PaymentDeposit[] = [
  {
    id: 'pay_201',
    userId: 'usr_john',
    userName: 'John Miller',
    userEmail: 'john.advertiser@gmail.com',
    amount: 50.00,
    method: 'JazzCash',
    trxRef: 'JC88392011',
    status: 'pending',
    screenshotUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&q=80&w=600',
    createdAt: '2026-07-22T03:10:00Z'
  },
  {
    id: 'pay_202',
    userId: 'usr_demo',
    userName: 'Alex Vance',
    userEmail: 'demo@trafficsell.com',
    amount: 100.00,
    method: 'USDT TRC20',
    trxRef: '0x78a9c3b4219ef891d28344e1a0b92c431',
    status: 'pending',
    screenshotUrl: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?auto=format&fit=crop&q=80&w=600',
    createdAt: '2026-07-22T01:45:00Z'
  },
  {
    id: 'pay_203',
    userId: 'usr_demo',
    userName: 'Alex Vance',
    userEmail: 'demo@trafficsell.com',
    amount: 30.00,
    method: 'EasyPaisa',
    trxRef: 'EP9920118',
    status: 'approved',
    screenshotUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&q=80&w=600',
    adminNote: 'Deposit verified + 20% bonus added',
    createdAt: '2026-07-20T10:00:00Z'
  }
];

export const INITIAL_TRANSACTIONS: WalletTransaction[] = [
  {
    id: 'tx_301',
    userId: 'usr_demo',
    type: 'deposit',
    amount: 36.00,
    description: 'EasyPaisa Deposit Approved: 30.00 + 6.00 (20% Extra Bonus)',
    status: 'completed',
    createdAt: '2026-07-20T10:05:00Z'
  },
  {
    id: 'tx_302',
    userId: 'usr_demo',
    type: 'spend',
    amount: 12.50,
    description: 'Campaign Order: US E-commerce SmartLink Drive (50,000 visitors)',
    status: 'completed',
    createdAt: '2026-07-20T14:30:00Z'
  }
];

export const INITIAL_TICKETS: SupportTicket[] = [
  {
    id: 'tkt_401',
    userId: 'usr_demo',
    userName: 'Alex Vance',
    userEmail: 'demo@trafficsell.com',
    subject: 'Question regarding SmartLink CCTR stats',
    category: 'Campaign Delivery',
    priority: 'medium',
    status: 'open',
    messages: [
      {
        id: 'msg_1',
        sender: 'user',
        senderName: 'Alex Vance',
        text: 'Hello, what is the average click-through rate for US SmartLink traffic?',
        createdAt: '2026-07-21T11:00:00Z'
      }
    ],
    createdAt: '2026-07-21T11:00:00Z'
  }
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'ntf_501',
    userId: 'usr_demo',
    title: 'Welcome to TrafficSell 🚀',
    message: 'Deposit funds to get 20% EXTRA balance on your first campaign order!',
    type: 'system',
    read: false,
    createdAt: '2026-07-20T10:00:00Z'
  }
];

