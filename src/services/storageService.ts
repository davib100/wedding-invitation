import { RSVP, WeddingSettings } from '../../types';
import { INITIAL_SETTINGS } from '../../constants';
import { supabase } from '../supabase';

const SETTINGS_ID = 1; // Assuming a single row for settings with a fixed ID

export const getSettings = async (): Promise<WeddingSettings> => {
  try {
    const { data, error, status } = await supabase
      .from('settings')
      .select('*')
      .eq('id', SETTINGS_ID)
      .single();

    if (error && status !== 406) { // 406 means "Not Found", which is expected on first run
      console.error('Error fetching settings:', error);
      throw error;
    }

    if (data) {
      // Settings exist, transform and return them
      const { lat, lng, ...rest } = data;
      
      // Constrói mapCoordinates a partir de lat e lng
      const mapCoordinates = (lat !== null && lng !== null) 
        ? { lat, lng } 
        : { lat: -15.7801, lng: -47.9292 }; // Coordenadas padrão
      
      return { 
        ...rest, 
        mapCoordinates 
      } as WeddingSettings;
    } else {
      // Settings do not exist, create them using upsert for safety
      console.log('No settings found, creating initial settings...');
      
      const { mapCoordinates, ...restOfInitialSettings } = INITIAL_SETTINGS;
      const dbInitialSettings = {
        ...restOfInitialSettings,
        lat: mapCoordinates?.lat || -15.7801,
        lng: mapCoordinates?.lng || -47.9292,
        id: SETTINGS_ID
      };

      const { data: newData, error: upsertError } = await supabase
        .from('settings')
        .upsert(dbInitialSettings)
        .select()
        .single();
      
      if (upsertError) {
        console.error('Error creating initial settings:', upsertError);
        throw upsertError;
      }
      
      console.log('Initial settings created successfully.');
      const { lat, lng, ...rest } = newData;
      return { 
        ...rest, 
        mapCoordinates: { lat, lng } 
      } as WeddingSettings;
    }
  } catch (error) {
    console.error('Error in getSettings, returning initial settings as fallback:', error);
    // Return default settings for the UI to function if db operations fail.
    return INITIAL_SETTINGS;
  }
};

export const saveSettings = async (settings: Partial<WeddingSettings>): Promise<void> => {
  try {
    const { mapCoordinates, ...rest } = settings;
    let dbSettings: any = { ...rest };

    // Converte mapCoordinates para colunas separadas lat/lng
    if (mapCoordinates) {
      dbSettings.lat = mapCoordinates.lat;
      dbSettings.lng = mapCoordinates.lng;
    }

    // Remove mapCoordinates do objeto antes de salvar (não existe no banco)
    delete dbSettings.mapCoordinates;

    const { error } = await supabase
      .from('settings')
      .update(dbSettings)
      .eq('id', SETTINGS_ID);

    if (error) {
      console.error('Error saving settings:', error);
      throw error;
    }
    
    console.log('Settings saved successfully');
  } catch (error) {
    console.error('Exception in saveSettings:', error);
    throw error;
  }
};

export const addRSVP = async (rsvpData: Omit<RSVP, 'id' | 'confirmedAt'>): Promise<void> => {
  try {
    const newRSVP = {
      ...rsvpData,
      confirmedAt: new Date().toISOString(),
    };

    const { error } = await supabase.from('rsvps').insert(newRSVP);

    if (error) {
      console.error('Error adding RSVP:', error);
      throw error;
    }
    
    console.log('RSVP added successfully');
  } catch (error) {
    console.error('Exception in addRSVP:', error);
    throw error;
  }
};
