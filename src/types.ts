export type UserRole = 'user' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  password?: string;
  fullName: string;
  username?: string;
  telegram?: string;
  whatsApp?: string;
  country?: string;
  city?: string;
  postalCode?: string;
  walletBalance: number;
  role: UserRole;
  createdAt: string;
  avatar?: string;
  isSuspended?: boolean;
  suspendedReason?: string;
  isVerified?: boolean;
  ipAddress?: string;
  registrationIp?: string;
  lastLoginIp?: string;
}

export type TrafficCountry = 
  | 'All Countries (Cheap)'
  | 'United States'
  | 'United Kingdom'
  | 'Germany'
  | 'Canada'
  | 'Australia'
  | 'France'
  | 'Japan'
  | 'Spain'
  | 'Italy'
  | 'Brazil'
  | 'Mexico'
  | 'Pakistan'
  | 'India'
  | 'Saudi Arabia'
  | 'UAE'
  | 'Other Tier 3';

export type DeviceType = 'desktop' | 'mobile' | 'both';

export type CampaignFormat = 'smartlink' | 'popup' | 'organic';

export type CampaignStatus = 'pending' | 'running' | 'completed' | 'paused' | 'cancelled';

export interface Campaign {
  id: string;
  userId: string;
  userName: string;
  name: string;
  url: string;
  keywords?: string;
  format: CampaignFormat;
  country: TrafficCountry;
  deviceType: DeviceType;
  visitorsTarget: number;
  visitorsDelivered: number;
  cpm: number;
  budget: number;
  status: CampaignStatus;
  estimatedDeliveryHours: number;
  createdAt: string;
}

export type PaymentMethod = 'JazzCash' | 'EasyPaisa' | 'PayPal' | 'USDT TRC20' | 'USDT ERC20' | 'USDT BEP20';

export type PaymentStatus = 'pending' | 'approved' | 'rejected';

export interface PaymentDeposit {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  method: PaymentMethod;
  amount: number;
  trxRef: string;
  screenshotUrl: string;
  status: PaymentStatus;
  createdAt: string;
  adminNote?: string;
}

export interface WalletTransaction {
  id: string;
  userId: string;
  type: 'deposit' | 'spend' | 'refund';
  amount: number;
  description: string;
  status: 'completed' | 'pending' | 'failed';
  createdAt: string;
}

export interface TicketMessage {
  id: string;
  sender: 'user' | 'admin';
  senderName: string;
  text: string;
  createdAt: string;
}

export interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  subject: string;
  category: 'Billing & Wallet' | 'Campaign Delivery' | 'Technical Issue' | 'General Inquiry';
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'in_progress' | 'resolved';
  createdAt: string;
  messages: TicketMessage[];
}

export interface AppNotification {
  id: string;
  userId: string; // 'all' or specific user id
  title: string;
  message: string;
  type: 'campaign' | 'payment' | 'ticket' | 'system';
  read: boolean;
  createdAt: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company?: string;
  content: string;
  avatar: string;
  rating: number;
  createdAt: string;
  active: boolean;
}

export interface EditablePageContent {
  privacyPolicy: string;
  termsOfService: string;
  refundPolicy: string;
  aboutUs: string;
  supportEmail: string;
  telegramContact: string;
  whatsAppContact: string;
}

export interface PlatformSettings {
  siteName?: string;
  siteIconUrl?: string;
  brandDisplayMode?: 'both' | 'icon' | 'text';
  minDeposit: number;
  minCPM: number;
  announcement: string;
  paymentAccounts: {
    jazzCashAccount: string;
    jazzCashTitle: string;
    easyPaisaAccount: string;
    easyPaisaTitle: string;
    payPalEmail: string;
    usdtTrc20Address: string;
    usdtErc20Address: string;
    usdtBep20Address: string;
  };
  pageContent: EditablePageContent;
}
