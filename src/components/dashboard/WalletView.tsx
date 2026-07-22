import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet, Plus, ArrowUpRight, ArrowDownLeft, Upload, CheckCircle2, Clock, AlertCircle, Copy, ShieldCheck, DollarSign } from 'lucide-react';
import { useStore } from '../../lib/store';
import { PaymentMethod } from '../../types';
import confetti from 'canvas-confetti';

export const WalletView: React.FC = () => {
  const { user, walletDeposits, requestDeposit, transactions, platformSettings } = useStore();

  const [activeTab, setActiveTab] = useState<'deposit' | 'history'>('deposit');
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('JazzCash');
  const [amount, setAmount] = useState<number>(50);
  const [trxRef, setTrxRef] = useState('');
  const [screenshotUrl, setScreenshotUrl] = useState('');
  const [copiedText, setCopiedText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const userDeposits = walletDeposits.filter(p => p.userId === user?.id || user?.role === 'admin');
  const userTx = transactions.filter(t => t.userId === user?.id || user?.role === 'admin');

  const methodsList: { id: PaymentMethod; name: string; detailKey: keyof typeof platformSettings.paymentAccounts }[] = [
    { id: 'JazzCash', name: 'JazzCash Instant', detailKey: 'jazzCashAccount' },
    { id: 'EasyPaisa', name: 'EasyPaisa Direct', detailKey: 'easyPaisaAccount' },
    { id: 'PayPal', name: 'PayPal Global', detailKey: 'payPalEmail' },
    { id: 'USDT TRC20', name: 'USDT (TRC20)', detailKey: 'usdtTrc20Address' },
    { id: 'USDT BEP20', name: 'USDT (BEP20)', detailKey: 'usdtBep20Address' },
    { id: 'USDT ERC20', name: 'USDT (ERC20)', detailKey: 'usdtErc20Address' },
  ];

  const getRecipientInfo = (m: PaymentMethod) => {
    const accs = platformSettings.paymentAccounts;
    switch (m) {
      case 'JazzCash':
        return { label: 'JazzCash Account No', val: accs.jazzCashAccount, title: accs.jazzCashTitle };
      case 'EasyPaisa':
        return { label: 'EasyPaisa Account No', val: accs.easyPaisaAccount, title: accs.easyPaisaTitle };
      case 'PayPal':
        return { label: 'PayPal Email', val: accs.payPalEmail, title: 'TrafficSell Global' };
      case 'USDT TRC20':
        return { label: 'USDT TRC20 Address', val: accs.usdtTrc20Address, title: 'TRON Network' };
      case 'USDT BEP20':
        return { label: 'USDT BEP20 Address', val: accs.usdtBep20Address, title: 'BNB Smart Chain' };
      case 'USDT ERC20':
        return { label: 'USDT ERC20 Address', val: accs.usdtErc20Address, title: 'Ethereum Network' };
    }
  };

  const recipient = getRecipientInfo(selectedMethod);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(''), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshotUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trxRef) return;

    setSubmitting(true);
    await requestDeposit({
      method: selectedMethod,
      amount,
      trxRef,
      screenshotUrl: screenshotUrl || 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&q=80&w=600',
    });

    setSubmitting(false);
    confetti({ particleCount: 80, spread: 60 });
    setSuccessMsg(`Your ${selectedMethod} deposit request of $${amount.toFixed(2)} was submitted! Our admin team will verify and credit your wallet shortly.`);
    setTrxRef('');
    setScreenshotUrl('');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      
      {/* Wallet Balance Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl p-6 md:p-8 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#DFFF2F]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-1">
          <span className="text-xs font-bold text-[#DFFF2F] uppercase tracking-wider flex items-center gap-1.5">
            <Wallet className="w-4 h-4" /> TrafficSell Wallet
          </span>
          <p className="text-xs text-slate-400">Available Balance for Campaign Launches</p>
          <div className="flex items-baseline gap-2 pt-1">
            <span className="text-4xl sm:text-5xl font-black text-[#DFFF2F]">${user?.walletBalance.toFixed(2)}</span>
            <span className="text-sm font-bold text-slate-400">USD</span>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-slate-950/60 p-4 rounded-2xl border border-slate-800 text-xs">
          <div>
            <p className="text-slate-400">Minimum Deposit:</p>
            <p className="font-extrabold text-white text-sm">${platformSettings.minDeposit.toFixed(2)} USD</p>
          </div>
          <div className="h-8 w-px bg-slate-800" />
          <div>
            <p className="text-slate-400">Processing Time:</p>
            <p className="font-extrabold text-emerald-400 text-sm">~5 - 15 Mins</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6">
        <button
          onClick={() => setActiveTab('deposit')}
          className={`pb-3 text-sm font-bold transition-all border-b-2 cursor-pointer ${
            activeTab === 'deposit'
              ? 'border-[#DFFF2F] text-slate-900 dark:text-[#DFFF2F]'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          + Deposit Funds
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`pb-3 text-sm font-bold transition-all border-b-2 cursor-pointer ${
            activeTab === 'history'
              ? 'border-[#DFFF2F] text-slate-900 dark:text-[#DFFF2F]'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Transaction & Deposit History ({userDeposits.length})
        </button>
      </div>

      {activeTab === 'deposit' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Method Selector */}
          <div className="lg:col-span-5 space-y-3">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Select Payment Gateway
            </label>
            <div className="space-y-2">
              {methodsList.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setSelectedMethod(m.id)}
                  className={`w-full p-4 rounded-2xl border transition-all flex items-center justify-between text-left cursor-pointer ${
                    selectedMethod === m.id
                      ? 'bg-slate-900 text-white dark:bg-[#DFFF2F] dark:text-slate-950 border-slate-900 dark:border-[#DFFF2F] shadow-lg scale-[1.02]'
                      : 'bg-white dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-[#DFFF2F]/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-0.5 bg-[#111827] text-[#DFFF2F] dark:bg-slate-800 dark:text-[#DFFF2F] rounded text-[10px] font-black uppercase">
                      {m.id.split(' ')[0]}
                    </span>
                    <span className="font-extrabold text-xs">{m.name}</span>
                  </div>
                  {selectedMethod === m.id && <CheckCircle2 className="w-4 h-4" />}
                </button>
              ))}
            </div>
          </div>

          {/* Deposit Form & Account Details */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
            
            {successMsg && (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-2xl flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-500" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Recipient Credentials Box */}
            <div className="p-4 bg-slate-900 text-white rounded-2xl border border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-xs text-slate-400">
                <span>Official Recipient Details ({selectedMethod})</span>
                <span className="text-[10px] text-emerald-400 font-bold">Verified Account</span>
              </div>
              <div className="flex items-center justify-between bg-slate-950 p-3 rounded-xl font-mono text-xs">
                <span className="text-[#DFFF2F] font-bold truncate pr-2">{recipient.val}</span>
                <button
                  type="button"
                  onClick={() => handleCopy(recipient.val)}
                  className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg shrink-0 flex items-center gap-1 text-[10px] font-sans cursor-pointer"
                >
                  <Copy className="w-3 h-3" />
                  {copiedText === recipient.val ? 'Copied!' : 'Copy'}
                </button>
              </div>
              {recipient.title && (
                <p className="text-[11px] text-slate-400">Account Title / Network: <strong className="text-white">{recipient.title}</strong></p>
              )}
            </div>

            <form onSubmit={handleSubmitDeposit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Deposit Amount ($ USD)
                </label>
                <div className="relative">
                  <DollarSign className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                  <input
                    type="number"
                    min={platformSettings.minDeposit}
                    step="1"
                    required
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full pl-9 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#DFFF2F]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Transaction Reference / TRX Hash ID
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. TRX_998124810239 or JazzCash TID"
                  value={trxRef}
                  onChange={(e) => setTrxRef(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:border-[#DFFF2F]"
                />
              </div>

              {/* Upload Screenshot */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Payment Receipt Screenshot
                </label>
                <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-center bg-slate-50 dark:bg-slate-950/50">
                  {screenshotUrl ? (
                    <div className="space-y-2">
                      <img src={screenshotUrl} alt="Receipt preview" className="max-h-32 mx-auto rounded-xl shadow-md" />
                      <button
                        type="button"
                        onClick={() => setScreenshotUrl('')}
                        className="text-xs text-rose-500 hover:underline"
                      >
                        Remove Image
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer block space-y-1">
                      <Upload className="w-6 h-6 text-slate-400 mx-auto" />
                      <span className="text-xs font-bold text-slate-600 dark:text-slate-300 block">Click to upload receipt image</span>
                      <span className="text-[10px] text-slate-400 block">PNG, JPG, WEBP max 5MB</span>
                      <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                    </label>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 bg-[#DFFF2F] hover:bg-[#cbe820] text-slate-950 font-black rounded-2xl text-sm transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : `Submit $${amount.toFixed(2)} Deposit for Verification`}
              </button>
            </form>
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm overflow-x-auto">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">Deposit Requests & Verification Status</h3>
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-mono text-[10px]">
                <tr>
                  <th className="pb-3">Method</th>
                  <th className="pb-3">TRX Ref</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Submitted</th>
                  <th className="pb-3">Admin Note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {userDeposits.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">No deposit history found.</td>
                  </tr>
                ) : (
                  userDeposits.map((dep) => (
                    <tr key={dep.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-3.5 font-bold text-slate-900 dark:text-white">{dep.method}</td>
                      <td className="py-3.5 font-mono text-slate-500">{dep.trxRef}</td>
                      <td className="py-3.5 font-bold text-[#DFFF2F]">${dep.amount.toFixed(2)}</td>
                      <td className="py-3.5">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          dep.status === 'approved' ? 'bg-emerald-500/10 text-emerald-500' :
                          dep.status === 'pending' ? 'bg-amber-500/10 text-amber-500' :
                          'bg-rose-500/10 text-rose-500'
                        }`}>
                          {dep.status}
                        </span>
                      </td>
                      <td className="py-3.5 text-slate-400 font-mono text-[11px]">
                        {new Date(dep.createdAt).toLocaleString()}
                      </td>
                      <td className="py-3.5 text-slate-400 italic text-[11px]">
                        {dep.adminNote || '-'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
