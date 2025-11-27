import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { addRSVP } from '../services/storageService';

interface RSVPModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RSVPModal: React.FC<RSVPModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    hasTransport: false
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }

    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.phone) return;

    addRSVP(formData);
    setIsSubmitted(true);
    
    setTimeout(() => {
      onClose();
      setIsSubmitted(false);
      setFormData({ firstName: '', lastName: '', phone: '', hasTransport: false });
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-paper relative w-full max-w-md rounded-lg shadow-2xl p-6 sm:p-8 border border-gold/30">
        <div className="absolute inset-0 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-50 rounded-lg"></div>
        
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-ink/50 hover:text-ink transition-colors"
        >
          <X size={24} />
        </button>

        <div className="relative z-10 text-center">
          <h2 className="font-serif text-2xl sm:text-3xl text-gold-dark mb-2">Confirmação de Presença</h2>
          <p className="font-sans text-xs text-ink/60 uppercase tracking-widest mb-6">Por favor, preencha seus dados</p>

          {isSubmitted ? (
            <div className="py-10 flex flex-col items-center animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4 text-green-600">
                <Check size={32} />
              </div>
              <p className="font-serif text-xl text-ink">Confirmado com sucesso!</p>
              <p className="font-sans text-sm text-ink/60 mt-2">Nos vemos no grande dia.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <div>
                <label className="block font-serif text-ink mb-1">Nome</label>
                <input 
                  type="text" 
                  required
                  value={formData.firstName}
                  onChange={e => setFormData({...formData, firstName: e.target.value})}
                  className="w-full bg-white/50 border-b border-gold/30 focus:border-gold outline-none py-2 px-1 font-sans text-ink transition-colors placeholder:text-ink/30"
                  placeholder="Seu primeiro nome"
                />
              </div>
              <div>
                <label className="block font-serif text-ink mb-1">Sobrenome</label>
                <input 
                  type="text" 
                  required
                  value={formData.lastName}
                  onChange={e => setFormData({...formData, lastName: e.target.value})}
                  className="w-full bg-white/50 border-b border-gold/30 focus:border-gold outline-none py-2 px-1 font-sans text-ink transition-colors placeholder:text-ink/30"
                  placeholder="Seu sobrenome"
                />
              </div>
              <div>
                <label className="block font-serif text-ink mb-1">Telefone (WhatsApp)</label>
                <input 
                  type="tel" 
                  required
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  className="w-full bg-white/50 border-b border-gold/30 focus:border-gold outline-none py-2 px-1 font-sans text-ink transition-colors placeholder:text-ink/30"
                  placeholder="(00) 00000-0000"
                />
              </div>
              
              <div className="pt-2 flex items-center gap-3 cursor-pointer select-none" onClick={() => setFormData({...formData, hasTransport: !formData.hasTransport})}>
                <div className={`w-5 h-5 border border-gold flex items-center justify-center transition-colors shrink-0 ${formData.hasTransport ? 'bg-gold' : 'bg-transparent'}`}>
                  {formData.hasTransport && <Check size={14} className="text-white" />}
                </div>
                <span className="font-serif text-ink text-sm sm:text-base">Utilizarei o transporte do evento (Van)</span>
              </div>

              <button 
                type="submit"
                className="w-full mt-6 bg-gold text-white font-serif tracking-widest uppercase py-3 hover:bg-gold-dark transition-all duration-300 shadow-md active:scale-95"
              >
                Confirmar
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
