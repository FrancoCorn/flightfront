import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pcazhdwjdpmvoopnqeqp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBjYXpoZHdqZHBtdm9vcG5xZXFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA1OTUwNzAsImV4cCI6MjA1NjE3MTA3MH0.HgCUKC1zLO5274v4AlEK0w_ZCB1QFe9EW2ckrm_qXbo';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});