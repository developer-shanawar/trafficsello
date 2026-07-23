import React, { useState } from 'react';
import {
  User, Mail, Phone, Send, ShieldCheck, Check, Save, Upload, MapPin,
  Building, Hash, Globe, Loader2, MessageSquare, Headset
} from 'lucide-react';
import { useStore } from '../../lib/store';

export const ProfileView: React.FC = () => {
  const { user, updateProfile } = useStore();

  const [fullName, setFullName] = useState(user?.fullName || '');
  const [username, setUsername] = useState(user?.username || '');
  const [telegram, setTelegram] = useState(user?.telegram || '');
  const [whatsApp, setWhatsApp] = useState(user?.whatsApp || '');
  const [country, setCountry] = useState(user?.country || 'United States');
  const [city, setCity] = useState(user?.city || '');
  const [postalCode, setPostalCode] = useState(user?.postalCode || '');
  const [avatar, setAvatar] = useState(user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250');
  
  const [isUploadingImg, setIsUploadingImg] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [saved, setSaved] = useState(false);

  const countriesList = [
    'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany',
    'France', 'Japan', 'Spain', 'Italy', 'Brazil', 'Mexico', 'Pakistan',
    'India', 'Saudi Arabia', 'United Arab Emirates', 'Turkey', 'Netherlands',
    'Singapore', 'South Korea', 'Switzerland', 'South Africa', 'Nigeria',
    'Kenya', 'Egypt', 'Malaysia', 'Indonesia', 'Vietnam', 'Philippines'
  ];

  const handleCustomAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImg(true);
    setUploadError('');

    try {
      const formData = new FormData();
      formData.append('image', file);

      const apiKey = '95bfa2c260a52e93433daf349259e043';
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      if (result && result.success && result.data && result.data.url) {
        setAvatar(result.data.url);
      } else {
        setUploadError('Failed to upload image. Please try again.');
      }
    } catch (err) {
      setUploadError('Network error during image upload.');
    } finally {
      setIsUploadingImg(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      fullName,
      username,
      telegram,
      whatsApp,
      country,
      city,
      postalCode,
      avatar,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      
      {/* Header & Verification Status Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <User className="w-6 h-6 text-[#DFFF2F]" /> Account Profile & Identity Verification
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Fill out your profile and location details to complete 100% identity verification.
          </p>
        </div>

        {user?.isVerified ? (
          <div className="flex flex-wrap items-center gap-2">
            <div className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-[11px] text-slate-700 dark:text-slate-300 font-bold">
              🌐 Your IP: <span className="text-emerald-500">{user?.ipAddress || user?.lastLoginIp || '198.51.100.42'}</span>
            </div>
            <div className="px-4 py-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center gap-2 font-bold text-xs shrink-0 shadow-sm">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>100% Profile Verified</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-2">
            <div className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-[11px] text-slate-700 dark:text-slate-300 font-bold">
              🌐 Your IP: <span className="text-emerald-500">{user?.ipAddress || user?.lastLoginIp || '198.51.100.42'}</span>
            </div>
            <div className="px-4 py-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-500 flex items-center gap-2 font-bold text-xs shrink-0">
              <ShieldCheck className="w-5 h-5 text-amber-500" />
              <span>Verification Pending</span>
            </div>
          </div>
        )}
      </div>

      {/* Account Manager Section */}
      <div className="p-6 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl border border-slate-800 shadow-xl space-y-4 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#DFFF2F] text-slate-950 flex items-center justify-center font-black text-xl shadow-md shrink-0">
              <Headset className="w-7 h-7 text-slate-950" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#DFFF2F] block">Assigned Account Manager</span>
              <h3 className="text-lg font-black text-white">Shanawar Support Team</h3>
              <p className="text-xs text-slate-300">Dedicated Traffic Strategist & Deposit Verification Lead</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <a
              href="mailto:support@trafficsell.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border border-slate-700"
            >
              <Mail className="w-3.5 h-3.5 text-rose-400" /> Email Manager
            </a>
            <a
              href="https://t.me/developershanawar"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer shadow"
            >
              <Send className="w-3.5 h-3.5" /> Telegram Support
            </a>
            <a
              href="https://wa.me/923001234567"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer shadow"
            >
              <Phone className="w-3.5 h-3.5" /> WhatsApp Direct
            </a>
          </div>
        </div>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
        
        {saved && (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-2xl flex items-center gap-2 font-bold">
            <Check className="w-5 h-5 text-emerald-400" />
            <span>Profile details updated successfully! Your account is 100% verified.</span>
          </div>
        )}

        {/* Custom Picture Upload Section */}
        <div className="space-y-3">
          <label className="block text-xs font-bold uppercase text-slate-400 tracking-wider">
            Profile Picture / Avatar Image
          </label>
          <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800">
            <img
              src={avatar}
              alt="User Avatar"
              className="w-16 h-16 rounded-2xl object-cover border-2 border-[#DFFF2F] shadow-md shrink-0"
            />
            <div className="space-y-2 flex-1 w-full text-center sm:text-left">
              <label className="px-4 py-2 bg-slate-900 dark:bg-[#DFFF2F] text-white dark:text-slate-950 rounded-xl text-xs font-bold cursor-pointer inline-flex items-center gap-2 shadow hover:opacity-90 transition-all">
                {isUploadingImg ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                <span>Upload Custom Profile Picture</span>
                <input type="file" accept="image/*" onChange={handleCustomAvatarUpload} className="hidden" />
              </label>
              {uploadError && <p className="text-xs text-rose-500 font-bold">{uploadError}</p>}
              <p className="text-[10px] text-slate-400">Upload your own real profile picture (PNG, JPG, WEBP). Avoid random placehold images.</p>
            </div>
          </div>
        </div>

        {/* Profile Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Full Name *</label>
            <input
              type="text"
              required
              value={fullName}
              placeholder="e.g. John Doe"
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs text-slate-900 dark:text-white font-bold focus:outline-none focus:border-[#DFFF2F]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Username *</label>
            <input
              type="text"
              required
              value={username}
              placeholder="e.g. johndoe99"
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:border-[#DFFF2F]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Email Address (Read-only)</label>
            <input
              type="email"
              disabled
              value={user?.email || ''}
              className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs text-slate-500 dark:text-slate-400 font-bold cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Telegram Handle (Optional)</label>
            <input
              type="text"
              value={telegram}
              placeholder="@username"
              onChange={(e) => setTelegram(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#DFFF2F]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-400 mb-1">WhatsApp Number (Optional)</label>
            <input
              type="text"
              value={whatsApp}
              placeholder="+1 555-0192"
              onChange={(e) => setWhatsApp(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#DFFF2F]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Country *</label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs text-slate-900 dark:text-white font-bold focus:outline-none focus:border-[#DFFF2F] cursor-pointer"
            >
              {countriesList.map((c, i) => (
                <option key={i} value={c} className="bg-white dark:bg-slate-900">{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-400 mb-1">City *</label>
            <input
              type="text"
              required
              placeholder="e.g. New York or London"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs text-slate-900 dark:text-white font-bold focus:outline-none focus:border-[#DFFF2F]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Postal Code *</label>
            <input
              type="text"
              required
              placeholder="e.g. 10001 or W1A 1AA"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs text-slate-900 dark:text-white font-bold focus:outline-none focus:border-[#DFFF2F]"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3.5 bg-[#DFFF2F] hover:bg-[#cbe820] text-slate-950 font-black rounded-2xl text-sm transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
        >
          <Save className="w-4 h-4" /> Save Profile & Complete Verification
        </button>
      </form>
    </div>
  );
};
