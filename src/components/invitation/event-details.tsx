import { weddingData } from '@/lib/data';
import { Separator } from '@/components/ui/separator';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { RsvpButton } from './rsvp-button';

const DetailItem = ({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) => (
  <div className="flex flex-col items-center">
    <div className="mb-4 text-primary">{icon}</div>
    <h3 className="font-headline text-xl text-primary/80 mb-1">{title}</h3>
    <div className="font-body text-foreground/80">{children}</div>
  </div>
);

export function EventDetails() {
  const eventDate = new Date(weddingData.eventDate);
  const formattedDate = eventDate.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  return (
    <section className="py-16 md:py-24">
      <Separator className="w-24 mx-auto bg-primary/20" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 py-16">
        <DetailItem icon={<Calendar size={32} />} title="Data">
          {formattedDate}
        </DetailItem>
        <DetailItem icon={<Clock size={32} />} title="Horário">
          {weddingData.eventTime}
        </DetailItem>
        <DetailItem icon={<MapPin size={32} />} title="Local">
          <p>{weddingData.eventLocation}</p>
          <p className="text-sm text-foreground/60">{weddingData.locationLine2}</p>
        </DetailItem>
      </div>
      <Separator className="w-24 mx-auto bg-primary/20" />
      <div className="mt-16">
        <RsvpButton />
      </div>
    </section>
  );
}
