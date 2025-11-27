import React, { useState } from 'react';

interface EnvelopeProps {
  onOpen: () => void;
}

export const Envelope: React.FC<EnvelopeProps> = ({ onOpen }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isZooming, setIsZooming] = useState(false);
  const [flapFullyOpen, setFlapFullyOpen] = useState(false);

  const handleOpen = () => {
    if (isOpen) return;
    setIsOpen(true);
    
    setTimeout(() => {
      setFlapFullyOpen(true);
    }, 700);
    
    setTimeout(() => {
      setIsZooming(true);
      setTimeout(() => {
        onOpen();
      }, 1200);
    }, 1900);
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black overflow-hidden transition-opacity duration-1000 ${isZooming ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] bg-cover opacity-30"></div>
      
      <div 
        className="relative w-[320px] h-[220px] sm:w-[400px] sm:h-[280px] md:w-[500px] md:h-[350px] perspective-1000 transition-transform duration-[1500ms] ease-in-out"
        style={{ 
          transform: isZooming ? 'scale(5) translateY(100px)' : 'scale(1)',
          transformStyle: 'preserve-3d'
        }}
      >
        
        <div className="relative w-full h-full preserve-3d">
          
          <div className="absolute inset-0 bg-[#e8e4da] shadow-2xl rounded-sm z-0"></div>

          <div 
            className={`absolute left-2 right-2 top-2 bottom-2 bg-paper rounded-sm shadow-md flex flex-col items-center justify-center transition-transform duration-[1000ms] ease-in-out border border-gold/20`}
            style={{ 
              transform: isOpen ? 'translateY(-60%)' : 'translateY(0)',
              transitionDelay: '900ms',
              backgroundImage: "url('https://www.transparenttextures.com/patterns/cream-paper.png')",
              zIndex: flapFullyOpen ? 25 : 15
            }}
          >
            <div className="text-center opacity-80 mt-10 p-4">
              <p className="font-serif text-gold-dark text-[10px] sm:text-xs tracking-[0.2em] uppercase mb-2">Convite de Casamento</p>
              <h1 className="font-script text-3xl sm:text-4xl text-ink">R & D</h1>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 w-full h-[70%] bg-[#ebe7dc] z-[28]" style={{ 
            clipPath: 'polygon(0 0, 50% 20%, 100% 0, 100% 100%, 0 100%)',
            filter: 'drop-shadow(0 -1px 2px rgba(0, 0, 0, 0.15))'
          }}>
             <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
          </div>
          
           <div className="absolute top-0 left-0 h-full w-1 bg-[#ebe7dc] z-10"></div>
           <div className="absolute top-0 right-0 h-full w-1 bg-[#ebe7dc] z-10"></div>

          <div 
            className="absolute top-0 left-0 w-full h-[70%] z-30 origin-top transition-transform duration-700 ease-in-out"
            style={{ 
              transform: isOpen ? 'rotateX(180deg)' : 'rotateX(0deg)',
              transformStyle: 'preserve-3d',
              zIndex: isOpen ? 1 : 30,
              filter: 'drop-shadow(0 2px 3px rgba(0, 0, 0, 0.2))'
            }}
          >
            <div className="absolute inset-0 bg-[#f4f1e8] shadow-lg backface-hidden" style={{ clipPath: 'polygon(-70% 0, 50% 75%, 170% 0)' }}>
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/5"></div>
              <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ overflow: 'visible' }}>
                <path d="M -70 0 L 50 75 L 170 0" fill="none" stroke="rgba(0,0,0,0.15)" strokeWidth="1.5" vectorEffect="non-scaling-stroke"/>
              </svg>
            </div>

            <div className="absolute inset-0 bg-[#e8e4da] rotate-x-180 backface-hidden" style={{ clipPath: 'polygon(-70% 0, 50% 75%, 170% 0)' }}></div>
          </div>

          <div 
            onClick={handleOpen}
            className={`absolute top-[48%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 cursor-pointer transition-all duration-500 group ${isOpen ? 'opacity-0 scale-150 pointer-events-none' : 'hover:scale-105'}`}
          >
             <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-wax-red-light to-wax-red shadow-[0_4px_10px_rgba(0,0,0,0.4)] flex items-center justify-center border-4 border-wax-red/50">
                <div className="absolute inset-0 rounded-full border border-white/10"></div>
                <div className="absolute inset-1 rounded-full border border-black/10"></div>
                <span className="font-script text-2xl sm:text-3xl text-[#e8cba5] drop-shadow-md select-none group-hover:text-white transition-colors">R&D</span>
             </div>
             <div className="absolute inset-0 rounded-full bg-wax-red/30 animate-ping -z-10"></div>
          </div>

        </div>
      </div>
      
      {!isOpen && (
        <div className="absolute bottom-20 text-center px-4 text-black font-sans tracking-widest animate-pulse text-sm md:text-base font-semibold drop-shadow-[0_2px_4px_rgba(255,255,255,0.8)]">
          TOQUE NO SELO PARA ABRIR
        </div>
      )}
    </div>
  );
};
