import { RSVP, WeddingSettings } from '../../types';
import { INITIAL_SETTINGS } from '../../constants';
import { doc, getDoc, setDoc, collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

const settingsDocRef = doc(db, 'wedding', 'settings');

export const getSettings = async (): Promise<WeddingSettings> => {
  try {
    const docSnap = await getDoc(settingsDocRef);
    if (docSnap.exists()) {
      return docSnap.data() as WeddingSettings;
    } else {
      // If no settings exist in Firestore, save and return the initial settings
      await setDoc(settingsDocRef, INITIAL_SETTINGS);
      return INITIAL_SETTINGS;
    }
  } catch (error) {
    console.error("Error fetching settings, returning initial settings:", error);
    return INITIAL_SETTINGS;
  }
};

export const saveSettings = async (settings: WeddingSettings): Promise<void> => {
  await setDoc(settingsDocRef, settings, { merge: true });
};

export const addRSVP = async (rsvpData: Omit<RSVP, 'id' | 'confirmedAt'>): Promise<void> => {
  try {
    const rsvpCollection = collection(db, 'rsvps');
    const newRSVP: Omit<RSVP, 'id'> = {
      ...rsvpData,
      confirmedAt: new Date().toISOString(),
    };
    await addDoc(rsvpCollection, newRSVP);
  } catch (error) {
    console.error("Error adding RSVP:", error);
  }
};
