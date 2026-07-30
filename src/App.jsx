import React, { useState } from 'react';
import { LDProvider, useLD } from './context/LDContext';
import { Header } from './components/Header';
import { BannerCarousel } from './components/BannerCarousel';
import { HeadcountDashboard } from './components/HeadcountDashboard';
import { ConferenceList } from './components/ConferenceList';
import { TLCECalendar } from './components/TLCECalendar';
import { RegistrationModal } from './components/RegistrationModal';
import { EmailInboxDrawer } from './components/EmailInboxDrawer';
import { ChatBot } from './components/ChatBot';
import { CreateConferenceModal } from './components/CreateConferenceModal';
import { AuthModal } from './components/AuthModal';
import { LoginScreen } from './components/LoginScreen';
import { Toast } from './components/Toast';
import { ShieldCheck } from 'lucide-react';

const MainApp = () => {
  const { currentUser } = useLD();
  const [activeTab, setActiveTab] = useState('programs'); // 'programs' | 'calendar' | 'analytics'
  const [selectedConferenceForReg, setSelectedConferenceForReg] = useState(null);
  const [isEmailInboxOpen, setIsEmailInboxOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  if (!currentUser) {
    return (<><LoginScreen /><Toast /></>);
  }

  const TAB_LABELS = {
    programs: 'TLCE Programs',
    calendar: 'Annual Calendar',
    analytics: 'Analytics & Roster'
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--n-gray-light)', color: 'var(--n-gray-dark)', display: 'flex', flexDirection: 'column', fontFamily: 'var(--font-sans)' }}>

      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenEmailInbox={() => setIsEmailInboxOpen(true)}
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
      />

      <main style={{ flex: 1, maxWidth: 1280, width: '100%', margin: '0 auto', padding: '24px 24px 48px', display: 'flex', flexDirection: 'column', gap: 24 }}>

        {/* Banner Carousel — only on Programs tab */}
        {activeTab === 'programs' && (
          <BannerCarousel onSelectConference={(conf) => setSelectedConferenceForReg(conf)} />
        )}

        {/* Section header bar */}
        <div className="resp-title-bar" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          borderBottom: '2px solid var(--n-gray-border)', paddingBottom: 14
        }}>
          <div className="resp-title-left" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <h2 style={{ fontSize: 20, color: 'var(--n-navy-dark)', fontWeight: 800, margin: 0 }}>
              {TAB_LABELS[activeTab]}
            </h2>
            <span style={{
              fontSize: 11, padding: '4px 12px', borderRadius: 999,
              background: 'var(--n-blue-pale)', color: 'var(--n-navy)',
              fontWeight: 700, border: '1px solid rgba(0,156,222,0.3)',
              textTransform: 'uppercase', letterSpacing: 0.5,
              whiteSpace: 'nowrap', flexShrink: 0
            }}>2026 Annual TLCE</span>
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            fontSize: 12, color: 'var(--n-success)', fontWeight: 600,
            background: 'var(--n-success-bg)', padding: '6px 14px',
            borderRadius: 999, border: '1px solid rgba(46,125,50,0.3)',
            whiteSpace: 'nowrap', flexShrink: 0
          }}>
            <ShieldCheck size={14} />
            {currentUser.email}
          </div>
        </div>

        {/* Tab content */}
        {activeTab === 'programs' && (
          <ConferenceList onSelectConference={(conf) => setSelectedConferenceForReg(conf)} />
        )}
        {activeTab === 'calendar' && (
          <TLCECalendar onSelectConference={(conf) => setSelectedConferenceForReg(conf)} />
        )}
        {activeTab === 'analytics' && (
          <HeadcountDashboard onOpenRegistrationModal={(conf) => setSelectedConferenceForReg(conf)} />
        )}
      </main>

      {/* Footer */}
      <footer style={{
        background: 'var(--grad-navy)', padding: '20px 32px',
        borderTop: '3px solid rgba(0,156,222,0.4)'
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 18, fontWeight: 900, color: '#fff', letterSpacing: 1 }}>xyz</span>
            <span style={{ color: 'rgba(255,255,255,0.4)' }}>|</span>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', fontWeight: 600, letterSpacing: 0.5 }}>
              Learning and Development Department
            </span>
            <span style={{
              fontSize: 10, padding: '3px 10px', borderRadius: 999,
              background: 'rgba(0,156,222,0.3)', color: '#fff', fontWeight: 700, border: '1px solid rgba(0,156,222,0.4)'
            }}>TLCE LMS</span>
          </div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>
            Logged in as <strong style={{ color: '#fff' }}>{currentUser.name}</strong> · {currentUser.role}
          </div>
        </div>
      </footer>

      {/* Modals */}
      {selectedConferenceForReg && (
        <RegistrationModal
          conference={selectedConferenceForReg}
          onClose={() => setSelectedConferenceForReg(null)}
        />
      )}
      <EmailInboxDrawer isOpen={isEmailInboxOpen} onClose={() => setIsEmailInboxOpen(false)} />
      <CreateConferenceModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      <ChatBot />
      <Toast />
    </div>
  );
};

export default function App() {
  return (<LDProvider><MainApp /></LDProvider>);
}
