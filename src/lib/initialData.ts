import { UserProfile, Campaign, PaymentDeposit, WalletTransaction, SupportTicket, AppNotification, PlatformSettings, Testimonial, CouponCode } from '../types';

export const DEFAULT_SETTINGS: PlatformSettings = {
  siteName: "TrafficSell",
  siteIconUrl: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&q=80&w=250",
  brandDisplayMode: "both",
  minDeposit: 1.00,
  minCPM: 0.05,
  announcement: "🚀 Welcome to TrafficSell! Instant campaign approval & high conversion real visitors starting at $0.05 CPM!",
  paymentAccounts: {
    jazzCashAccount: "0301-8899221",
    jazzCashTitle: "TrafficSell Corp",
    easyPaisaAccount: "0345-7722110",
    easyPaisaTitle: "TrafficSell Official",
    payPalEmail: "payments@trafficsell.com",
    usdtTrc20Address: "TQ9z8MvK4pL2x3n1Y8B5cV7w0qR1s2T3u4",
    usdtErc20Address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
    usdtBep20Address: "0x9522D8870F78A2359281716A5E5C9A7c8e9d10F2"
  },
  pageContent: {
    privacyPolicy: `At TrafficSell, we prioritize user data protection and transparency. We collect basic details such as email, username, and campaign configuration strictly to facilitate website traffic delivery and billing. We never sell or share user data with third-party advertisers. All payment verifications are stored securely with encrypted reference IDs.`,
    termsOfService: `By registering and creating campaigns on TrafficSell, you agree to follow our advertising guidelines. Prohibited content includes malware, phish links, illegal downloads, or deceptive locking pages. TrafficSell reserves the right to suspend any campaign violating our safety standards without refund.`,
    refundPolicy: `Unspent wallet balances can be requested for refund within 7 days of deposit. Once traffic has been delivered and recorded on live campaign analytics, that portion of the budget is non-refundable.`,
    aboutUs: `TrafficSell is a premier high-performance global ad network and website traffic marketplace. We connect affiliate marketers, media buyers, and website owners with real, verified human traffic from over 150+ countries starting at $0.05 CPM.`,
    supportEmail: "support@trafficsell.com",
    telegramContact: "@developershanawar",
    whatsAppContact: "+92 300-1234567"
  }
};

