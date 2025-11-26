'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { weddingData } from '@/lib/data';

const SealIcon = () => {
    const initials = `${weddingData.brideName.charAt(0)}&${weddingData.groomName.charAt(0)}`;
    return (
      <div className="relative w-24 h-24 md:w-28 md:h-28">
        <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full drop-shadow-lg">
          <defs>
            <radialGradient id="sealGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
              <stop offset="0%" style={{ stopColor: 'hsl(var(--accent))', stopOpacity: 0.8 }} />
              <stop offset="60%" style={{ stopColor: 'hsl(var(--accent))' }} />
              <stop offset="100%" style={{ stopColor: 'hsl(0, 100%, 18%)' }} />
            </radialGradient>
          </defs>
          <path d="M8.2,46.3c-1.2-9.1,1.1-18.4,6.4-26.2C22.6,10,34.8,4.1,47.9,3.6c13.1-0.5,25.9,4.4,34.8,13.8 c8.9,9.4,12,22.6,9.1,35.2c-2.9,12.6-11.8,23.3-23.4,28.7c-11.6,5.4-25.2,4.8-36.1-1.4C21.4,73.6,12.5,62.3,8.2,49.3" transform="translate(0, 0) rotate(-10 50 50)" fill="url(#sealGradient)" />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center font-headline text-2xl md:text-3xl text-primary opacity-80" style={{ textShadow: '1px 1px 2px hsla(var(--primary), 0.2)' }}>
          {initials}
        </span>
      </div>
    );
};

export function Envelope({ onOpen }: { onOpen: () => void }) {
  const [isOpening, setIsOpening] = useState(false);

  const handleClick = () => {
    if (isOpening) return;
    setIsOpening(true);
    setTimeout(onOpen, 2000); // Trigger page transition after envelope animation starts
  };

  return (
    <div className="relative w-[90vw] max-w-lg h-auto aspect-[1.5/1] cursor-pointer" onClick={handleClick}>
      <div className="perspective-1000 w-full h-full">
        {/* Envelope Body */}
        <div className={cn("absolute inset-0 transition-transform duration-1000 delay-[1500ms]", isOpening ? 'scale-150' : '')}>
          {/* Back */}
          <div className="absolute inset-0 bg-secondary rounded-lg shadow-2xl" />
          {/* Left & Right Flaps */}
          <div className="absolute top-0 left-0 h-full w-1/2 bg-secondary/80 rounded-l-lg" style={{ clipPath: 'polygon(0% 0%, 100% 50%, 0% 100%)' }} />
          <div className="absolute top-0 right-0 h-full w-1/2 bg-secondary/80 rounded-r-lg" style={{ clipPath: 'polygon(100% 0%, 0% 50%, 100% 100%)' }} />
          {/* Bottom Flap */}
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-secondary rounded-b-lg" style={{ clipPath: 'polygon(50% 100%, 0 0, 100% 0)' }} />

          {/* Letter */}
          <div className={cn("absolute inset-x-2 top-2 h-full bg-background rounded-md shadow-inner transition-transform duration-1000 ease-[cubic-bezier(0.6,0,0.2,1)] delay-500", isOpening && '-translate-y-3/4')}>
            <div className="w-full h-1/2 p-4">
              <div className="w-1/3 h-2 bg-muted rounded-full my-2"></div>
              <div className="w-2/3 h-2 bg-muted rounded-full my-2"></div>
              <div className="w-1/2 h-2 bg-muted rounded-full my-2"></div>
            </div>
          </div>

          {/* Top Flap */}
          <div className={cn("absolute inset-x-0 top-0 h-1/2 origin-top transform-style-preserve-3d transition-transform duration-1000 ease-[cubic-bezier(0.6,0,0.2,1)] delay-300 backface-hidden", isOpening && 'rotate-x-180')}>
            <div className="absolute inset-0 bg-primary/10" style={{ clipPath: 'polygon(50% 100%, 0 0, 100% 0)' }} />
          </div>
        </div>

        {/* Seal Button */}
        <button
          disabled={isOpening}
          className={cn("absolute z-10 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/3 md:-translate-y-1/4 transition-all duration-500 ease-out", isOpening && 'opacity-0 scale-150 -translate-y-1/2 rotate-45')}
        >
          <SealIcon />
        </button>
      </div>
    </div>
  );
}
