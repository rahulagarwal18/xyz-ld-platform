import React from 'react';
import { useLD } from '../context/LDContext';
import { Mail, Plus, LogOut, Calendar, BarChart3, Bell } from 'lucide-react';

export const Header = ({ 
  activeTab, 
  setActiveTab, 
  onOpenEmailInbox, 
  onOpenCreateModal 
}) => {
  const { currentUser, logoutUser, emails } = useLD();

  const unreadEmailCount = emails.filter(e => !e.read).length;

  return (
    <header className="sticky top-0 z-40 bg-[#001e42] border-b border-[#002d62] text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Left: Executive Brand Identity */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0066cc] to-[#00a3e0] flex items-center justify-center font-black text-lg tracking-tighter text-white shadow-md border border-white/20">
            xyz
          </div>
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-2">
              <span className="text-lg font-black tracking-tight text-white leading-none">xyz</span>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#00a3e0]/15 text-[#00a3e0] border border-[#00a3e0]/30 tracking-wider">
                L&D PORTAL
              </span>
            </div>
            <span className="text-[11px] font-semibold text-slate-300 tracking-wide mt-0.5">
              Learning and Devlopemnt department
            </span>
          </div>
        </div>

        {/* Center: Sleek Navigation Switcher */}
        <nav className="hidden md:flex items-center bg-[#00132e] p-1 rounded-xl border border-[#002d62] shadow-inner">
          <button
            onClick={() => setActiveTab('events')}
            className={`px-4 py-1.5 rounded-lg text-xs font-extrabold transition-all flex items-center gap-2 ${
              activeTab === 'events'
                ? 'bg-[#0066cc] text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Conferences Catalog</span>
          </button>
          
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-1.5 rounded-lg text-xs font-extrabold transition-all flex items-center gap-2 ${
              activeTab === 'dashboard'
                ? 'bg-[#0066cc] text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Headcount Analytics</span>
            {currentUser?.role === 'Admin' && (
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            )}
          </button>
        </nav>

        {/* Right: User Profile & Quick Actions */}
        <div className="flex items-center gap-3">
          
          {/* Admin "New Event" CTA */}
          {currentUser?.role === 'Admin' && (
            <button
              onClick={onOpenCreateModal}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0066cc] hover:bg-[#0052a3] text-white text-xs font-extrabold transition-all shadow-sm border border-white/10"
            >
              <Plus className="w-3.5 h-3.5 text-white" />
              <span>New Event</span>
            </button>
          )}

          {/* Email Inbox Trigger */}
          <button
            onClick={onOpenEmailInbox}
            className="relative p-2 rounded-lg bg-[#00132e] border border-[#002d62] text-slate-300 hover:text-white hover:border-[#0066cc] transition-all"
            title="Automated Emails Inbox"
          >
            <Mail className="w-4 h-4 text-[#00a3e0]" />
            {unreadEmailCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-[#001e42]">
                {unreadEmailCount}
              </span>
            )}
          </button>

          {/* User Profile Badge */}
          {currentUser && (
            <div className="flex items-center gap-2 bg-[#00132e] pl-2 pr-3 py-1 rounded-xl border border-[#002d62]">
              <div className="w-7 h-7 rounded-lg bg-[#0066cc]/30 border border-[#0066cc]/50 flex items-center justify-center text-sm font-bold">
                {currentUser.avatar || '👤'}
              </div>
              <div className="text-left leading-tight hidden sm:block">
                <div className="text-xs font-extrabold text-white max-w-[120px] truncate">
                  {currentUser.name}
                </div>
                <div className="text-[9px] font-bold text-[#00a3e0] uppercase tracking-wider">
                  {currentUser.role}
                </div>
              </div>
            </div>
          )}

          {/* Logout Button */}
          <button
            onClick={logoutUser}
            className="p-1.5 px-2.5 rounded-lg bg-slate-800/80 hover:bg-rose-600/80 border border-slate-700 hover:border-rose-500 text-slate-300 hover:text-white transition-all flex items-center gap-1 text-xs font-bold"
            title="Log Out Session"
          >
            <LogOut className="w-3.5 h-3.5 text-slate-300" />
            <span className="hidden lg:inline">Logout</span>
          </button>

        </div>

      </div>
    </header>
  );
};
