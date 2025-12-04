import { createClient } from '@supabase/supabase-js';
import { WeddingSettings } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and Anon Key must be provided in .env');
}

export const supabase = createClient<{[x: string]: any}>(supabaseUrl, supabaseAnonKey);

/**
 * Sets the authentication token for Supabase client.
 * This function should be called after a user logs in via Firebase.
 * @param {string | null} token The Firebase JWT token.
 */
export const setSupabaseAuthToken = async (token: string | null) => {
  if (token) {
    await supabase.auth.setSession({ access_token: token, refresh_token: '' });
  } else {
    // If no token, sign out from Supabase as well
    await supabase.auth.signOut();
  }
};
