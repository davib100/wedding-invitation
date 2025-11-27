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
             <div className="relative w-48 h-48 md:w-56 md:h-56 -mt-8 opacity-80">
              <svg className="w-full h-full" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="luxuryGold" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#BF953F" />
                    <stop offset="25%" stopColor="#FCF6BA" />
                    <stop offset="50%" stopColor="#B38728" />
                    <stop offset="75%" stopColor="#FBF5B7" />
                    <stop offset="100%" stopColor="#AA771C" />
                  </linearGradient>
                  <filter id="goldEmboss" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur in="SourceAlpha" stdDeviation="1" result="blur"/>
                    <feSpecularLighting in="blur" surfaceScale="2" specularConstant="0.8" specularExponent="15" lightingColor="#FFF" result="specOut">
                      <fePointLight x="-5000" y="-10000" z="20000"/>
                    </feSpecularLighting>
                    <feComposite in="specOut" in2="SourceAlpha" operator="in" result="specOut"/>
                    <feComposite in="SourceGraphic" in2="specOut" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" result="litPaint"/>
                     <feDropShadow dx="0.5" dy="1" stdDeviation="1" floodColor="#3e2b06" floodOpacity="0.3"/>
                  </filter>
                </defs>

                <g filter="url(#goldEmboss)">
                  <circle cx="200" cy="200" r="130" fill="none" stroke="url(#luxuryGold)" strokeWidth="1" />
                  <circle cx="200" cy="200" r="122" fill="none" stroke="url(#luxuryGold)" strokeWidth="3" strokeDasharray="1, 8" strokeLinecap="round" />
                  <line x1="152" y1="260" x2="248" y2="140" stroke="url(#luxuryGold)" strokeWidth="1.5" strokeLinecap="square" />
                </g>

                <g>
                  <text x="145" y="190" 
                        textAnchor="middle" 
                        dominantBaseline="middle"
                        fill="url(#luxuryGold)" 
                        style={{ fontStyle: 'italic', fontFamily: '"Times New Roman", serif', fontSize: '100px', fontWeight: '400', letterSpacing: '-2px' }}
                        filter="url(#goldEmboss)">
                    R
                  </text>

                  <text x="255" y="220" 
                        textAnchor="middle" 
                        dominantBaseline="middle"
                        fill="url(#luxuryGold)" 
                        style={{ fontStyle: 'italic', fontFamily: '"Times New Roman", serif', fontSize: '100px', fontWeight: '400', letterSpacing: '-2px' }}
                        filter="url(#goldEmboss)">
                    D
                  </text>
                </g>
              </svg>
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
        <div className="absolute bottom-10 md:bottom-20 text-center px-4 text-black font-sans tracking-widest animate-pulse text-sm md:text-base font-semibold drop-shadow-[0_2px_4px_rgba(255,255,255,0.8)]">
          TOQUE NO SELO PARA ABRIR
        </div>
      )}
    </div>
  );
};
