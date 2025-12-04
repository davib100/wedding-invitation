import React, { useState, useEffect } from 'react';
import { ArrowLeft, Gift as GiftIcon, Loader2, PartyPopper } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getGifts, createReservation } from '../services/storageService';
import { Gift } from '../../types';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useToast } from '../hooks/use-toast';
import { supabase } from '../supabase';

interface ReserveModalProps {
  gift: Gift;
  onClose: () => void;
  onSuccess: () => void;
}

const ReserveModal: React.FC<ReserveModalProps> = ({ gift, onClose, onSuccess }) => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !phone) {
            toast({ title: 'Atenção', description: 'Por favor, preencha seu nome e telefone.', variant: 'destructive' });
            return;
        }
        setIsSaving(true);
        try {
            await createReservation(gift.id, name, phone);
            toast({ title: 'Oba!', description: 'Presente reservado com sucesso! Muito obrigado!', className: 'bg-paper border-green-300' });
            onSuccess();
        } catch (error: any) {
            toast({ title: 'Ops!', description: `Não foi possível reservar. ${error.message}`, variant: 'destructive' });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="relative bg-paper-texture bg-paper w-full max-w-md rounded-lg shadow-2xl p-8 border border-gold/30">
                <h2 className="font-serif text-2xl text-gold-dark text-center">Reservar Mimo</h2>
                <p className="text-center font-sans text-ink/70 mt-1 mb-6">Você está presenteando com: <span className="font-bold">{gift.name}</span></p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="font-serif text-ink">Seu nome completo</label>
                        <Input value={name} onChange={e => setName(e.target.value)} placeholder="Seu nome" disabled={isSaving}/>
                    </div>
                    <div>
                        <label className="font-serif text-ink">Seu telefone (WhatsApp)</label>
                        <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="(00) 00000-0000" disabled={isSaving}/>
                    </div>
                    <div className="flex gap-4 pt-4">
                        <Button variant="outline" type="button" onClick={onClose} className="w-full" disabled={isSaving}>Cancelar</Button>
                        <Button type="submit" className="w-full bg-gold hover:bg-gold-dark text-white" disabled={isSaving}>
                            {isSaving ? <Loader2 className="animate-spin" /> : 'Confirmar Reserva'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};


const GiftCard = ({ gift, onReserve }: { gift: Gift, onReserve: (gift: Gift) => void }) => {
  const reservedCount = gift.reservations?.length || 0;
  const isFullyReserved = reservedCount >= gift.quantity;

  return (
    <div className={`bg-paper border border-gold/10 rounded-sm overflow-hidden group flex flex-col transition-opacity duration-300 ${isFullyReserved ? 'opacity-50' : ''}`}>
      <div className="overflow-hidden relative">
        <img 
          src={gift.image_url || `https://picsum.photos/seed/${gift.id}/400/400`} 
          alt={gift.name} 
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" 
        />
        {isFullyReserved ? (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-gold text-white font-serif px-3 py-1 rounded-full text-sm">Esgotado</span>
          </div>
        ) : (
          <div className="absolute bottom-2 right-2 bg-paper/80 text-ink text-xs px-2 py-1 rounded-full font-sans">
            {reservedCount} de {gift.quantity} reservados
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-serif text-ink text-lg leading-tight mb-2 flex-grow">{gift.name}</h3>
        
        <p className="font-sans text-2xl text-ink font-light mb-4">
          R$ {gift.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </p>

        <Button 
          onClick={() => onReserve(gift)}
          disabled={isFullyReserved}
          className="mt-auto w-full bg-gold hover:bg-gold-dark text-white font-serif tracking-widest uppercase py-2 transition-all duration-300 shadow-md active:scale-95 text-sm"
        >
          Presentear
        </Button>
      </div>
    </div>
  )
};

const GiftListPage = () => {
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedGift, setSelectedGift] = useState<Gift | null>(null);

  const fetchGifts = async () => {
    setIsLoading(true);
    try {
      const giftsData = await getGifts();
      setGifts(giftsData);
    } catch(e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGifts();

    const giftsChannel = supabase
      .channel('gifts-list-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'gifts' }, () => {
        fetchGifts();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reservations' }, () => {
        fetchGifts();
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(giftsChannel);
    };
  }, []);

  const handleReserveSuccess = () => {
    setSelectedGift(null);
    fetchGifts();
  };

  return (
    <div className="bg-paper-dark min-h-screen font-sans">
      {selectedGift && (
        <ReserveModal 
            gift={selectedGift}
            onClose={() => setSelectedGift(null)}
            onSuccess={handleReserveSuccess}
        />
      )}
      <header className="bg-paper shadow-md sticky top-0 z-20">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-gold-dark hover:text-ink transition-colors">
            <ArrowLeft size={20} />
            <span className="font-serif text-lg">Voltar ao Convite</span>
          </Link>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-8">
        <div className="text-center mb-12">
            <h1 className="font-serif text-4xl md:text-5xl text-gold-dark mb-2">Lista de Presentes</h1>
            <p className="max-w-2xl mx-auto text-ink/60">Seu carinho é o nosso maior presente, mas se desejar nos mimar, preparamos uma lista com itens que amamos.</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-10 h-10 text-gold animate-spin"/>
          </div>
        ) : gifts.length > 0 ? (
          <section>
            <h2 className="font-serif text-2xl text-ink mb-6">Mimos Disponíveis</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {gifts.map(gift => (
                <GiftCard key={gift.id} gift={gift} onReserve={setSelectedGift} />
              ))}
            </div>
          </section>
        ) : (
          <div className="text-center py-20 border border-dashed rounded-lg bg-paper">
            <PartyPopper size={48} className="mx-auto text-gold/30 mb-4" />
            <h3 className="font-serif text-2xl text-ink">Em breve!</h3>
            <p className="text-ink/60 mt-2">Nossa lista de presentes ainda está sendo preparada com muito carinho.</p>
          </div>
        )}
      </main>

      <footer className="text-center py-8 mt-8 border-t border-gold/10">
         <p className="font-sans text-[10px] tracking-widest text-ink/40">
           Lista de Presentes de Rosângela & Davi
         </p>
      </footer>
    </div>
  );
};

export default GiftListPage;
