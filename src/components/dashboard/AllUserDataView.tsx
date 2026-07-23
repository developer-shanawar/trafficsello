import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users, Search, Download, ShieldCheck, Mail, Phone, MapPin, Wallet,
  Layers, Ticket, Calendar, Eye, Filter, CheckCircle, AlertTriangle, ArrowUpDown
} from 'lucide-react';
import { useStore } from '../../lib/store';
import { exportToCSV, exportToExcel, exportToJSON, exportToPDF } from '../../lib/exportUtils';

export const AllUserDataView: React.FC = () => {
  const { allUsers, campaigns, walletDeposits, supportTickets, updateUserBalanceByAdmin, toggleUserSuspension } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | 'admin' | 'user'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'verified' | 'unverified' | 'suspended'>('all');

  const filteredUsers = allUsers.filter(u => {
    const matchesSearch =
      u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.username && u.username.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (u.country && u.country.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;
    if (filterRole !== 'all' && u.role !== filterRole) return false;
    if (filterStatus === 'verified' && !u.isVerified) return false;
    if (filterStatus === 'unverified' && u.isVerified) return false;
    if (filterStatus === 'suspended' && !u.isSuspended) return false;

    return true;
  });

  const handleExportAllUserData = (type: 'pdf' | 'excel' | 'csv' | 'json') => {
    const headers = ['Full Name', 'Email', 'Role', 'Wallet ($)', 'Country', 'City', 'Postal Code', 'Verified', 'Suspended'];
    const rows = filteredUsers.map(u => [
      u.fullName,
      u.email,
      u.role.toUpperCase(),
      `$${u.walletBalance.toFixed(2)}`,
      u.country || 'N/A',
      u.city || 'N/A',
      u.postalCode || 'N/A',
      u.isVerified ? 'YES' : 'NO',
      u.isSuspended ? 'YES' : 'NO'
    ]);

    if (type === 'csv') exportToCSV('TrafficSell_All_Users_Directory', headers, rows);
    if (type === 'excel') exportToExcel('TrafficSell_All_Users_Directory', headers, rows);
    if (type === 'json') exportToJSON('TrafficSell_All_Users_Directory', filteredUsers);
    if (type === 'pdf') exportToPDF('TrafficSell All Users Directory', headers, rows);
  };

  return (
    <div className="space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#DFFF2F] text-slate-950 shadow-sm border border-slate-900">
              <Users className="w-3 h-3 inline mr-1" /> Directory Telemetry
            </span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">All Platform User Data & Directory</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Complete database view of registered advertisers, wallet balances, locations, identity verification, and campaign stats.
          </p>
        </div>

        {/* Export toolbar */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 text-xs shrink-0">
          <span className="text-[10px] text-slate-400 uppercase font-mono px-2 font-bold flex items-center gap-1">
            <Download className="w-3.5 h-3.5 text-[#DFFF2F]" /> Export Data:
          </span>
          <button
            onClick={() => handleExportAllUserData('pdf')}
            className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-[10px] font-bold cursor-pointer"
          >
            PDF
          </button>
          <button
            onClick={() => handleExportAllUserData('excel')}
            className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded-xl text-[10px] font-bold cursor-pointer"
          >
            Excel
          </button>
          <button
            onClick={() => handleExportAllUserData('csv')}
            className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-xl text-[10px] font-bold cursor-pointer"
          >
            CSV
          </button>
          <button
            onClick={() => handleExportAllUserData('json')}
            className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-[#DFFF2F] rounded-xl text-[10px] font-bold cursor-pointer"
          >
            JSON
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 shadow-sm">
        
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search name, email, country or username..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs text-slate-900 dark:text-white font-bold focus:outline-none focus:border-[#DFFF2F]"
          />
        </div>

        {/* Role Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400">Role:</span>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value as any)}
            className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-bold text-slate-900 dark:text-white cursor-pointer"
          >
            <option value="all">All Roles</option>
            <option value="user">User / Advertiser</option>
            <option value="admin">Administrator</option>
          </select>
        </div>

        {/* Verification / Status Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400">Status:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-bold text-slate-900 dark:text-white cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="verified">Verified Only</option>
            <option value="unverified">Unverified Only</option>
            <option value="suspended">Suspended Only</option>
          </select>
        </div>
      </div>

      {/* Users Detailed Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.length === 0 ? (
          <div className="col-span-full text-center py-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl text-slate-400 text-xs">
            No users matched your search criteria. Try adjusting filters.
          </div>
        ) : (
          filteredUsers.map((usr) => {
            const userCampaignsCount = campaigns.filter(c => c.userId === usr.id).length;
            const userDepositsCount = walletDeposits.filter(d => d.userId === usr.id && d.status === 'approved').length;
            const userTicketsCount = supportTickets.filter(t => t.userId === usr.id).length;

            return (
              <div
                key={usr.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all space-y-4 relative overflow-hidden flex flex-col justify-between"
              >
                <div>
                  {/* User Profile Header */}
                  <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={usr.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250"}
                        alt={usr.fullName}
                        className="w-12 h-12 rounded-2xl object-cover border-2 border-slate-200 dark:border-slate-700 shadow-sm"
                      />
                      <div>
                        <h4 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                          {usr.fullName}
                          {usr.isVerified && (
                            <ShieldCheck className="w-4 h-4 text-emerald-500 inline" title="Verified Identity" />
                          )}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{usr.email}</p>
                        <span className="text-[10px] text-slate-400 font-mono">@{usr.username || 'user'}</span>
                      </div>
                    </div>

                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                      usr.isSuspended
                        ? 'bg-rose-500/20 text-rose-500 border border-rose-500/30'
                        : usr.role === 'admin'
                        ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30'
                        : 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/30'
                    }`}>
                      {usr.isSuspended ? 'Suspended' : usr.role}
                    </span>
                  </div>

                  {/* Wallet & Location Info */}
                  <div className="grid grid-cols-2 gap-3 text-xs mb-4 p-3.5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800/80">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Wallet Balance</span>
                      <strong className="text-emerald-600 dark:text-[#DFFF2F] font-mono text-base">
                        ${usr.walletBalance.toFixed(2)}
                      </strong>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Location</span>
                      <strong className="text-slate-900 dark:text-white truncate block">
                        📍 {usr.country || 'USA'}, {usr.city || 'N/A'}
                      </strong>
                    </div>
                  </div>

                  {/* Activity Stats */}
                  <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-bold text-slate-500 dark:text-slate-400">
                    <div className="p-2 bg-slate-100 dark:bg-slate-800/40 rounded-xl">
                      <span className="block text-slate-900 dark:text-white font-black text-sm">{userCampaignsCount}</span>
                      Campaigns
                    </div>
                    <div className="p-2 bg-slate-100 dark:bg-slate-800/40 rounded-xl">
                      <span className="block text-emerald-600 dark:text-emerald-400 font-black text-sm">{userDepositsCount}</span>
                      Deposits
                    </div>
                    <div className="p-2 bg-slate-100 dark:bg-slate-800/40 rounded-xl">
                      <span className="block text-sky-500 font-black text-sm">{userTicketsCount}</span>
                      Tickets
                    </div>
                  </div>
                </div>

                {/* Footer Metadata */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-[10px] text-slate-400 font-mono mt-4">
                  <span>Postal Code: {usr.postalCode || 'N/A'}</span>
                  <span>Joined: {new Date(usr.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
