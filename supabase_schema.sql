-- TrafficSell Supabase Database Schema
-- Run this SQL in your Supabase SQL Editor (https://supabase.com)

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS / PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT,
  full_name TEXT NOT NULL,
  telegram TEXT,
  whats_app TEXT,
  wallet_balance NUMERIC DEFAULT 0.00,
  role TEXT DEFAULT 'user',
  country TEXT,
  city TEXT,
  postal_code TEXT,
  is_verified BOOLEAN DEFAULT true,
  is_suspended BOOLEAN DEFAULT false,
  avatar TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure all columns exist on public.users even if table was created previously
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS password TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS telegram TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS whats_app TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS wallet_balance NUMERIC DEFAULT 0.00;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS country TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS postal_code TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT true;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS is_suspended BOOLEAN DEFAULT false;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS avatar TEXT;

-- 2. CAMPAIGNS TABLE
CREATE TABLE IF NOT EXISTS public.campaigns (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES public.users(id) ON DELETE CASCADE,
  user_name TEXT,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  keywords TEXT,
  format TEXT NOT NULL,
  country TEXT NOT NULL,
  device_type TEXT NOT NULL,
  visitors_target BIGINT NOT NULL,
  visitors_delivered BIGINT DEFAULT 0,
  cpm NUMERIC NOT NULL,
  budget NUMERIC NOT NULL,
  status TEXT DEFAULT 'pending',
  estimated_delivery_hours INT DEFAULT 24,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.campaigns ADD COLUMN IF NOT EXISTS user_name TEXT;
ALTER TABLE public.campaigns ADD COLUMN IF NOT EXISTS keywords TEXT;
ALTER TABLE public.campaigns ADD COLUMN IF NOT EXISTS visitors_delivered BIGINT DEFAULT 0;

-- 3. PAYMENT DEPOSITS TABLE
CREATE TABLE IF NOT EXISTS public.payment_deposits (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES public.users(id) ON DELETE CASCADE,
  user_name TEXT,
  user_email TEXT,
  method TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  trx_ref TEXT NOT NULL,
  screenshot_url TEXT,
  status TEXT DEFAULT 'pending',
  admin_note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.payment_deposits ADD COLUMN IF NOT EXISTS admin_note TEXT;
ALTER TABLE public.payment_deposits ADD COLUMN IF NOT EXISTS screenshot_url TEXT;

-- 4. TRANSACTIONS TABLE
CREATE TABLE IF NOT EXISTS public.transactions (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES public.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'completed',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. SUPPORT TICKETS TABLE
CREATE TABLE IF NOT EXISTS public.support_tickets (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES public.users(id) ON DELETE CASCADE,
  user_name TEXT,
  user_email TEXT,
  subject TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  priority TEXT DEFAULT 'medium',
  status TEXT DEFAULT 'open',
  messages JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'system',
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. PLATFORM SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.platform_settings (
  id TEXT PRIMARY KEY DEFAULT 'main',
  site_name TEXT DEFAULT 'TrafficSell',
  site_icon_url TEXT DEFAULT '/logo.svg',
  brand_display_mode TEXT DEFAULT 'both',
  default_cpm NUMERIC DEFAULT 0.05,
  min_deposit_amount NUMERIC DEFAULT 10.00,
  easypaisa_number TEXT,
  easypaisa_title TEXT,
  jazzcash_number TEXT,
  jazzcash_title TEXT,
  usdt_trc20_address TEXT,
  bank_account_title TEXT,
  bank_name TEXT,
  bank_account_number TEXT,
  bank_iban TEXT,
  page_content JSONB,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. TESTIMONIALS TABLE
CREATE TABLE IF NOT EXISTS public.testimonials (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT,
  company TEXT,
  avatar TEXT,
  content TEXT NOT NULL,
  rating INT DEFAULT 5,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. SOCIAL ADVERTISING TABLES
CREATE TABLE IF NOT EXISTS public.social_services (
  id TEXT PRIMARY KEY,
  platform TEXT NOT NULL,
  service_name TEXT NOT NULL,
  service_type TEXT NOT NULL,
  price_per_1000 NUMERIC(10,2) NOT NULL,
  min_quantity INT DEFAULT 100,
  max_quantity INT DEFAULT 100000,
  estimated_minutes INT DEFAULT 30,
  description TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.social_campaigns (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  user_name TEXT,
  service_id TEXT NOT NULL,
  platform TEXT NOT NULL,
  service_name TEXT NOT NULL,
  target_link TEXT NOT NULL,
  quantity INT NOT NULL,
  price_per_1000 NUMERIC(10,2) NOT NULL,
  total_cost NUMERIC(10,2) NOT NULL,
  estimated_minutes INT DEFAULT 30,
  status TEXT DEFAULT 'pending',
  admin_note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- VIEWS FOR ALIASED COMPATIBILITY
CREATE OR REPLACE VIEW public.deposits AS SELECT * FROM public.payment_deposits;
CREATE OR REPLACE VIEW public.tickets AS SELECT * FROM public.support_tickets;

-- DISABLE RLS FOR FREE ACCESS
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_deposits DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_services DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_campaigns DISABLE ROW LEVEL SECURITY;

-- SAFE REALTIME PUBLICATION SETUP (Ignores duplicate table publication errors)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    CREATE PUBLICATION supabase_realtime;
  END IF;

  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.users;
  EXCEPTION WHEN OTHERS THEN NULL;
  END;

  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.payment_deposits;
  EXCEPTION WHEN OTHERS THEN NULL;
  END;

  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.support_tickets;
  EXCEPTION WHEN OTHERS THEN NULL;
  END;

  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
  EXCEPTION WHEN OTHERS THEN NULL;
  END;

  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.campaigns;
  EXCEPTION WHEN OTHERS THEN NULL;
  END;

  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.transactions;
  EXCEPTION WHEN OTHERS THEN NULL;
  END;

  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.social_services;
  EXCEPTION WHEN OTHERS THEN NULL;
  END;

  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.social_campaigns;
  EXCEPTION WHEN OTHERS THEN NULL;
  END;
END $$;

-- SEED INITIAL MASTER ADMIN USER
INSERT INTO public.users (id, email, password, full_name, telegram, whats_app, wallet_balance, role, created_at, avatar, country, is_verified)
VALUES (
  'usr_master_admin',
  'developershanawar@gmail.com',
  'admin123',
  'Shanawar Admin',
  '@developershanawar',
  '+92 300-1234567',
  2500.00,
  'admin',
  NOW(),
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
  'Pakistan',
  true
)
ON CONFLICT (id) DO UPDATE 
SET role = 'admin', full_name = 'Shanawar Admin';

-- SEED INITIAL PLATFORM SETTINGS
INSERT INTO public.platform_settings (id, site_name, site_icon_url, brand_display_mode, default_cpm, min_deposit_amount, easypaisa_number, easypaisa_title, jazzcash_number, jazzcash_title, usdt_trc20_address)
VALUES (
  'main',
  'TrafficSell',
  '/logo.svg',
  'both',
  0.05,
  10.00,
  '03001234567',
  'TrafficSell Official EasyPaisa',
  '03001234567',
  'TrafficSell Official JazzCash',
  'TY38a7Kx99mQLLzX21TRC20WalletAddress'
)
ON CONFLICT (id) DO NOTHING;
