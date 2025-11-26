'use client';
import { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function MusicPlayer({ src }: { src: string }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio(src);
      audioRef.current.loop = true;

      const playAudio = async () => {
        try {
          await audioRef.current?.play();
          setIsPlaying(true);
        } catch (error) {
          console.log("Autoplay was prevented by the browser.");
          setIsPlaying(false);
        }
      };
      
      const handleFirstInteraction = () => {
        if (!isPlaying) {
          playAudio();
        }
        window.removeEventListener('click', handleFirstInteraction);
        window.removeEventListener('keydown', handleFirstInteraction);
      }

      window.addEventListener('click', handleFirstInteraction);
      window.addEventListener('keydown', handleFirstInteraction);
      

      return () => {
        window.removeEventListener('click', handleFirstInteraction);
        window.removeEventListener('keydown', handleFirstInteraction);
        audioRef.current?.pause();
        audioRef.current = null;
      };
    }
  }, [src, isPlaying]);

  const toggleMute = () => {
    if (audioRef.current) {
        if (!isPlaying) {
            audioRef.current.play().then(() => {
                setIsPlaying(true);
                setIsMuted(false);
                audioRef.current!.muted = false;
            }).catch(e => console.log(e));
        } else {
            const newMutedState = !audioRef.current.muted;
            audioRef.current.muted = newMutedState;
            setIsMuted(newMutedState);
        }
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
        {isMuted || !isPlaying ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
      </Button>
    </div>
  );
}
