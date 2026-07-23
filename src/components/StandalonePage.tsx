import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, FileText, RefreshCw, Info, Mail, Send, Phone, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useStore } from '../lib/store';

interface StandalonePageProps {
  page: 'about' | 'privacy' | 'terms' | 'refund';
  onNavigateHome: () => void;
}

export const StandalonePage: React.FC<StandalonePageProps> = ({ page, onNavigateHome }) => {
  const { platformSettings } = useStore();
  const pageContent = platformSettings?.pageContent;

  const title =
    page === 'about' ? 'About Us' :
    page === 'privacy' ? 'Privacy Policy' :
    page === 'terms' ? 'Terms of Service' :
    'Refund Policy';

  const description =
    page === 'about' ? 'Learn about TrafficSell - The #1 High Converting Web Traffic Marketplace & Ad Network.' :
    page === 'privacy' ? 'TrafficSell Privacy Policy - How we protect your data and privacy.' :
    page === 'terms' ? 'TrafficSell Terms of Service - Usage conditions, advertiser guidelines, and service terms.' :
    'TrafficSell Refund Policy - Details regarding deposit refunds and campaign adjustments.';

  // Update SEO Document Title and Canonical Meta for Google Indexing
  useEffect(() => {
    document.title = `TrafficSell - ${title} | High Conversion Ad Network`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', description);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = description;
      document.head.appendChild(meta);
    }
  }, [page, title, description]);

  const icon =
    page === 'privacy' ? <Shield className="w-8 h-8 text-[#DFFF2F]" /> :
    page === 'terms' ? <FileText className="w-8 h-8 text-[#DFFF2F]" /> :
    page === 'refund' ? <RefreshCw className="w-8 h-8 text-[#DFFF2F]" /> :
    <Info className="w-8 h-8 text-[#DFFF2F]" />;

  return (
    <div className="min-h-screen bg-[#CFE7FF]/30 dark:bg-[#0F172A] py-12 px-4 sm:px-6 lg:px-8 font-sans text-slate-900 dark:text-white">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Navigation Back Button */}
        <button
          onClick={onNavigateHome}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-extrabold hover:scale-105 transition-all shadow-sm cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-[#111827] dark:text-[#DFFF2F]" />
          Back to TrafficSell Home
        </button>

        {/* Hero Header Card */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white rounded-3xl p-8 border border-slate-800 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-xs font-mono text-[#DFFF2F]">
              <span>Official Policy Document</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white">{title}</h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl font-medium">
              {description}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shrink-0 shadow-lg">
            {icon}
          </div>
        </div>

        {/* Content Body Card */}
        <motion.article
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 md:p-10 shadow-xl space-y-6 leading-relaxed font-medium text-slate-700 dark:text-slate-300 text-sm sm:text-base whitespace-pre-wrap"
        >
          {page === 'about' && (
            <div className="space-y-6">
              <div className="p-4 bg-[#DFFF2F]/10 border border-[#DFFF2F]/30 rounded-2xl text-slate-900 dark:text-[#DFFF2F] font-bold text-sm">
                TrafficSell is an industry-leading website traffic marketplace connecting advertisers with verified global publishers.
              </div>
              <p>{pageContent?.aboutUs}</p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center">
                  <span className="text-2xl font-black text-[#111827] dark:text-[#DFFF2F]">50M+</span>
                  <p className="text-xs font-bold text-slate-500 mt-1">Verified Hits</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center">
                  <span className="text-2xl font-black text-[#111827] dark:text-[#DFFF2F]">120+</span>
                  <p className="text-xs font-bold text-slate-500 mt-1">Geo Countries</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center">
                  <span className="text-2xl font-black text-emerald-500">$0.05</span>
                  <p className="text-xs font-bold text-slate-500 mt-1">Lowest CPM Rate</p>
                </div>
              </div>
            </div>
          )}

          {page === 'privacy' && (
            <div className="space-y-4">
              <p>{pageContent?.privacyPolicy}</p>
            </div>
          )}

          {page === 'terms' && (
            <div className="space-y-4">
              <p>{pageContent?.termsOfService}</p>
            </div>
          )}

          {page === 'refund' && (
            <div className="space-y-4">
              <p>{pageContent?.refundPolicy}</p>
            </div>
          )}

          {/* Official Direct Contact Section */}
          <div className="pt-8 border-t border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Direct Official Support Contacts</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-bold">
              <a
                href={`mailto:${pageContent?.supportEmail || 'support@trafficsell.com'}`}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center gap-3 hover:border-[#DFFF2F] transition-all cursor-pointer"
              >
                <div className="p-2 rounded-xl bg-rose-500/10 text-rose-500">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="overflow-hidden">
                  <span className="text-slate-400 text-[10px] block uppercase">Official Email</span>
                  <span className="truncate block text-slate-900 dark:text-white">{pageContent?.supportEmail || 'support@trafficsell.com'}</span>
                </div>
              </a>

              <a
                href={`https://t.me/${(pageContent?.telegramContact || '@developershanawar').replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center gap-3 hover:border-sky-400 transition-all cursor-pointer"
              >
                <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400">
                  <Send className="w-5 h-5" />
                </div>
                <div className="overflow-hidden">
                  <span className="text-slate-400 text-[10px] block uppercase">Telegram Channel</span>
                  <span className="truncate block text-slate-900 dark:text-white">{pageContent?.telegramContact || '@developershanawar'}</span>
                </div>
              </a>

              <a
                href={`https://wa.me/${(pageContent?.whatsAppContact || '+923001234567').replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center gap-3 hover:border-emerald-400 transition-all cursor-pointer"
              >
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="overflow-hidden">
                  <span className="text-slate-400 text-[10px] block uppercase">WhatsApp Direct</span>
                  <span className="truncate block text-slate-900 dark:text-white">{pageContent?.whatsAppContact || '+92 300-1234567'}</span>
                </div>
              </a>
            </div>
          </div>
        </motion.article>
      </div>
    </div>
  );
};
