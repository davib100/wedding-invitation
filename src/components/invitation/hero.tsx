import { weddingData } from '@/lib/data';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { MoveDown } from 'lucide-react';
import { RomanticSubtitle } from './romantic-subtitle';

export function Hero() {
  return (
    <section className="py-24 md:py-20 flex flex-col items-center justify-center min-h-[70vh]">
      <h2 className="font-headline text-lg md:text-xl text-primary/80 tracking-widest uppercase">Juntam-se em matrimônio</h2>
      <h1 className="font-headline text-5xl md:text-7xl text-primary tracking-tight my-4">
        {weddingData.brideName}
        <span className="text-4xl md:text-6xl mx-2 md:mx-4">&</span>
        {weddingData.groomName}
      </h1>
      
      <Suspense fallback={<Skeleton className="h-8 w-72 mx-auto mt-4" />}>
        <RomanticSubtitle />
      </Suspense>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-primary/60 animate-bounce">
        <span className="text-xs uppercase tracking-widest">Role para ver</span>
        <MoveDown className="w-4 h-4" />
      </div>
    </section>
  );
}
