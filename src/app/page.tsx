import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Invitation } from '@/components/invitation/invitation';
import { Footer } from '@/components/invitation/footer';
import { MusicPlayer } from '@/components/invitation/music-player';
import { Hero } from '@/components/invitation/hero';
import { weddingData } from '@/lib/data';

export default function Home() {
  return (
    <>
      <Suspense fallback={<div className="fixed inset-0 bg-background flex items-center justify-center"><Skeleton className="w-[90vw] max-w-lg h-auto aspect-[1.6/1] rounded-lg" /></div>}>
        <Invitation hero={<Hero />} />
      </Suspense>
      <MusicPlayer src={weddingData.musicUrl} />
      <Footer />
    </>
  );
}
