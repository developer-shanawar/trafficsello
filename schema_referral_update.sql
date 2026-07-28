-- =========================================================
-- TrafficSell Database Schema Update: 5% Referral System
-- =========================================================
-- Run this SQL in your Supabase SQL Editor to enable referral tracking
-- and 5% commission rewards.

-- 1. Add referral columns to public.users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS referral_code TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS referred_by TEXT,
ADD COLUMN IF NOT EXISTS total_referral_earnings NUMERIC(12,2) DEFAULT 0.00;

-- Create indexes for quick query performance
CREATE INDEX IF NOT EXISTS idx_users_referral_code ON public.users(referral_code);
CREATE INDEX IF NOT EXISTS idx_users_referred_by ON public.users(referred_by);

-- 2. Create referrals log table to record all 5% commissions earned
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

-- 3. Enable RLS or update policies if required
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public select referrals" ON public.referrals FOR SELECT USING (true);
CREATE POLICY "Allow public insert referrals" ON public.referrals FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update referrals" ON public.referrals FOR UPDATE USING (true);
