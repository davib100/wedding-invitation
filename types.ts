export interface RSVP {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  hasSpouse: boolean;
  spouseName?: string;
  hasChildren: boolean;
  childrenCount: number;
  confirmedAt: string; // ISO String
}

export interface WeddingSettings {
  id?: number; // Adiciona ID para compatibilidade com banco
  groomName: string;
  brideName: string;
  eventDate: string; // ISO String
  eventLocation: string;
  eventAddress: string;
  mapCoordinates?: { lat: number; lng: number }; // Opcional para evitar erros
  lat?: number; // Colunas do banco
  lng?: number; // Colunas do banco
  mapUrl?: string;
  musicUrl: string;
  heroImageUrl: string;
  introText: string;
  inviteText: string;
  thankYouText: string;
  colorPaletteText: string;
  colorPalette: string[];
  mapPinLocation?: { x: number; y: number }; // Para o pino no mapa interativo
}

export interface AdminUser {
  email: string;
  isAuthenticated: boolean;
}
