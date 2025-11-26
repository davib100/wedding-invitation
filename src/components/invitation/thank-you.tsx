import { weddingData } from '@/lib/data';
import { Separator } from '@/components/ui/separator';

export function ThankYou() {
  return (
    <section className="py-16 md:py-24">
      <Separator className="w-24 mx-auto bg-primary/20 mb-16" />
      <p className="font-body text-lg md:text-xl max-w-2xl mx-auto leading-relaxed text-foreground/80">
        {weddingData.thankYouText}
      </p>
      <div className="mt-8 font-headline text-4xl text-primary">
        Com amor, <br /> Rosângela & Davi
      </div>
    </section>
  );
}
