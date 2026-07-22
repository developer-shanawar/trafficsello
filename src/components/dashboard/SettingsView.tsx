import React, { useState } from 'react';
import { Settings, Moon, Sun, Bell, ShieldCheck, Check } from 'lucide-react';
import { useStore } from '../../lib/store';

export const SettingsView: React.FC = () => {
  const { theme, toggleTheme } = useStore();
  const [emailNotif, setEmailNotif] = useState(true);
  const [telegramNotif, setTelegramNotif] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Platform Settings & Preferences</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Customize UI theme, notification alerts, and security options.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
        
        {saved && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl flex items-center gap-2">
            <Check className="w-4 h-4" /> Preferences saved!
          </div>
        )}

        {/* Theme Settings */}
        <div>
          <h3 className="text-xs font-bold uppercase text-slate-400 mb-3">Display Theme</h3>
          <div className="flex gap-3">
            <button
              onClick={() => theme === 'light' && toggleTheme()}
              className={`p-4 rounded-2xl border flex items-center gap-3 text-xs font-bold transition-all ${
                theme === 'dark' ? 'bg-slate-900 text-[#DFFF2F] border-[#DFFF2F]' : 'bg-slate-50 text-slate-600 border-slate-200'
              }`}
            >
              <Moon className="w-4 h-4" /> Dark Mode (Recommended)
            </button>
            <button
              onClick={() => theme === 'dark' && toggleTheme()}
              className={`p-4 rounded-2xl border flex items-center gap-3 text-xs font-bold transition-all ${
                theme === 'light' ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-600 border-slate-200'
              }`}
            >
              <Sun className="w-4 h-4 text-amber-500" /> Light Mode
            </button>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <h3 className="text-xs font-bold uppercase text-slate-400 mb-2">Notification Preferences</h3>
          
          <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/50 cursor-pointer text-xs">
            <span className="font-semibold text-slate-900 dark:text-white">Email Campaign Delivery Summaries</span>
            <input
              type="checkbox"
              checked={emailNotif}
              onChange={(e) => setEmailNotif(e.target.checked)}
              className="w-4 h-4 rounded accent-[#DFFF2F]"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/50 cursor-pointer text-xs">
            <span className="font-semibold text-slate-900 dark:text-white">Telegram Deposit Approval Alerts</span>
            <input
              type="checkbox"
              checked={telegramNotif}
              onChange={(e) => setTelegramNotif(e.target.checked)}
              className="w-4 h-4 rounded accent-[#DFFF2F]"
            />
          </label>
        </div>

        <button
          onClick={handleSave}
          className="py-3 px-6 bg-[#DFFF2F] hover:bg-[#cbe820] text-slate-950 font-black rounded-2xl text-xs transition-all shadow cursor-pointer"
        >
          Save Preferences
        </button>
      </div>
    </div>
  );
};
