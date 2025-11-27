
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { X } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock authentication
    if (username === 'admin' && password === 'password') {
      setError('');
      onLoginSuccess();
    } else {
      setError('Usuário ou senha inválidos');
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
            <Label htmlFor="username" className="font-serif text-ink">Usuário</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
