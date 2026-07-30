import React, { useState } from 'react';
import { LDProvider, useLD } from './context/LDContext';
import { Header } from './components/Header';
import { BannerCarousel } from './components/BannerCarousel';
import { HeadcountDashboard } from './components/HeadcountDashboard';
import { ConferenceList } from './components/ConferenceList';
import { RegistrationModal } from './components/RegistrationModal';
import { EmailInboxDrawer } from './components/EmailInboxDrawer';
import { ChatBot } from './components/ChatBot';
import { CreateConferenceModal } from './components/CreateConferenceModal';
import { AuthModal } from './components/AuthModal';
import { LoginScreen } from './components/LoginScreen';
import { Toast } from './components/Toast';
import { ShieldCheck, Sparkles } from 'lucide-react';

const MainApp = () => {
  const { currentUser } = useLD();

  const [activeTab, setActiveTab] = useState('events'); // 'events' | 'dashboard'
  const [selectedConferenceForReg, setSelectedConferenceForReg] = useState(null);
  
  const [isEmailInboxOpen, setIsEmailInboxOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // If user is logged out, show LoginScreen
  if (!currentUser) {
    return (
      <>
        <LoginScreen />
        <Toast />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f6f9] text-slate-900 flex flex-col font-sans selection:bg-[#0066cc] selection:text-white">
      
      {/* Top Executive Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenEmailInbox={() => setIsEmailInboxOpen(true)}
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6 space-y-6">
        
        {/* Banner Carousel for 3 Mandatory Featured Banners */}
        <BannerCarousel 
          onSelectConference={(conf) => setSelectedConferenceForReg(conf)} 
        />

        {/* View Header Bar */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-[#001e42] tracking-tight">
              {activeTab === 'events' ? 'Conference Catalog & Registrations' : 'Headcount Analytics & Attendee Roster'}
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#0066cc]/10 text-[#0066cc] font-extrabold border border-[#0066cc]/20">
              Q3 Flagship Calendar
            </span>
          </div>

          <div className="hidden md:flex items-center gap-3 text-xs text-slate-600 font-bold">
            <span className="flex items-center gap-1.5 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 text-emerald-700">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> Active Session: <strong>{currentUser.email}</strong>
            </span>
          </div>
        </div>

        {/* Tab View Content */}
        {activeTab === 'events' ? (
          <ConferenceList
            onSelectConference={(conf) => setSelectedConferenceForReg(conf)}
          />
        ) : (
          <HeadcountDashboard
            onOpenRegistrationModal={(conf) => setSelectedConferenceForReg(conf)}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-[#001e42] py-6 px-4 text-center text-xs text-slate-300 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-black text-white text-sm">xyz</span>
            <span>•</span>
            <span className="uppercase tracking-wider font-extrabold text-slate-300">Learning and Devlopemnt department</span>
          </div>
          <div className="font-semibold text-slate-300">
            Enterprise L&D Automation Platform • Logged in as {currentUser.name} ({currentUser.role})
          </div>
        </div>
      </footer>

      {/* Modals & Floating Drawers */}
      {selectedConferenceForReg && (
        <RegistrationModal
          conference={selectedConferenceForReg}
          onClose={() => setSelectedConferenceForReg(null)}
        />
      )}

      <EmailInboxDrawer
        isOpen={isEmailInboxOpen}
        onClose={() => setIsEmailInboxOpen(false)}
      />

      <CreateConferenceModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* Floating Bottom-Right Chatbot Widget */}
      <ChatBot />

      {/* Floating Toast Alerts */}
      <Toast />

    </div>
  );
};

export default function App() {
  return (
    <LDProvider>
      <MainApp />
    </LDProvider>
  );
}
