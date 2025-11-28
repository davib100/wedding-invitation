import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Envelope } from './src/components/Envelope';
import { InvitationContent } from './src/components/InvitationContent';
import { LoginModal } from './src/components/LoginModal';
import { getSettings } from './src/services/storageService';
import { WeddingSettings } from './types';
import { initializeFirebase } from './src/firebase';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';

const AdminPanel = lazy(() => import('./src/components/AdminPanel'));

function App() {
  const [hasOpenedEnvelope, setHasOpenedEnvelope] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [settings, setSettings] = useState<WeddingSettings | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const fetchSettings = async () => {
    const appSettings = await getSettings();
    setSettings(appSettings);
  };

  useEffect(() => {
    initializeFirebase();
    fetchSettings();

    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setIsAdminOpen(true);
        setIsLoginModalOpen(false);
      } else {
        setIsAdminOpen(false); // Close admin panel on logout
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

  const handleAdminClose = () => {
    setIsAdminOpen(false);
  };

  const handleSettingsUpdate = () => {
    fetchSettings(); // Re-fetch settings after they are updated
  };

  if (!settings) {
    return (
      <div className="w-full min-h-screen bg-black flex items-center justify-center">
        <p className="text-white font-serif">Carregando convite...</p>
      </div>
    );
  }

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

      {!user && (
        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          onLoginSuccess={() => { /* Auth state change handles opening the admin panel */ }}
        />
      )}

      {isAdminOpen && (
        <Suspense fallback={<div className="fixed inset-0 bg-black/50 flex items-center justify-center"><p className="text-white font-serif">Carregando painel...</p></div>}>
          <AdminPanel
            isOpen={isAdminOpen}
            onClose={handleAdminClose}
            onSettingsUpdate={handleSettingsUpdate}
          />
        </Suspense>
      )}
    </div>
  );
}

export default App;
