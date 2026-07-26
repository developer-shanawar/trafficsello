import React, { useEffect, useState } from 'react';
import { subscribeToast } from '../lib/notifications';
import { Bell, X, CheckCircle2, AlertTriangle, Info } from 'lucide-react';

interface ToastItem {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning';
}

export const ToastContainer: React.FC = () => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    const unsubscribe = subscribeToast((title, message, type = 'info') => {
      const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      setToasts(prev => [{ id, title, message, type }, ...prev].slice(0, 4));

      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, 6000);
    });

    return () => unsubscribe();
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-2">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isWarning = toast.type === 'warning';
        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-2xl shadow-2xl border backdrop-blur-xl flex items-start justify-between gap-3 transition-all animate-in slide-in-from-top-3 ${
              isSuccess
                ? 'bg-emerald-950/90 border-emerald-500/40 text-emerald-100'
                : isWarning
                ? 'bg-amber-950/90 border-amber-500/40 text-amber-100'
                : 'bg-slate-900/95 border-slate-700/80 text-white'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                isSuccess ? 'bg-emerald-500/20 text-emerald-400' : isWarning ? 'bg-amber-500/20 text-amber-400' : 'bg-[#DFFF2F]/20 text-[#DFFF2F]'
              }`}>
                {isSuccess ? <CheckCircle2 className="w-4 h-4" /> : isWarning ? <AlertTriangle className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-black tracking-tight">{toast.title}</p>
                <p className="text-[11px] opacity-90 leading-tight">{toast.message}</p>
              </div>
            </div>

            <button
              onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
              className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white shrink-0 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
