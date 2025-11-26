'use client';

import { useState, useEffect, Suspense } from 'react';
import { Envelope } from '@/components/invitation/envelope';
import { Hero } from '@/components/invitation/hero';
import { InvitationText } from '@/components/invitation/invitation-text';
import { Countdown } from '@/components/invitation/countdown';
import { EventDetails } from '@/components/invitation/event-details';
import { MapSection } from '@/components/invitation/map-section';
import { ThankYou } from '@/components/invitation/thank-you';
import { weddingData } from '@/lib/data';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

function InvitationContent() {
  return (
    <div className="relative max-w-4xl mx-auto px-4 sm:px-8 py-16 sm:py-24 font-body text-center text-foreground/90">
      <div className="absolute -inset-2 sm:-inset-4 md:-inset-6 bg-card/80 backdrop-blur-[2px] rounded-lg shadow-2xl border border-primary/10" />
      <div className="relative">
        <Hero />
        <InvitationText />
        <Countdown targetDate={weddingData.eventDate} />
        <EventDetails />
        <MapSection />
        <ThankYou />
      </div>
    </div>
  );
}

export function Invitation() {
  const [isClient, setIsClient] = useState(false);
  const [scene, setScene] = useState<'envelope' | 'opening' | 'invitation'>('envelope');

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleOpen = () => {
    setScene('opening');
    setTimeout(() => {
      setScene('invitation');
    }, 2800); // Animation duration
  };

  useEffect(() => {
    if (scene === 'invitation' || scene === 'opening') {
      document.body.classList.add('bg-paper');
    } else {
      document.body.classList.remove('bg-paper');
    }
  }, [scene]);

  if (!isClient) {
    return <div className="fixed inset-0 bg-background flex items-center justify-center"><Skeleton className="w-[90vw] max-w-lg h-auto aspect-[1.6/1] rounded-lg" /></div>;
  }

  return (
    <>
      <div
        className={cn(
          'fixed inset-0 flex items-center justify-center bg-background transition-all duration-1000 z-50',
          scene !== 'envelope' && 'opacity-0 scale-150 pointer-events-none'
        )}
      >
        <Envelope onOpen={handleOpen} />
      </div>

      <div
        className={cn(
          "min-h-screen transition-opacity duration-1000",
          scene === 'invitation' ? 'opacity-100' : 'opacity-0 pointer-events-none',
        )}
      >
        <div className="animate-zoom-in-content">
          <Suspense fallback={<Skeleton className="w-full h-screen" />}>
            <InvitationContent />
          </Suspense>
        </div>
      </div>
    </>
  );
}
