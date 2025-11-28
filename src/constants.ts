import { WeddingSettings } from './types';

export const ADMIN_EMAIL = 'davib.aguiar@gmail.com';

export const INITIAL_SETTINGS: WeddingSettings = {
  groomName: 'Davi Aguiar',
  brideName: 'Rosângela de Jesus',
  eventDate: '2024-12-14T16:00:00.000Z', // Example date
  eventLocation: 'Villa Giardini',
  eventAddress: 'St. de Mansões Park Way Q 3 - Núcleo Bandeirante, Brasília - DF',
  mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3838.487778942369!2d-47.95463792412853!3d-15.831034423853112!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x935a305963955555%3A0x6b3b555555555555!2sBrasilia!5e0!3m2!1sen!2sbr!4v1715000000000!5m2!1sen!2sbr',
  musicUrl: 'https://cdn.pixabay.com/audio/2022/11/17/audio_8714b18d36.mp3', // Romantic Piano royalty free
  heroImageUrl: 'https://picsum.photos/800/1200?grayscale',
  introText: 'Com a bênção de Deus e de nossos pais',
  inviteText: 'Convidam para a cerimônia religiosa de seu casamento.',
  thankYouText: 'Sua presença tornará este dia ainda mais especial.',
};

export const STORAGE_KEYS = {
  RSVP: 'rd_wedding_rsvps',
  SETTINGS: 'rd_wedding_settings',
};
