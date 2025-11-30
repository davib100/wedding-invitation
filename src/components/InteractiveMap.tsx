import React, { useEffect, useRef } from 'react';

declare var L: any; // Declare Leaflet

interface InteractiveMapProps {
  coordinates: { lat: number; lng: number };
  onMapClick: (coords: { lat: number; lng: number }) => void;
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({ coordinates, onMapClick }) => {
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInitializedRef = useRef<boolean>(false);

  useEffect(() => {
    if (!coordinates || !containerRef.current) return;

    // Se o mapa já existe, apenas atualiza a visualização
    if (mapRef.current && isInitializedRef.current) {
      mapRef.current.setView([coordinates.lat, coordinates.lng], 15);
      if (markerRef.current) {
        markerRef.current.setLatLng([coordinates.lat, coordinates.lng]);
      }
      return;
    }

    // Limpa qualquer instância anterior do Leaflet no container
    const container = L.DomUtil.get('interactive-map');
    if (container != null) {
      if (container._leaflet_id != null) {
        delete container._leaflet_id;
      }
    }

    try {
      // Initialize map
      const map = L.map('interactive-map', {
        center: [coordinates.lat, coordinates.lng],
        zoom: 15,
        zoomControl: true,
        attributionControl: true
      });

      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
      }).addTo(map);

      mapRef.current = map;
      isInitializedRef.current = true;

      // Add initial marker
      const marker = L.marker([coordinates.lat, coordinates.lng], {
        draggable: false
      }).addTo(map);
      markerRef.current = marker;

      // Map click event
      map.on('click', (e: any) => {
        const { lat, lng } = e.latlng;
        onMapClick({ lat, lng });
        if (markerRef.current) {
          markerRef.current.setLatLng([lat, lng]);
        }
      });

      // Força o mapa a recalcular seu tamanho após a renderização
      setTimeout(() => {
        if (mapRef.current) {
          mapRef.current.invalidateSize({ pan: false });
        }
      }, 100);

    } catch (error) {
      console.error('Error initializing map:', error);
      isInitializedRef.current = false;
    }
  }, [coordinates, onMapClick]);
  
  // Cleanup ao desmontar o componente
  useEffect(() => {
    return () => {
      if (mapRef.current) {
        try {
          mapRef.current.off();
          mapRef.current.remove();
        } catch (error) {
          console.error('Error cleaning up map:', error);
        }
        mapRef.current = null;
        markerRef.current = null;
        isInitializedRef.current = false;
      }
    };
  }, []);

  return (
    <div>
      <div 
        id="interactive-map" 
        ref={containerRef}
        style={{ 
          height: '400px', 
          width: '100%', 
          zIndex: 0,
          position: 'relative'
        }}
      />
      <p className="text-sm text-gray-500 mt-2">
        Clique no mapa para definir a localização exata.
      </p>
    </div>
  );
};

export default InteractiveMap;
