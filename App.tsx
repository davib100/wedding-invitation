import React, { useState, useEffect } from 'react';
import { Envelope } from './src/components/Envelope';
import { InvitationContent } from './src/components/InvitationContent';
import AdminPanel from './src/components/AdminPanel';
import { LoginModal } from './src/components/LoginModal';
import { getSettings } from './src/services/storageService';
import { WeddingSettings } from './types';
import { initializeFirebase } from './src/firebase';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';

function App() {
  const [hasOpenedEnvelope, setHasOpenedEnvelope] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [settings, setSettings] = useState<WeddingSettings>(getSettings());
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    initializeFirebase();
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setIsAdminOpen(true);
        setIsLoginModalOpen(false);
      }
    });

    return () => unsubscribe();
  }, []);


  const handleFooterTap = () => {
    if (user) {
        setIsAdminOpen(true);
    } else {
        setIsLoginModalOpen(true);
    }
  };

  const handleLoginSuccess = () => {
    // Auth state change will handle opening the admin panel
  };

  const handleAdminClose = () => {
    setIsAdminOpen(false);
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
          onFooterClick={handleFooterTap}
        />
      )}

      {!user && <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />}

      {user && isAdminOpen && (
        <AdminPanel
          isOpen={isAdminOpen}
          onClose={handleAdminClose}
          onSettingsUpdate={handleSettingsUpdate}
        />
      )}
    </div>
  );
}

export default App;
