import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, FileText, RefreshCw, HelpCircle } from 'lucide-react';

interface LegalModalProps {
  type: 'privacy' | 'terms' | 'refund' | null;
  onClose: () => void;
}

export const LegalPages: React.FC<LegalModalProps> = ({ type, onClose }) => {
  if (!type) return null;

  const title = 
    type === 'privacy' ? 'Privacy Policy' :
    type === 'terms' ? 'Terms of Service' :
    'Refund & Refund Policy';

  const icon =
    type === 'privacy' ? <Shield className="w-5 h-5 text-[#DFFF2F]" /> :
    type === 'terms' ? <FileText className="w-5 h-5 text-[#DFFF2F]" /> :
    <RefreshCw className="w-5 h-5 text-[#DFFF2F]" />;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 max-w-3xl w-full shadow-2xl relative max-h-[85vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-slate-900 text-[#DFFF2F]">
                {icon}
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{title}</h3>
                <p className="text-xs text-slate-500">Last updated: July 2026 • TrafficSell Marketplace</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-full bg-slate-100 dark:bg-slate-800">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="overflow-y-auto pr-2 space-y-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {type === 'privacy' && (
              <>
                <p>At TrafficSell, we take your privacy and data security seriously. This policy outlines how we collect, handle, and safeguard user information across our Website Traffic Marketplace platform.</p>
                
                <h4 className="font-bold text-slate-900 dark:text-white text-base">1. Information Collection</h4>
                <p>We collect essential account details including your name, email address, optional WhatsApp/Telegram contacts, and campaign parameters (target URLs, geo requirements) necessary for traffic fulfillment and wallet management.</p>

                <h4 className="font-bold text-slate-900 dark:text-white text-base">2. Payment & Verification Data</h4>
                <p>Manual deposit payment transaction references and uploaded verification screenshots are processed solely for funding approval. We do not store financial card credentials on our servers.</p>

                <h4 className="font-bold text-slate-900 dark:text-white text-base">3. Fraud Prevention & Analytics</h4>
                <p>All traffic delivered through TrafficSell is filtered using proprietary bot-detection algorithms to maintain genuine human engagement and protect client target domains.</p>
              </>
            )}

            {type === 'terms' && (
              <>
                <p>By creating an account on TrafficSell or launching traffic campaigns, you agree to adhere to the following operational terms and conditions:</p>

                <h4 className="font-bold text-slate-900 dark:text-white text-base">1. Acceptable Use & Target URLs</h4>
                <p>Target URLs must not contain malware, illegal content, phishing scripts, or auto-downloading payloads. Campaigns violating these terms will be terminated immediately without refund.</p>

                <h4 className="font-bold text-slate-900 dark:text-white text-base">2. Minimum Deposit & Wallet Balance</h4>
                <p>The minimum deposit threshold is $1.00 USD. Wallet balances do not expire and can be utilized across multiple campaigns at any time.</p>

                <h4 className="font-bold text-slate-900 dark:text-white text-base">3. Traffic Delivery Pacing</h4>
                <p>While TrafficSell optimizes for fast delivery, pacing may vary based on geo-targeting, device filters, and total real-human publisher supply in real time.</p>
              </>
            )}

            {type === 'refund' && (
              <>
                <p>We stand by the quality and delivery guarantee of our Website Traffic Marketplace.</p>

                <h4 className="font-bold text-slate-900 dark:text-white text-base">1. Unused Wallet Balance Refund</h4>
                <p>If you have unspent funds in your TrafficSell wallet, you may request a withdrawal or refund to your original payment method (USDT, JazzCash, EasyPaisa, or PayPal) by opening a Support Ticket.</p>

                <h4 className="font-bold text-slate-900 dark:text-white text-base">2. Incomplete Campaigns</h4>
                <p>If a campaign is cancelled or cannot be fulfilled within the estimated window, the remaining unspent budget is automatically returned to your wallet balance instantly.</p>

                <h4 className="font-bold text-slate-900 dark:text-white text-base">3. Quality Guarantee</h4>
                <p>If you suspect discrepancies in delivery metrics, our technical team will audit server logs and issue a credit replacement if delivery targets were not satisfied.</p>
              </>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-[#DFFF2F] hover:bg-[#cbe820] text-slate-900 font-bold rounded-xl text-sm transition-colors"
            >
              I Understand
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
