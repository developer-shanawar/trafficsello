import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Activity, Zap, ShieldCheck, Globe, Smartphone, BarChart3, Clock,
  ArrowRight, Check, CheckCircle2, ChevronDown, Sparkles, Wallet, Users,
  Award, HeartHandshake, HelpCircle, Layers, Play, Star, Quote, ChevronLeft, ChevronRight
} from 'lucide-react';
import { TrafficCalculator } from './TrafficCalculator';
import { useStore } from '../lib/store';

interface LandingPageProps {
  onGetStarted: () => void;
  onViewPricing: () => void;
  onStartCalculatorCampaign: (details: any) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onGetStarted,
  onViewPricing,
  onStartCalculatorCampaign
}) => {
  const { platformSettings, testimonials } = useStore();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [activeTestimonialIdx, setActiveTestimonialIdx] = useState(0);

  const featuresList = [
    {
      title: "Real Human Visitors",
      desc: "100% verified traffic routed from high-performing publisher networks with zero bots.",
      icon: Users,
    },
    {
      title: "Fast Campaign Delivery",
      desc: "Campaigns begin routing within minutes of instant approval with custom pacing.",
      icon: Zap,
    },
    {
      title: "120+ Countries Geo-Targeting",
      desc: "Target specific tier-1 countries (US, UK, DE, CA, AU) or global traffic packages.",
      icon: Globe,
    },
    {
      title: "Device & Browser Filters",
      desc: "Select Desktop workstations, Mobile smartphones, or combined multi-channel feeds.",
      icon: Smartphone,
    },
    {
      title: "Live Real-Time Telemetry",
      desc: "Track delivery counts, hourly hit velocity, and visitor retention live on your dashboard.",
      icon: BarChart3,
    },
    {
      title: "Instant Wallet & Manual Verification",
      desc: "Fund your account using JazzCash, EasyPaisa, PayPal, or USDT TRC20/BEP20 with $1 min deposit.",
      icon: Wallet,
    },
  ];

  const whyChooseUs = [
    { title: "Unbeatable Baseline CPM", desc: "Start buying traffic at an ultra-affordable $0.05 per 1,000 visitors." },
    { title: "FraudShield Bot Detection", desc: "Proprietary multi-layer proxy and bot filter ensuring 100% real human hits." },
    { title: "Instant Campaign Approval", desc: "No long waiting queues. Your campaign initializes and starts delivering immediately." },
    { title: "Manual Payment Verification", desc: "Upload payment screenshots for instant deposit approval via JazzCash, EasyPaisa & USDT." },
  ];

  const pricingPlans = [
    {
      name: "Starter Test",
      deposit: "$1 - $25",
      cpm: "$0.05 CPM",
      popular: false,
      features: ["Global Geo Targeting", "5,000 Minimum Visitors", "Standard Delivery Speed", "Real Human Filter", "Basic Analytics"],
    },
    {
      name: "Pro Network",
      deposit: "$25 - $100",
      cpm: "$0.08 CPM",
      popular: true,
      features: ["US / Tier-1 Country Targeting", "Desktop & Mobile Filtering", "Accelerated Pacing", "Detailed Country Breakdown", "Priority 24/7 Support"],
    },
    {
      name: "Enterprise Bulk",
      deposit: "$100+",
      cpm: "$0.10 CPM",
      popular: false,
      features: ["Custom Geo & State Targeting", "Unlimited Visitor Volume", "Dedicated Account Manager", "API Access", "Custom CPM Discounts"],
    },
  ];

  const paymentMethods = [
    { name: "JazzCash", badge: "Instant PKR", network: "Mobile Wallet" },
    { name: "EasyPaisa", badge: "Direct PKR", network: "Mobile Wallet" },
    { name: "PayPal", badge: "Global USD", network: "Credit / Debit" },
    { name: "USDT TRC20", badge: "TRON Network", network: "Crypto Deposit" },
    { name: "USDT BEP20", badge: "BNB Smart Chain", network: "Crypto Deposit" },
    { name: "USDT ERC20", badge: "Ethereum Network", network: "Crypto Deposit" },
  ];

  const faqs = [
    {
      q: "How fast does my campaign start after launching?",
      a: "Campaigns start delivering visitors within 2 to 10 minutes after submission once your wallet has sufficient balance.",
    },
    {
      q: "Is the traffic delivered 100% real human visitors?",
      a: "Yes. All TrafficSell traffic is filtered through FraudShield to guarantee genuine human impressions with realistic session durations.",
    },
    {
      q: "What is the minimum deposit and minimum CPM rate?",
      a: `The minimum deposit is only $1.00 USD, and our baseline CPM rate starts at $0.05 per 1,000 visitors.`,
    },
    {
      q: "How does manual deposit verification work?",
      a: "Select your preferred payment gateway (JazzCash, EasyPaisa, PayPal, or USDT), send funds to our displayed recipient credentials, and upload a screenshot of your receipt. Our admin verifies and credits your wallet within minutes.",
    },
  ];

  return (
    <div className="space-y-24 pb-20">
      
      {/* Hero Section */}
      <section className="relative pt-12 pb-16 overflow-hidden">
        
        {/* Soft Sky Blue Gradient Orb */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#CFE7FF]/20 dark:bg-[#DFFF2F]/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/50 dark:bg-slate-800/80 border border-white/60 dark:border-slate-700 text-xs font-semibold shadow-sm text-[#111827] dark:text-white"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-[#111827] dark:bg-[#DFFF2F] animate-pulse" />
                <span>#1 Premium Website Traffic Marketplace</span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#DFFF2F] text-[#111827] font-extrabold text-[10px]">CPM $0.05</span>
              </motion.div>

              {/* Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#111827] dark:text-white leading-[1.1] tracking-tight"
              >
                Buy <span className="text-white dark:text-[#DFFF2F] underline decoration-[#DFFF2F] dark:decoration-white decoration-4 underline-offset-4">Premium</span> Website Traffic
              </motion.h1>

              {/* Subheading */}
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-base sm:text-lg text-[#111827]/80 dark:text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium"
              >
                100% Real Human Visitors • Fast Campaign Delivery • 120+ Countries • $0.05 CPM • Instant Wallet Funding via JazzCash, EasyPaisa, PayPal & USDT.
              </motion.p>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2"
              >
                <button
                  onClick={onGetStarted}
                  className="py-4 px-8 bg-[#111827] dark:bg-[#DFFF2F] hover:bg-slate-800 dark:hover:bg-[#cbe820] text-white dark:text-[#111827] font-bold rounded-2xl text-base transition-all shadow-xl shadow-[#111827]/10 dark:shadow-[#DFFF2F]/20 hover:scale-105 flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-5 h-5 text-[#DFFF2F] dark:text-[#111827]" /> Get Started
                </button>
                <a
                  href="#estimator"
                  className="py-4 px-8 bg-[#DFFF2F] dark:bg-slate-800 hover:bg-[#cbe820] dark:hover:bg-slate-700 text-[#111827] dark:text-white font-bold rounded-2xl text-base transition-all border border-white/60 dark:border-slate-700 shadow-md hover:scale-105 flex items-center gap-2 cursor-pointer"
                >
                  Calculate Traffic Cost
                </a>
              </motion.div>

              {/* Highlights pills */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-500 dark:text-slate-400 font-semibold">
                <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-[#DFFF2F]" /> $1 Minimum Deposit</span>
                <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-[#DFFF2F]" /> Instant Approval</span>
                <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-[#DFFF2F]" /> 100% Real Visitors</span>
              </div>
            </div>

            {/* Right Interactive Mockup Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-5 relative"
            >
              <div className="bg-gradient-to-br from-white/40 to-white/10 dark:from-slate-900/80 dark:to-slate-900/40 backdrop-blur-xl rounded-[40px] border border-white/50 dark:border-slate-800 shadow-2xl p-6 text-[#111827] dark:text-white">
                
                {/* Header Mockup */}
                <div className="flex justify-between items-center pb-4 border-b border-[#111827]/10 dark:border-slate-800 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500" />
                    <span className="w-3 h-3 rounded-full bg-amber-500" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500" />
                    <span className="text-xs font-mono font-bold text-[#111827]/60 dark:text-slate-400 ml-2">trafficsell.com/live</span>
                  </div>
                  <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" /> LIVE ROUTING
                  </span>
                </div>

                {/* Live Stat Banner */}
                <div className="p-4 rounded-3xl bg-[#111827] text-white mb-4 flex justify-between items-center shadow-lg">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Active Campaign</span>
                    <p className="text-sm font-bold text-white">US E-Commerce Surge</p>
                    <p className="text-[10px] text-[#DFFF2F] font-mono mt-0.5">CPM: $0.08 • Target: 100,000</p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-[#DFFF2F]">84,210</span>
                    <span className="text-[9px] text-slate-400 block">Visitors Delivered</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-1 mb-4">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-[#111827]/70 dark:text-slate-400">Delivery Completion</span>
                    <span className="text-[#111827] dark:text-[#DFFF2F]">84%</span>
                  </div>
                  <div className="w-full h-2.5 bg-white/60 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 border border-white/50 dark:border-slate-700">
                    <div className="h-full bg-gradient-to-r from-emerald-500 to-[#DFFF2F] w-[84%] rounded-full" />
                  </div>
                </div>

                {/* Country Hits Grid */}
                <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
                  <div className="p-2.5 rounded-2xl bg-white/60 dark:bg-slate-800/60 border border-white/60 dark:border-slate-700/60 flex justify-between">
                    <span>🇺🇸 United States</span>
                    <strong className="text-[#111827] dark:text-[#DFFF2F]">52,100</strong>
                  </div>
                  <div className="p-2.5 rounded-2xl bg-white/60 dark:bg-slate-800/60 border border-white/60 dark:border-slate-700/60 flex justify-between">
                    <span>🇩🇪 Germany</span>
                    <strong className="text-[#111827] dark:text-[#DFFF2F]">18,400</strong>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Traffic Calculator Section */}
      <section id="estimator" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <TrafficCalculator onStartCampaign={onStartCalculatorCampaign} />
      </section>

      {/* Features Grid */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-[#111827] dark:text-[#DFFF2F] uppercase tracking-wider block mb-1">Built For Scale</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111827] dark:text-white">Enterprise Traffic Marketplace Features</h2>
          <p className="text-xs sm:text-sm text-[#111827]/80 dark:text-slate-300 mt-2 font-medium">
            Engineered with high performance publisher pipelines and transparent tracking.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuresList.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={i}
                whileHover={{ y: -4 }}
                className="bg-white/80 dark:bg-slate-900/80 rounded-3xl p-6 border border-white dark:border-slate-800 hover:border-[#111827] dark:hover:border-[#DFFF2F]/50 transition-all shadow-md group"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#111827] dark:bg-slate-800 text-[#DFFF2F] flex items-center justify-center font-bold mb-4 shadow-md group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6 text-[#DFFF2F]" />
                </div>
                <h3 className="text-lg font-extrabold text-[#111827] dark:text-white mb-2">{f.title}</h3>
                <p className="text-xs text-[#111827]/80 dark:text-slate-300 leading-relaxed font-medium">{f.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Live Statistics */}
      <section className="bg-slate-900 text-white py-16 border-y border-slate-800 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl sm:text-5xl font-black text-[#DFFF2F]">50M+</p>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-2">Visitors Delivered</p>
            </div>
            <div>
              <p className="text-4xl sm:text-5xl font-black text-white">120+</p>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-2">Target Countries</p>
            </div>
            <div>
              <p className="text-4xl sm:text-5xl font-black text-[#DFFF2F]">99.9%</p>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-2">Delivery Success</p>
            </div>
            <div>
              <p className="text-4xl sm:text-5xl font-black text-white">$0.05</p>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-2">Minimum CPM Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials & Advertiser Reviews Carousel */}
      <section id="testimonials" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-[#111827] dark:text-[#DFFF2F] uppercase tracking-wider block mb-1">Real Advertiser Feedback</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111827] dark:text-white">What Media Buyers Say</h2>
          <p className="text-xs sm:text-sm text-[#111827]/80 dark:text-slate-300 mt-2 font-medium">
            Trusted by over 10,000+ affiliate marketers and e-commerce brands for high-converting traffic.
          </p>
        </div>

        {/* Sliding Carousel Container */}
        <div className="relative max-w-4xl mx-auto">
          {(() => {
            const activeTestimonials = testimonials.filter(t => t.active);
            if (activeTestimonials.length === 0) return null;

            const handleNext = () => {
              setActiveTestimonialIdx((prev) => (prev + 1) % activeTestimonials.length);
            };

            const handlePrev = () => {
              setActiveTestimonialIdx((prev) => (prev - 1 + activeTestimonials.length) % activeTestimonials.length);
            };

            const currentItem = activeTestimonials[activeTestimonialIdx % activeTestimonials.length];

            return (
              <div className="space-y-6">
                <div className="relative overflow-hidden p-2">
                  <motion.div
                    key={currentItem.id}
                    initial={{ x: 120, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -120, opacity: 0 }}
                    transition={{ type: 'spring', damping: 20, stiffness: 180 }}
                    className="bg-white/90 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 md:p-10 shadow-2xl relative flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-1 text-amber-400">
                          {[...Array(currentItem.rating)].map((_, i) => (
                            <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                        <Quote className="w-10 h-10 text-slate-300 dark:text-slate-700 opacity-40" />
                      </div>
                      <p className="text-base sm:text-lg text-[#111827] dark:text-slate-100 font-semibold leading-relaxed mb-8 italic">
                        "{currentItem.content}"
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-4">
                        <img
                          src={currentItem.avatar}
                          alt={currentItem.name}
                          className="w-12 h-12 rounded-full object-cover border-2 border-[#DFFF2F] shadow-md"
                        />
                        <div>
                          <h4 className="text-sm font-extrabold text-[#111827] dark:text-white">{currentItem.name}</h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{currentItem.role} {currentItem.company ? `• ${currentItem.company}` : ''}</p>
                        </div>
                      </div>

                      {/* Left - Right Slide Adjust Controls */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handlePrev}
                          className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-[#DFFF2F] hover:text-slate-950 transition-colors cursor-pointer text-[#111827] dark:text-white"
                          title="Previous review"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                          onClick={handleNext}
                          className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-[#DFFF2F] hover:text-slate-950 transition-colors cursor-pointer text-[#111827] dark:text-white"
                          title="Next review"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Carousel Pagination Dots */}
                <div className="flex items-center justify-center gap-2">
                  {activeTestimonials.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveTestimonialIdx(idx)}
                      className={`h-2.5 rounded-full transition-all cursor-pointer ${
                        idx === activeTestimonialIdx % activeTestimonials.length
                          ? 'w-8 bg-[#111827] dark:bg-[#DFFF2F]'
                          : 'w-2.5 bg-slate-300 dark:bg-slate-700'
                      }`}
                    />
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
      </section>

      {/* Payment Methods Section */}
      <section id="payment-methods" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-[#111827] dark:text-[#DFFF2F] uppercase tracking-wider block mb-1">Instant Manual Verification</span>
          <h2 className="text-3xl font-extrabold text-[#111827] dark:text-white">Supported Payment Gateways</h2>
          <p className="text-xs sm:text-sm text-[#111827]/80 dark:text-slate-300 mt-1 font-medium">
            Deposit funds using local or global payment options with fast admin verification.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {paymentMethods.map((pm, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -4, scale: 1.02 }}
              className="p-5 rounded-2xl bg-white/80 dark:bg-slate-900/90 border border-white dark:border-slate-800 text-center space-y-2.5 shadow-md hover:border-[#111827] dark:hover:border-[#DFFF2F] transition-all"
            >
              <div className="inline-block px-2.5 py-1 rounded-lg bg-[#111827] text-white dark:bg-[#DFFF2F] dark:text-[#111827] text-[11px] font-black tracking-wide uppercase">
                {pm.name.split(' ')[0]}
              </div>
              <p className="font-extrabold text-sm text-[#111827] dark:text-white">{pm.name}</p>
              <span className="text-[10px] font-bold text-[#111827] dark:text-[#DFFF2F] bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-full inline-block border border-slate-200 dark:border-slate-700">
                {pm.badge}
              </span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ Accordion */}
      <section id="faq" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-[#111827] dark:text-white">Frequently Asked Questions</h2>
          <p className="text-xs sm:text-sm text-[#111827]/80 dark:text-slate-300 font-medium mt-1">Got questions? We have clear answers.</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white/80 dark:bg-slate-900 border border-white dark:border-slate-800 rounded-2xl p-5 shadow-sm transition-all"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full flex justify-between items-center text-left font-bold text-sm text-[#111827] dark:text-white cursor-pointer"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-[#111827] dark:text-[#DFFF2F] transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
              </button>
              {openFaq === idx && (
                <p className="text-xs text-[#111827]/80 dark:text-slate-300 mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 leading-relaxed font-medium">
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
