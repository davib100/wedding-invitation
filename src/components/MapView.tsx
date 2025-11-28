import React from 'react';

interface MapViewProps {
  mapUrl: string;
}

export const MapView = React.memo(({ mapUrl }: MapViewProps) => {
  if (!mapUrl) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-paper/50">
        <p className="font-serif text-ink/50">Mapa não disponível.</p>
      </div>
    );
  }

  return (
    <iframe
      src={mapUrl}
      width="100%"
      height="100%"
      style={{ border: 0 }}
      allowFullScreen
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      className="w-full h-full opacity-90 rounded-sm"
    ></iframe>
  );
});
