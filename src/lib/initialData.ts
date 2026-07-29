import { UserProfile, Campaign, PaymentDeposit, WalletTransaction, SupportTicket, AppNotification, PlatformSettings, Testimonial, WithdrawalRequest, CommissionIncreaseRequest, SocialCampaign } from '../types';

export const DEFAULT_SETTINGS: PlatformSettings = {
  siteName: "TrafficSell",
  siteIconUrl: "/logo.png",
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
    walletBalance: 2500.00,
    referralBalance: 185.50,
    totalReferralEarnings: 235.50,
    referralCode: 'REF_ADMIN1',
    role: 'admin',
    createdAt: '2026-01-01T00:00:00Z',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    country: 'Pakistan',
    city: 'Lahore',
    postalCode: '54000',
    isVerified: true
  },
  {
    id: 'usr_2',
    email: 'demoadvertiser@trafficsell.com',
    fullName: 'Alex Vance',
    telegram: '@alexvance_ad',
    whatsApp: '+1 415-555-0199',
    walletBalance: 145.50,
    referralBalance: 32.50,
    totalReferralEarnings: 32.50,
    referralCode: 'REF_ALEX01',
    role: 'advertiser',
    createdAt: '2026-06-15T10:00:00Z',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    country: 'United States',
    city: 'San Francisco',
    postalCode: '94103',
    isVerified: true
  },
  {
    id: 'usr_3',
    email: 'demopublisher@trafficsell.com',
    fullName: 'Marcus Sterling',
    telegram: '@marcus_pub',
    whatsApp: '+44 20-7946-0912',
    walletBalance: 320.00,
    referralBalance: 12.00,
    totalReferralEarnings: 12.00,
    referralCode: 'REF_MARCUS',
    role: 'publisher',
    createdAt: '2026-06-20T14:20:00Z',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
    country: 'United Kingdom',
    city: 'London',
    postalCode: 'EC1A 1BB',
    isVerified: true
  },
  {
    id: 'usr_4',
    email: 'tenant1@trafficsell.com',
    fullName: 'Nexus Traffic Partner',
    telegram: '@nexus_tenant',
    whatsApp: '+92 321-9988776',
    walletBalance: 500.00,
    role: 'tenant',
    createdAt: '2026-07-01T08:00:00Z',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
    country: 'Pakistan',
    city: 'Karachi',
    postalCode: '75500',
    isVerified: true
  },
  {
    id: 'usr_5',
    email: 'sarah.k@trendify.com',
    fullName: 'Sarah Jenkins',
    telegram: '@sarah_trendify',
    whatsApp: '+1 212-555-0144',
    walletBalance: 210.00,
    role: 'advertiser',
    createdAt: '2026-07-05T11:30:00Z',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250',
    country: 'United States',
    city: 'New York',
    postalCode: '10001',
    isVerified: true
  },
  {
    id: 'usr_6',
    email: 'usman.a@techpulse.pk',
    fullName: 'Usman Ali',
    telegram: '@usman_techpulse',
    whatsApp: '+92 300-9876543',
    walletBalance: 85.20,
    role: 'publisher',
    createdAt: '2026-07-10T16:45:00Z',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=250',
    country: 'Pakistan',
    city: 'Rawalpindi',
    postalCode: '46000',
    isVerified: true
  },
  {
    id: 'usr_7',
    email: 'alexandre.dubois@apexgrowth.eu',
    fullName: 'Alexandre Dubois',
    telegram: '@alex_apexgrowth',
    whatsApp: '+33 1-4268-5500',
    walletBalance: 450.00,
    role: 'advertiser',
    createdAt: '2026-07-12T09:15:00Z',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=250',
    country: 'France',
    city: 'Paris',
    postalCode: '75008',
    isVerified: true
  }
];

