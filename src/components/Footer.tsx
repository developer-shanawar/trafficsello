import React, { useState } from 'react';
import { Activity, ShieldCheck, Mail, ArrowRight, Heart } from 'lucide-react';

interface FooterProps {
  onOpenLegal: (type: 'privacy' | 'terms' | 'refund') => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenLegal }) => {
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800/80 pt-16 pb-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#DFFF2F] text-slate-900 flex items-center justify-center font-extrabold shadow-md">
                <Activity className="w-5 h-5 stroke-[2.5]" />
              </div>
              <span className="text-xl font-black text-white">
                Traffic<span className="text-[#DFFF2F]">Sell</span>
              </span>
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
              <li><a href="#features" className="hover:text-[#DFFF2F] transition-colors">Platform Features</a></li>
              <li><a href="#estimator" className="hover:text-[#DFFF2F] transition-colors">Traffic Estimator</a></li>
              <li><a href="#pricing" className="hover:text-[#DFFF2F] transition-colors">CPM Rates & Plans</a></li>
              <li><a href="#payment-methods" className="hover:text-[#DFFF2F] transition-colors">Deposit Methods</a></li>
            </ul>
          </div>

          {/* Legal Pages */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Legal & Support</h4>
            <ul className="space-y-2.5 text-sm">
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

          {/* Newsletter Box */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Newsletter</h4>
            <p className="text-xs text-slate-400 mb-3">Get CPM rate updates & promo codes delivered to your inbox.</p>
            
            {subscribed ? (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl">
                ✓ Thank you for subscribing to TrafficSell updates!
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="Enter email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#DFFF2F]"
                  />
                  <button
                    type="submit"
                    className="absolute right-1 top-1 bottom-1 px-3 bg-[#DFFF2F] hover:bg-[#cbe820] text-slate-900 rounded-lg text-xs font-bold transition-all"
                  >
                    Join
                  </button>
                </div>
              </form>
            )}
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
