import React, { useEffect, useRef } from 'react';
import { WeddingSettings } from '../../types';

declare var L: any; // Declare Leaflet

interface MapViewProps {
  settings: Partial<WeddingSettings>;
}

const MapView: React.FC<MapViewProps> = ({ settings }) => {
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInitializedRef = useRef<boolean>(false);
  const { mapCoordinates } = settings;

  useEffect(() => {
    if (!mapCoordinates || !containerRef.current) return;

    if (mapRef.current && isInitializedRef.current) {
      mapRef.current.setView([mapCoordinates.lat, mapCoordinates.lng], 16);
      if (markerRef.current) {
        markerRef.current.setLatLng([mapCoordinates.lat, mapCoordinates.lng]);
      }
      return;
    }

    const container = L.DomUtil.get('map-view');
    if (container != null) {
      if (container._leaflet_id != null) {
        delete container._leaflet_id;
      }
    }

    try {
      const map = L.map('map-view', {
        center: [mapCoordinates.lat, mapCoordinates.lng],
        zoom: 16,
        zoomControl: false,
        attributionControl: true,
        scrollWheelZoom: false,
        dragging: false,
        touchZoom: false,
        doubleClickZoom: false,
        boxZoom: false,
        keyboard: false,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
      }).addTo(map);

      mapRef.current = map;
      isInitializedRef.current = true;

      const marker = L.marker([mapCoordinates.lat, mapCoordinates.lng]).addTo(map);
      markerRef.current = marker;

      setTimeout(() => {
        if (mapRef.current) {
          mapRef.current.invalidateSize({ pan: false });
        }
      }, 100);

    } catch (error) {
      console.error('Error initializing map:', error);
      isInitializedRef.current = false;
    }
  }, [mapCoordinates]);

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
    <div style={{ position: 'relative', height: '100%', width: '100%' }}>
      <div 
        id="map-view" 
        ref={containerRef}
        style={{ 
          height: '100%', 
          width: '100%', 
          minHeight: '400px',
          position: 'relative',
          zIndex: 0
        }}
      />
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'transparent',
          zIndex: 10
        }}
      ></div>
    </div>
  );
};

export default MapView;
