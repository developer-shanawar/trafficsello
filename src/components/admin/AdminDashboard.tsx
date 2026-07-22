import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldAlert, CheckCircle2, XCircle, Eye, Wallet, DollarSign,
  Users, Layers, Settings, Megaphone, Edit, Save, AlertTriangle, Image as ImageIcon
} from 'lucide-react';
import { useStore } from '../../lib/store';
import { PaymentDeposit, PlatformSettings } from '../../types';

export const AdminDashboard: React.FC = () => {
  const {
    walletDeposits, approveDeposit, rejectDeposit, campaigns, updateCampaignStatus,
    allUsers, updateUserBalanceByAdmin, platformSettings, updatePlatformSettings
  } = useStore();

  const [activeTab, setActiveTab] = useState<'deposits' | 'campaigns' | 'users' | 'settings'>('deposits');
  const [selectedReceiptUrl, setSelectedReceiptUrl] = useState<string | null>(null);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [newBalanceInput, setNewBalanceInput] = useState<number>(0);

  // Settings form state
  const [settingsForm, setSettingsForm] = useState<PlatformSettings>(platformSettings);
  const [settingsSaved, setSettingsSaved] = useState(false);

  const pendingDeposits = walletDeposits.filter(d => d.status === 'pending');
  const pendingCampaigns = campaigns.filter(c => c.status === 'pending');
  const totalVolumeApproved = walletDeposits.filter(d => d.status === 'approved').reduce((a, b) => a + b.amount, 0);

  const handleApprove = (id: string) => {
    approveDeposit(id, 'Deposit verified & credited by Admin.');
  };

  const handleReject = (id: string) => {
    const reason = prompt('Enter rejection reason for user notification:', 'Invalid TRX reference or receipt');
    if (reason !== null) {
      rejectDeposit(id, reason);
    }
  };

  const handleSaveUserBalance = (userId: string) => {
    updateUserBalanceByAdmin(userId, newBalanceInput);
    setEditingUserId(null);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updatePlatformSettings(settingsForm);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2000);
  };

  return (
    <div className="space-y-8">
      
      {/* Admin Hero */}
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-amber-950 text-white rounded-3xl p-6 md:p-8 border border-amber-500/30 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative overflow-hidden">
        <div>
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
            <ShieldAlert className="w-4 h-4" /> Chief Operations & Compliance
          </span>
          <h2 className="text-2xl sm:text-3xl font-black">TrafficSell Admin Control Center</h2>
          <p className="text-xs text-amber-200/80 mt-1">
            Review manual deposit screenshots, adjust user balances, and manage global CPM rates.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-slate-950/80 p-3.5 rounded-2xl border border-amber-500/20 text-xs">
          <div>
            <span className="text-slate-400 block">Pending Deposits:</span>
            <span className="font-extrabold text-amber-400 text-lg">{pendingDeposits.length} Pending</span>
          </div>
          <div className="h-8 w-px bg-slate-800" />
          <div>
            <span className="text-slate-400 block">Approved Volume:</span>
            <span className="font-extrabold text-[#DFFF2F] text-lg">${totalVolumeApproved.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6 flex-wrap">
        <button
          onClick={() => setActiveTab('deposits')}
          className={`pb-3 text-sm font-bold transition-all border-b-2 cursor-pointer ${
            activeTab === 'deposits'
              ? 'border-amber-400 text-amber-500 dark:text-amber-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Payment Verification ({pendingDeposits.length})
        </button>
        <button
          onClick={() => setActiveTab('campaigns')}
          className={`pb-3 text-sm font-bold transition-all border-b-2 cursor-pointer ${
            activeTab === 'campaigns'
              ? 'border-amber-400 text-amber-500 dark:text-amber-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Campaign Approvals ({pendingCampaigns.length})
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`pb-3 text-sm font-bold transition-all border-b-2 cursor-pointer ${
            activeTab === 'users'
              ? 'border-amber-400 text-amber-500 dark:text-amber-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          User Accounts & Wallets ({allUsers.length})
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`pb-3 text-sm font-bold transition-all border-b-2 cursor-pointer ${
            activeTab === 'settings'
              ? 'border-amber-400 text-amber-500 dark:text-amber-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Site Settings & Credentials
        </button>
      </div>

      {/* Pending Deposits Tab */}
      {activeTab === 'deposits' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm overflow-x-auto">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">Manual Payment Approval Queue</h3>
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-mono text-[10px]">
                <tr>
                  <th className="pb-3">User Details</th>
                  <th className="pb-3">Gateway</th>
                  <th className="pb-3">TRX Hash / ID</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Receipt Screenshot</th>
                  <th className="pb-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {walletDeposits.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">No payment requests submitted.</td>
                  </tr>
                ) : (
                  walletDeposits.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-3.5">
                        <p className="font-bold text-slate-900 dark:text-white">{p.userName}</p>
                        <p className="text-[10px] text-slate-400">{p.userEmail}</p>
                      </td>
                      <td className="py-3.5 font-bold text-[#DFFF2F]">{p.method}</td>
                      <td className="py-3.5 font-mono text-slate-400">{p.trxRef}</td>
                      <td className="py-3.5 font-bold text-lg text-slate-900 dark:text-white">${p.amount.toFixed(2)}</td>
                      <td className="py-3.5">
                        {p.screenshotUrl ? (
                          <button
                            onClick={() => setSelectedReceiptUrl(p.screenshotUrl)}
                            className="py-1 px-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <ImageIcon className="w-3 h-3 text-[#DFFF2F]" /> View Image
                          </button>
                        ) : (
                          <span className="text-slate-500 italic">No image</span>
                        )}
                      </td>
                      <td className="py-3.5">
                        {p.status === 'pending' ? (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleApprove(p.id)}
                              className="py-1.5 px-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1 shadow cursor-pointer"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                            </button>
                            <button
                              onClick={() => handleReject(p.id)}
                              className="py-1.5 px-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-bold rounded-xl text-xs flex items-center gap-1 cursor-pointer"
                            >
                              <XCircle className="w-3.5 h-3.5" /> Decline
                            </button>
                          </div>
                        ) : (
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            p.status === 'approved' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
                          }`}>
                            {p.status}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Campaign Approvals Tab */}
      {activeTab === 'campaigns' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm overflow-x-auto">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">Pending Campaign Quality Review Queue</h3>
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-mono text-[10px]">
              <tr>
                <th className="pb-3">Campaign Name & URL</th>
                <th className="pb-3">Format</th>
                <th className="pb-3">Target Geo</th>
                <th className="pb-3">Target Visitors</th>
                <th className="pb-3">Budget</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {campaigns.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">No campaigns created yet.</td>
                </tr>
              ) : (
                campaigns.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-3.5">
                      <p className="font-extrabold text-slate-900 dark:text-white">{c.name}</p>
                      <a href={c.url} target="_blank" rel="noreferrer" className="text-[11px] text-emerald-600 dark:text-[#DFFF2F] hover:underline font-mono truncate max-w-xs block">
                        {c.url}
                      </a>
                    </td>
                    <td className="py-3.5 font-bold uppercase text-slate-700 dark:text-slate-300">{c.format || 'SmartLink'}</td>
                    <td className="py-3.5 font-bold text-slate-900 dark:text-white">{c.country}</td>
                    <td className="py-3.5 font-mono">{c.visitorsTarget.toLocaleString()} Hits</td>
                    <td className="py-3.5 font-extrabold text-[#DFFF2F]">${c.budget.toFixed(2)}</td>
                    <td className="py-3.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                        c.status === 'running' ? 'bg-emerald-500/10 text-emerald-500' :
                        c.status === 'pending' ? 'bg-amber-500/20 text-amber-500' :
                        'bg-slate-500/10 text-slate-400'
                      }`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="py-3.5">
                      {c.status === 'pending' ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateCampaignStatus(c.id, 'running')}
                            className="py-1.5 px-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black rounded-xl text-xs flex items-center gap-1 cursor-pointer"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" /> Approve Campaign
                          </button>
                          <button
                            onClick={() => updateCampaignStatus(c.id, 'paused')}
                            className="py-1.5 px-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-bold rounded-xl text-xs flex items-center gap-1 cursor-pointer"
                          >
                            <XCircle className="w-3.5 h-3.5" /> Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-[10px]">Reviewed</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* User Management Tab */}
      {activeTab === 'users' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm overflow-x-auto">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">User Accounts & Wallet Adjuster</h3>
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-mono text-[10px]">
              <tr>
                <th className="pb-3">User</th>
                <th className="pb-3">Role</th>
                <th className="pb-3">Wallet Balance</th>
                <th className="pb-3">Joined Date</th>
                <th className="pb-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {allUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-3.5 flex items-center gap-3">
                    <img src={u.avatar} alt={u.fullName} className="w-8 h-8 rounded-xl object-cover" />
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">{u.fullName}</p>
                      <p className="text-[10px] text-slate-400">{u.email}</p>
                    </div>
                  </td>
                  <td className="py-3.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      u.role === 'admin' ? 'bg-amber-500/20 text-amber-400' : 'bg-[#DFFF2F]/20 text-[#DFFF2F]'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3.5 font-bold text-sm text-[#DFFF2F]">
                    {editingUserId === u.id ? (
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          value={newBalanceInput}
                          onChange={(e) => setNewBalanceInput(Number(e.target.value))}
                          className="w-24 px-2 py-1 bg-slate-950 border border-slate-700 rounded text-xs text-white"
                        />
                        <button
                          onClick={() => handleSaveUserBalance(u.id)}
                          className="p-1 bg-emerald-500 text-slate-950 rounded font-bold"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <span>${u.walletBalance.toFixed(2)}</span>
                    )}
                  </td>
                  <td className="py-3.5 text-slate-400 font-mono">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="py-3.5">
                    <button
                      onClick={() => { setEditingUserId(u.id); setNewBalanceInput(u.walletBalance); }}
                      className="py-1 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Edit className="w-3 h-3 text-[#DFFF2F]" /> Edit Balance
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Platform Settings Tab */}
      {activeTab === 'settings' && (
        <form onSubmit={handleSaveSettings} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm space-y-6 max-w-3xl">
          
          {settingsSaved && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> Global Settings Updated!
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Minimum Deposit Threshold ($)</label>
              <input
                type="number"
                step="0.5"
                value={settingsForm.minDeposit}
                onChange={(e) => setSettingsForm({ ...settingsForm, minDeposit: Number(e.target.value) })}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Minimum Baseline CPM ($)</label>
              <input
                type="number"
                step="0.01"
                value={settingsForm.minCPM}
                onChange={(e) => setSettingsForm({ ...settingsForm, minCPM: Number(e.target.value) })}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Global Announcement Bar Message</label>
            <input
              type="text"
              value={settingsForm.announcement}
              onChange={(e) => setSettingsForm({ ...settingsForm, announcement: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white"
            />
          </div>

          <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <h4 className="text-xs font-bold uppercase text-slate-400">Payment Accounts Displayed to Users</h4>
            
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">JazzCash Account No</label>
                <input
                  type="text"
                  value={settingsForm.paymentAccounts.jazzCashAccount}
                  onChange={(e) => setSettingsForm({
                    ...settingsForm,
                    paymentAccounts: { ...settingsForm.paymentAccounts, jazzCashAccount: e.target.value }
                  })}
                  className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">EasyPaisa Account No</label>
                <input
                  type="text"
                  value={settingsForm.paymentAccounts.easyPaisaAccount}
                  onChange={(e) => setSettingsForm({
                    ...settingsForm,
                    paymentAccounts: { ...settingsForm.paymentAccounts, easyPaisaAccount: e.target.value }
                  })}
                  className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">PayPal Email</label>
                <input
                  type="text"
                  value={settingsForm.paymentAccounts.payPalEmail}
                  onChange={(e) => setSettingsForm({
                    ...settingsForm,
                    paymentAccounts: { ...settingsForm.paymentAccounts, payPalEmail: e.target.value }
                  })}
                  className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">USDT TRC20 Address</label>
                <input
                  type="text"
                  value={settingsForm.paymentAccounts.usdtTrc20Address}
                  onChange={(e) => setSettingsForm({
                    ...settingsForm,
                    paymentAccounts: { ...settingsForm.paymentAccounts, usdtTrc20Address: e.target.value }
                  })}
                  className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="py-3 px-6 bg-[#DFFF2F] text-slate-950 font-black rounded-xl text-xs transition-colors cursor-pointer"
          >
            Save Admin Settings
          </button>
        </form>
      )}

      {/* Screenshot Modal */}
      {selectedReceiptUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-xl w-full text-white relative">
            <button
              onClick={() => setSelectedReceiptUrl(null)}
              className="absolute right-4 top-4 p-2 text-slate-400 hover:text-white"
            >
              Close ✕
            </button>
            <h3 className="text-sm font-bold mb-4">Payment Receipt Screenshot Verification</h3>
            <img src={selectedReceiptUrl} alt="Receipt" className="max-h-[70vh] mx-auto rounded-2xl shadow-xl" />
          </div>
        </div>
      )}
    </div>
  );
};
