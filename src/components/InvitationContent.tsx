import React, { useState, useEffect, useMemo } from 'react';
import { MapPin, ChevronsDown, Volume2, VolumeX, Gift, ExternalLink } from 'lucide-react';
import { WeddingSettings } from '../../types';

interface InvitationContentProps {
  settings: WeddingSettings;
  onOpenRSVP: () => void;
  onFooterClick: () => void;
}

export const InvitationContent: React.FC<InvitationContentProps> = ({ settings, onOpenRSVP, onFooterClick }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isPlaying, setIsPlaying] = useState(true);
  const audioRef = React.useRef<HTMLAudioElement>(null);
  const [footerClicks, setFooterClicks] = useState(0);

  const initials = useMemo(() => {
    const groomInitial = settings.groomName ? settings.groomName.trim().charAt(0).toUpperCase() : 'R';
    const brideInitial = settings.brideName ? settings.brideName.trim().charAt(0).toUpperCase() : 'D';
    return { groom: groomInitial, bride: brideInitial };
  }, [settings.groomName, settings.brideName]);

  const handleFooterClick = () => {
    const newClickCount = footerClicks + 1;
    setFooterClicks(newClickCount);
    if (newClickCount >= 5) {
      onFooterClick();
      setFooterClicks(0); // Reset after opening
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.volume = 0.4;
        audioRef.current.play().catch(e => console.log("Autoplay blocked until interaction", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    const targetDate = new Date(settings.eventDate).getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;
      if (distance < 0) {
        clearInterval(interval);
        return;
      }
      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [settings.eventDate]);

  return (
    <div className="relative w-full min-h-screen bg-paper bg-paper-texture overflow-y-auto animate-fade-in">
      <audio ref={audioRef} src={settings.musicUrl} loop />

      <button 
        onClick={() => setIsPlaying(!isPlaying)}
        className="fixed top-4 right-4 md:top-6 md:right-6 z-40 w-10 h-10 rounded-full bg-gold/20 backdrop-blur-sm border border-gold flex items-center justify-center text-gold-dark hover:bg-gold hover:text-white transition-all duration-300"
      >
        {isPlaying ? <Volume2 size={18} className="animate-pulse" /> : <VolumeX size={18} />}
      </button>

      <div className="fixed inset-2 md:inset-4 border border-gold/30 pointer-events-none z-30 rounded-sm"></div>
      <div className="fixed inset-3 md:inset-6 border border-gold/10 pointer-events-none z-30 rounded-sm"></div>
      
      <div className="fixed right-4 top-1/2 -translate-y-1/2 flex flex-col items-center text-gold-dark/60 animate-swipe-down z-30">
        <ChevronsDown size={24} />
      </div>


      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 md:py-20 flex flex-col items-center text-center space-y-12 md:space-y-16 relative z-10">
        
          <div className="relative group cursor-default pt-6">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 md:w-40 md:h-40 bg-[#D4AF37] blur-[80px] opacity-20 rounded-full pointer-events-none"></div>
            
            <div className="relative w-72 h-72 md:w-96 md:h-96 transition-transform duration-[2000ms] hover:scale-[1.02]">
              <svg className="w-full h-full drop-shadow-2xl" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="luxuryGold" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#BF953F" />
                    <stop offset="25%" stopColor="#FCF6BA" />
                    <stop offset="50%" stopColor="#B38728" />
                    <stop offset="75%" stopColor="#FBF5B7" />
                    <stop offset="100%" stopColor="#AA771C" />
                  </linearGradient>
                  <filter id="goldEmboss" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur"/>
                    <feSpecularLighting in="blur" surfaceScale="3" specularConstant="1" specularExponent="20" lightingColor="#FFF" result="specOut">
                      <fePointLight x="-5000" y="-10000" z="20000"/>
                    </feSpecularLighting>
                    <feComposite in="specOut" in2="SourceAlpha" operator="in" result="specOut"/>
                    <feComposite in="SourceGraphic" in2="specOut" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" result="litPaint"/>
                    <feDropShadow dx="1" dy="2" stdDeviation="3" floodColor="#3e2b06" floodOpacity="0.4"/>
                  </filter>
                </defs>

                <g filter="url(#goldEmboss)">
                  <circle cx="200" cy="200" r="130" fill="none" stroke="url(#luxuryGold)" strokeWidth="1.5" />
                  <circle cx="200" cy="200" r="122" fill="none" stroke="url(#luxuryGold)" strokeWidth="4" strokeDasharray="1, 8" strokeLinecap="round" />
                  <circle cx="200" cy="200" r="114" fill="none" stroke="url(#luxuryGold)" strokeWidth="1" />
                  <line x1="152" y1="260" x2="248" y2="140" stroke="url(#luxuryGold)" strokeWidth="2" strokeLinecap="square" />
                </g>

                <g>
                  <text x="145" y="190" 
                        textAnchor="middle" 
                        dominantBaseline="middle"
                        fill="url(#luxuryGold)" 
                        style={{ fontStyle: 'italic', fontFamily: '"Times New Roman", serif', fontSize: '100px', fontWeight: '400', letterSpacing: '-2px' }}
                        filter="url(#goldEmboss)">
                    {initials.bride}
                  </text>

                  <text x="255" y="220" 
                        textAnchor="middle" 
                        dominantBaseline="middle"
                        fill="url(#luxuryGold)" 
                        style={{ fontStyle: 'italic', fontFamily: '"Times New Roman", serif', fontSize: '100px', fontWeight: '400', letterSpacing: '-2px' }}
                        filter="url(#goldEmboss)">
                    {initials.groom}
                  </text>
                </g>
              </svg>
            </div>
          </div>

        <header className="space-y-4 animate-slide-up w-full">
          <p className="font-serif italic text-ink/70 text-base md:text-lg tracking-wide">
            {settings.introText}
          </p>
          
          <div className="py-4 md:py-8">
            <h1 className="font-script text-5xl sm:text-6xl md:text-8xl text-gold-dark drop-shadow-sm p-2 md:p-4 leading-tight">
               {settings.groomName.split(' ')[0]} 
               <span className="text-3xl md:text-5xl px-2 md:px-4 text-ink/40">&</span> 
               {settings.brideName.split(' ')[0]}
            </h1>
          </div>
          
        </header>

        <section className="space-y-6 max-w-lg mx-auto">
          <p className="font-serif text-base md:text-lg text-ink leading-relaxed">
            {settings.inviteText}
          </p>
          <div className="w-12 h-[1px] bg-gold mx-auto my-6"></div>
        </section>

        <section className="w-full">
           <div className="grid grid-cols-4 gap-2 md:gap-4 text-gold-dark max-w-sm mx-auto">
             {[
               { val: timeLeft.days, label: 'Dias' },
               { val: timeLeft.hours, label: 'Horas' },
               { val: timeLeft.minutes, label: 'Min' },
               { val: timeLeft.seconds, label: 'Seg' }
             ].map((item, idx) => (
               <div key={idx} className="flex flex-col items-center p-2 border border-gold/10 bg-white/40 rounded-sm">
                 <span className="font-serif text-xl md:text-3xl font-semibold">{String(item.val).padStart(2, '0')}</span>
                 <span className="text-[9px] md:text-[10px] uppercase tracking-widest opacity-70">{item.label}</span>
               </div>
             ))}
           </div>
        </section>

        <section className="space-y-2 w-full pt-4 md:pt-8">
           <h3 className="font-serif text-2xl md:text-3xl text-gold-dark border-b border-gold/20 pb-2 inline-block px-8">
             A Celebração
           </h3>
           <div className="pt-6 space-y-4">
             <div className="flex flex-col">
                <span className="font-script text-2xl md:text-3xl text-ink">
                  {new Date(settings.eventDate).toLocaleDateString('pt-BR', { weekday: 'long' })}
                </span>
                <span className="font-serif text-4xl md:text-5xl text-gold-dark font-bold my-1">
                  {new Date(settings.eventDate).getDate()}
                </span>
                <span className="text-xs uppercase tracking-[0.2em] text-ink/60">
                  {new Date(settings.eventDate).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                </span>
                <span className="font-serif italic text-base md:text-lg mt-2">
                   às {new Date(settings.eventDate).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </span>
             </div>
             <div className="pt-4">
                <p className="font-serif text-lg md:text-xl font-semibold text-ink">{settings.eventLocation}</p>
                <p className="font-sans text-sm text-ink/60 max-w-xs mx-auto mt-1">{settings.eventAddress}</p>
             </div>
           </div>
        </section>

        <section className="w-full pt-4 md:pt-8">
          <div className="relative w-full h-64 md:h-80 bg-paper-dark p-2 shadow-inner border border-gold/20 rotate-1 transition-transform hover:rotate-0 duration-500 rounded-sm">
             <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gold text-white p-2 rounded-full shadow-lg z-10">
               <MapPin size={20} />
             </div>
             <iframe 
               src={settings.mapUrl}
               width="100%" 
               height="100%" 
               style={{ border: 0, filter: 'grayscale(30%) sepia(20%)' }} 
               allowFullScreen 
               loading="lazy"
               referrerPolicy="no-referrer-when-downgrade"
               className="w-full h-full opacity-90 rounded-sm"
             ></iframe>
          </div>
          <div className="text-center mt-4">
             <a 
               href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.eventAddress)}`}
               target="_blank"
               rel="noreferrer"
               className="text-xs font-sans tracking-widest text-gold-dark hover:underline uppercase"
             >
               Ver no Google Maps
             </a>
          </div>
        </section>

        <section className="w-full max-w-4xl mx-auto text-center bg-paper/90 backdrop-blur-sm border-2 border-gold/30 rounded-lg p-6 md:p-10 mt-8 md:mt-12">
            <div className="flex justify-center mb-6 text-gold">
              <Gift size={36} />
            </div>
            <h2 className="font-serif text-3xl md:text-4xl text-gold-dark mb-4">Lista de Presentes</h2>
            <p className="font-sans text-ink/70 mb-8 max-w-lg mx-auto text-sm md:text-base">
              Sua presença é o maior presente! Mas se desejar nos presentear, ficaremos muito felizes com sua contribuição.
            </p>
            <div className="flex justify-center">
              <a
                href="https://meu-cha-de-panela-295da407.base44.app/home"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-3 bg-gold hover:bg-gold-dark text-white font-serif text-base md:text-lg px-6 py-3 md:px-8 md:py-4 rounded-full shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                <Gift size={20} />
                Ver Lista de Presentes
                <ExternalLink size={16} />
              </a>
            </div>
        </section>

        <section className="max-w-md mx-auto py-6">
           <p className="font-script text-2xl md:text-3xl text-ink/80 leading-relaxed">
             "{settings.thankYouText}"
           </p>
        </section>

        <div className="sticky bottom-6 z-40 pb-6 w-full flex justify-center">
           <button 
             onClick={onOpenRSVP}
             className="bg-gold hover:bg-gold-dark text-white font-serif text-base md:text-lg px-8 py-3 md:px-10 md:py-4 rounded-full shadow-[0_4px_20px_rgba(212,175,55,0.4)] transition-all duration-300 hover:scale-105 hover:shadow-[0_6px_25px_rgba(212,175,55,0.6)] tracking-widest uppercase flex items-center gap-2"
           >
             Confirmar Presença
           </button>
        </div>

        <footer className="w-full pt-10 pb-6 opacity-40">
           <p 
             onClick={handleFooterClick}
             className="font-sans text-[10px] tracking-widest text-ink/40 cursor-pointer select-none hover:text-ink hover:underline transition-colors duration-300"
           >
             POWERED BY ZAZZILABS
           </p>
        </footer>

      </div>
    </div>
  );
};
