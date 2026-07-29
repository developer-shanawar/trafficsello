-- ====================================================================
-- TrafficSell / Platform Complete System Database Schema & Migration SQL
-- Compatible with Supabase, Cloud SQL, and PostgreSQL 12+
-- ====================================================================

-- Enable UUID extension if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- --------------------------------------------------------------------
-- 1. USERS TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT,
  full_name TEXT NOT NULL,
  role TEXT DEFAULT 'user', -- 'user' or 'admin'
  wallet_balance NUMERIC(12,2) DEFAULT 0.00,
  referral_balance NUMERIC(12,2) DEFAULT 0.00,
  custom_referral_rate NUMERIC(5,4) DEFAULT 0.0500, -- e.g. 0.0500 for 5%, 0.0800 for 8%, 0.1000 for 10%
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
  referred_by TEXT, -- Stores referrer user ID or referral code
  total_referral_earnings NUMERIC(12,2) DEFAULT 0.00
);

-- Indexes for Users
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_referral_code ON public.users(UPPER(referral_code));
CREATE INDEX IF NOT EXISTS idx_users_referred_by ON public.users(referred_by);

-- Ensure all users have 4-6 character referral codes
UPDATE public.users 
SET referral_code = UPPER(SUBSTRING(MD5(id || email || RANDOM()::text) FROM 1 FOR 6))
WHERE referral_code IS NULL OR referral_code = '' OR LENGTH(referral_code) > 12;


