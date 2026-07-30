import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Wallet, ShieldCheck, DollarSign, Layers, Clock, Zap, UserCheck, ArrowUpRight, ArrowDownLeft,
  CheckCircle2, Copy, Check, Upload, AlertCircle, Gift, Sparkles, CreditCard, Building, QrCode
} from 'lucide-react';
import { useStore } from '../../lib/store';
import { PaymentMethod } from '../../types';
import { WithdrawalModal } from '../modals/WithdrawalModal';
import { TransferModal } from '../modals/TransferModal';

export const WalletView: React.FC = () => {
  const { user, transactions, campaigns, walletDeposits, requestDeposit, platformSettings, formatMoney } = useStore();

  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [isTransferOpen, setIsTransferOpen] = useState(false);

  // Deposit Form State
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('JazzCash');
  const [amount, setAmount] = useState<number>(10);
  const [trxRef, setTrxRef] = useState<string>('');
  const [screenshotUrl, setScreenshotUrl] = useState<string>('');
  const [loadingDeposit, setLoadingDeposit] = useState<boolean>(false);
  const [depositSuccess, setDepositSuccess] = useState<string>('');
  const [depositError, setDepositError] = useState<string>('');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // User campaigns & budget calculations
  const userCampaigns = campaigns.filter(c => c.userId === user?.id || user?.role === 'admin');
  const activeCampaigns = userCampaigns.filter(c => c.status === 'running' || c.status === 'pending');
  const totalCampaignBudget = userCampaigns.reduce((sum, c) => sum + (c.budget || 0), 0);
  const totalHitsDelivered = userCampaigns.reduce((sum, c) => sum + (c.visitorsDelivered || 0), 0);
  
  const userTx = transactions.filter(t => t.userId === user?.id || user?.role === 'admin');
  const userDeposits = walletDeposits.filter(d => d.userId === user?.id || user?.role === 'admin');

  // Copy helper
  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Payment Accounts configuration
  const accounts = platformSettings?.paymentAccounts || {
    jazzCashAccount: "0300-1234567",
    jazzCashTitle: "TrafficSell Network Official",
    easyPaisaAccount: "0312-9876543",
    easyPaisaTitle: "TrafficSell Ops",
    payPalEmail: "billing@trafficsell.com",
    usdtTrc20Address: "T9yD14Nj9j7xXv8yK4w2Z1mNpQ7rS3tU5v",
    usdtBep20Address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
    usdtErc20Address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F"
  };

  // Get current payment gateway instructions
  const getGatewayDetails = () => {
    switch (selectedMethod) {
      case 'JazzCash':
        return {
          title: 'JazzCash Mobile Wallet',
          accountLabel: 'Account Number',
          accountValue: accounts.jazzCashAccount || '0300-1234567',
          nameLabel: 'Account Title',
          nameValue: accounts.jazzCashTitle || 'TrafficSell Network',
          note: 'Send PKR equivalent to the account above via JazzCash App or USSD code *786#. Enter your 12-digit TRX ID below.',
          badge: 'Pakistani PKR'
        };
      case 'EasyPaisa':
        return {
          title: 'EasyPaisa Mobile Wallet',
          accountLabel: 'Account Number',
          accountValue: accounts.easyPaisaAccount || '0312-9876543',
          nameLabel: 'Account Title',
          nameValue: accounts.easyPaisaTitle || 'TrafficSell Ops',
          note: 'Send PKR equivalent to the account above via EasyPaisa App. Enter your TRX ID and upload receipt proof.',
          badge: 'Pakistani PKR'
        };
      case 'USDT TRC20':
        return {
          title: 'USDT (TRC-20 TRON Network)',
          accountLabel: 'TRC20 Wallet Address',
          accountValue: accounts.usdtTrc20Address || 'T9yD14Nj9j7xXv8yK4w2Z1mNpQ7rS3tU5v',
          nameLabel: 'Network',
          nameValue: 'TRON (TRC-20)',
          note: 'Send exact USDT amount to the TRC-20 address above. Copy the TxHash from your exchange/wallet and paste below.',
          badge: 'Crypto Instant'
        };
      case 'USDT BEP20':
        return {
          title: 'USDT (BEP-20 BNB Smart Chain)',
          accountLabel: 'BEP20 Wallet Address',
          accountValue: accounts.usdtBep20Address || '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
          nameLabel: 'Network',
          nameValue: 'BNB Smart Chain (BEP-20)',
          note: 'Send USDT to the BEP-20 address above. Low gas fee network. Provide transaction hash after transfer.',
          badge: 'Crypto Instant'
        };
      case 'USDT ERC20':
        return {
          title: 'USDT (ERC-20 Ethereum)',
          accountLabel: 'ERC20 Wallet Address',
          accountValue: accounts.usdtErc20Address || '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
          nameLabel: 'Network',
          nameValue: 'Ethereum (ERC-20)',
          note: 'Send USDT to the ERC-20 address above. Ensure correct network selection to prevent loss of funds.',
          badge: 'Crypto Instant'
        };
      case 'PayPal':
        return {
          title: 'PayPal & Credit Card',
          accountLabel: 'PayPal Business Email',
          accountValue: accounts.payPalEmail || 'billing@trafficsell.com',
          nameLabel: 'Recipient Name',
          nameValue: 'TrafficSell Global Ltd',
          note: 'Send USD via Friends & Family / Goods & Services to our PayPal email. Paste your Transaction ID / Email below.',
          badge: 'Global USD'
        };
      default:
        return {
          title: 'Payment Gateway',
          accountLabel: 'Account Info',
          accountValue: 'Contact Support',
          nameLabel: 'Name',
          nameValue: 'TrafficSell',
          note: 'Please select a payment method.',
          badge: 'Standard'
        };
    }
  };

  const gateway = getGatewayDetails();
  const bonusAmount = amount * 0.20; // 20% bonus
  const totalCredited = amount + bonusAmount;

  // Handle Submit Deposit Request
  const handleDepositSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setDepositError('');
    setDepositSuccess('');

    if (!amount || amount < 1) {
      setDepositError('Minimum deposit amount is $1.00 USD.');
      return;
    }

    if (!trxRef.trim()) {
      setDepositError('Please enter your Transaction ID or Reference Hash.');
      return;
    }

    setLoadingDeposit(true);
    try {
      await requestDeposit({
        method: selectedMethod,
        amount: Number(amount),
        bonusAmount: Number(bonusAmount),
        trxRef: trxRef.trim(),
        screenshotUrl: screenshotUrl.trim() || undefined,
        senderName: user?.fullName || 'User',
      });

      setLoadingDeposit(false);
      setDepositSuccess('Deposit request submitted successfully! Admin will verify your receipt and credit your wallet balance shortly.');
      setTrxRef('');
      setScreenshotUrl('');
    } catch (err: any) {
      setLoadingDeposit(false);
      setDepositError(err.message || 'Failed to submit deposit request.');
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 text-[#111827] dark:text-white">
      
      {/* 1. Primary Campaign Balance & Traffic Budget Hero Box */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white rounded-3xl p-6 md:p-8 border border-slate-800 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#DFFF2F]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-[#DFFF2F] uppercase tracking-wider flex items-center gap-1.5 px-3 py-1 bg-[#DFFF2F]/10 border border-[#DFFF2F]/20 rounded-full">
                <Wallet className="w-3.5 h-3.5" /> Campaign Balance & Budget
              </span>
              <span className="text-xs font-extrabold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5" /> Role: {user?.role ? user.role.toUpperCase() : 'ADVERTISER'}
              </span>
            </div>

            <h2 className="text-2xl md:text-3xl font-black text-white">Campaign Balance & Add Funds Gateway</h2>
            <p className="text-xs text-slate-300 max-w-lg leading-relaxed">
              Real-time campaign wallet balance, allocated traffic budget, and instant deposit gateways via JazzCash, EasyPaisa, PayPal & USDT.
            </p>
          </div>

          {/* Balance Cards Display */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full lg:w-auto">
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shrink-0 min-w-[200px] shadow-lg">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Available Campaign Balance
              </span>
              <p className="text-3xl font-black text-[#DFFF2F] font-mono">
                {formatMoney(user?.walletBalance || 0)}
              </p>
              <div className="mt-2 flex items-center gap-1.5 text-[11px] font-bold text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" /> Ready for Traffic Orders
              </div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shrink-0 min-w-[200px] shadow-lg">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Total Campaign Budget Spent
              </span>
              <p className="text-3xl font-black text-white font-mono">
                {formatMoney(totalCampaignBudget)}
              </p>
              <div className="mt-2 flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
                <Layers className="w-3.5 h-3.5 text-[#DFFF2F]" /> {userCampaigns.length} Total Campaigns
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 2. Stat Metrics Summary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">Active Campaigns</span>
            <span className="text-2xl font-black text-slate-900 dark:text-white mt-1 block">{activeCampaigns.length}</span>
          </div>
          <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl">
            <Layers className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">Delivered Traffic</span>
            <span className="text-2xl font-black text-slate-900 dark:text-white mt-1 block">{totalHitsDelivered.toLocaleString()}</span>
          </div>
          <div className="p-3 bg-sky-500/10 text-sky-500 rounded-xl">
            <Zap className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">Delivery Speed</span>
            <span className="text-2xl font-black text-[#111827] dark:text-[#DFFF2F] mt-1 block">1 Hour Est.</span>
          </div>
          <div className="p-3 bg-[#DFFF2F]/20 text-[#111827] dark:text-[#DFFF2F] rounded-xl">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">Assigned User Role</span>
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1 block capitalize">
              {user?.role || 'Advertiser'}
            </span>
          </div>
          <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-xl">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* 3. ADD FUNDS & PAYMENT GATEWAYS SECTION */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/10 text-emerald-600 dark:text-[#DFFF2F] border border-emerald-500/20 uppercase tracking-wider">
                <Gift className="w-3 h-3 inline mr-1" /> 20% Deposit Bonus Active
              </span>
              <span className="text-xs text-slate-400 font-bold">$1 Minimum Deposit</span>
            </div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white">Add Funds & Deposit Gateways</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Select your preferred payment method below, transfer funds, and submit transaction details for instant admin receipt approval.
            </p>
          </div>
        </div>

        {/* Method Selector Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {(['JazzCash', 'EasyPaisa', 'USDT TRC20', 'USDT BEP20', 'USDT ERC20', 'PayPal'] as PaymentMethod[]).map((m) => {
            const isSelected = selectedMethod === m;
            return (
              <button
                key={m}
                type="button"
                onClick={() => setSelectedMethod(m)}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between h-24 relative overflow-hidden ${
                  isSelected
                    ? 'bg-slate-900 text-white border-[#DFFF2F] dark:border-[#DFFF2F] shadow-md ring-2 ring-[#DFFF2F]/30'
                    : 'bg-slate-50 dark:bg-slate-950/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2 w-4 h-4 bg-[#DFFF2F] rounded-full flex items-center justify-center text-slate-900 font-bold text-[10px]">
                    ✓
                  </div>
                )}
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Gateway</span>
                  <span className="font-black text-xs block leading-snug">{m}</span>
                </div>
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded w-fit ${
                  m.includes('USDT') ? 'bg-amber-500/10 text-amber-500' :
                  m === 'PayPal' ? 'bg-sky-500/10 text-sky-500' : 'bg-emerald-500/10 text-emerald-500'
                }`}>
                  {m.includes('USDT') ? 'Crypto' : m === 'PayPal' ? 'USD' : 'PKR Direct'}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Payment Gateway Account Credentials Display */}
        <div className="p-5 rounded-2xl bg-slate-950 text-white border border-slate-800 space-y-4 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div>
              <span className="text-[10px] font-bold text-[#DFFF2F] uppercase tracking-wider block">Official Deposit Credentials</span>
              <h4 className="text-base font-black text-white">{gateway.title}</h4>
            </div>
            <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-xs font-bold">
              {gateway.badge}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Account / Address Box */}
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">{gateway.accountLabel}</span>
                <span className="font-mono text-sm font-extrabold text-[#DFFF2F] break-all select-all">
                  {gateway.accountValue}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(gateway.accountValue, 'acc')}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors shrink-0 cursor-pointer"
                title="Copy Address/Number"
              >
                {copiedField === 'acc' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {/* Name / Title Box */}
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">{gateway.nameLabel}</span>
                <span className="font-semibold text-xs text-white">
                  {gateway.nameValue}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(gateway.nameValue, 'name')}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors shrink-0 cursor-pointer"
              >
                {copiedField === 'name' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <p className="text-xs text-slate-400 bg-slate-900/60 p-3 rounded-xl border border-slate-800/80 leading-relaxed">
            💡 <strong>Deposit Instructions:</strong> {gateway.note}
          </p>
        </div>

        {/* Deposit Submission Form */}
        <form onSubmit={handleDepositSubmit} className="space-y-4 pt-2">
          
          {depositError && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-semibold rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {depositError}
            </div>
          )}

          {depositSuccess && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-semibold rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              {depositSuccess}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            
            {/* Amount */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Deposit Amount ($ USD) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <DollarSign className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  required
                  value={amount}
                  onChange={(e) => setAmount(Math.max(1, Number(e.target.value)))}
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-xs font-bold font-mono text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <span className="text-[10px] text-emerald-600 dark:text-[#DFFF2F] font-bold mt-1 block">
                +20% Bonus ({formatMoney(bonusAmount)}) = {formatMoney(totalCredited)} Credited
              </span>
            </div>

            {/* TRX Reference / ID */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Transaction ID / TRX Hash <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. TRX-99221100 or Hash"
                value={trxRef}
                onChange={(e) => setTrxRef(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Enter receipt transaction ID or hash</span>
            </div>

            {/* Receipt Proof Screenshot URL */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Receipt Image Proof URL (Optional)
              </label>
              <div className="relative">
                <Upload className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="url"
                  placeholder="https://imgur.com/screenshot.jpg"
                  value={screenshotUrl}
                  onChange={(e) => setScreenshotUrl(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">Direct image link or screenshot proof</span>
            </div>

          </div>

          <button
            type="submit"
            disabled={loadingDeposit}
            className="w-full sm:w-auto px-8 py-3.5 bg-[#111827] dark:bg-[#DFFF2F] hover:bg-slate-800 dark:hover:bg-[#cbe820] text-white dark:text-[#111827] font-extrabold rounded-2xl text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loadingDeposit ? 'Submitting Receipt...' : 'Submit Deposit Request for Admin Approval'}
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </form>

      </div>

      {/* 4. USER'S PENDING & SUBMITTED DEPOSITS TRACKER */}
      {userDeposits.length > 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Your Submitted Deposit Receipts</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Track real-time admin receipt verification status</p>
            </div>
            <span className="text-xs font-mono font-bold text-[#DFFF2F]">
              {userDeposits.length} Requests
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-mono text-[10px]">
                <tr>
                  <th className="pb-3">Deposit ID</th>
                  <th className="pb-3">Gateway</th>
                  <th className="pb-3">TRX Ref</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Bonus</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {userDeposits.map((dep) => (
                  <tr key={dep.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-3 font-mono text-[11px] font-bold text-[#DFFF2F]">{dep.id}</td>
                    <td className="py-3 font-bold text-slate-900 dark:text-white">{dep.method}</td>
                    <td className="py-3 font-mono text-slate-500 dark:text-slate-300">{dep.trxRef || 'N/A'}</td>
                    <td className="py-3 font-black text-emerald-500">{formatMoney(dep.amount)}</td>
                    <td className="py-3 font-bold text-emerald-400">+{formatMoney(dep.bonusAmount || dep.amount * 0.2)}</td>
                    <td className="py-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                        dep.status === 'approved' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                        dep.status === 'rejected' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                        'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}>
                        {dep.status === 'pending' ? '⏳ Awaiting Admin Review' : dep.status}
                      </span>
                    </td>
                    <td className="py-3 text-slate-400 font-mono text-[11px]">
                      {new Date(dep.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. Campaign Budget & Wallet Activity History Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Campaign & Wallet Activity History</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">All campaign budget allocations, referral commissions, and wallet transactions</p>
          </div>
          <span className="text-xs font-bold text-slate-400 font-mono">
            {userTx.length} Entries
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-mono text-[10px]">
              <tr>
                <th className="pb-3">Transaction ID</th>
                <th className="pb-3">Type</th>
                <th className="pb-3">Description</th>
                <th className="pb-3">Amount</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {userTx.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">No activity history recorded yet. Launch a campaign or deposit funds to see transactions here.</td>
                </tr>
              ) : (
                userTx.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-3.5 font-mono text-[11px] font-bold text-[#DFFF2F]">{tx.id}</td>
                    <td className="py-3.5 font-bold uppercase text-slate-900 dark:text-white">{tx.type}</td>
                    <td className="py-3.5 text-slate-600 dark:text-slate-300 font-medium">{tx.description}</td>
                    <td className={`py-3.5 font-bold ${tx.amount > 0 ? 'text-emerald-500' : 'text-slate-900 dark:text-white'}`}>
                      {formatMoney(tx.amount)}
                    </td>
                    <td className="py-3.5">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                        {tx.status || 'completed'}
                      </span>
                    </td>
                    <td className="py-3.5 text-slate-400 font-mono text-[11px]">
                      {new Date(tx.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <WithdrawalModal
        isOpen={isWithdrawOpen}
        onClose={() => setIsWithdrawOpen(false)}
      />
      <TransferModal
        isOpen={isTransferOpen}
        onClose={() => setIsTransferOpen(false)}
      />
    </div>
  );
};
