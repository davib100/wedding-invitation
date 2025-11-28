import { RSVP, WeddingSettings } from '../../types';
import { INITIAL_SETTINGS } from '../../constants';
import { doc, getDoc, setDoc, collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

const settingsDocRef = doc(db, 'wedding', 'settings');

export const getSettings = async (): Promise<WeddingSettings> => {
  // Verifica a conexão antes de tentar. Não é 100% garantido, mas ajuda.
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    console.log('Navegador offline, retornando configurações iniciais.');
    return INITIAL_SETTINGS;
  }
  
  try {
    const docSnap = await getDoc(settingsDocRef);
    
    if (docSnap.exists()) {
      return docSnap.data() as WeddingSettings;
    } else {
      // Se não existir, cria o documento com as configurações iniciais
      await setDoc(settingsDocRef, INITIAL_SETTINGS);
      return INITIAL_SETTINGS;
    }
  } catch (error: any) {
    // Não loga múltiplas vezes se for erro de offline
    if (error?.code === 'unavailable' || error?.message?.includes('offline')) {
      console.log('Firestore temporariamente indisponível. Retornando configurações padrão.');
    } else {
      console.error("Error fetching settings, returning initial settings:", error);
    }
    
    // Lança o erro para que a lógica de retry possa ser acionada
    throw error;
  }
};

export const saveSettings = async (settings: WeddingSettings): Promise<void> => {
  try {
    await setDoc(settingsDocRef, settings, { merge: true });
  } catch (error) {
    console.error("Error saving settings:", error);
    throw error; // Re-throw para tratamento no componente chamador
  }
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
    throw error; // Re-throw para tratamento no componente chamador
  }
};
