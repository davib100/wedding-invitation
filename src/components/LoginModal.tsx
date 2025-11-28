
import React, 'useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { X } from 'lucide-react';
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      onLoginSuccess(userCredential.user);
    } catch (error: any) {
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
        setError('Usuário ou senha inválidos.');
      } else if (error.code === 'auth/api-key-not-valid') {
        setError('Erro de configuração: A chave da API do Firebase não é válida.');
        console.error("Please check your Firebase configuration in the .env file at the root of your project.");
      }
      else {
        setError('Ocorreu um erro ao fazer login.');
        console.error(error);
      }
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-paper/90 border border-gold/30 text-ink rounded-lg shadow-2xl w-full max-w-sm p-8 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-ink/50 hover:text-gold transition-colors">
          <X size={20} />
        </button>
        <h2 className="font-serif text-3xl text-gold-dark mb-6 text-center">Admin Login</h2>
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="font-serif text-ink">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/50 border-b border-gold/30 focus:border-gold outline-none py-2 px-1 font-sans text-ink transition-colors placeholder:text-ink/30"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password"  className="font-serif text-ink">Senha</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
               className="w-full bg-white/50 border-b border-gold/30 focus:border-gold outline-none py-2 px-1 font-sans text-ink transition-colors placeholder:text-ink/30"
              required
            />
          </div>
          {error && <p className="text-red-600 text-sm font-sans text-center">{error}</p>}
          <Button type="submit" className="w-full bg-gold hover:bg-gold-dark text-white font-serif tracking-widest uppercase py-3 mt-4">
            Login
          </Button>
        </form>
      </div>
    </div>
  );
};
