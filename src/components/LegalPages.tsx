import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, FileText, RefreshCw, HelpCircle, Info, Mail, Send, Phone } from 'lucide-react';
import { useStore } from '../lib/store';

interface LegalModalProps {
  type: 'privacy' | 'terms' | 'refund' | 'about' | null;
  onClose: () => void;
}

export const LegalPages: React.FC<LegalModalProps> = ({ type, onClose }) => {
  const { platformSettings } = useStore();
  if (!type) return null;

  const pageContent = platformSettings?.pageContent;

  const title = 
    type === 'privacy' ? 'Privacy Policy' :
    type === 'terms' ? 'Terms of Service' :
    type === 'refund' ? 'Refund Policy' :
    'About TrafficSell';

  const icon =
    type === 'privacy' ? <Shield className="w-5 h-5 text-[#DFFF2F]" /> :
    type === 'terms' ? <FileText className="w-5 h-5 text-[#DFFF2F]" /> :
    type === 'refund' ? <RefreshCw className="w-5 h-5 text-[#DFFF2F]" /> :
    <Info className="w-5 h-5 text-[#DFFF2F]" />;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 max-w-3xl w-full shadow-2xl relative max-h-[85vh] flex flex-col text-slate-900 dark:text-white"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-slate-900 text-[#DFFF2F]">
                {icon}
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{title}</h3>
                <p className="text-xs text-slate-500">TrafficSell Official Marketplace</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-full bg-slate-100 dark:bg-slate-800 cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="overflow-y-auto pr-2 space-y-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium whitespace-pre-wrap">
            {type === 'privacy' && (
              <p>{pageContent?.privacyPolicy}</p>
            )}

            {type === 'terms' && (
              <p>{pageContent?.termsOfService}</p>
            )}

            {type === 'refund' && (
              <p>{pageContent?.refundPolicy}</p>
            )}

            {type === 'about' && (
              <div className="space-y-4">
                <p>{pageContent?.aboutUs}</p>

                <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3 mt-4">
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Direct Official Contact</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                      <Mail className="w-4 h-4 text-[#DFFF2F] shrink-0" />
                      <span className="truncate">{pageContent?.supportEmail || 'support@trafficsell.com'}</span>
                    </div>
                    <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                      <Send className="w-4 h-4 text-sky-400 shrink-0" />
                      <span className="truncate">{pageContent?.telegramContact || '@developershanawar'}</span>
                    </div>
                    <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                      <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="truncate">{pageContent?.whatsAppContact || '+92 300-1234567'}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-[#DFFF2F] hover:bg-[#cbe820] text-slate-900 font-bold rounded-xl text-sm transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
