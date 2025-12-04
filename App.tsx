import React, { useState, useEffect, lazy, Suspense, useCallback } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Envelope } from './src/components/Envelope';
import { InvitationContent } from './src/components/InvitationContent';
import { LoginModal } from './src/components/LoginModal';
import { getSettings } from './src/services/storageService';
import { WeddingSettings } from './types';
import { auth } from './src/firebase';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { INITIAL_SETTINGS } from './constants';
import { Loader2 } from 'lucide-react';
import { Toaster } from './src/components/ui/toaster';
import GiftListPage from './src/pages/GiftListPage';
import { setSupabaseAuthToken } from './src/supabase';

const AdminPanel = lazy(() => import('./src/components/AdminPanel'));

const InvitationPage = () => {
  const [hasOpenedEnvelope, setHasOpenedEnvelope] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [settings, setSettings] = useState<WeddingSettings>(INITIAL_SETTINGS);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSettings = useCallback(async () => {
    setIsLoading(true);
    try {
      const appSettings = await getSettings();
      if (appSettings) {
        setSettings(appSettings);
      }
    } catch (error: any) {
      console.error('Error fetching settings:', error);
      setSettings(INITIAL_SETTINGS);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const token = await currentUser.getIdToken();
        await setSupabaseAuthToken(token);
      } else {
        await setSupabaseAuthToken(null);
        sessionStorage.removeItem('isAdminLoggedIn');
        setIsAdminOpen(false);
      }
    });
    
    return () => unsubscribe();
  }, [fetchSettings]);

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

  const handleLoginSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
    sessionStorage.setItem('isAdminLoggedIn', 'true');
    setIsLoginModalOpen(false);
    setIsAdminOpen(true);
  };
  
  const handleSettingsUpdate = async () => {
    await fetchSettings();
  };
  
  useEffect(() => {
    const handleBeforeUnload = () => {
      sessionStorage.removeItem('isAdminLoggedIn');
    };
  
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    if (auth.currentUser && sessionStorage.getItem('isAdminLoggedIn') !== 'true') {
        signOut(auth);
    }
  
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-paper text-gold-dark font-serif">
          <Loader2 className="w-12 h-12 animate-spin" />
          <p className="mt-4 text-lg">Carregando convite...</p>
        </div>
      );
    }
    return (
      <InvitationContent
        settings={settings}
        onFooterClick={handleFooterTap}
      />
    );
  };

  return (
    <>
      {!hasOpenedEnvelope ? (
        <Envelope onOpen={() => setHasOpenedEnvelope(true)} />
      ) : (
        renderContent()
      )}

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {isAdminOpen && user && (
        <Suspense fallback={<div className="fixed inset-0 bg-black/50 flex items-center justify-center"><p className="text-white font-serif">Carregando painel...</p></div>}>
          <AdminPanel
            isOpen={isAdminOpen}
            onClose={handleAdminClose}
            onSettingsUpdate={handleSettingsUpdate}
          />
        </Suspense>
      )}
    </>
  );
}

function App() {
  const location = useLocation();
  return (
    <div className="w-full min-h-screen bg-black">
      <Routes location={location}>
        <Route path="/" element={<InvitationPage />} />
        <Route path="/lista-de-presentes" element={<GiftListPage />} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