export const INITIAL_CAMPAIGNS: Campaign[] = [
  {
    id: 'cmp_101',
    userId: 'usr_2',
    userName: 'Alex Vance',
    name: 'High Converting US Popunder Offer',
    url: 'https://example.com/landing-page-us',
    format: 'popup',
    country: 'United States',
    deviceType: 'both',
    visitorsTarget: 100000,
    visitorsDelivered: 45200,
    cpm: 0.08,
    budget: 8.00,
    status: 'running',
    estimatedDeliveryHours: 24,
    createdAt: '2026-07-18T10:00:00Z'
  },
  {
    id: 'cmp_102',
    userId: 'usr_5',
    userName: 'Sarah Jenkins',
    name: 'Global SmartLink E-commerce Campaign',
    url: 'https://trendify.com/flash-sale',
    format: 'smartlink',
    country: 'All Countries (Cheap)',
    deviceType: 'mobile',
    visitorsTarget: 500000,
    visitorsDelivered: 320000,
    cpm: 0.05,
    budget: 25.00,
    status: 'running',
    estimatedDeliveryHours: 48,
    createdAt: '2026-07-20T14:30:00Z'
  },
  {
    id: 'cmp_103',
    userId: 'usr_7',
    userName: 'Alexandre Dubois',
    name: 'Europe Direct Organic Web Visits',
    url: 'https://apexgrowth.eu/promotions',
    format: 'organic',
    country: 'France',
    deviceType: 'desktop',
    visitorsTarget: 250000,
    visitorsDelivered: 250000,
    cpm: 0.12,
    budget: 30.00,
    status: 'completed',
    estimatedDeliveryHours: 12,
    createdAt: '2026-07-15T08:00:00Z'
  },
  {
    id: 'cmp_104',
    userId: 'usr_2',
    userName: 'Alex Vance',
    name: 'Mobile App Store Click Boost',
    url: 'https://example.com/app-install',
    format: 'popup',
    country: 'All Countries (Cheap)',
    deviceType: 'mobile',
    visitorsTarget: 50000,
    visitorsDelivered: 12000,
    cpm: 0.06,
    budget: 3.00,
    status: 'paused',
    estimatedDeliveryHours: 24,
    createdAt: '2026-07-22T11:15:00Z'
  },
  {
    id: 'cmp_105',
    userId: 'usr_5',
    userName: 'Sarah Jenkins',
    name: 'Crypto SmartLink Premium LeadGen',
    url: 'https://trendify.com/crypto-lander',
    format: 'smartlink',
    country: 'United States',
    deviceType: 'both',
    visitorsTarget: 80000,
    visitorsDelivered: 0,
    cpm: 0.10,
    budget: 8.00,
    status: 'pending',
    estimatedDeliveryHours: 12,
    createdAt: '2026-07-25T02:00:00Z'
  }
];

export const INITIAL_PAYMENTS: PaymentDeposit[] = [
  {
    id: 'dep_1001',
    userId: 'usr_6',
    userName: 'Usman Ali',
    userEmail: 'usman.a@techpulse.pk',
    method: 'JazzCash',
    amount: 50.00,
    trxRef: 'TRX-99882211',
    screenshotUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&q=80&w=400',
    status: 'approved',
    createdAt: '2026-07-22T09:00:00Z',
    adminNote: 'Verified and credited to wallet.'
  },
  {
    id: 'dep_1002',
    userId: 'usr_5',
    userName: 'Sarah Jenkins',
    userEmail: 'sarah.k@trendify.com',
    method: 'EasyPaisa',
    amount: 100.00,
    trxRef: 'EP-77441100',
    screenshotUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=400',
    status: 'pending',
    createdAt: '2026-07-24T18:00:00Z'
  },
  {
    id: 'dep_1003',
    userId: 'usr_2',
    userName: 'Alex Vance',
    userEmail: 'demoadvertiser@trafficsell.com',
    method: 'PayPal',
    amount: 250.00,
    trxRef: 'PAYPAL-INV-9901',
    screenshotUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=400',
    status: 'approved',
    createdAt: '2026-07-20T12:00:00Z',
    adminNote: 'PayPal payment confirmed.'
  },
  {
    id: 'dep_1004',
    userId: 'usr_7',
    userName: 'Alexandre Dubois',
    userEmail: 'alexandre.dubois@apexgrowth.eu',
    method: 'USDT TRC20',
    amount: 500.00,
    trxRef: '0x8f2a7b...99a0',
    screenshotUrl: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?auto=format&fit=crop&q=80&w=400',
    status: 'pending',
    createdAt: '2026-07-25T01:30:00Z'
  }
];

export const INITIAL_TRANSACTIONS: WalletTransaction[] = [
  {
    id: 'tx_101',
    userId: 'usr_2',
    type: 'deposit',
    amount: 250.00,
    description: 'Wallet Deposit via PayPal (Approved)',
    status: 'completed',
    createdAt: '2026-07-20T12:00:00Z'
  },
  {
    id: 'tx_102',
    userId: 'usr_2',
    type: 'spend',
    amount: 8.00,
    description: 'Campaign cmp_101 Popunder US Allocation',
    status: 'completed',
    createdAt: '2026-07-20T12:05:00Z'
  },
  {
    id: 'tx_103',
    userId: 'usr_6',
    type: 'deposit',
    amount: 50.00,
    description: 'Wallet Deposit via JazzCash (Approved)',
    status: 'completed',
    createdAt: '2026-07-22T09:00:00Z'
  }
];