export const INITIAL_TESTIMONIALS: Testimonial[] = [
  {
    id: 'tstm_1',
    name: 'Michael R.',
    role: 'Affiliate Marketer',
    company: 'CPA Profits',
    content: 'TrafficSell delivered over 200,000 real US pop-under visitors in less than 24 hours. Converted 4x better than my previous traffic source!',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    rating: 5,
    createdAt: '2026-07-01T10:00:00Z',
    active: true
  },
  {
    id: 'tstm_2',
    name: 'Sarah K.',
    role: 'E-commerce Owner',
    company: 'Trendify Digital',
    content: 'Deposited via EasyPaisa and my campaign was approved automatically! The CPM rates are unbeatable at $0.05 per 1,000 visitors.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250',
    rating: 5,
    createdAt: '2026-07-05T14:30:00Z',
    active: true
  },
  {
    id: 'tstm_3',
    name: 'David Chen',
    role: 'Media Buyer',
    company: 'Nexus Media',
    content: 'SmartLink targetting for mobile and desktop is super clean. Real human hits with zero bot traffic detected on Google Analytics.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    rating: 5,
    createdAt: '2026-07-10T09:15:00Z',
    active: true
  },
  {
    id: 'tstm_4',
    name: 'Alexandre Dubois',
    role: 'Ad Agency Director',
    company: 'Apex Growth Europe',
    content: 'We run high volume campaigns across France & Germany. TrafficSell geo-targeting delivers clean, verified residential IPs every single run.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
    rating: 5,
    createdAt: '2026-07-11T11:20:00Z',
    active: true
  },
  {
    id: 'tstm_5',
    name: 'Elena Rostova',
    role: 'Crypto Affiliate Manager',
    company: 'BitTraffic Network',
    content: 'Instant deposits via USDT BEP20 and TRC20 made budget management seamless. Customer support on Telegram answered within 2 minutes!',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
    rating: 5,
    createdAt: '2026-07-12T08:45:00Z',
    active: true
  },
  {
    id: 'tstm_6',
    name: 'Usman Ali',
    role: 'Blogger & Webmaster',
    company: 'TechPulse PK',
    content: 'JazzCash deposit verification was so fast! Scaled my blog pageviews to 100k daily without high costs. Highly recommended ad platform.',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=250',
    rating: 5,
    createdAt: '2026-07-13T16:10:00Z',
    active: true
  },
  {
    id: 'tstm_7',
    name: 'Jessica Gomez',
    role: 'SaaS Founder',
    company: 'LaunchFuel',
    content: 'We tested 5 ad networks for our product launch. TrafficSell generated the highest time-on-site and lowest bounce rate by far.',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=250',
    rating: 5,
    createdAt: '2026-07-14T13:00:00Z',
    active: true
  },
  {
    id: 'tstm_8',
    name: 'Liam Wilson',
    role: 'PPC Specialist',
    company: 'DirectScale UK',
    content: 'The $0.05 CPM rate allows us to test new landing page angles risk-free. Real visitors that actually scroll and engage with content.',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=250',
    rating: 5,
    createdAt: '2026-07-14T18:25:00Z',
    active: true
  },
  {
    id: 'tstm_9',
    name: 'Hiroshi Tanaka',
    role: 'App Publisher',
    company: 'Tokyo Mobile Interactive',
    content: 'Mobile traffic targeting for Japan and East Asia brought thousands of organic app store click-throughs. Premium traffic quality!',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=250',
    rating: 5,
    createdAt: '2026-07-15T07:50:00Z',
    active: true
  },
  {
    id: 'tstm_10',
    name: 'Fatima Al-Mansoor',
    role: 'Digital Marketing Strategist',
    company: 'Gulf Ventures UAE',
    content: 'Targeting Tier 1 Arab countries (UAE & Saudi Arabia) was precise and effective. Excellent ROI for our client promotional campaigns.',
    avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=250',
    rating: 5,
    createdAt: '2026-07-15T12:40:00Z',
    active: true
  },
  {
    id: 'tstm_11',
    name: 'Carlos Mendez',
    role: 'Lead Affiliate Strategist',
    company: 'LatAm Media Group',
    content: 'The real-time live hits tracker on the dashboard updates instantly. Transparent metrics with complete campaign control.',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=250',
    rating: 5,
    createdAt: '2026-07-16T09:30:00Z',
    active: true
  },
  {
    id: 'tstm_12',
    name: 'Chloe Bennett',
    role: 'Growth Lead',
    company: 'ShopPulse',
    content: 'We integrated TrafficSell with PayPal and launched our flash sale promotion within minutes. Generated over $12,000 in attribution sales!',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=250',
    rating: 5,
    createdAt: '2026-07-16T15:15:00Z',
    active: true
  },
  {
    id: 'tstm_13',
    name: 'Tariq Mehmood',
    role: 'E-commerce Marketer',
    company: 'BazaarPK',
    content: 'EasyPaisa payment method makes it so convenient for Pakistani marketers to run global ad campaigns. 10/10 service!',
    avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&q=80&w=250',
    rating: 5,
    createdAt: '2026-07-17T11:05:00Z',
    active: true
  },
  {
    id: 'tstm_14',
    name: 'Emma Watson',
    role: 'Content Strategist',
    company: 'DailyBuzz Media',
    content: 'Delivered 1,000,000 pageviews across Australia and Canada smoothly. Great support staff and flexible budget choices.',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=250',
    rating: 5,
    createdAt: '2026-07-17T17:40:00Z',
    active: true
  },
  {
    id: 'tstm_15',
    name: 'Lucas Silva',
    role: 'Performance Marketer',
    company: 'Rio Digital Agency',
    content: 'Cheap Tier 3 global traffic packages delivered millions of genuine impressions for brand awareness campaigns in South America.',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=250',
    rating: 5,
    createdAt: '2026-07-18T10:20:00Z',
    active: true
  },
  {
    id: 'tstm_16',
    name: 'Sofia Rossi',
    role: 'Influencer Marketing Manager',
    company: 'Milan Fashion Tech',
    content: 'Clean user dashboard with exact delivery progress bars. Managing 10+ client campaigns simultaneously is effortless.',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=250',
    rating: 5,
    createdAt: '2026-07-18T14:50:00Z',
    active: true
  },
  {
    id: 'tstm_17',
    name: 'Vikram Patel',
    role: 'SEO & Growth Consultant',
    company: 'AdVantage India',
    content: 'Verified human traffic that passes strict fraud filters. Perfect for indexing new URLs and boosting organic search signals.',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=250',
    rating: 5,
    createdAt: '2026-07-19T08:15:00Z',
    active: true
  },
  {
    id: 'tstm_18',
    name: 'Anna Schneider',
    role: 'Affiliate Marketing Lead',
    company: 'Berlin CPA Hub',
    content: 'The IMGBB upload for payment receipts worked flawlessly. Approved within 5 minutes and traffic started flowing immediately.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    rating: 5,
    createdAt: '2026-07-19T13:30:00Z',
    active: true
  },
  {
    id: 'tstm_19',
    name: 'Oliver Taylor',
    role: 'Digital Ad Buyer',
    company: 'Sydney AdVentures',
    content: 'SmartLink optimization automatically routes traffic to high performing landers. My profit margin increased by 35% in week one.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    rating: 5,
    createdAt: '2026-07-20T09:00:00Z',
    active: true
  },
  {
    id: 'tstm_20',
    name: 'Zainab Qureshi',
    role: 'Media Planner',
    company: 'Karachi Tech Media',
    content: 'Best advertising platform for both beginners and pros. Transparent rates, fast approval, and 24/7 dedicated Telegram support!',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
    rating: 5,
    createdAt: '2026-07-20T16:45:00Z',
    active: true
  }
];

