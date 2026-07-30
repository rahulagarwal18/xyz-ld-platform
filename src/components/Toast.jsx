import React from 'react';
import { useLD } from '../context/LDContext';
import { CheckCircle2, AlertTriangle, Info, XCircle, ExternalLink } from 'lucide-react';

export const Toast = () => {
  const { toast } = useLD();

  if (!toast) return null;

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-rose-400 shrink-0" />;
      default:
        return <Info className="w-5 h-5 text-[#00a3e0] shrink-0" />;
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-50 animate-bounce-short">
      <div className="bg-[#001e42] text-white border border-[#002d62] p-4 rounded-xl shadow-2xl flex flex-col sm:flex-row items-start sm:items-center gap-3 max-w-md">
        <div className="flex items-center gap-2.5">
          {getIcon()}
          <span className="text-xs font-extrabold leading-snug">{toast.message}</span>
        </div>

        {toast.action && (
          <a
            href={toast.action.url}
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1 rounded-lg bg-[#0066cc] hover:bg-[#0052a3] text-white text-xs font-extrabold transition-all flex items-center gap-1 shrink-0 shadow-sm border border-white/20"
          >
            <span>{toast.action.label}</span>
            <ExternalLink className="w-3.5 h-3.5 text-white" />
          </a>
        )}
      </div>
    </div>
  );
};