export const INITIAL_TICKETS: SupportTicket[] = [
  {
    id: 'tkt_101',
    userId: 'usr_2',
    userName: 'Alex Vance',
    userEmail: 'demoadvertiser@trafficsell.com',
    subject: 'How fast will my pop-under campaign be approved?',
    category: 'Campaign Delivery',
    priority: 'high',
    status: 'open',
    createdAt: '2026-07-25T03:15:00Z',
    messages: [
      {
        id: 'msg_1',
        sender: 'user',
        senderName: 'Alex Vance',
        text: 'Hi! I just created a new campaign for US Popunder traffic. How long does manual review usually take?',
        createdAt: '2026-07-25T03:15:00Z'
      },
      {
        id: 'msg_2',
        sender: 'admin',
        senderName: 'Shanawar Admin',
        text: 'Hello Alex! Campaigns are usually reviewed within 5 to 15 minutes. Yours is currently in queue.',
        createdAt: '2026-07-25T03:20:00Z'
      },
      {
        id: 'msg_3',
        sender: 'user',
        senderName: 'Alex Vance',
        text: 'Awesome, thank you! Ready to scale once approved.',
        createdAt: '2026-07-25T03:22:00Z'
      }
    ]
  },
  {
    id: 'tkt_102',
    userId: 'usr_6',
    userName: 'Usman Ali',
    userEmail: 'usman.a@techpulse.pk',
    subject: 'JazzCash deposit reference confirmation',
    category: 'Billing & Wallet',
    priority: 'high',
    status: 'open',
    createdAt: '2026-07-25T04:00:00Z',
    messages: [
      {
        id: 'msg_4',
        sender: 'user',
        senderName: 'Usman Ali',
        text: 'Hello, I submitted a deposit via JazzCash TRX ID #TRX-99882211. Please verify and credit my wallet.',
        createdAt: '2026-07-25T04:00:00Z'
      }
    ]
  },
  {
    id: 'tkt_103',
    userId: 'usr_5',
    userName: 'Sarah Jenkins',
    userEmail: 'sarah.k@trendify.com',
    subject: 'Custom CPM rate for 1M+ monthly volume',
    category: 'General Inquiry',
    priority: 'medium',
    status: 'in_progress',
    createdAt: '2026-07-24T18:30:00Z',
    messages: [
      {
        id: 'msg_5',
        sender: 'user',
        senderName: 'Sarah Jenkins',
        text: 'We are looking to order 1,000,000+ US impressions monthly. Do you offer bulk CPM discounts?',
        createdAt: '2026-07-24T18:30:00Z'
      },
      {
        id: 'msg_6',
        sender: 'admin',
        senderName: 'Shanawar Admin',
        text: 'Hello Sarah! Yes, for orders above 1M impressions, we offer $0.04 CPM special rate. Let us know your target geos.',
        createdAt: '2026-07-24T19:00:00Z'
      }
    ]
  }
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'ntf_201',
    userId: 'usr_2',
    title: 'Deposit Approved',
    message: 'Your PayPal deposit of $250.00 has been credited to your wallet balance.',
    type: 'payment',
    read: false,
    createdAt: '2026-07-20T12:00:00Z'
  },
  {
    id: 'ntf_202',
    userId: 'usr_2',
    title: 'Campaign Live',
    message: 'Campaign cmp_101 "High Converting US Popunder Offer" is now actively delivering visitors.',
    type: 'campaign',
    read: true,
    createdAt: '2026-07-20T12:10:00Z'
  },
  {
    id: 'ntf_203',
    userId: 'all',
    title: '🚀 TrafficSell Platform Upgrade',
    message: 'New high-conversion SmartLink targeting now available with 0% commission fees on bulk orders!',
    type: 'system',
    read: false,
    createdAt: '2026-07-24T10:00:00Z'
  }
];

