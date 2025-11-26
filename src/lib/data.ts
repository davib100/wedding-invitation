export type RsvpData = {
  id: string;
  name: string;
  surname: string;
  phone: string;
  hasTransport: 'yes' | 'no';
  confirmedAt: Date;
};

export type WeddingData = {
  groomName: string;
  brideName: string;
  eventDate: Date;
  eventTime: string;
  eventLocation: string;
  locationLine2: string;
  invitationText: string;
  thankYouText: string;
  musicUrl: string;
};

export const weddingData: WeddingData = {
  groomName: 'Davi Aguiar',
  brideName: 'Rosângela de Jesus',
  eventDate: new Date('2025-10-18T16:00:00'),
  eventTime: '16:00',
  eventLocation: 'Recanto das Orquídeas',
  locationLine2: 'Rua das Flores, 123, São Paulo - SP',
  invitationText: 'Com a bênção de Deus e de seus pais, temos a alegria de vos convidar para a celebração do nosso casamento. Esperamos por vocês para compartilhar este momento único e especial em nossas vidas, onde duas histórias se tornam uma.',
  thankYouText: 'A vossa presença é o maior presente que poderíamos receber. Agradecemos de coração por fazerem parte da nossa história e deste dia tão sonhado.',
  musicUrl: 'https://cdn.pixabay.com/audio/2022/11/17/audio_8714b18d36.mp3',
};

// In a real app, this would be a database.
// This in-memory array will reset on server restarts.
export const rsvpList: RsvpData[] = [];
