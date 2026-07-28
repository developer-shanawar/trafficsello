-- =========================================================
-- TrafficSell Supabase Database Schema & Migration SQL
-- Run this script in your Supabase SQL Editor
-- =========================================================

-- 1. Add Referral Columns to the 'users' table
ALTER TABLE users ADD COLUMN IF NOT EXISTS referral_code TEXT UNIQUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS referred_by TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS total_referral_earnings NUMERIC DEFAULT 0;

-- 2. Create 'referrals' tracking table for deposit commissions
CREATE TABLE IF NOT EXISTS referrals (
  id TEXT PRIMARY KEY,
  referrer_id TEXT NOT NULL,
  referred_user_id TEXT NOT NULL,
  referred_user_name TEXT,
  referred_user_email TEXT,
  deposit_amount NUMERIC NOT NULL DEFAULT 0,
  commission_amount NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast lookup by referrer ID
CREATE INDEX IF NOT EXISTS idx_referrals_referrer_id ON referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_users_referred_by ON users(referred_by);

-- 3. Enable Row Level Security (RLS) on referrals table
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;

-- 4. Create Security Policies for Public Access / API usage
DROP POLICY IF EXISTS "Allow public read access to referrals" ON referrals;
CREATE POLICY "Allow public read access to referrals" ON referrals FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert to referrals" ON referrals;
CREATE POLICY "Allow public insert to referrals" ON referrals FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update to referrals" ON referrals;
CREATE POLICY "Allow public update to referrals" ON referrals FOR UPDATE USING (true);

-- 5. Helper query to generate unique referral code for existing users if null
UPDATE users 
SET referral_code = 'REF_' || UPPER(SUBSTRING(MD5(id || email || RANDOM()::text) FROM 1 FOR 6))
WHERE referral_code IS NULL OR referral_code = '';

-- Complete! All referral tracking columns and tables are ready.
