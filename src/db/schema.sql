-- =========================================================================
-- TrafficSell Complete Database Schema & Migration Setup
-- Compatible with all Supabase projects (New & Existing).
-- Copy & Paste directly into Supabase SQL Editor and click "Run".
-- =========================================================================

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS public.users (
  id TEXT PRIMARY KEY,
  full_name TEXT NOT NULL,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'user',
  is_verified BOOLEAN DEFAULT true,
  wallet_balance NUMERIC(12, 2) DEFAULT 0.00,
  referral_balance NUMERIC(12, 2) DEFAULT 0.00,
  total_spent NUMERIC(12, 2) DEFAULT 0.00,
  referral_code TEXT,
  referred_by TEXT,
  custom_referral_rate NUMERIC(5, 2) DEFAULT 5.00,
  avatar TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Safe Column Upgrades for USERS
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS username TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT true;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS wallet_balance NUMERIC(12, 2) DEFAULT 0.00;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS referral_balance NUMERIC(12, 2) DEFAULT 0.00;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS total_spent NUMERIC(12, 2) DEFAULT 0.00;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS referral_code TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS referred_by TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS custom_referral_rate NUMERIC(5, 2) DEFAULT 5.00;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS avatar TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

-- 2. CAMPAIGNS TABLE (Website & Popunder Traffic)
CREATE TABLE IF NOT EXISTS public.campaigns (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES public.users(id) ON DELETE CASCADE,
  user_name TEXT,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  keywords TEXT,
  format TEXT DEFAULT 'popup',
  country TEXT DEFAULT 'Global',
  device_type TEXT DEFAULT 'both',
  visitors_target INTEGER DEFAULT 10000,
  visitors_delivered INTEGER DEFAULT 0,
  cpm NUMERIC(8, 4) DEFAULT 0.05,
  budget NUMERIC(12, 2) DEFAULT 5.00,
  status TEXT DEFAULT 'pending',
  estimated_delivery_hours INTEGER DEFAULT 24,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Safe Column Upgrades for CAMPAIGNS
ALTER TABLE public.campaigns ADD COLUMN IF NOT EXISTS user_id TEXT;
ALTER TABLE public.campaigns ADD COLUMN IF NOT EXISTS user_name TEXT;
ALTER TABLE public.campaigns ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE public.campaigns ADD COLUMN IF NOT EXISTS url TEXT;
ALTER TABLE public.campaigns ADD COLUMN IF NOT EXISTS keywords TEXT;
ALTER TABLE public.campaigns ADD COLUMN IF NOT EXISTS format TEXT DEFAULT 'popup';
ALTER TABLE public.campaigns ADD COLUMN IF NOT EXISTS country TEXT DEFAULT 'Global';
ALTER TABLE public.campaigns ADD COLUMN IF NOT EXISTS device_type TEXT DEFAULT 'both';
ALTER TABLE public.campaigns ADD COLUMN IF NOT EXISTS visitors_target INTEGER DEFAULT 10000;
ALTER TABLE public.campaigns ADD COLUMN IF NOT EXISTS visitors_delivered INTEGER DEFAULT 0;
ALTER TABLE public.campaigns ADD COLUMN IF NOT EXISTS cpm NUMERIC(8, 4) DEFAULT 0.05;
ALTER TABLE public.campaigns ADD COLUMN IF NOT EXISTS budget NUMERIC(12, 2) DEFAULT 5.00;
ALTER TABLE public.campaigns ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending';
ALTER TABLE public.campaigns ADD COLUMN IF NOT EXISTS estimated_delivery_hours INTEGER DEFAULT 24;
ALTER TABLE public.campaigns ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

-- 3. SOCIAL CAMPAIGNS TABLE (SMM Services - Likes, Followers, Views)
CREATE TABLE IF NOT EXISTS public.social_campaigns (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES public.users(id) ON DELETE CASCADE,
  user_name TEXT,
  platform TEXT NOT NULL,
  service_id TEXT NOT NULL,
  service_name TEXT NOT NULL,
  target_link TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  delivered_quantity INTEGER DEFAULT 0,
  price_per_1000 NUMERIC(10, 4) NOT NULL,
  total_cost NUMERIC(12, 2) NOT NULL,
  status TEXT DEFAULT 'pending',
  admin_note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Safe Column Upgrades for SOCIAL_CAMPAIGNS
ALTER TABLE public.social_campaigns ADD COLUMN IF NOT EXISTS user_id TEXT;
ALTER TABLE public.social_campaigns ADD COLUMN IF NOT EXISTS user_name TEXT;
ALTER TABLE public.social_campaigns ADD COLUMN IF NOT EXISTS platform TEXT;
ALTER TABLE public.social_campaigns ADD COLUMN IF NOT EXISTS service_id TEXT;
ALTER TABLE public.social_campaigns ADD COLUMN IF NOT EXISTS service_name TEXT;
ALTER TABLE public.social_campaigns ADD COLUMN IF NOT EXISTS target_link TEXT;
ALTER TABLE public.social_campaigns ADD COLUMN IF NOT EXISTS quantity INTEGER;
ALTER TABLE public.social_campaigns ADD COLUMN IF NOT EXISTS delivered_quantity INTEGER DEFAULT 0;
ALTER TABLE public.social_campaigns ADD COLUMN IF NOT EXISTS price_per_1000 NUMERIC(10, 4);
ALTER TABLE public.social_campaigns ADD COLUMN IF NOT EXISTS total_cost NUMERIC(12, 2);
ALTER TABLE public.social_campaigns ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending';
ALTER TABLE public.social_campaigns ADD COLUMN IF NOT EXISTS admin_note TEXT;
ALTER TABLE public.social_campaigns ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

-- 4. PAYMENT DEPOSITS TABLE (Manual & Automated Wallet Top-ups)
CREATE TABLE IF NOT EXISTS public.payment_deposits (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES public.users(id) ON DELETE CASCADE,
  user_name TEXT,
  user_email TEXT,
  method TEXT NOT NULL,
  amount NUMERIC(12, 2) NOT NULL,
  trx_ref TEXT NOT NULL,
  screenshot_url TEXT,
  status TEXT DEFAULT 'pending',
  admin_note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Safe Column Upgrades for PAYMENT_DEPOSITS
ALTER TABLE public.payment_deposits ADD COLUMN IF NOT EXISTS user_id TEXT;
ALTER TABLE public.payment_deposits ADD COLUMN IF NOT EXISTS user_name TEXT;
ALTER TABLE public.payment_deposits ADD COLUMN IF NOT EXISTS user_email TEXT;
ALTER TABLE public.payment_deposits ADD COLUMN IF NOT EXISTS method TEXT;
ALTER TABLE public.payment_deposits ADD COLUMN IF NOT EXISTS amount NUMERIC(12, 2);
ALTER TABLE public.payment_deposits ADD COLUMN IF NOT EXISTS trx_ref TEXT;
ALTER TABLE public.payment_deposits ADD COLUMN IF NOT EXISTS screenshot_url TEXT;
ALTER TABLE public.payment_deposits ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending';
ALTER TABLE public.payment_deposits ADD COLUMN IF NOT EXISTS admin_note TEXT;
ALTER TABLE public.payment_deposits ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

-- ALIAS VIEW FOR DEPOSITS
CREATE OR REPLACE VIEW public.deposits AS SELECT * FROM public.payment_deposits;

-- 5. WITHDRAWAL REQUESTS TABLE (Affiliate & Referral Payouts)
CREATE TABLE IF NOT EXISTS public.withdrawal_requests (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES public.users(id) ON DELETE CASCADE,
  user_name TEXT,
  user_email TEXT,
  amount NUMERIC(12, 2) NOT NULL,
  method TEXT NOT NULL,
  account_title TEXT,
  account_number TEXT,
  crypto_address TEXT,
  status TEXT DEFAULT 'pending',
  admin_note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Safe Column Upgrades for WITHDRAWAL_REQUESTS
ALTER TABLE public.withdrawal_requests ADD COLUMN IF NOT EXISTS user_id TEXT;
ALTER TABLE public.withdrawal_requests ADD COLUMN IF NOT EXISTS user_name TEXT;
ALTER TABLE public.withdrawal_requests ADD COLUMN IF NOT EXISTS user_email TEXT;
ALTER TABLE public.withdrawal_requests ADD COLUMN IF NOT EXISTS amount NUMERIC(12, 2);
ALTER TABLE public.withdrawal_requests ADD COLUMN IF NOT EXISTS method TEXT;
ALTER TABLE public.withdrawal_requests ADD COLUMN IF NOT EXISTS account_title TEXT;
ALTER TABLE public.withdrawal_requests ADD COLUMN IF NOT EXISTS account_number TEXT;
ALTER TABLE public.withdrawal_requests ADD COLUMN IF NOT EXISTS crypto_address TEXT;
ALTER TABLE public.withdrawal_requests ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending';
ALTER TABLE public.withdrawal_requests ADD COLUMN IF NOT EXISTS admin_note TEXT;
ALTER TABLE public.withdrawal_requests ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

-- ALIAS VIEW FOR WITHDRAWALS
CREATE OR REPLACE VIEW public.withdrawals AS SELECT * FROM public.withdrawal_requests;

-- 6. COMMISSION RATE REQUESTS TABLE (Custom Referral % Requests)
CREATE TABLE IF NOT EXISTS public.commission_requests (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES public.users(id) ON DELETE CASCADE,
  user_name TEXT,
  user_email TEXT,
  referrals_count INTEGER DEFAULT 0,
  requested_rate NUMERIC(5, 2) DEFAULT 8.00,
  social_platform TEXT,
  proof_url TEXT,
  message TEXT,
  status TEXT DEFAULT 'in review',
  admin_note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Safe Column Upgrades for COMMISSION_REQUESTS
ALTER TABLE public.commission_requests ADD COLUMN IF NOT EXISTS user_id TEXT;
ALTER TABLE public.commission_requests ADD COLUMN IF NOT EXISTS user_name TEXT;
ALTER TABLE public.commission_requests ADD COLUMN IF NOT EXISTS user_email TEXT;
ALTER TABLE public.commission_requests ADD COLUMN IF NOT EXISTS referrals_count INTEGER DEFAULT 0;
ALTER TABLE public.commission_requests ADD COLUMN IF NOT EXISTS requested_rate NUMERIC(5, 2) DEFAULT 8.00;
ALTER TABLE public.commission_requests ADD COLUMN IF NOT EXISTS social_platform TEXT;
ALTER TABLE public.commission_requests ADD COLUMN IF NOT EXISTS proof_url TEXT;
ALTER TABLE public.commission_requests ADD COLUMN IF NOT EXISTS message TEXT;
ALTER TABLE public.commission_requests ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'in review';
ALTER TABLE public.commission_requests ADD COLUMN IF NOT EXISTS admin_note TEXT;
ALTER TABLE public.commission_requests ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

-- ALIAS VIEW FOR COMMISSION REQUESTS
CREATE OR REPLACE VIEW public.referral_requests AS SELECT * FROM public.commission_requests;

-- 7. TRANSACTIONS TABLE
CREATE TABLE IF NOT EXISTS public.transactions (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES public.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  amount NUMERIC(12, 2) NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'completed',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS user_id TEXT;
ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS type TEXT;
ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS amount NUMERIC(12, 2);
ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'completed';
ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

-- 8. REFERRALS HISTORY TABLE
CREATE TABLE IF NOT EXISTS public.referrals (
  id TEXT PRIMARY KEY,
  referrer_id TEXT REFERENCES public.users(id) ON DELETE CASCADE,
  referred_user_id TEXT REFERENCES public.users(id) ON DELETE CASCADE,
  referred_user_name TEXT,
  referred_user_email TEXT,
  deposit_amount NUMERIC(12, 2) DEFAULT 0.00,
  commission_amount NUMERIC(12, 2) DEFAULT 0.00,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. PLATFORM SETTINGS TABLE (Global System Config)
CREATE TABLE IF NOT EXISTS public.platform_settings (
  id TEXT PRIMARY KEY DEFAULT 'main',
  site_name TEXT DEFAULT 'TrafficSell',
  site_icon_url TEXT,
  brand_display_mode TEXT DEFAULT 'both',
  default_cpm NUMERIC(8, 4) DEFAULT 0.05,
  min_deposit NUMERIC(10, 2) DEFAULT 1.00,
  min_deposit_amount NUMERIC(10, 2) DEFAULT 1.00,
  min_withdrawal NUMERIC(10, 2) DEFAULT 10.00,
  min_withdrawal_amount NUMERIC(10, 2) DEFAULT 10.00,
  default_referral_rate NUMERIC(5, 2) DEFAULT 5.00,
  jazzcash_title TEXT DEFAULT 'TrafficSell Official',
  jazzcash_number TEXT DEFAULT '03001234567',
  easypaisa_title TEXT DEFAULT 'TrafficSell Official',
  easypaisa_number TEXT DEFAULT '03111234567',
  usdt_trc20_address TEXT DEFAULT 'TXYZ1234567890TRC20OfficialWalletAddress',
  usdt_bep20_address TEXT DEFAULT '0x1234567890BEP20OfficialWalletAddress',
  usdt_erc20_address TEXT DEFAULT '0x1234567890ERC20OfficialWalletAddress',
  paypal_email TEXT DEFAULT 'billing@trafficsell.com',
  bank_name TEXT DEFAULT 'Meezan Bank',
  bank_title TEXT DEFAULT 'TrafficSell SMC Pvt Ltd',
  bank_iban TEXT DEFAULT 'PK36MEZN0001020304050607',
  page_content TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Safe Column Upgrades for PLATFORM_SETTINGS (Ensures old & new databases succeed)
ALTER TABLE public.platform_settings ADD COLUMN IF NOT EXISTS site_name TEXT DEFAULT 'TrafficSell';
ALTER TABLE public.platform_settings ADD COLUMN IF NOT EXISTS site_icon_url TEXT;
ALTER TABLE public.platform_settings ADD COLUMN IF NOT EXISTS brand_display_mode TEXT DEFAULT 'both';
ALTER TABLE public.platform_settings ADD COLUMN IF NOT EXISTS default_cpm NUMERIC(8, 4) DEFAULT 0.05;
ALTER TABLE public.platform_settings ADD COLUMN IF NOT EXISTS min_deposit NUMERIC(10, 2) DEFAULT 1.00;
ALTER TABLE public.platform_settings ADD COLUMN IF NOT EXISTS min_deposit_amount NUMERIC(10, 2) DEFAULT 1.00;
ALTER TABLE public.platform_settings ADD COLUMN IF NOT EXISTS min_withdrawal NUMERIC(10, 2) DEFAULT 10.00;
ALTER TABLE public.platform_settings ADD COLUMN IF NOT EXISTS min_withdrawal_amount NUMERIC(10, 2) DEFAULT 10.00;
ALTER TABLE public.platform_settings ADD COLUMN IF NOT EXISTS default_referral_rate NUMERIC(5, 2) DEFAULT 5.00;
ALTER TABLE public.platform_settings ADD COLUMN IF NOT EXISTS jazzcash_title TEXT DEFAULT 'TrafficSell Official';
ALTER TABLE public.platform_settings ADD COLUMN IF NOT EXISTS jazzcash_number TEXT DEFAULT '03001234567';
ALTER TABLE public.platform_settings ADD COLUMN IF NOT EXISTS easypaisa_title TEXT DEFAULT 'TrafficSell Official';
ALTER TABLE public.platform_settings ADD COLUMN IF NOT EXISTS easypaisa_number TEXT DEFAULT '03111234567';
ALTER TABLE public.platform_settings ADD COLUMN IF NOT EXISTS usdt_trc20_address TEXT DEFAULT 'TXYZ1234567890TRC20OfficialWalletAddress';
ALTER TABLE public.platform_settings ADD COLUMN IF NOT EXISTS usdt_bep20_address TEXT DEFAULT '0x1234567890BEP20OfficialWalletAddress';
ALTER TABLE public.platform_settings ADD COLUMN IF NOT EXISTS usdt_erc20_address TEXT DEFAULT '0x1234567890ERC20OfficialWalletAddress';
ALTER TABLE public.platform_settings ADD COLUMN IF NOT EXISTS paypal_email TEXT DEFAULT 'billing@trafficsell.com';
ALTER TABLE public.platform_settings ADD COLUMN IF NOT EXISTS bank_name TEXT DEFAULT 'Meezan Bank';
ALTER TABLE public.platform_settings ADD COLUMN IF NOT EXISTS bank_title TEXT DEFAULT 'TrafficSell SMC Pvt Ltd';
ALTER TABLE public.platform_settings ADD COLUMN IF NOT EXISTS bank_iban TEXT DEFAULT 'PK36MEZN0001020304050607';
ALTER TABLE public.platform_settings ADD COLUMN IF NOT EXISTS page_content TEXT;
ALTER TABLE public.platform_settings ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- 10. SUPPORT TICKETS TABLE
CREATE TABLE IF NOT EXISTS public.support_tickets (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES public.users(id) ON DELETE CASCADE,
  user_name TEXT,
  user_email TEXT,
  subject TEXT NOT NULL,
  category TEXT DEFAULT 'General Inquiry',
  status TEXT DEFAULT 'open',
  messages JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. TESTIMONIALS TABLE
CREATE TABLE IF NOT EXISTS public.testimonials (
  id TEXT PRIMARY KEY,
  user_name TEXT NOT NULL,
  role TEXT DEFAULT 'Advertiser',
  company TEXT,
  content TEXT NOT NULL,
  rating INTEGER DEFAULT 5,
  avatar TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. PAGES & LANDING CMS TABLE
CREATE TABLE IF NOT EXISTS public.pages (
  id TEXT PRIMARY KEY DEFAULT 'global_page_content',
  hero_title TEXT,
  hero_subtitle TEXT,
  telegram_contact TEXT DEFAULT '@trafficsell_support',
  whatsapp_contact TEXT DEFAULT '+923001234567',
  about_content TEXT,
  privacy_policy TEXT,
  terms_of_service TEXT,
  refund_policy TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================================
-- INDEXES FOR MAXIMUM QUERY PERFORMANCE
-- =========================================================================
CREATE INDEX IF NOT EXISTS idx_campaigns_user_id ON public.campaigns(user_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON public.campaigns(status);
CREATE INDEX IF NOT EXISTS idx_payment_deposits_user_id ON public.payment_deposits(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_deposits_status ON public.payment_deposits(status);
CREATE INDEX IF NOT EXISTS idx_withdrawal_requests_user_id ON public.withdrawal_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_withdrawal_requests_status ON public.withdrawal_requests(status);
CREATE INDEX IF NOT EXISTS idx_social_campaigns_user_id ON public.social_campaigns(user_id);
CREATE INDEX IF NOT EXISTS idx_commission_requests_user_id ON public.commission_requests(user_id);

-- =========================================================================
-- DISABLE ROW-LEVEL SECURITY RESTRICTIONS (PERMISSIVE ACCESS FOR ANON KEY)
-- =========================================================================
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_campaigns DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_deposits DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.withdrawal_requests DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.commission_requests DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.pages DISABLE ROW LEVEL SECURITY;

-- =========================================================================
-- INITIAL DEFAULT DATA SEEDING
-- =========================================================================
INSERT INTO public.platform_settings (id, site_name, min_deposit, min_deposit_amount, min_withdrawal, min_withdrawal_amount, default_referral_rate)
VALUES ('main', 'TrafficSell', 1.00, 1.00, 10.00, 10.00, 5.00)
ON CONFLICT (id) DO UPDATE SET 
  min_deposit = EXCLUDED.min_deposit,
  min_deposit_amount = EXCLUDED.min_deposit_amount,
  default_referral_rate = EXCLUDED.default_referral_rate;

INSERT INTO public.pages (id, hero_title, hero_subtitle)
VALUES ('global_page_content', 'High-Converting Web Traffic & Social Media Growth Engine', 'Target real human visitors with precision CPM targeting, zero bot feeds, instant queue processing, and local payment support.')
ON CONFLICT (id) DO NOTHING;
