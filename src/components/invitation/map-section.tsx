import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export function MapSection() {
  const mapImage = PlaceHolderImages.find(img => img.id === 'map-placeholder');

  return (
    <section className="py-16 md:py-24">
      <h2 className="font-headline text-3xl md:text-4xl text-primary mb-8">Como Chegar</h2>
      <div className="w-full max-w-3xl mx-auto aspect-video rounded-lg overflow-hidden shadow-lg border border-primary/10 p-2 bg-primary/5">
        {mapImage && (
          <Image
            src={mapImage.imageUrl}
            alt={mapImage.description}
            width={800}
            height={600}
            data-ai-hint={mapImage.imageHint}
            className="w-full h-full object-cover rounded-md"
          />
        )}
      </div>
    </section>
  );
}
