'use client';
import { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function MusicPlayer({ src }: { src: string }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio(src);
      audioRef.current.loop = true;

      const playAudio = () => {
        audioRef.current?.play().catch(() => {
          // Autoplay was prevented.
        });
      };
      
      // Attempt to play after a short delay
      const timer = setTimeout(playAudio, 1000);

      // Clean up audio element on unmount
      return () => {
        clearTimeout(timer);
        audioRef.current?.pause();
        audioRef.current = null;
      };
    }
  }, [src]);

  const toggleMute = () => {
    if (audioRef.current) {
      const newMutedState = !audioRef.current.muted;
      audioRef.current.muted = newMutedState;
      setIsMuted(newMutedState);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      <Button 
        onClick={toggleMute} 
        variant="outline" 
        size="icon" 
        className="bg-background/50 hover:bg-background/80 text-primary border-primary/20 hover:border-primary/40 rounded-full backdrop-blur-sm"
        aria-label="Tocar ou pausar música"
      >
        {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
      </Button>
    </div>
  );
}
