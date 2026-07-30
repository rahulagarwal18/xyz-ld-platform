import React, { useState } from 'react';
import { useLD } from '../context/LDContext';
import { X, Mail, RefreshCw, ExternalLink, ShieldCheck } from 'lucide-react';

export const EmailInboxDrawer = ({ isOpen, onClose }) => {
  const { emails, markEmailRead, completeEventAutomations, conferences } = useLD();
  const [filterType, setFilterType] = useState('All');

  if (!isOpen) return null;

  const filteredEmails = emails.filter(e => {
    if (filterType === 'All') return true;
    return e.type === filterType;
  });

  const emailTypes = ['All', 'Confirmation', 'Pre-Event', 'Check-In', 'Feedback', 'Absentee', 'Recommendation', 'Broadcast'];

  return (
    <div className="fixed inset-0 z-50 bg-[#00132e]/50 backdrop-blur-xs flex justify-end animate-fade-in">
      <div className="w-full max-w-xl bg-white border-l border-slate-200 h-full flex flex-col shadow-2xl">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-200 bg-[#001e42] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#0066cc] text-white">
              <Mail className="w-5 h-5 text-[#00a3e0]" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base">
                Automated Email Inbox & Delivery Center
              </h3>
              <p className="text-xs font-semibold text-slate-300">
                xyz Learning and Devlopemnt department
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 rounded bg-[#00132e] text-slate-300 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Action bar for automated workflows */}
        <div className="p-3 bg-slate-100 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="font-extrabold text-[#001e42]">Trigger Automations:</span>
          <div className="flex gap-2">
            <button
              onClick={() => {
                if (conferences.length > 0) {
                  completeEventAutomations(conferences[0].id);
                }
              }}
              className="px-2.5 py-1 rounded bg-[#0066cc] text-white font-bold hover:bg-[#0052a3] flex items-center gap-1 shadow-xs"
            >
              <RefreshCw className="w-3 h-3" /> Fulfill Event Mails
            </button>
          </div>
        </div>

        {/* Type Filter Pills */}
        <div className="p-3 border-b border-slate-200 flex gap-1.5 overflow-x-auto bg-slate-50 text-xs">
          {emailTypes.map(t => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-2.5 py-1 rounded-md font-bold whitespace-nowrap transition-all ${
                filterType === t
                  ? 'bg-[#001e42] text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Emails List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
          {filteredEmails.length === 0 ? (
            <div className="text-center py-12 text-slate-500 font-semibold text-xs">
              No emails found matching filter "{filterType}".
            </div>
          ) : (
            filteredEmails.map(email => (
              <div
                key={email.id}
                onClick={() => markEmailRead(email.id)}
                className={`p-4 rounded-xl border transition-all space-y-2 cursor-pointer ${
                  email.read ? 'bg-white border-slate-200' : 'bg-blue-50/60 border-[#0066cc]/40 shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-extrabold text-white px-2 py-0.5 rounded ${email.badgeColor}`}>
                      {email.type}
                    </span>
                    <span className="text-xs font-extrabold text-[#001e42]">
                      To: {email.recipientName} ({email.recipientEmail})
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold text-slate-400">
                    {new Date(email.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <div className="font-extrabold text-slate-900 text-xs">
                  {email.subject}
                </div>

                <div className="text-xs text-slate-600 line-clamp-2 font-medium">
                  {email.preview}
                </div>

                {/* Open in Gmail / Outlook Native App Button */}
                <div className="pt-2 flex items-center justify-between border-t border-slate-100 text-[11px]">
                  <span className="text-emerald-700 font-extrabold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Dispatched to Inbox
                  </span>
                  
                  <a
                    href={`mailto:${email.recipientEmail}?subject=${encodeURIComponent(email.subject)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#0066cc] font-extrabold hover:underline flex items-center gap-1"
                  >
                    Open in Gmail / Outlook App <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 border-t border-slate-200 bg-white text-[11px] text-slate-500 font-semibold text-center">
          Pre-Configured Email Engine Active • Ready Out-Of-The-Box
        </div>

      </div>
    </div>
  );
};
