
import { RSVP, WeddingSettings } from '../../types';
import { INITIAL_SETTINGS } from '../constants';
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
      const { lat, lng, colorPalette: dbColorPalette, color_palette_text, ...rest } = data;
      
      const mapCoordinates = (lat !== null && lng !== null) 
        ? { lat, lng } 
        : INITIAL_SETTINGS.mapCoordinates;
      
      let colorPalette = INITIAL_SETTINGS.colorPalette;
      // The database column is 'colorPalette' and it's of type jsonb
      if (dbColorPalette && Array.isArray(dbColorPalette)) {
        colorPalette = dbColorPalette;
      } else if (typeof dbColorPalette === 'string') {
         try {
          colorPalette = JSON.parse(dbColorPalette);
        } catch (e) {
          console.error("Error parsing colorPalette, using default.", e);
          colorPalette = INITIAL_SETTINGS.colorPalette;
        }
      }

      return { 
        ...INITIAL_SETTINGS,
        ...rest,
        mapCoordinates,
        colorPalette: Array.isArray(colorPalette) ? colorPalette : INITIAL_SETTINGS.colorPalette,
        colorPaletteText: color_palette_text || INITIAL_SETTINGS.colorPaletteText,
      } as WeddingSettings;
    } else {
      // Settings do not exist, create them using upsert for safety
      console.log('No settings found, creating initial settings...');
      
      const { mapCoordinates, colorPalette, colorPaletteText, ...restOfInitialSettings } = INITIAL_SETTINGS;
      const dbInitialSettings = {
        ...restOfInitialSettings,
        lat: mapCoordinates?.lat || -15.7801,
        lng: mapCoordinates?.lng || -47.9292,
        id: SETTINGS_ID,
        colorPalette: colorPalette, // Use the correct column name
        color_palette_text: colorPaletteText,
      };

      const { data: newData, error: upsertError } = await supabase
        .from('settings')
        .upsert(dbInitialSettings, { onConflict: 'id' })
        .select()
        .single();
      
      if (upsertError) {
        console.error('Error creating initial settings:', upsertError);
        throw upsertError;
      }
      
      console.log('Initial settings created successfully.');
      const { lat, lng, colorPalette: newDbColorPalette, color_palette_text, ...rest } = newData;

      return { 
        ...INITIAL_SETTINGS,
        ...rest, 
        mapCoordinates: { lat, lng },
        colorPalette: newDbColorPalette,
        colorPaletteText: color_palette_text,
      } as WeddingSettings;
    }
  } catch (error) {
    console.error('Error in getSettings, returning initial settings as fallback:', error);
    return INITIAL_SETTINGS;
  }
};

export const saveSettings = async (settings: Partial<WeddingSettings>): Promise<void> => {
  try {
    const { mapCoordinates, colorPalette, colorPaletteText, ...rest } = settings;
    let dbSettings: any = { ...rest };

    if (mapCoordinates) {
      dbSettings.lat = mapCoordinates.lat;
      dbSettings.lng = mapCoordinates.lng;
    }
    
    // Map application properties to the correct database column names
    if (Array.isArray(colorPalette)) {
      // The column name is 'colorPalette' (camelCase) and is of type jsonb
      dbSettings.colorPalette = colorPalette;
    }
    if (colorPaletteText) {
        dbSettings.color_palette_text = colorPaletteText;
    }
    
    // Always set the ID for the upsert condition
    dbSettings.id = SETTINGS_ID;

    // Use upsert to either update the existing settings or create them if they don't exist.
    const { error } = await supabase
      .from('settings')
      .upsert(dbSettings, { onConflict: 'id' });

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
