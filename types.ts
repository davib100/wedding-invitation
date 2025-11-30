export interface RSVP {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  hasSpouse: boolean;
  spouseName?: string;
  hasChildren: boolean;
  childrenCount: number;
  confirmedAt: string;
}

export interface WeddingSettings {
  id?: number;
  groomName: string;
  brideName: string;
  eventDate: string;
  eventLocation: string;
  eventAddress: string;
  eventAddressReference?: string;
  mapCoordinates?: { lat: number; lng: number };
  lat?: number; 
  lng?: number; 
  mapUrl?: string;
  musicUrl: string;
  heroImageUrl: string;
  introText: string;
  inviteText: string;
  thankYouText: string;
  colorPaletteText: string;
  colorPalette: string[];
  mapPinLocation?: { x: number; y: number }; 
}

export interface AdminUser {
  email: string;
  isAuthenticated: boolean;
}
