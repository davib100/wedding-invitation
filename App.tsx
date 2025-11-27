import React, { useState } from 'react';
import { Envelope } from './src/components/Envelope';
import { InvitationContent } from './src/components/InvitationContent';
import { RSVPModal } from './src/components/RSVPModal';
import AdminPanel from './src/components/AdminPanel';
import { LoginModal } from './src/components/LoginModal';
import { getSettings } from './src/services/storageService';
import { WeddingSettings } from './types';

function App() {
  const [hasOpenedEnvelope, setHasOpenedEnvelope] = useState(false);
  const [isRSVPModalOpen, setIsRSVPModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [settings, setSettings] = useState<WeddingSettings>(getSettings());

  const handleFooterTap = () => {
    setIsLoginModalOpen(true);
  };

  const handleLoginSuccess = () => {
    setIsLoginModalOpen(false);
    setIsAdminOpen(true);
  };

  const handleSettingsUpdate = () => {
    setSettings(getSettings());
  };

  return (
    <div className="w-full min-h-screen bg-black">
      {!hasOpenedEnvelope ? (
        <Envelope onOpen={() => setHasOpenedEnvelope(true)} />
      ) : (
        <InvitationContent
          settings={settings}
          onOpenRSVP={() => setIsRSVPModalOpen(true)}
          onFooterClick={handleFooterTap}
        />
      )}

      <RSVPModal
        isOpen={isRSVPModalOpen}
        onClose={() => setIsRSVPModalOpen(false)}
      />

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {isAdminOpen && (
        <AdminPanel
          isOpen={isAdminOpen}
          onClose={() => setIsAdminOpen(false)}
          onSettingsUpdate={handleSettingsUpdate}
        />
      )}
    </div>
  );
}

export default App;
