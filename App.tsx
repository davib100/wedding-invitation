import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Envelope } from './src/components/Envelope';
import { InvitationContent } from './src/components/InvitationContent';
import { LoginModal } from './src/components/LoginModal';
import { getSettings } from './src/services/storageService';
import { WeddingSettings } from './types';
import { auth } from './src/firebase';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { INITIAL_SETTINGS } from './constants';

const AdminPanel = lazy(() => import('./src/components/AdminPanel'));

function App() {
  const [hasOpenedEnvelope, setHasOpenedEnvelope] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [settings, setSettings] = useState<WeddingSettings>(INITIAL_SETTINGS);
  const [user, setUser] = useState<User | null>(null);

  const fetchSettings = async () => {
    try {
      const appSettings = await getSettings();
      if (appSettings) {
        setSettings(appSettings);
      }
    } catch (error: any) {
      if (error?.code === 'unavailable' || error?.message?.includes('offline')) {
        console.log('App offline, using cached settings');
      } else {
        console.error('Error fetching settings, returning initial settings:', error);
      }
    }
  };

  useEffect(() => {
    fetchSettings();

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      // Força o logout se a página for recarregada e um usuário persistido for encontrado.
      // Apenas permite o estado do usuário se for definido por um login ativo.
      if (currentUser && sessionStorage.getItem('isAdminLoggedIn') !== 'true') {
        signOut(auth);
        setUser(null);
        setIsAdminOpen(false);
      } else {
        setUser(currentUser);
      }

      if (!currentUser) {
        sessionStorage.removeItem('isAdminLoggedIn');
        setIsAdminOpen(false);
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

  const handleLoginSuccess = () => {
    sessionStorage.setItem('isAdminLoggedIn', 'true');
    setIsLoginModalOpen(false);
    setIsAdminOpen(true); 
  };
  
  const handleSettingsUpdate = () => {
    fetchSettings();
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

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

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
