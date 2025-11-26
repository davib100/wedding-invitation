import { weddingData } from '@/lib/data';
import { Separator } from '@/components/ui/separator';

export function InvitationText() {
  return (
    <section className="py-16 md:py-24">
      <Separator className="w-24 mx-auto bg-primary/20 mb-16" />
      <p className="font-body text-lg md:text-xl max-w-2xl mx-auto leading-relaxed text-foreground/80">
        {weddingData.invitationText}
      </p>
    </section>
  );
}