export const INITIAL_SOCIAL_SERVICES = [
  {
    id: 'soc_srv_1',
    platform: 'Instagram',
    serviceName: 'Instagram Real Followers [HQ Fast]',
    serviceType: 'Followers',
    pricePer1000: 1.20,
    minQuantity: 100,
    maxQuantity: 100000,
    estimatedMinutes: 30,
    description: 'High quality active accounts. Non-drop 30-day auto refill.',
    active: true
  },
  {
    id: 'soc_srv_2',
    platform: 'Instagram',
    serviceName: 'Instagram Organic Likes & Impressions',
    serviceType: 'Likes',
    pricePer1000: 0.40,
    minQuantity: 100,
    maxQuantity: 50000,
    estimatedMinutes: 15,
    description: 'Instant start. Works on posts and reels.',
    active: true
  },
  {
    id: 'soc_srv_3',
    platform: 'Instagram',
    serviceName: 'Instagram Reel & Post Views [Viral Push]',
    serviceType: 'Views',
    pricePer1000: 0.15,
    minQuantity: 500,
    maxQuantity: 1000000,
    estimatedMinutes: 10,
    description: 'Super fast delivery for explore page ranking.',
    active: true
  },
  {
    id: 'soc_srv_4',
    platform: 'YouTube',
    serviceName: 'YouTube High Retention Video Views',
    serviceType: 'Views',
    pricePer1000: 1.50,
    minQuantity: 1000,
    maxQuantity: 500000,
    estimatedMinutes: 60,
    description: 'Real watch time retention (3-5 mins per view). Monetization safe.',
    active: true
  },
  {
    id: 'soc_srv_5',
    platform: 'YouTube',
    serviceName: 'YouTube Channel Subscribers [Real]',
    serviceType: 'Subscribers',
    pricePer1000: 4.50,
    minQuantity: 100,
    maxQuantity: 10000,
    estimatedMinutes: 120,
    description: 'Gradual organic drip feed to prevent drops.',
    active: true
  },
  {
    id: 'soc_srv_6',
    platform: 'TikTok',
    serviceName: 'TikTok Video Views [Instant Speed]',
    serviceType: 'Views',
    pricePer1000: 0.20,
    minQuantity: 1000,
    maxQuantity: 1000000,
    estimatedMinutes: 10,
    description: 'Boost your FYP algorithm exposure instantly.',
    active: true
  },
  {
    id: 'soc_srv_7',
    platform: 'TikTok',
    serviceName: 'TikTok Profile Followers',
    serviceType: 'Followers',
    pricePer1000: 1.80,
    minQuantity: 100,
    maxQuantity: 50000,
    estimatedMinutes: 45,
    description: 'Real active users. Drip feed enabled.',
    active: true
  },
  {
    id: 'soc_srv_8',
    platform: 'Telegram',
    serviceName: 'Telegram Channel Members [Global]',
    serviceType: 'Followers',
    pricePer1000: 0.80,
    minQuantity: 500,
    maxQuantity: 200000,
    estimatedMinutes: 20,
    description: 'Public & private channel support.',
    active: true
  }
];

export const INITIAL_WITHDRAWALS: WithdrawalRequest[] = [
  {
    id: 'wth_101',
    userId: 'usr_2',
    userName: 'Alex Vance',
    userEmail: 'demoadvertiser@trafficsell.com',
    amount: 15.00,
    method: 'JazzCash',
    accountTitle: 'Alex Vance',
    accountNumber: '03001234567',
    status: 'in review',
    createdAt: '2026-07-27T18:30:00Z'
  },
  {
    id: 'wth_102',
    userId: 'usr_3',
    userName: 'Marcus Sterling',
    userEmail: 'demopublisher@trafficsell.com',
    amount: 50.00,
    method: 'USDT TRC20',
    cryptoAddress: 'TQ9z8MvK4pL2x3n1Y8B5cV7w0qR1s2T3u4',
    status: 'in review',
    createdAt: '2026-07-28T02:15:00Z'
  }
];

export const INITIAL_COMMISSION_REQUESTS: CommissionIncreaseRequest[] = [
  {
    id: 'cmreq_101',
    userId: 'usr_2',
    userName: 'Alex Vance',
    userEmail: 'demoadvertiser@trafficsell.com',
    referralsCount: 18,
    requestedRate: 8,
    message: 'I manage an ad network community of 500+ webmasters and send active traffic buyers daily. Requesting an 8% commission rate.',
    status: 'in review',
    createdAt: '2026-07-26T11:20:00Z'
  }
];

export const INITIAL_SOCIAL_CAMPAIGNS: SocialCampaign[] = [
  {
    id: 'soc_cmp_101',
    userId: 'usr_2',
    userName: 'Demo Advertiser',
    serviceId: 'soc_srv_1',
    platform: 'Instagram',
    serviceName: 'Instagram Real Followers [High Quality]',
    targetLink: 'https://instagram.com/demoadvertiser',
    quantity: 2000,
    pricePer1000: 1.20,
    totalCost: 2.40,
    estimatedMinutes: 60,
    status: 'in_progress',
    createdAt: '2026-07-27T14:20:00Z'
  }
];



