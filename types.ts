export interface RSVP {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  hasSpouse: boolean;
  hasChildren: boolean;
  childrenCount: number;
  confirmedAt: string; // ISO String
}

export interface WeddingSettings {
  groomName: string;
  brideName: string;
  eventDate: string; // ISO String
  eventLocation: string;
  eventAddress: string;
  mapUrl: string;
  musicUrl: string;
  heroImageUrl: string;
  introText: string;
  inviteText: string;
  thankYouText: string;
}

export interface AdminUser {
  email: string;
  isAuthenticated: boolean;
}
