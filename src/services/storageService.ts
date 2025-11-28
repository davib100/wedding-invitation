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

    if (error && status !== 406) { // 406 means no rows found, which is not an error here
      console.error('Error fetching settings:', error);
      throw error;
    }

    if (data) {
      return data as WeddingSettings;
    } else {
      // If no settings row exists, create it with initial values.
      // This happens on the very first run against a new database.
      const { data: newData, error: insertError } = await supabase
        .from('settings')
        .insert({ ...INITIAL_SETTINGS, id: SETTINGS_ID })
        .select()
        .single();
      
      if (insertError) {
        console.error('Error creating initial settings:', insertError);
        // This will likely fail if the table doesn't exist, so we fall back.
        throw insertError;
      }
      // Successfully created the initial settings row.
      return newData as WeddingSettings;
    }
  } catch (error) {
    console.error('Error in getSettings, returning initial settings as fallback:', error);
    // Return default settings for the UI to function if db operations fail.
    return INITIAL_SETTINGS;
  }
};

export const saveSettings = async (settings: Partial<WeddingSettings>): Promise<void> => {
  try {
    const { error } = await supabase
      .from('settings')
      .update(settings)
      .eq('id', SETTINGS_ID);

    if (error) {
      console.error('Error saving settings:', error);
      throw error;
    }
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
  } catch (error) {
    console.error('Exception in addRSVP:', error);
    throw error;
  }
};
