import React, { useState } from 'react';
import { useLD } from '../context/LDContext';
import { X, Mail, RefreshCw, ExternalLink, ShieldCheck } from 'lucide-react';

export const EmailInboxDrawer = ({ isOpen, onClose }) => {
  const { emails, markEmailRead, completeEventAutomations, conferences, currentUser } = useLD();
  const [filterType, setFilterType] = useState('All');

  if (!isOpen) return null;

  const isAdmin = currentUser?.role === 'Admin';
  const userEmails = isAdmin
    ? emails
    : emails.filter(e => e.recipientEmail === currentUser?.email || e.recipientEmail === 'all-employees@xyz.com');

  const filteredEmails = userEmails.filter(e => {
    if (filterType === 'All') return true;
    return e.type === filterType;
  });

  const emailTypes = ['All', 'Confirmation', 'Pre-Event', 'Check-In', 'Feedback', 'Absentee', 'Recommendation', 'Broadcast'];

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9100,
          background: 'rgba(0, 20, 60, 0.45)',
          backdropFilter: 'blur(3px)',
          animation: 'fadeIn 0.25s ease'
        }}
      />

      {/* Drawer Panel */}
      <div style={{
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        maxWidth: 520,
        zIndex: 9101,
        background: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '-8px 0 40px rgba(0,0,0,0.15)',
        animation: 'slideFromRight 0.25s ease'
      }}>
        <style>{`
          @keyframes slideFromRight {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
          }
        `}</style>

        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #003087 0%, #00205B 100%)',
          padding: '18px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          color: '#ffffff',
          flexShrink: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: 'rgba(255,255,255,0.18)',
              border: '1.5px solid rgba(255,255,255,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Mail size={18} color="#009CDE" />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: '#ffffff' }}>
                Automated Email Engine &amp; Logs
              </h3>
              <p style={{ margin: '4px 0 0', fontSize: 11, color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>
                xyz Learning and Development Department
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            style={{
              background: 'rgba(255,255,255,0.15)',
              border: 'none',
              borderRadius: 8,
              padding: 6,
              cursor: 'pointer',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Quick Action bar for automated workflows */}
        <div style={{
          padding: '12px 18px',
          background: '#F8FAFC',
          borderBottom: '1px solid #E2E8F0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 10,
          flexShrink: 0
        }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#00205B' }}>Trigger Automations:</span>
          <button
            onClick={() => {
              if (conferences.length > 0) {
                completeEventAutomations(conferences[0].id);
              }
            }}
            style={{
              padding: '6px 12px',
              borderRadius: 6,
              border: 'none',
              background: '#003087',
              color: '#ffffff',
              fontSize: 11,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontFamily: 'var(--font-sans)',
              boxShadow: '0 2px 6px rgba(0,48,135,0.15)'
            }}
          >
            <RefreshCw size={12} /> Fulfill Event Mails
          </button>
        </div>

        {/* Type Filter Pills */}
        <div style={{
          padding: '10px 16px',
          borderBottom: '1px solid #E2E8F0',
          display: 'flex',
          gap: 6,
          overflowX: 'auto',
          background: '#ffffff',
          flexShrink: 0
        }}>
          {emailTypes.map(t => {
            const active = filterType === t;
            return (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                style={{
                  padding: '6px 12px',
                  borderRadius: 6,
                  border: active ? 'none' : '1px solid #D1D5DB',
                  background: active ? '#003087' : '#ffffff',
                  color: active ? '#ffffff' : '#767676',
                  fontSize: 11,
                  fontWeight: 700,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  fontFamily: 'var(--font-sans)',
                  transition: 'all 0.15s ease'
                }}
              >
                {t}
              </button>
            );
          })}
        </div>

        {/* Emails List */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          background: '#F8FAFC'
        }}>
          {filteredEmails.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#767676', fontSize: 13, fontWeight: 500 }}>
              No emails found matching filter "{filterType}".
            </div>
          ) : (
            filteredEmails.map(email => (
              <div
                key={email.id}
                onClick={() => markEmailRead(email.id)}
                style={{
                  padding: '16px',
                  borderRadius: 12,
                  border: '1px solid #E2E8F0',
                  background: '#ffffff',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                  cursor: 'pointer',
                  boxShadow: email.read ? 'none' : '0 2px 8px rgba(0,9c,de,0.06)',
                  borderLeft: email.read ? '1px solid #E2E8F0' : '4px solid #009CDE',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{
                      fontSize: 9,
                      fontWeight: 800,
                      color: '#ffffff',
                      padding: '3px 8px',
                      borderRadius: 999,
                      background: email.type === 'Confirmation' ? 'var(--n-success)' :
                                  email.type === 'Broadcast' ? 'var(--n-navy)' :
                                  email.type === 'Absentee' ? 'var(--n-red)' : 'var(--n-blue)',
                      textTransform: 'uppercase'
                    }}>{email.type}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#00205B' }}>
                      To: {email.recipientName} ({email.recipientEmail})
                    </span>
                  </div>
                  <span style={{ fontSize: 10, color: '#767676', fontWeight: 500 }}>
                    {new Date(email.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <div style={{ fontWeight: 800, color: '#333333', fontSize: 13 }}>
                  {email.subject}
                </div>

                <div style={{ fontSize: 12, color: '#767676', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
                  {email.preview}
                </div>

                {/* Open in Mail app link */}
                <div style={{
                  paddingTop: 10,
                  borderTop: '1px solid #F1F5F9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: 11
                }}>
                  <span style={{ color: 'var(--n-success)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <ShieldCheck size={14} /> Dispatched to Inbox
                  </span>
                  
                  <a
                    href={`mailto:${email.recipientEmail}?subject=${encodeURIComponent(email.subject)}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      color: '#009CDE',
                      fontWeight: 700,
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4
                    }}
                    onClick={e => e.stopPropagation()}
                  >
                    Open in Mail Client <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        <div style={{
          padding: '12px',
          borderTop: '1px solid #E2E8F0',
          background: '#ffffff',
          fontSize: 11,
          color: '#767676',
          fontWeight: 600,
          textAlign: 'center',
          flexShrink: 0
        }}>
          Pre-Configured Email Engine Active · Ready Out-Of-The-Box
        </div>

      </div>
    </>
  );
};
