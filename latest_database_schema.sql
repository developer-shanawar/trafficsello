-- ====================================================================
-- TRAFFICSELL / AD NETWORK COMPLETE DATABASE SCHEMA & SEED DATA SCRIPT
-- Compatible with PostgreSQL 12+, Supabase, Cloud SQL, and CockroachDB
-- ====================================================================

-- 1. Enable Required Database Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- --------------------------------------------------------------------
-- 2. USERS & ADMIN ACCOUNTS TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.users (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  email TEXT UNIQUE NOT NULL,
  username TEXT DEFAULT 'user',
  password TEXT, -- Encrypted / Hashed password
  full_name TEXT NOT NULL DEFAULT 'User',
  role TEXT DEFAULT 'user', -- 'user' or 'admin'
  wallet_balance NUMERIC(12,2) DEFAULT 0.00,
  referral_balance NUMERIC(12,2) DEFAULT 0.00,
  custom_referral_rate NUMERIC(5,4) DEFAULT 0.0500, -- Default 5% referral commission
  avatar TEXT,
  ip_address TEXT,
  registration_ip TEXT,
  last_login_ip TEXT,
  is_verified BOOLEAN DEFAULT TRUE,
  is_suspended BOOLEAN DEFAULT FALSE,
  telegram TEXT,
  whats_app TEXT,
  referral_code TEXT UNIQUE,
  referred_by TEXT, -- Direct referrer user ID or referral code
  total_referral_earnings NUMERIC(12,2) DEFAULT 0.00,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure all columns exist even if public.users was previously created
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS username TEXT DEFAULT 'user';
ALTER TABLE public.users ALTER COLUMN username DROP NOT NULL;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS password TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS full_name TEXT DEFAULT 'User';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS wallet_balance NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS referral_balance NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS custom_referral_rate NUMERIC(5,4) DEFAULT 0.0500;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS avatar TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS ip_address TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS registration_ip TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS last_login_ip TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT TRUE;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS is_suspended BOOLEAN DEFAULT FALSE;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS telegram TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS whats_app TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS referral_code TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS referred_by TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS total_referral_earnings NUMERIC(12,2) DEFAULT 0.00;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

-- Indexes for Fast User Queries
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_users_referral_code ON public.users(UPPER(referral_code));
CREATE INDEX IF NOT EXISTS idx_users_referred_by ON public.users(referred_by);


-- --------------------------------------------------------------------
-- 3. CAMPAIGNS TABLE (PopUnder, SmartLink, Direct Traffic)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.campaigns (
  id TEXT PRIMARY KEY DEFAULT ('cmp_' || extract(epoch from now())::bigint::text),
  user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  user_name TEXT,
  user_email TEXT,
  name TEXT NOT NULL,
  target_url TEXT NOT NULL,
  visitors_target INTEGER NOT NULL DEFAULT 10000,
  visitors_delivered INTEGER DEFAULT 0,
  budget NUMERIC(12,2) NOT NULL DEFAULT 10.00,
  spent NUMERIC(12,2) DEFAULT 0.00,
  cpm NUMERIC(8,4) DEFAULT 0.05, -- $0.05 CPM default rate
  status TEXT DEFAULT 'pending', -- 'pending', 'running', 'paused', 'completed', 'rejected'
  target_country TEXT DEFAULT 'Worldwide',
  device_type TEXT DEFAULT 'all', -- 'all', 'desktop', 'mobile'
  ad_format TEXT DEFAULT 'SmartLink', -- 'SmartLink', 'Popunder', 'Banner'
  estimated_delivery_hours INTEGER DEFAULT 1, -- 1-Hour Express Delivery
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.campaigns ADD COLUMN IF NOT EXISTS estimated_delivery_hours INTEGER DEFAULT 1;

-- Indexes for Campaigns
CREATE INDEX IF NOT EXISTS idx_campaigns_user_id ON public.campaigns(user_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON public.campaigns(status);


-- --------------------------------------------------------------------
-- 4. PAYMENT DEPOSITS & RECEIPT VERIFICATION TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.payment_deposits (
  id TEXT PRIMARY KEY DEFAULT ('pay_' || extract(epoch from now())::bigint::text),
  user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  user_name TEXT,
  user_email TEXT NOT NULL,
  method TEXT NOT NULL, -- 'JazzCash', 'EasyPaisa', 'PayPal', 'USDT TRC20', 'USDT BEP20', 'USDT ERC20'
  amount NUMERIC(12,2) NOT NULL,
  bonus_amount NUMERIC(12,2) DEFAULT 0.00,
  trx_ref TEXT NOT NULL,
  screenshot_url TEXT,
  status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  admin_note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for Deposits
CREATE INDEX IF NOT EXISTS idx_deposits_user_id ON public.payment_deposits(user_id);
CREATE INDEX IF NOT EXISTS idx_deposits_status ON public.payment_deposits(status);


-- --------------------------------------------------------------------
-- 5. TRANSACTIONS AUDIT LOG TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.transactions (
  id TEXT PRIMARY KEY DEFAULT ('tx_' || extract(epoch from now())::bigint::text),
  user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- 'deposit', 'campaign_spend', 'referral_commission', 'withdrawal'
  amount NUMERIC(12,2) NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'completed',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON public.transactions(user_id);


-- --------------------------------------------------------------------
-- 6. WITHDRAWAL REQUESTS SYSTEM TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.withdrawal_requests (
  id TEXT PRIMARY KEY DEFAULT ('wd_' || extract(epoch from now())::bigint::text),
  user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  user_name TEXT,
  user_email TEXT NOT NULL,
  amount NUMERIC(12,2) NOT NULL,
  method TEXT NOT NULL, -- 'JazzCash', 'EasyPaisa', 'PayPal', 'USDT TRC20', 'USDT BEP20'
  account_title TEXT,
  account_number TEXT,
  crypto_address TEXT,
  status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  admin_note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_withdrawals_user_id ON public.withdrawal_requests(user_id);


-- --------------------------------------------------------------------
-- 7. COMMISSION INCREASE REQUESTS TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.commission_requests (
  id TEXT PRIMARY KEY DEFAULT ('com_' || extract(epoch from now())::bigint::text),
  user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  user_name TEXT,
  user_email TEXT NOT NULL,
  referrals_count INTEGER DEFAULT 0,
  requested_rate NUMERIC(5,2) NOT NULL, -- 8%, 10%, 12%, 15%
  social_platform TEXT, -- e.g. 'Telegram Channel', 'YouTube', 'Website'
  proof_url TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'in review', -- 'in review', 'approved', 'rejected'
  admin_note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);


-- --------------------------------------------------------------------
-- 8. REFERRALS LOG TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.referrals (
  id TEXT PRIMARY KEY DEFAULT ('ref_' || extract(epoch from now())::bigint::text),
  referrer_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  referred_user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  referred_user_name TEXT,
  referred_user_email TEXT,
  deposit_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  commission_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMPTZ DEFAULT NOW()
);


-- --------------------------------------------------------------------
-- 9. NOTIFICATIONS TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.notifications (
  id TEXT PRIMARY KEY DEFAULT ('ntf_' || extract(epoch from now())::bigint::text),
  user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'system',
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);


-- --------------------------------------------------------------------
-- 10. PLATFORM GLOBAL SETTINGS TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.platform_settings (
  id TEXT PRIMARY KEY DEFAULT 'settings_global',
  site_name TEXT DEFAULT 'TrafficSell',
  site_icon_url TEXT DEFAULT '/logo.png',
  brand_display_mode TEXT DEFAULT 'both',
  min_deposit NUMERIC(12,2) DEFAULT 1.00,
  min_cpm NUMERIC(8,4) DEFAULT 0.05,
  announcement TEXT DEFAULT '🚀 Instant 1-Hour Traffic Delivery active on all approved campaigns! Deposit via JazzCash, EasyPaisa, PayPal & USDT to get a 20% bonus.',
  payment_accounts JSONB DEFAULT '{
    "jazzCashAccount": "0300-1234567",
    "jazzCashTitle": "TrafficSell Network Official",
    "easyPaisaAccount": "0312-9876543",
    "easyPaisaTitle": "TrafficSell Ops",
    "payPalEmail": "billing@trafficsell.com",
    "usdtTrc20Address": "T9yD14Nj9j7xXv8yK4w2Z1mNpQ7rS3tU5v",
    "usdtBep20Address": "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
    "usdtErc20Address": "0x71C7656EC7ab88b098defB751B7401B5f6d8976F"
  }'::jsonb,
  page_content JSONB DEFAULT '{
    "privacyPolicy": "Default privacy policy...",
    "termsOfService": "Default terms of service...",
    "refundPolicy": "Default refund policy...",
    "aboutUs": "Default about us...",
    "supportEmail": "support@trafficsell.com",
    "telegramContact": "https://t.me/trafficsell_support",
    "whatsAppContact": "https://wa.me/15550192834"
  }'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);


-- --------------------------------------------------------------------
-- 11. PRE-SEEDED ADMIN ACCOUNT & SAMPLE DATA
-- --------------------------------------------------------------------

-- Seed Super Admin Account
INSERT INTO public.users (
  id,
  email,
  username,
  password,
  full_name,
  role,
  wallet_balance,
  referral_balance,
  custom_referral_rate,
  referral_code,
  is_verified,
  created_at
) VALUES (
  'usr_admin_001',
  'developershanawar@gmail.com',
  'shanawar_admin',
  '$2a$10$e8W1.YV.4x4Z5/8z.uYyXeX3t9d2Yq7b2c0m.3...', -- Hashed default password
  'Shanawar Admin',
  'admin',
  10000.00,
  500.00,
  0.1000,
  'ADMIN1',
  TRUE,
  NOW()
) ON CONFLICT (email) DO UPDATE SET
  role = 'admin',
  username = EXCLUDED.username,
  password = EXCLUDED.password,
  wallet_balance = GREATEST(public.users.wallet_balance, 10000.00);


-- Seed Platform Settings
INSERT INTO public.platform_settings (
  id, site_name, site_icon_url, brand_display_mode, min_deposit, min_cpm
) VALUES (
  'settings_global', 'TrafficSell', '/logo.png', 'both', 1.00, 0.05
) ON CONFLICT (id) DO NOTHING;


-- --------------------------------------------------------------------
-- 12. ROW LEVEL SECURITY (RLS) POLICIES
-- --------------------------------------------------------------------
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_deposits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.withdrawal_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commission_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;

-- Permissive client RLS policies for seamless frontend operations
DROP POLICY IF EXISTS "Enable all access for users" ON public.users;
CREATE POLICY "Enable all access for users" ON public.users FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Enable all access for campaigns" ON public.campaigns;
CREATE POLICY "Enable all access for campaigns" ON public.campaigns FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Enable all access for deposits" ON public.payment_deposits;
CREATE POLICY "Enable all access for deposits" ON public.payment_deposits FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Enable all access for transactions" ON public.transactions;
CREATE POLICY "Enable all access for transactions" ON public.transactions FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Enable all access for withdrawals" ON public.withdrawal_requests;
CREATE POLICY "Enable all access for withdrawals" ON public.withdrawal_requests FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Enable all access for commission_requests" ON public.commission_requests;
CREATE POLICY "Enable all access for commission_requests" ON public.commission_requests FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Enable all access for referrals" ON public.referrals;
CREATE POLICY "Enable all access for referrals" ON public.referrals FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Enable all access for notifications" ON public.notifications;
CREATE POLICY "Enable all access for notifications" ON public.notifications FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Enable all access for platform_settings" ON public.platform_settings;
CREATE POLICY "Enable all access for platform_settings" ON public.platform_settings FOR ALL USING (true) WITH CHECK (true);

-- ====================================================================
-- END OF SQL SCHEMA & SEED DATA FILE
-- ====================================================================
