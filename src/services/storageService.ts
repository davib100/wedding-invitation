
import { RSVP, WeddingSettings, Gift, Reservation } from '../../types';
import { INITIAL_SETTINGS } from '../constants';
import { supabase } from '../supabase';

const SETTINGS_ID = 1; // Assuming a single row for settings with a fixed ID

// --- Settings Functions ---

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
      const { lat, lng, color_palette, color_palette_text, event_address_reference, ...rest } = data;
      
      const mapCoordinates = (lat !== null && lng !== null) 
        ? { lat, lng } 
        : INITIAL_SETTINGS.mapCoordinates;
      
      let colorPalette = INITIAL_SETTINGS.colorPalette;
      // The database column is 'color_palette' and it's of type jsonb
      if (color_palette && Array.isArray(color_palette)) {
        colorPalette = color_palette;
      } else if (typeof color_palette === 'string') {
         try {
          colorPalette = JSON.parse(color_palette);
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
        eventAddressReference: event_address_reference, // Map snake_case to camelCase
      } as WeddingSettings;
    } else {
      // Settings do not exist, create them using upsert for safety
      console.log('No settings found, creating initial settings...');
      
      const { mapCoordinates, colorPalette, colorPaletteText, eventAddressReference, ...restOfInitialSettings } = INITIAL_SETTINGS;
      const dbInitialSettings = {
        ...restOfInitialSettings,
        lat: mapCoordinates?.lat || -15.7801,
        lng: mapCoordinates?.lng || -47.9292,
        id: SETTINGS_ID,
        color_palette: colorPalette, 
        color_palette_text: colorPaletteText,
        event_address_reference: eventAddressReference || '', // Add snake_case version
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
      const { lat, lng, color_palette, color_palette_text, event_address_reference, ...rest } = newData;

      return { 
        ...INITIAL_SETTINGS,
        ...rest, 
        mapCoordinates: { lat, lng },
        colorPalette: color_palette,
        colorPaletteText: color_palette_text,
        eventAddressReference: event_address_reference, // Map back on creation as well
      } as WeddingSettings;
    }
  } catch (error) {
    console.error('Error in getSettings, returning initial settings as fallback:', error);
    return INITIAL_SETTINGS;
  }
};

export const saveSettings = async (settings: Partial<WeddingSettings>): Promise<void> => {
  try {
    const { mapCoordinates, colorPalette, colorPaletteText, eventAddressReference, ...rest } = settings;
    let dbSettings: any = { ...rest };

    if (mapCoordinates) {
      dbSettings.lat = mapCoordinates.lat;
      dbSettings.lng = mapCoordinates.lng;
    }
    
    // Check if the property exists on the partial settings object before adding it
    if (eventAddressReference !== undefined) {
        dbSettings.event_address_reference = eventAddressReference; // Map camelCase to snake_case
    }
    
    // Map application properties to the correct database column names
    if (Array.isArray(colorPalette)) {
      dbSettings.color_palette = colorPalette;
    }
    if (colorPaletteText !== undefined) {
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


// --- RSVP Functions ---

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


// --- Gift Functions ---

export const getGifts = async (): Promise<Gift[]> => {
    try {
        const { data, error } = await supabase
            .from('gifts')
            .select('*, reservations(*)')
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        // Supabase returns reservations, which is great.
        // The type `Gift` expects `reservations` to be there.
        return data as Gift[];
    } catch (error) {
        console.error('Error fetching gifts:', error);
        return [];
    }
};

export const addGift = async (giftData: Omit<Gift, 'id' | 'created_at' | 'reservations'>): Promise<Gift | null> => {
    try {
        const { data, error } = await supabase.from('gifts').insert(giftData).select().single();
        if (error) throw error;
        // Return with empty reservations array to match the type
        return { ...data, reservations: [] } as Gift;
    } catch (error) {
        console.error('Error adding gift:', error);
        throw error;
    }
};

export const deleteGift = async (id: number): Promise<void> => {
    try {
        // Deleting a gift will also delete its reservations due to ON DELETE CASCADE
        const { error } = await supabase.from('gifts').delete().eq('id', id);
        if (error) throw error;
    } catch (error) {
        console.error('Error deleting gift:', error);
        throw error;
    }
};

export const createReservation = async (giftId: number, guestName: string, guestPhone: string): Promise<void> => {
    try {
        // We first need to check if the gift still has available quantity
        const { data: giftData, error: giftError } = await supabase
            .from('gifts')
            .select('quantity, reservations(count)')
            .eq('id', giftId)
            .single();

        if (giftError) throw giftError;

        const reservedCount = giftData.reservations[0]?.count || 0;

        if (reservedCount >= giftData.quantity) {
            throw new Error("Este presente já atingiu a quantidade máxima de reservas.");
        }

        // If checks pass, create the new reservation
        const { error } = await supabase
            .from('reservations')
            .insert({
                gift_id: giftId,
                guest_name: guestName,
                guest_phone: guestPhone,
            });
            
        if (error) throw error;

    } catch (error) {
        console.error('Error creating reservation:', error);
        // Re-throw the error so the UI can catch it
        throw error;
    }
};
