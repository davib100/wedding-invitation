import React from 'react';
import { ArrowLeft, Gift, Search, ShoppingCart, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { giftList } from '../lib/gifts';

const GiftCard = ({ gift }: { gift: any }) => (
  <div className="bg-paper border border-gold/10 rounded-sm overflow-hidden group flex flex-col">
    <div className="overflow-hidden">
      <img src={gift.image} alt={gift.name} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
    </div>
    <div className="p-4 flex flex-col flex-grow">
      <h3 className="font-serif text-ink text-lg leading-tight mb-2 flex-grow">{gift.name}</h3>
      <div className="flex items-center mb-2">
        {[...Array(5)].map((_, i) => (
          <Star key={i} size={14} className={`mr-0.5 ${i < 4 ? 'text-gold-dark fill-gold-dark' : 'text-gold/30 fill-gold/30'}`} />
        ))}
        <span className="text-xs text-ink/50 ml-1">(1,234)</span>
      </div>
      <p className="font-sans text-2xl text-ink font-light mb-4">
        R$ {gift.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
      </p>
      <button className="mt-auto w-full bg-gold hover:bg-gold-dark text-white font-serif tracking-widest uppercase py-2 transition-all duration-300 shadow-md active:scale-95 text-sm">
        Presentear
      </button>
    </div>
  </div>
);

const GiftListPage = () => {
  return (
    <div className="bg-paper-dark min-h-screen font-sans">
      <header className="bg-paper shadow-md sticky top-0 z-20">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-gold-dark hover:text-ink transition-colors">
            <ArrowLeft size={20} />
            <span className="font-serif text-lg">Voltar ao Convite</span>
          </Link>
          <div className="flex items-center gap-4">
            {/* Icons removed as requested */}
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-8">
        <div className="text-center mb-12">
            <h1 className="font-serif text-4xl md:text-5xl text-gold-dark mb-2">Lista de Presentes</h1>
            <p className="max-w-2xl mx-auto text-ink/60">Seu carinho é o maior presente, mas se desejar nos mimar, preparamos uma lista com itens que amamos.</p>
        </div>

        <section>
          <h2 className="font-serif text-2xl text-ink mb-6">Mimos Disponiveis</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {giftList.map(gift => (
              <GiftCard key={gift.id} gift={gift} />
            ))}
          </div>
        </section>
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
