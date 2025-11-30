import { WeddingSettings } from './types';

export const ADMIN_EMAIL = 'davib.aguiar@gmail.com';

export const INITIAL_SETTINGS: WeddingSettings = {
  groomName: 'Davi Aguiar',
  brideName: 'Rosângela de Jesus',
  eventDate: '2024-12-14T16:00:00.000Z',
  eventLocation: 'Villa Giardini',
  eventAddress: 'St. de Mansões Park Way Q 3 - Núcleo Bandeirante, Brasília - DF',
  mapCoordinates: { lat: -15.8310344, lng: -47.9546379 },
  musicUrl: 'https://cdn.pixabay.com/audio/2022/02/07/audio_1947b74447.mp3',
  heroImageUrl: 'https://picsum.photos/800/1200?grayscale',
  introText: 'Com a bênção de Deus e de nossos pais',
  inviteText: 'Convidam para a cerimônia religiosa de seu casamento.',
  thankYouText: 'Sua presença tornará este dia ainda mais especial.',
  colorPaletteText: 'Paleta de Cores',
  colorPalette: ['#ffffff', '#000000', '#ff0000', '#00ff00', '#0000ff'],
};

export const STORAGE_KEYS = {
  RSVP: 'rd_wedding_rsvps',
  SETTINGS: 'rd_wedding_settings',
};
