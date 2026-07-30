import React from 'react';
import { useLD } from '../context/LDContext';
import { Mail, Plus, LogOut, LayoutGrid, Calendar, BarChart3 } from 'lucide-react';

export const Header = ({ activeTab, setActiveTab, onOpenEmailInbox, onOpenCreateModal }) => {
  const { currentUser, logoutUser, emails } = useLD();
  const unreadEmailCount = emails.filter(e => !e.read).length;

  const TABS = [
    { id: 'programs', label: 'TLCE Programs', icon: LayoutGrid },
    { id: 'calendar', label: 'Annual Calendar', icon: Calendar },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, adminOnly: false },
  ];

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 40,
      background: 'var(--grad-navy)',
      borderBottom: '2px solid rgba(0,156,222,0.3)',
      boxShadow: '0 4px 20px rgba(0,32,91,0.4)'
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>

        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: 'linear-gradient(135deg, var(--n-red) 0%, #FF3333 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 900, fontSize: 13, color: '#fff',
            boxShadow: '0 2px 8px rgba(204,0,0,0.4)', border: '1.5px solid rgba(255,255,255,0.2)',
            letterSpacing: -0.5
          }}>xyz</div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 16, fontWeight: 900, color: '#fff', letterSpacing: 0.5 }}>xyz</span>
              <span style={{
                fontSize: 9, fontWeight: 800, padding: '2px 8px', borderRadius: 999,
                background: 'rgba(0,156,222,0.25)', color: 'var(--n-blue-light)',
                border: '1px solid rgba(0,156,222,0.4)', letterSpacing: 1.5, textTransform: 'uppercase'
              }}>TLCE LMS</span>
            </div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)', fontWeight: 500, marginTop: 1 }}>
              Learning and Development Department
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav style={{
          display: 'flex', alignItems: 'center',
          background: 'rgba(0,0,0,0.25)', borderRadius: 12,
          padding: 4, border: '1px solid rgba(255,255,255,0.1)',
          gap: 2
        }}>
          {TABS.map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 7,
                  padding: '7px 16px', borderRadius: 9, border: 'none', cursor: 'pointer',
                  fontSize: 12, fontWeight: 700, letterSpacing: 0.3,
                  background: active ? 'var(--n-blue)' : 'transparent',
                  color: active ? '#fff' : 'rgba(255,255,255,0.65)',
                  boxShadow: active ? '0 2px 8px rgba(0,156,222,0.4)' : 'none',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap'
                }}
              >
                <Icon size={13} />
                <span className="hidden md:inline">{tab.label}</span>
                {tab.id === 'analytics' && currentUser?.role === 'Admin' && (
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#F59E0B' }} />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>

          {currentUser?.role === 'Admin' && (
            <button
              onClick={onOpenCreateModal}
              style={{
                display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px',
                borderRadius: 10, border: '1px solid rgba(0,156,222,0.4)',
                background: 'rgba(0,156,222,0.2)', color: 'var(--n-blue-light)',
                fontSize: 12, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s ease'
              }}
            >
              <Plus size={13} /> New Program
            </button>
          )}

          {/* Email */}
          <button
            onClick={onOpenEmailInbox}
            style={{
              position: 'relative', padding: '9px 10px', borderRadius: 10,
              background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.1)',
              color: 'var(--n-blue-light)', cursor: 'pointer', transition: 'all 0.2s ease',
              display: 'flex', alignItems: 'center'
            }}
          >
            <Mail size={16} />
            {unreadEmailCount > 0 && (
              <span style={{
                position: 'absolute', top: -4, right: -4,
                background: 'var(--n-red)', color: '#fff',
                fontSize: 9, fontWeight: 800, width: 16, height: 16,
                borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '2px solid var(--n-navy-dark)'
              }}>{unreadEmailCount}</span>
            )}
          </button>

          {/* Profile */}
          {currentUser && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 9,
              background: 'rgba(0,0,0,0.25)', padding: '6px 12px 6px 8px',
              borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)'
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: 8,
                background: 'rgba(0,156,222,0.3)', border: '1.5px solid rgba(0,156,222,0.5)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14
              }}>{currentUser.avatar || '👤'}</div>
              <div style={{ lineHeight: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#fff', maxWidth: 110, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{currentUser.name}</div>
                <div style={{ fontSize: 9, fontWeight: 800, color: 'var(--n-blue-light)', textTransform: 'uppercase', letterSpacing: 1 }}>{currentUser.role}</div>
              </div>
            </div>
          )}

          <button
            onClick={logoutUser}
            style={{
              padding: '8px 10px', borderRadius: 10,
              background: 'rgba(204,0,0,0.15)', border: '1px solid rgba(204,0,0,0.3)',
              color: '#FF8888', cursor: 'pointer', transition: 'all 0.2s ease',
              display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 700
            }}
          >
            <LogOut size={14} />
            <span style={{ display: 'none' }} className="lg:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};
