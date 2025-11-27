import { RSVP, WeddingSettings } from '../../types';
import { INITIAL_SETTINGS, STORAGE_KEYS } from '../../constants';

export const getSettings = (): WeddingSettings => {
  const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
  if (!stored) return INITIAL_SETTINGS;
  try {
    return JSON.parse(stored);
  } catch {
    return INITIAL_SETTINGS;
  }
};

export const saveSettings = (settings: WeddingSettings): void => {
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
};

export const getRSVPs = (): RSVP[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.RSVP);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
};

export const addRSVP = (rsvp: Omit<RSVP, 'id' | 'confirmedAt'>): void => {
  const current = getRSVPs();
  const newRSVP: RSVP = {
    ...rsvp,
    id: crypto.randomUUID(),
    confirmedAt: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEYS.RSVP, JSON.stringify([...current, newRSVP]));
};