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

export interface Reservation {
  id: number;
  created_at: string;
  gift_id: number;
  guest_name: string;
  guest_phone: string;
}

export interface Gift {
  id: number;
  created_at: string;
  name: string;
  price: number;
  image_url: string | null;
  quantity: number;
  reservations: Reservation[];
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
