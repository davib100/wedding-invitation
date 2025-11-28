import React, { useState, useEffect, lazy, Suspense, useCallback } from 'react';
import { Envelope } from './src/components/Envelope';
import { InvitationContent } from './src/components/InvitationContent';
import { LoginModal } from './src/components/LoginModal';
import { getSettings } from './src/services/storageService';
import { WeddingSettings } from './types';
import { auth } from './src/firebase';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { INITIAL_SETTINGS } from './constants';

const AdminPanel = lazy(() => import('./src/components/AdminPanel'));

const MAX_FETCH_RETRIES = 3;
const FETCH_RETRY_DELAY = 2000; // 2 segundos

function App() {
  const [hasOpenedEnvelope, setHasOpenedEnvelope] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [settings, setSettings] = useState<WeddingSettings>(INITIAL_SETTINGS);
  const [user, setUser] = useState<User | null>(null);
  const [fetchAttempt, setFetchAttempt] = useState(0);

  const fetchSettings = useCallback(async () => {
    try {
      const appSettings = await getSettings();
      if (appSettings) {
        setSettings(appSettings);
      }
    } catch (error: any) {
      console.error('Error fetching settings:', error);
      // Tenta novamente se houver erro e não tiver atingido o limite
      if (fetchAttempt < MAX_FETCH_RETRIES) {
        setTimeout(() => setFetchAttempt(prev => prev + 1), FETCH_RETRY_DELAY);
      }
    }
  }, [fetchAttempt]);


  useEffect(() => {
    fetchSettings();

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // Apenas atualiza o estado do usuário
    
      // Se não há usuário, limpa o estado de admin
      if (!currentUser) {
        sessionStorage.removeItem('isAdminLoggedIn');
        setIsAdminOpen(false);
      }
    });
    
    return () => unsubscribe();
  // A dependência `fetchSettings` garante que o useEffect seja re-executado na tentativa de retry
  }, [fetchSettings]);

  const handleFooterTap = () => {
    // Se o usuário já está logado (verificado pelo estado `user`), abre o painel.
    // Senão, abre o modal de login.
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
    setUser(loggedInUser); // Garante que o estado do usuário seja definido
    sessionStorage.setItem('isAdminLoggedIn', 'true');
    setIsLoginModalOpen(false);
    setIsAdminOpen(true); // Abre o painel diretamente
  };
  
  const handleSettingsUpdate = () => {
    // Força uma nova busca para refletir as alterações salvas
    setFetchAttempt(0);
    fetchSettings();
  };
  
  // Efeito para forçar o logout ao recarregar a página
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Limpa a flag de sessão para que na próxima carga o estado seja resetado
      sessionStorage.removeItem('isAdminLoggedIn');
    };
  
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    // Força o logout se um usuário persistido for encontrado na carga inicial
    // sem a flag de sessão (indicando recarga da página).
    if (auth.currentUser && sessionStorage.getItem('isAdminLoggedIn') !== 'true') {
        signOut(auth);
    }
  
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);


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

      {isAdminOpen && user && (
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
