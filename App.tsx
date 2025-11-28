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
      if (!currentUser) {
        // If user logs out, ensure admin panel is closed.
        setIsAdminOpen(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleFooterTap = () => {
    // This function decides whether to open the login modal or the admin panel
    if (user) {
      setIsAdminOpen(true);
    } else {
      setIsLoginModalOpen(true);
    }
  };

  const handleAdminClose = () => {
    setIsAdminOpen(false);
  };

  const handleLoginSuccess = () => {
    setIsLoginModalOpen(false);
    // On successful login, we set the state to open the admin panel.
    setIsAdminOpen(true); 
  };
  
  const handleSettingsUpdate = () => {
    // This function is called from the AdminPanel to signal that settings have changed
    fetchSettings(); // Re-fetch settings from Firestore to update the UI
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

      {/* Login modal is always present in the DOM but its visibility is toggled. */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* 
        The AdminPanel is now conditionally rendered and lazy-loaded.
        It will only be fetched and rendered if a user is logged in AND the isAdminOpen state is true.
        This prevents it from loading on initial app start.
      */}
      {user && isAdminOpen && (
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
