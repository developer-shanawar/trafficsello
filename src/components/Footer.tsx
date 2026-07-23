import React, { useState } from 'react';
import { Activity, ShieldCheck, Mail, ArrowRight, Heart } from 'lucide-react';
import { useStore } from '../lib/store';

interface FooterProps {
  onOpenLegal: (type: 'privacy' | 'terms' | 'refund' | 'about') => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenLegal }) => {
  const { platformSettings } = useStore();
  const siteName = platformSettings?.siteName || 'TrafficSell';
  const siteIconUrl = platformSettings?.siteIconUrl || '/logo.png';
  const brandDisplayMode = platformSettings?.brandDisplayMode || 'both';

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800/80 pt-16 pb-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800/80">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              {(brandDisplayMode === 'both' || brandDisplayMode === 'icon') && (
                siteIconUrl ? (
                  <img src={siteIconUrl} alt={siteName} onError={(e) => { (e.target as HTMLImageElement).src = '/logo.png'; }} className="w-10 h-10 rounded-2xl object-cover border-2 border-[#DFFF2F] shadow-md" />
                ) : (
                  <div className="w-10 h-10 rounded-2xl bg-[#DFFF2F] text-slate-900 flex items-center justify-center font-extrabold shadow-md">
                    <Activity className="w-5 h-5 stroke-[2.5]" />
                  </div>
                )
              )}
              {(brandDisplayMode === 'both' || brandDisplayMode === 'text') && (
                <span className="text-xl font-black text-white flex items-center gap-1.5">
                  {siteName}
                  <span className="px-1.5 py-0.5 text-[10px] font-black uppercase rounded bg-[#DFFF2F] text-slate-950">
                    Beta
                  </span>
                </span>
              )}
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Premium Ad Network & High-Conversion Website Traffic Marketplace. Real visitors, instant campaign approval, live delivery tracking, and low $0.05 CPM.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              All Publisher Networks Operational (99.99%)
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Marketplace</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => onOpenLegal('about')} className="hover:text-[#DFFF2F] transition-colors text-left cursor-pointer">
                  About Us
                </button>
              </li>
              <li><a href="#features" className="hover:text-[#DFFF2F] transition-colors">Platform Features</a></li>
              <li><a href="#estimator" className="hover:text-[#DFFF2F] transition-colors">Traffic Estimator</a></li>
              <li><a href="#payment-methods" className="hover:text-[#DFFF2F] transition-colors">Deposit Methods</a></li>
            </ul>
          </div>

          {/* Legal Pages */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Legal & Support</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => onOpenLegal('about')} className="hover:text-[#DFFF2F] transition-colors text-left cursor-pointer">
                  About Us
                </button>
              </li>
              <li>
                <button onClick={() => onOpenLegal('privacy')} className="hover:text-[#DFFF2F] transition-colors text-left cursor-pointer">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => onOpenLegal('terms')} className="hover:text-[#DFFF2F] transition-colors text-left cursor-pointer">
                  Terms of Service
                </button>
              </li>
              <li>
                <button onClick={() => onOpenLegal('refund')} className="hover:text-[#DFFF2F] transition-colors text-left cursor-pointer">
                  Refund Policy
                </button>
              </li>
              <li><a href="#faq" className="hover:text-[#DFFF2F] transition-colors">Help Center & FAQ</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} TrafficSell Ad Network. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Supported: JazzCash • EasyPaisa • PayPal • USDT (TRC20/BEP20)</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
