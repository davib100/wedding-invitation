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
      // Se não existir, cria o documento com as configurações iniciais
      await setDoc(settingsDocRef, INITIAL_SETTINGS);
      return INITIAL_SETTINGS;
    }
  } catch (error: any) {
    if (error.code === 'unavailable' || (error.message && error.message.includes('offline'))) {
      console.log('Firestore temporariamente indisponível. Retornando configurações padrão.');
    } else {
      console.error('Erro ao buscar configurações. Retornando configurações padrão:', error);
    }
    // Retorna as configurações padrão para que a UI não quebre em caso de erro de conexão.
    return INITIAL_SETTINGS;
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
