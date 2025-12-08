import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ChevronsDown, Volume2, VolumeX, Gift, ExternalLink, Check, ChevronDown } from 'lucide-react';
import { WeddingSettings } from '../../types';
import { addRSVP } from '../services/storageService';
import MapView from './MapView';

interface InvitationContentProps {
  settings: WeddingSettings;
  onFooterClick: () => void;
}

// Paleta centralizada para a nova cor “ouro oliva”
const OLIVE_GOLD = '#5e5a3d';

export const InvitationContent: React.FC<InvitationContentProps> = ({ settings, onFooterClick }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isPlaying, setIsPlaying] = useState(true);
  const audioRef = React.useRef<HTMLAudioElement>(null);
  const [footerClicks, setFooterClicks] = useState(0);
  const [isRsvpOpen, setIsRsvpOpen] = useState(false);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);

  // RSVP Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    hasSpouse: 'no' as 'yes' | 'no',
    spouseName: '',
    hasChildren: 'no' as 'yes' | 'no',
    childrenCount: 0,
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const initials = useMemo(() => {
    if (!settings) return { groom: 'G', bride: 'B' };
    const groomInitial = settings.groomName ? settings.groomName.trim().charAt(0).toUpperCase() : 'G';
    const brideInitial = settings.brideName ? settings.brideName.trim().charAt(0).toUpperCase() : 'B';
    return { groom: groomInitial, bride: brideInitial };
  }, [settings?.groomName, settings?.brideName]);

  const handleFooterClick = () => {
    const newClickCount = footerClicks + 1;
    setFooterClicks(newClickCount);
    if (newClickCount >= 5) {
      onFooterClick();
      setFooterClicks(0); // Reset after opening
    }
  };

  useEffect(() => {
    if (audioRef.current && settings?.musicUrl) {
      if (isPlaying) {
        audioRef.current.volume = 0.4;
        audioRef.current.play().catch(e => console.log("Autoplay blocked until interaction", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, settings?.musicUrl]);

  useEffect(() => {
    if (!settings?.eventDate) return;
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
  }, [settings?.eventDate]);

  const handleRsvpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.phone) return;

    const rsvpData = {
      ...formData,
      hasSpouse: formData.hasSpouse === 'yes',
      spouseName: formData.hasSpouse === 'yes' ? formData.spouseName : '',
      hasChildren: formData.hasChildren === 'yes',
      childrenCount: formData.hasChildren === 'yes' ? formData.childrenCount : 0,
    };

    await addRSVP(rsvpData);
    setIsSubmitted(true);
    
    setTimeout(() => {
      setIsRsvpOpen(false);
      // Reset form after a delay to allow for closing animation
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          firstName: '',
          lastName: '',
          phone: '',
          hasSpouse: 'no',
          spouseName: '',
          hasChildren: 'no',
          childrenCount: 0,
        });
      }, 500);
    }, 2500);
  };
  
  // Handle radio button changes
  const handleRadioChange = (field: 'hasSpouse' | 'hasChildren', value: 'yes' | 'no') => {
    setFormData(prev => {
      const newState = { ...prev, [field]: value };
      if (field === 'hasChildren' && value === 'no') {
        newState.childrenCount = 0;
      }
      if (field === 'hasChildren' && value === 'yes' && newState.childrenCount === 0) {
        newState.childrenCount = 1;
      }
      if (field === 'hasSpouse' && value === 'no') {
        newState.spouseName = '';
      }
      return newState;
    });
  };

  const mapLink = settings.mapCoordinates
    ? `https://www.google.com/maps/search/?api=1&query=${settings.mapCoordinates.lat},${settings.mapCoordinates.lng}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.eventAddress)}`;

  return (
    <div className="relative w-full min-h-screen bg-paper bg-paper-texture overflow-y-auto animate-fade-in">
      <audio ref={audioRef} src={settings.musicUrl} loop />

      {/* Botão de áudio com nova cor */}
      <button 
        onClick={() => setIsPlaying(!isPlaying)}
        className="fixed bottom-6 right-6 z-40 w-10 h-10 rounded-full backdrop-blur-sm border flex items-center justify-center transition-all duration-300"
        style={{
          backgroundColor: `${OLIVE_GOLD}33`,
          borderColor: OLIVE_GOLD,
          color: OLIVE_GOLD
        }}
      >
        {isPlaying ? <Volume2 size={18} className="animate-pulse" /> : <VolumeX size={18} />}
      </button>

      {/* Molduras com tom oliva suave */}
      <div
        className="fixed inset-2 pointer-events-none z-30 rounded-sm border"
        style={{ borderColor: `${OLIVE_GOLD}4D` }}
      ></div>
      <div
        className="fixed inset-3 md:inset-6 pointer-events-none z-30 rounded-sm border"
        style={{ borderColor: `${OLIVE_GOLD}1A` }}
      ></div>
      
      <div className="fixed top-4 right-4 md:top-6 md:right-6 flex flex-col items-center animate-bounce z-30"
           style={{ color: `${OLIVE_GOLD}99` }}>
        <ChevronsDown size={24} />
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 md:py-20 flex flex-col items-center text-center space-y-12 md:space-y-16 relative z-10">
        
        {/* Selo inicial com gradiente verde oliva brilhante - MAIOR */}
<div className="relative group cursor-default pt-6">
  <div 
    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 md:w-52 md:h-52 blur-[80px] opacity-20 rounded-full pointer-events-none"
    style={{ backgroundColor: OLIVE_GOLD }}
  ></div>
  
  <div className="relative w-80 h-80 md:w-[28rem] md:h-[28rem] transition-transform duration-[2000ms] hover:scale-[1.02]">
    <svg className="w-full h-full drop-shadow-2xl" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
      <defs>
        {/* Gradiente verde oliva com efeito brilhante */}
        <linearGradient id="luxuryOlive" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4a4630" />
          <stop offset="25%" stopColor="#8a8a5f" />
          <stop offset="50%" stopColor="#5e5a3d" />
          <stop offset="75%" stopColor="#9b9b6f" />
          <stop offset="100%" stopColor="#3d3a28" />
        </linearGradient>
        <filter id="oliveEmboss" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur"/>
          <feSpecularLighting in="blur" surfaceScale="3" specularConstant="1" specularExponent="20" lightingColor="#FFF" result="specOut">
            <fePointLight x="-5000" y="-10000" z="20000"/>
          </feSpecularLighting>
          <feComposite in="specOut" in2="SourceAlpha" operator="in" result="specOut"/>
          <feComposite in="SourceGraphic" in2="specOut" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" result="litPaint"/>
          <feDropShadow dx="1" dy="2" stdDeviation="3" floodColor="#1a1810" floodOpacity="0.4"/>
        </filter>
      </defs>

      <g filter="url(#oliveEmboss)">
        <circle cx="200" cy="200" r="130" fill="none" stroke="url(#luxuryOlive)" strokeWidth="1.5" />
        <circle cx="200" cy="200" r="122" fill="none" stroke="url(#luxuryOlive)" strokeWidth="4" strokeDasharray="1, 8" strokeLinecap="round" />
        <circle cx="200" cy="200" r="114" fill="none" stroke="url(#luxuryOlive)" strokeWidth="1" />
        <line x1="152" y1="260" x2="248" y2="140" stroke="url(#luxuryOlive)" strokeWidth="2" strokeLinecap="square" />
      </g>

      <g>
        <text
          x="145"
          y="190"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="url(#luxuryOlive)"
          style={{ fontStyle: 'italic', fontFamily: '"Times New Roman", serif', fontSize: '100px', fontWeight: '400', letterSpacing: '-2px' }}
          filter="url(#oliveEmboss)"
        >
          {initials.bride}
        </text>

        <text
          x="255"
          y="220"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="url(#luxuryOlive)"
          style={{ fontStyle: 'italic', fontFamily: '"Times New Roman", serif', fontSize: '100px', fontWeight: '400', letterSpacing: '-2px' }}
          filter="url(#oliveEmboss)"
        >
          {initials.groom}
        </text>
      </g>
    </svg>
  </div>
</div>


        <header className="space-y-4 animate-slide-up w-full">
          <p className="font-serif italic text-ink/70 text-lg md:text-xl tracking-wide">
            {settings.introText}
          </p>
          
          <div className="py-4 md:py-8">
            <h1
              className="font-script text-5xl sm:text-6xl md:text-8xl drop-shadow-sm p-2 md:p-4 leading-tight"
              style={{ color: OLIVE_GOLD }}
            >
               {settings.groomName.split(' ')[0]} 
               <span className="text-3xl md:text-5xl px-2 md:px-4 text-ink/40">&</span> 
               {settings.brideName.split(' ')[0]}
            </h1>
          </div>
        </header>

        <section className="space-y-6 max-w-lg mx-auto mt-[-4rem] md:mt-[-5rem]">
          <p className="font-serif text-base md:text-lg text-ink leading-relaxed">
            {settings.inviteText}
          </p>
          <div
            className="w-12 h-[1px] mx-auto my-6"
            style={{ backgroundColor: OLIVE_GOLD }}
          ></div>
        </section>

        <section className="w-full">
           <div className="grid grid-cols-4 gap-2 md:gap-4 max-w-sm mx-auto"
                style={{ color: OLIVE_GOLD }}>
             {[
               { val: timeLeft.days, label: 'Dias' },
               { val: timeLeft.hours, label: 'Horas' },
               { val: timeLeft.minutes, label: 'Min' },
               { val: timeLeft.seconds, label: 'Seg' }
             ].map((item, idx) => (
               <div
                 key={idx}
                 className="flex flex-col items-center p-2 bg-white/40 rounded-sm border"
                 style={{ borderColor: `${OLIVE_GOLD}1A` }}
               >
                 <span className="font-serif text-xl md:text-3xl font-semibold">
                   {String(item.val).padStart(2, '0')}
                 </span>
                 <span className="text-[9px] md:text-[10px] uppercase tracking-widest opacity-70">
                   {item.label}
                 </span>
               </div>
             ))}
           </div>
        </section>

        <section className="space-y-2 w-full pt-4 md:pt-8">
           <h3
             className="font-serif text-2xl md:text-3xl border-b pb-2 inline-block px-8"
             style={{ color: OLIVE_GOLD, borderColor: `${OLIVE_GOLD}33` }}
           >
             A Celebração
           </h3>
           <div className="pt-6 space-y-4">
             <div className="flex flex-col">
                <span className="font-script text-4xl md:text-5xl text-ink">
                  {new Date(settings.eventDate).toLocaleDateString('pt-BR', { weekday: 'long' })}
                </span>
                <span
                  className="font-serif text-6xl md:text-7xl font-bold my-1"
                  style={{ color: OLIVE_GOLD }}
                >
                  {new Date(settings.eventDate).getDate()}
                </span>
                <span className="text-base uppercase tracking-[0.2em] text-ink/60">
                  {new Date(settings.eventDate).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                </span>
                <span className="font-serif italic text-2xl md:text-4xl mt-2">
                   às {new Date(settings.eventDate).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </span>
             </div>
             <div className="pt-4">
                <p className="font-serif text-lg md:text-xl font-semibold text-ink">
                  {settings.eventLocation}
                </p>
                <p className="font-sans text-sm text-ink/60 max-w-xs mx-auto mt-1">
                  {settings.eventAddress && settings.eventAddress.split('/').map((line, index, arr) => (
                    <React.Fragment key={index}>
                      {line}
                      {index < arr.length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </p>
                {settings.eventAddressReference && (
                   <p className="font-sans text-sm text-ink/60 max-w-xs mx-auto mt-1">
                    {settings.eventAddressReference.split('/').map((line, index, arr) => (
                      <React.Fragment key={index}>
                        {line}
                        {index < arr.length - 1 && <br />}
                      </React.Fragment>
                    ))}
                  </p>
                )}
             </div>
           </div>
        </section>

        <section className="w-full pt-4 md:pt-8">
          <div 
            className="relative w-full bg-paper-dark p-2 shadow-inner border rotate-1 transition-transform hover:rotate-0 duration-500 rounded-sm"
            style={{ height: '450px', borderColor: `${OLIVE_GOLD}33` }}
          >
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white p-2 rounded-full shadow-lg z-10"
              style={{ backgroundColor: OLIVE_GOLD }}
            >
              <MapPin size={20} />
            </div>
            <div className="w-full h-full">
              <MapView settings={settings} />
            </div>
          </div>
          <div className="text-center mt-4">
            <a 
              href={mapLink}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-sans tracking-widest hover:underline uppercase"
              style={{ color: OLIVE_GOLD }}
            >
              Ver no Google Maps
            </a>
          </div>
        </section>

        <section className="max-w-md mx-auto py-6 text-center">
           <p className="font-script text-2xl md:text-3xl text-ink/80 leading-relaxed">
             “Acima de tudo, porém, revistam-se do amor, que é o vínculo da perfeição.”
           </p>
           <p className="font-sans text-sm text-ink/60 mt-2">
             Colossenses 3:14
           </p>
        </section>

        <div className="sticky bottom-6 z-20 pb-6 w-full flex flex-col items-center gap-4">
           <button 
             onClick={() => setIsRsvpOpen(!isRsvpOpen)}
             className="font-serif text-base md:text-lg px-8 py-3 md:px-10 md:py-4 rounded-full transition-all duration-300 tracking-widest uppercase flex items-center gap-2 shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:scale-105"
             style={{
               backgroundColor: OLIVE_GOLD,
               color: '#ffffff',
               boxShadow: '0 4px 20px rgba(94,90,61,0.4)'
             }}
           >
             {isRsvpOpen ? 'Fechar' : 'Confirmar Presença'}
           </button>

           <div className={`transition-all duration-500 ease-in-out overflow-hidden w-full max-w-lg ${isRsvpOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
              <div
                className="bg-paper/80 backdrop-blur-sm mt-4 w-full mx-auto rounded-lg shadow-2xl p-6 sm:p-8 border"
                style={{ borderColor: `${OLIVE_GOLD}4D` }}
              >
                <div className="relative z-10 text-center">
                  {isSubmitted ? (
                    <div className="py-10 flex flex-col items-center animate-fade-in">
                      <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                           style={{ backgroundColor: '#dcfce7', color: '#16a34a' }}>
                        <Check size={32} />
                      </div>
                      <p className="font-serif text-xl text-ink">Confirmado com sucesso!</p>
                      <p className="font-sans text-sm text-ink/60 mt-2">Nos vemos no grande dia.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleRsvpSubmit} className="space-y-6 text-left">
                       <h2
                         className="font-serif text-2xl sm:text-3xl mb-2 text-center"
                         style={{ color: OLIVE_GOLD }}
                       >
                         Confirmação de Presença
                       </h2>
                       <p className="font-sans text-xs text-ink/60 uppercase tracking-widest mb-6 text-center">
                         Por favor, preencha seus dados
                       </p>
                       <div>
                         <label className="block font-serif text-ink mb-1">Nome</label>
                         <input 
                           type="text" 
                           required
                           value={formData.firstName}
                           onChange={e => setFormData({...formData, firstName: e.target.value})}
                           className="w-full bg-white/50 border-b focus:border-gold outline-none py-2 px-1 font-sans text-ink transition-colors placeholder:text-ink/30"
                           style={{ borderColor: `${OLIVE_GOLD}4D` }}
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
                           className="w-full bg-white/50 border-b outline-none py-2 px-1 font-sans text-ink transition-colors placeholder:text-ink/30"
                           style={{ borderColor: `${OLIVE_GOLD}4D` }}
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
                           className="w-full bg-white/50 border-b outline-none py-2 px-1 font-sans text-ink transition-colors placeholder:text-ink/30"
                           style={{ borderColor: `${OLIVE_GOLD}4D` }}
                           placeholder="(00) 00000-0000"
                         />
                       </div>
                       
                       <div className="space-y-3 pt-2">
                         <label className="block font-serif text-ink">
                           Você vai acompanhado do seu cônjuge? (esposa ou esposo)
                         </label>
                         <div className="flex gap-4">
                            <div
                              className="flex items-center gap-2 cursor-pointer"
                              onClick={() => handleRadioChange('hasSpouse', 'yes')}
                            >
                              <div
                                className="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                                style={{
                                  borderColor: formData.hasSpouse === 'yes' ? OLIVE_GOLD : 'rgba(0,0,0,0.3)'
                                }}
                              >
                                {formData.hasSpouse === 'yes' && (
                                  <div
                                    className="w-2.5 h-2.5 rounded-full"
                                    style={{ backgroundColor: OLIVE_GOLD }}
                                  ></div>
                                )}
                              </div>
                              <span className="font-sans text-ink">Sim</span>
                            </div>
                            <div
                              className="flex items-center gap-2 cursor-pointer"
                              onClick={() => handleRadioChange('hasSpouse', 'no')}
                            >
                              <div
                                className="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                                style={{
                                  borderColor: formData.hasSpouse === 'no' ? OLIVE_GOLD : 'rgba(0,0,0,0.3)'
                                }}
                              >
                                {formData.hasSpouse === 'no' && (
                                  <div
                                    className="w-2.5 h-2.5 rounded-full"
                                    style={{ backgroundColor: OLIVE_GOLD }}
                                  ></div>
                                )}
                              </div>
                              <span className="font-sans text-ink">Não</span>
                            </div>
                         </div>
                       </div>

                       {formData.hasSpouse === 'yes' && (
                          <div className="space-y-2 pt-2 transition-all duration-300 animate-fade-in">
                            <label className="block font-serif text-ink">Nome do Cônjuge</label>
                            <input
                              type="text"
                              value={formData.spouseName}
                              onChange={e => setFormData({...formData, spouseName: e.target.value})}
                              className="w-full bg-white/50 border-b outline-none py-2 px-1 font-sans text-ink transition-colors placeholder:text-ink/30"
                              style={{ borderColor: `${OLIVE_GOLD}4D` }}
                              placeholder="Nome completo do cônjuge"
                            />
                          </div>
                       )}

                       <div className="space-y-3 pt-2">
                         <label className="block font-serif text-ink">
                           Você pretende levar seu filhos?
                         </label>
                         <div className="flex gap-4">
                            <div
                              className="flex items-center gap-2 cursor-pointer"
                              onClick={() => handleRadioChange('hasChildren', 'yes')}
                            >
                              <div
                                className="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                                style={{
                                  borderColor: formData.hasChildren === 'yes' ? OLIVE_GOLD : 'rgba(0,0,0,0.3)'
                                }}
                              >
                                {formData.hasChildren === 'yes' && (
                                  <div
                                    className="w-2.5 h-2.5 rounded-full"
                                    style={{ backgroundColor: OLIVE_GOLD }}
                                  ></div>
                                )}
                              </div>
                              <span className="font-sans text-ink">Sim</span>
                            </div>
                            <div
                              className="flex items-center gap-2 cursor-pointer"
                              onClick={() => handleRadioChange('hasChildren', 'no')}
                            >
                              <div
                                className="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                                style={{
                                  borderColor: formData.hasChildren === 'no' ? OLIVE_GOLD : 'rgba(0,0,0,0.3)'
                                }}
                              >
                                {formData.hasChildren === 'no' && (
                                  <div
                                    className="w-2.5 h-2.5 rounded-full"
                                    style={{ backgroundColor: OLIVE_GOLD }}
                                  ></div>
                                )}
                              </div>
                              <span className="font-sans text-ink">Não</span>
                            </div>
                         </div>
                       </div>

                       {formData.hasChildren === 'yes' && (
                          <div className="space-y-2 pt-2 transition-all duration-300 animate-fade-in">
                            <label className="block font-serif text-ink">Quantos filhos?</label>
                            <select
                              value={formData.childrenCount}
                              onChange={e => setFormData({...formData, childrenCount: parseInt(e.target.value)})}
                              className="w-full bg-white/50 border-b outline-none py-2 px-1 font-sans text-ink"
                              style={{ borderColor: `${OLIVE_GOLD}4D` }}
                            >
                              <option value={1}>1</option>
                              <option value={2}>2</option>
                              <option value={3}>3</option>
                              <option value={4}>4</option>
                              <option value={5}>5</option>
                            </select>
                          </div>
                       )}
                       
                       <div className="flex justify-center pt-4">
                         <button 
                           type="submit"
                           className="w-full sm:w-auto font-serif tracking-widest uppercase py-3 px-12 transition-all duration-300 shadow-md active:scale-95"
                           style={{
                             backgroundColor: OLIVE_GOLD,
                             color: '#ffffff'
                           }}
                         >
                           Confirmar
                         </button>
                       </div>
                    </form>
                  )}
                </div>
              </div>
           </div>
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
