import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Loader2 } from 'lucide-react';

const containerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '8px',
};

// Central Brazil coordinates
const initialCenter = {
  lat: -15.793889,
  lng: -47.882778
};

const libraries: "places"[] = ["places"];

interface MapSelectorProps {
  onChange: (location: { address: string; mapUrl: string }) => void;
  initialAddress?: string;
}

const MapSelector: React.FC<MapSelectorProps> = ({ onChange, initialAddress }) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: apiKey,
    libraries,
  });

  const [markerPosition, setMarkerPosition] = useState(initialCenter);
  const [address, setAddress] = useState(initialAddress || 'Arraste o pino para selecionar o local.');
  const geocoderRef = useRef<google.maps.Geocoder | null>(null);

  useEffect(() => {
    if (isLoaded) {
      geocoderRef.current = new google.maps.Geocoder();
      // If we have an initial address, geocode it to set the initial marker
      if (initialAddress && geocoderRef.current) {
        geocoderRef.current.geocode({ address: initialAddress }, (results, status) => {
            if (status === 'OK' && results && results[0]) {
                const location = results[0].geometry.location;
                setMarkerPosition({ lat: location.lat(), lng: location.lng() });
            }
        });
      }
    }
  }, [isLoaded, initialAddress]);

  const handleLocationSelect = useCallback((latLng: google.maps.LatLng) => {
    setMarkerPosition({ lat: latLng.lat(), lng: latLng.lng() });
    
    if (geocoderRef.current) {
      geocoderRef.current.geocode({ location: latLng }, (results, status) => {
        if (status === 'OK' && results && results[0]) {
          const newAddress = results[0].formatted_address;
          setAddress(newAddress);
          const mapUrl = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodeURIComponent(newAddress)}`;
          onChange({ address: newAddress, mapUrl });
        } else {
          setAddress('Endereço não encontrado para esta localização.');
        }
      });
    }
  }, [onChange, apiKey]);
  
  const onMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      handleLocationSelect(e.latLng);
    }
  };

  const onMarkerDragEnd = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      handleLocationSelect(e.latLng);
    }
  };

  if (!apiKey) {
    return (
        <div className="text-center p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
            <p className="font-bold">Erro de Configuração do Mapa.</p>
            <p className="text-sm">A chave de API do Google Maps não foi encontrada. Por favor, adicione a variável de ambiente <code className="font-mono text-xs bg-red-200 px-1 py-0.5 rounded">VITE_GOOGLE_MAPS_API_KEY</code> ao seu arquivo .env.</p>
        </div>
    );
  }

  if (loadError) {
    return (
        <div className="text-center p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
            <p className="font-bold">Erro ao carregar o Google Maps.</p>
            <p className="text-sm">Verifique se a chave de API do Google Maps está correta e se as APIs "Maps JavaScript API" e "Geocoding API" estão ativadas no Google Cloud Console.</p>
        </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
        <p className="ml-4 font-serif">Carregando mapa...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 pt-4">
      <div>
        <Label>Localização no Mapa</Label>
        <p className="text-xs text-ink/60 mt-1">Endereço selecionado: <span className="font-medium text-ink">{address}</span></p>
      </div>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={markerPosition}
        zoom={initialAddress ? 15 : 4} // Zoom out if no address is set initially
        onClick={onMapClick}
      >
        <Marker 
            position={markerPosition} 
            draggable={true}
            onDragEnd={onMarkerDragEnd}
        />
      </GoogleMap>
      <p className="text-xs text-center text-ink/50">Clique no mapa para definir um local ou arraste o pino para ajustar.</p>
    </div>
  );
};

export default MapSelector;