export const INITIAL_USERS: UserProfile[] = [
  {
    id: 'usr_master_admin',
    email: 'developershanawar@gmail.com',
    fullName: 'Shanawar Admin',
    telegram: '@developershanawar',
    whatsApp: '+92 300-1234567',
    walletBalance: 0.00,
    role: 'admin',
    createdAt: '2026-01-01T00:00:00Z',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'
  }
];

export const INITIAL_CAMPAIGNS: Campaign[] = [];

export const INITIAL_PAYMENTS: PaymentDeposit[] = [];

export const INITIAL_TRANSACTIONS: WalletTransaction[] = [];

export const INITIAL_TICKETS: SupportTicket[] = [];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [];

export const INITIAL_COUPONS: CouponCode[] = [
  {
    id: 'cpn_bonus20',
    code: 'BONUS20',
    bonusPercentage: 20,
    minDepositRequired: 1,
    targetAudience: 'non_depositors',
    maxUses: 500,
    usedCount: 12,
    expiryDate: '2026-12-31',
    active: true,
    createdAt: '2026-07-01T00:00:00Z',
    totalRedeemedAmount: 240.00
  },
  {
    id: 'cpn_welcome10',
    code: 'WELCOME10',
    fixedBonusAmount: 10,
    minDepositRequired: 10,
    targetAudience: 'min_10_dollar',
    maxUses: 200,
    usedCount: 25,
    expiryDate: '2026-12-31',
    active: true,
    createdAt: '2026-07-05T00:00:00Z',
    totalRedeemedAmount: 250.00
  },
  {
    id: 'cpn_dep100',
    code: 'SUPER50',
    bonusPercentage: 50,
    minDepositRequired: 10,
    targetAudience: 'depositors',
    maxUses: 100,
    usedCount: 8,
    expiryDate: '2026-12-31',
    active: true,
    createdAt: '2026-07-10T00:00:00Z',
    totalRedeemedAmount: 400.00
  },
  {
    id: 'cpn_free1',
    code: 'FREE1USD',
    fixedBonusAmount: 1,
    minDepositRequired: 0,
    targetAudience: 'all',
    maxUses: 1000,
    usedCount: 45,
    expiryDate: '2026-12-31',
    active: true,
    createdAt: '2026-07-15T00:00:00Z',
    totalRedeemedAmount: 45.00
  }
];