-- --------------------------------------------------------------------
-- 2. REFERRALS LOG TABLE (5%-15% Commission Tracking)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.referrals (
  id TEXT PRIMARY KEY,
  referrer_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  referred_user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  referred_user_name TEXT,
  referred_user_email TEXT,
  deposit_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  commission_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for Referrals
CREATE INDEX IF NOT EXISTS idx_referrals_referrer_id ON public.referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referred_user_id ON public.referrals(referred_user_id);


-- --------------------------------------------------------------------
-- 3. WITHDRAWAL REQUESTS SYSTEM TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.withdrawal_requests (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  user_name TEXT,
  user_email TEXT NOT NULL,
  amount NUMERIC(12,2) NOT NULL,
  method TEXT NOT NULL, -- e.g. 'Easypaisa', 'JazzCash', 'Bank Transfer', 'Crypto USDT', 'PayPal'
  account_title TEXT,
  account_number TEXT,
  crypto_address TEXT,
  status TEXT DEFAULT 'pending', -- 'pending' / 'in review', 'approved', 'rejected'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  admin_note TEXT
);

-- Indexes for Withdrawal Requests
CREATE INDEX IF NOT EXISTS idx_withdrawal_user_id ON public.withdrawal_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_withdrawal_status ON public.withdrawal_requests(status);


-- --------------------------------------------------------------------
-- 4. REFERRAL COMMISSION RATE INCREASE REQUESTS TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.commission_requests (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  user_name TEXT,
  user_email TEXT NOT NULL,
  referrals_count INTEGER DEFAULT 0,
  requested_rate NUMERIC(5,2) NOT NULL, -- e.g. 8 for 8%, 10 for 10%, 12 for 12%, 15 for 15%
  social_platform TEXT, -- e.g. 'Telegram Channel', 'YouTube', 'Website / Blog', 'Media Buying'
  proof_url TEXT, -- Proof screenshot link or channel link
  message TEXT NOT NULL,
  status TEXT DEFAULT 'in review', -- 'in review', 'approved', 'rejected'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  admin_note TEXT
);

-- Indexes for Commission Requests
CREATE INDEX IF NOT EXISTS idx_commission_req_user_id ON public.commission_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_commission_req_status ON public.commission_requests(status);

-- Optional View for backward compatibility if queried as 'referral_requests'
CREATE OR REPLACE VIEW public.referral_requests AS 
SELECT 
  id,
  user_id,
  user_name,
  user_email,
  referrals_count,
  requested_rate,
  social_platform,
  proof_url,
  message,
  status,
  created_at,
  admin_note
FROM public.commission_requests;


-- --------------------------------------------------------------------
-- 5. CAMPAIGNS TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.campaigns (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  user_email TEXT,
  name TEXT NOT NULL,
  target_url TEXT NOT NULL,
  daily_limit INTEGER DEFAULT 1000,
  total_budget NUMERIC(12,2) NOT NULL DEFAULT 10.00,
  spent NUMERIC(12,2) DEFAULT 0.00,
  status TEXT DEFAULT 'pending', -- 'pending', 'active', 'paused', 'completed', 'rejected'
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

-- Indexes for Campaigns
CREATE INDEX IF NOT EXISTS idx_campaigns_user_id ON public.campaigns(user_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON public.campaigns(status);


-- --------------------------------------------------------------------
-- 6. PAYMENTS / DEPOSITS TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.payments (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  user_name TEXT,
  user_email TEXT NOT NULL,
  amount NUMERIC(12,2) NOT NULL,
  gateway TEXT NOT NULL, -- 'easypaisa', 'jazzcash', 'crypto', 'paypal', 'manual'
  transaction_id TEXT NOT NULL,
  proof_url TEXT,
  sender_account TEXT,
  sender_name TEXT,
  sender_mobile TEXT,
  sender_easypaisa TEXT,
  sender_paypal TEXT,
  sender_crypto TEXT,
  status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  admin_note TEXT
);

-- Indexes for Payments
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON public.payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);


-- --------------------------------------------------------------------
-- 7. TRANSACTIONS LOG TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.transactions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- 'deposit', 'campaign_spend', 'referral_bonus', 'withdrawal'
  amount NUMERIC(12,2) NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'completed',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON public.transactions(user_id);


-- --------------------------------------------------------------------
-- 8. NOTIFICATIONS TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.notifications (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'system',
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);


-- --------------------------------------------------------------------
-- 9. TESTIMONIALS / REVIEWS TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.testimonials (
  id TEXT PRIMARY KEY,
  user_name TEXT NOT NULL,
  user_role TEXT DEFAULT 'Advertiser / Affiliate Partner',
  user_avatar TEXT,
  content TEXT NOT NULL,
  rating INTEGER DEFAULT 5,
  approved BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);


-- --------------------------------------------------------------------
-- 10. PLATFORM SETTINGS TABLE
-- --------------------------------------------------------------------
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


-- --------------------------------------------------------------------
-- 11. ROW LEVEL SECURITY (RLS) POLICIES
-- --------------------------------------------------------------------
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.withdrawal_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commission_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;

-- Global Permissive RLS Policies for Supabase Client Sync
DROP POLICY IF EXISTS "Public Users Access" ON public.users;
CREATE POLICY "Public Users Access" ON public.users FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Referrals Access" ON public.referrals;
CREATE POLICY "Public Referrals Access" ON public.referrals FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Withdrawal Requests Access" ON public.withdrawal_requests;
CREATE POLICY "Public Withdrawal Requests Access" ON public.withdrawal_requests FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Commission Requests Access" ON public.commission_requests;
CREATE POLICY "Public Commission Requests Access" ON public.commission_requests FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Campaigns Access" ON public.campaigns;
CREATE POLICY "Public Campaigns Access" ON public.campaigns FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Payments Access" ON public.payments;
CREATE POLICY "Public Payments Access" ON public.payments FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Transactions Access" ON public.transactions;
CREATE POLICY "Public Transactions Access" ON public.transactions FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Notifications Access" ON public.notifications;
CREATE POLICY "Public Notifications Access" ON public.notifications FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Testimonials Access" ON public.testimonials;
CREATE POLICY "Public Testimonials Access" ON public.testimonials FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Settings Access" ON public.platform_settings;
CREATE POLICY "Public Settings Access" ON public.platform_settings FOR ALL USING (true) WITH CHECK (true);

-- ====================================================================
-- END OF DATABASE SCHEMA SCRIPT
-- ====================================================================
