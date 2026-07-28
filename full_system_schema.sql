-- ====================================================================
-- TrafficSell Complete System Database Schema & Migration Script
-- Platform: Supabase / PostgreSQL
-- ====================================================================

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS public.users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT,
  full_name TEXT NOT NULL,
  role TEXT DEFAULT 'user',
  wallet_balance NUMERIC(12,2) DEFAULT 0.00,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  avatar TEXT,
  ip_address TEXT,
  registration_ip TEXT,
  last_login_ip TEXT,
  is_verified BOOLEAN DEFAULT TRUE,
  is_suspended BOOLEAN DEFAULT FALSE,
  telegram TEXT,
  whats_app TEXT,
  referral_code TEXT UNIQUE,
  referred_by TEXT,
  total_referral_earnings NUMERIC(12,2) DEFAULT 0.00
);

CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_referral_code ON public.users(referral_code);
CREATE INDEX IF NOT EXISTS idx_users_referred_by ON public.users(referred_by);

-- 2. REFERRALS LOG TABLE (5% Commission Tracking)
CREATE TABLE IF NOT EXISTS public.referrals (
  id TEXT PRIMARY KEY,
  referrer_id TEXT NOT NULL,
  referred_user_id TEXT NOT NULL,
  referred_user_name TEXT,
  referred_user_email TEXT,
  deposit_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  commission_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_referrals_referrer_id ON public.referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referred_user_id ON public.referrals(referred_user_id);

-- 3. CAMPAIGNS TABLE (Organic Traffic & Social Ads SMM)
CREATE TABLE IF NOT EXISTS public.campaigns (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  user_email TEXT,
  name TEXT NOT NULL,
  target_url TEXT NOT NULL,
  daily_limit INTEGER DEFAULT 1000,
  total_budget NUMERIC(12,2) NOT NULL DEFAULT 10.00,
  spent NUMERIC(12,2) DEFAULT 0.00,
  status TEXT DEFAULT 'pending',
  target_country TEXT DEFAULT 'Worldwide',
  device_type TEXT DEFAULT 'all',
  start_date TIMESTAMPTZ DEFAULT NOW(),
  end_date TIMESTAMPTZ,
  cpm NUMERIC(8,4) DEFAULT 0.05,
  impressions_delivered INTEGER DEFAULT 0,
  clicks_delivered INTEGER DEFAULT 0,
  ad_format TEXT DEFAULT 'popunder',
  niche TEXT DEFAULT 'general',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_campaigns_user_id ON public.campaigns(user_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON public.campaigns(status);

-- 4. PAYMENTS / DEPOSITS TABLE
CREATE TABLE IF NOT EXISTS public.payments (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  user_name TEXT,
  user_email TEXT,
  amount NUMERIC(12,2) NOT NULL,
  gateway TEXT NOT NULL,
  transaction_id TEXT NOT NULL,
  proof_url TEXT,
  sender_account TEXT,
  sender_name TEXT,
  sender_mobile TEXT,
  sender_easypaisa TEXT,
  sender_paypal TEXT,
  sender_crypto TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  admin_note TEXT
);

CREATE INDEX IF NOT EXISTS idx_payments_user_id ON public.payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);

-- 5. TRANSACTIONS LOG TABLE
CREATE TABLE IF NOT EXISTS public.transactions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  type TEXT NOT NULL,
  amount NUMERIC(12,2) NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'completed',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON public.transactions(user_id);

-- 6. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'system',
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);

-- 7. TESTIMONIALS / REVIEWS TABLE
CREATE TABLE IF NOT EXISTS public.testimonials (
  id TEXT PRIMARY KEY,
  user_name TEXT NOT NULL,
  user_role TEXT DEFAULT 'Advertiser',
  user_avatar TEXT,
  content TEXT NOT NULL,
  rating INTEGER DEFAULT 5,
  approved BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. PLATFORM SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.platform_settings (
  id TEXT PRIMARY KEY DEFAULT 'settings_global',
  site_name TEXT DEFAULT 'TrafficSell',
  cpm_rate NUMERIC(8,4) DEFAULT 0.05,
  min_deposit NUMERIC(12,2) DEFAULT 1.00,
  min_campaign_budget NUMERIC(12,2) DEFAULT 5.00,
  manual_deposit_instructions JSONB,
  support_email TEXT DEFAULT 'support@trafficsell.com',
  support_whatsapp TEXT,
  support_telegram TEXT,
  payment_gateways JSONB,
  site_icon_url TEXT DEFAULT '/logo.png',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;

-- Allow public access for application operational sync
CREATE POLICY "Public Users Access" ON public.users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Referrals Access" ON public.referrals FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Campaigns Access" ON public.campaigns FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Payments Access" ON public.payments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Transactions Access" ON public.transactions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Notifications Access" ON public.notifications FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Testimonials Access" ON public.testimonials FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Settings Access" ON public.platform_settings FOR ALL USING (true) WITH CHECK (true);

-- Populate unique referral codes for any existing users with null referral codes
UPDATE public.users 
SET referral_code = 'REF_' || UPPER(SUBSTRING(MD5(id || email || RANDOM()::text) FROM 1 FOR 6))
WHERE referral_code IS NULL OR referral_code = '';

-- Complete TrafficSell Database Script.
