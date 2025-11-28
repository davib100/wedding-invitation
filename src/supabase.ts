import { createClient } from '@supabase/supabase-js';
import { WeddingSettings } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and Anon Key must be provided in .env');
}

export const supabase = createClient<{[x: string]: any}>(supabaseUrl, supabaseAnonKey);
