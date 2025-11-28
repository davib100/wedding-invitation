import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker, Autocomplete } from '@react-google-maps/api';
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
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markerPosition, setMarkerPosition] = useState(initialCenter);
  const [address, setAddress] = useState(initialAddress || '');
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const onMapLoad = useCallback((mapInstance: google.maps.Map) => {
    setMap(mapInstance);
    // If we have an initial address, geocode it
    if (initialAddress) {
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ address: initialAddress }, (results, status) => {
            if (status === 'OK' && results && results[0]) {
                const location = results[0].geometry.location;
                setMarkerPosition({ lat: location.lat(), lng: location.lng() });
                mapInstance.panTo(location);
            }
        });
    }
  }, [initialAddress]);

  const onAutocompleteLoad = (autocomplete: google.maps.places.Autocomplete) => {
    autocompleteRef.current = autocomplete;
  };

  const onPlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place.geometry && place.geometry.location) {
        const location = place.geometry.location;
        const newPosition = { lat: location.lat(), lng: location.lng() };
        map?.panTo(newPosition);
        setMarkerPosition(newPosition);
        setAddress(place.formatted_address || '');
        
        const mapUrl = `https://www.google.com/maps/embed/v1/place?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(place.formatted_address || '')}`;
        onChange({ address: place.formatted_address || '', mapUrl });
      }
    }
  };
  
  const onMarkerDragEnd = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const newPosition = { lat: e.latLng.lat(), lng: e.latLng.lng() };
      setMarkerPosition(newPosition);
      
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ location: newPosition }, (results, status) => {
        if (status === 'OK' && results && results[0]) {
          const newAddress = results[0].formatted_address;
          setAddress(newAddress);
          const mapUrl = `https://www.google.com/maps/embed/v1/place?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(newAddress)}`;
          onChange({ address: newAddress, mapUrl });
        }
      });
    }
  };


  if (loadError) {
    return (
        <div className="text-center p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
            <p className="font-bold">Erro ao carregar o Google Maps.</p>
            <p className="text-sm">Por favor, verifique se a chave de API do Google Maps está configurada corretamente no arquivo .env (VITE_GOOGLE_MAPS_API_KEY).</p>
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
        <Label htmlFor="location-search">Pesquisar Endereço</Label>
        <Autocomplete
          onLoad={onAutocompleteLoad}
          onPlaceChanged={onPlaceChanged}
        >
          <Input
            id="location-search"
            type="text"
            placeholder="Digite o endereço do evento"
            defaultValue={initialAddress}
            className="mt-1"
          />
        </Autocomplete>
        <p className="text-xs text-ink/60 mt-2">Endereço selecionado: <span className="font-medium">{address}</span></p>
      </div>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={markerPosition}
        zoom={15}
        onLoad={onMapLoad}
      >
        <Marker 
            position={markerPosition} 
            draggable={true}
            onDragEnd={onMarkerDragEnd}
        />
      </GoogleMap>
      <p className="text-xs text-center text-ink/50">Você pode arrastar o marcador para ajustar a localização exata.</p>
    </div>
  );
};

export default MapSelector;
