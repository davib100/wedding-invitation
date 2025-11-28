
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { X, Loader2 } from 'lucide-react';
import { signInWithEmailAndPassword, User } from 'firebase/auth';
import { auth } from '../firebase';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      onLoginSuccess(userCredential.user);
    } catch (error: any) {
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
        setError('Usuário ou senha inválidos.');
      } else if (error.code === 'auth/api-key-not-valid') {
        setError('Erro de configuração: A chave da API do Firebase não é válida.');
        console.error("Please check your Firebase configuration in the .env file at the root of your project.");
      } else {
        setError('Ocorreu um erro ao fazer login.');
        console.error(error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-paper bg-paper-texture border border-gold/30 text-ink rounded-lg shadow-2xl w-full max-w-sm p-8 relative">
        
        <button onClick={onClose} className="absolute top-4 right-4 text-ink/50 hover:text-gold transition-colors disabled:opacity-50" disabled={isLoading}>
          <X size={20} />
        </button>
        
        <div className="text-center mb-8">
          <h2 className="font-serif text-3xl text-gold-dark">Acesso Restrito</h2>
          <p className="text-sm text-ink/60 mt-1">Painel Administrativo</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="font-serif text-ink">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white/50 border-b-2 border-gold/30 focus:border-gold !ring-0 !ring-offset-0"
              required
              placeholder="seu@email.com"
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password"  className="font-serif text-ink">Senha</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-white/50 border-b-2 border-gold/30 focus:border-gold !ring-0 !ring-offset-0"
              required
              placeholder="••••••••"
              disabled={isLoading}
            />
          </div>

          {error && <p className="text-red-600 text-sm font-sans text-center bg-red-500/10 p-3 rounded-md border border-red-600/30">{error}</p>}
          
          <div className="pt-2">
            <Button type="submit" className="w-full bg-gold hover:bg-gold-dark text-white font-serif tracking-widest uppercase py-3 h-12 text-base shadow-lg hover:shadow-xl transition-all duration-300" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                'Login'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
