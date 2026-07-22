import React, { useState } from 'react';
import { User, Mail, Phone, Send, ShieldCheck, Check, Save } from 'lucide-react';
import { useStore } from '../../lib/store';

export const ProfileView: React.FC = () => {
  const { user, updateProfile } = useStore();

  const [fullName, setFullName] = useState(user?.fullName || '');
  const [telegram, setTelegram] = useState(user?.telegram || '');
  const [whatsApp, setWhatsApp] = useState(user?.whatsApp || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [saved, setSaved] = useState(false);

  const avatarsList = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ fullName, telegram, whatsApp, avatar });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Account Profile & Verification</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Manage your contact credentials and avatar for TrafficSell communications.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
        
        {saved && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl flex items-center gap-2">
            <Check className="w-4 h-4" /> Profile updated successfully!
          </div>
        )}

        {/* Avatar Picker */}
        <div>
          <label className="block text-xs font-bold uppercase text-slate-400 mb-3">Choose Profile Avatar</label>
          <div className="flex items-center gap-4">
            {avatarsList.map((url, i) => (
              <img
                key={i}
                src={url}
                alt="Avatar option"
                onClick={() => setAvatar(url)}
                className={`w-14 h-14 rounded-2xl object-cover cursor-pointer border-2 transition-all ${
                  avatar === url ? 'border-[#DFFF2F] scale-110 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Full Name</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#DFFF2F]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Email Address (Read-only)</label>
            <input
              type="email"
              disabled
              value={user?.email}
              className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs text-slate-500 dark:text-slate-400 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Telegram Handle</label>
            <input
              type="text"
              value={telegram}
              placeholder="@username"
              onChange={(e) => setTelegram(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#DFFF2F]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-400 mb-1">WhatsApp Number</label>
            <input
              type="text"
              value={whatsApp}
              placeholder="+1 555-0192"
              onChange={(e) => setWhatsApp(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#DFFF2F]"
            />
          </div>
        </div>

        <button
          type="submit"
          className="py-3 px-6 bg-[#DFFF2F] hover:bg-[#cbe820] text-slate-950 font-black rounded-2xl text-xs transition-all shadow flex items-center gap-2 cursor-pointer"
        >
          <Save className="w-4 h-4" /> Save Profile Changes
        </button>
      </form>
    </div>
  );
};
