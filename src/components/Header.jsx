import React from 'react';
import { useLD } from '../context/LDContext';
import { Mail, Plus, LogOut, LayoutGrid, Calendar, Image, BarChart3, User } from 'lucide-react';

export const Header = ({ activeTab, setActiveTab, onOpenEmailInbox, onOpenCreateModal }) => {
  const { currentUser, logoutUser, emails } = useLD();
  const unreadEmailCount = emails.filter(e => !e.read).length;

  const TABS = [
    { id: 'programs', label: 'TLCE Programs', icon: LayoutGrid },
    { id: 'calendar', label: 'Annual Calendar', icon: Calendar },
    { id: 'gallery', label: 'Gallery', icon: Image },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 40,
      background: 'var(--grad-navy)',
      borderBottom: '2px solid rgba(0,156,222,0.3)',
      boxShadow: '0 4px 20px rgba(0,32,91,0.4)'
    }}>
      <div className="resp-header-container" style={{ 
        maxWidth: 1280, margin: '0 auto', padding: '0 24px', height: 64, 
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
        boxSizing: 'border-box'
      }}>

        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 8,
            background: 'linear-gradient(135deg, var(--n-red) 0%, #FF3333 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 900, fontSize: 13, color: '#fff',
            boxShadow: '0 2px 8px rgba(204,0,0,0.3)', border: '1.5px solid rgba(255,255,255,0.2)'
          }}>xyz</div>
          <div className="resp-hide-mobile">
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 15, fontWeight: 900, color: '#fff', letterSpacing: 0.3 }}>xyz</span>
              <span style={{
                fontSize: 8, fontWeight: 800, padding: '1px 6px', borderRadius: 999,
                background: 'rgba(0,156,222,0.25)', color: 'var(--n-blue-light)',
                border: '1px solid rgba(0,156,222,0.4)', textTransform: 'uppercase'
              }}>TLCE LMS</span>
            </div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.65)', fontWeight: 500, marginTop: 1 }}>
              Learning and Development Department
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="resp-header-nav" style={{
          display: 'flex', alignItems: 'center',
          background: 'rgba(0,0,0,0.25)', borderRadius: 10,
          padding: 3, border: '1px solid rgba(255,255,255,0.1)',
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
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '6px 12px', borderRadius: 8, border: 'none', cursor: 'pointer',
                  fontSize: 11, fontWeight: 700,
                  background: active ? 'var(--n-navy)' : 'transparent',
                  color: active ? '#fff' : 'rgba(255,255,255,0.65)',
                  transition: 'all 0.15s ease',
                  whiteSpace: 'nowrap'
                }}
              >
                <Icon size={13} />
                <span className="resp-hide-mobile">{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right actions */}
        <div className="resp-header-actions" style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>

          {currentUser?.role === 'Admin' && (
            <button
              onClick={onOpenCreateModal}
              style={{
                display: 'flex', alignItems: 'center', gap: 5, padding: '7px 12px',
                borderRadius: 8, border: '1px solid rgba(0,156,222,0.4)',
                background: 'rgba(0,156,222,0.2)', color: 'var(--n-blue-light)',
                fontSize: 11, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s ease'
              }}
            >
              <Plus size={12} /> <span className="resp-hide-mobile">New Program</span>
            </button>
          )}

          {/* Email Drawer */}
          <button
            onClick={onOpenEmailInbox}
            style={{
              position: 'relative', padding: '8px 9px', borderRadius: 8,
              background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.1)',
              color: 'var(--n-blue-light)', cursor: 'pointer', display: 'flex', alignItems: 'center'
            }}
          >
            <Mail size={14} />
            {unreadEmailCount > 0 && (
              <span style={{
                position: 'absolute', top: -3, right: -3,
                background: 'var(--n-red)', color: '#fff',
                fontSize: 8, fontWeight: 800, width: 14, height: 14,
                borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '1.5px solid var(--n-navy-dark)'
              }}>{unreadEmailCount}</span>
            )}
          </button>

          {/* Profile */}
          {currentUser && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'rgba(0,0,0,0.25)', padding: '4px 8px',
              borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)'
            }}>
              <div style={{
                width: 22, height: 22, borderRadius: 6,
                background: 'rgba(0,156,222,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <User size={13} color="#fff" />
              </div>
              <span className="resp-hide-mobile" style={{ fontSize: 11, fontWeight: 700, color: '#fff', maxWidth: 90, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {currentUser.name.split(' ')[0]}
              </span>
            </div>
          )}

          {/* Logout */}
          <button
            onClick={logoutUser}
            style={{
              padding: '8px 9px', borderRadius: 8,
              background: 'rgba(204,0,0,0.15)', border: '1px solid rgba(204,0,0,0.3)',
              color: '#FF8888', cursor: 'pointer', display: 'flex', alignItems: 'center'
            }}
          >
            <LogOut size={13} />
          </button>
        </div>
      </div>
    </header>
  );
};
