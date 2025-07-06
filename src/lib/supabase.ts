import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Auth functions
export const signUp = async (email: string, password: string, username: string, phone: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username,
        phone
      }
    }
  });
  return { data, error };
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

// Purchase functions
export const createPurchase = async (purchaseData: any) => {
  const { data, error } = await supabase
    .from('purchases')
    .insert([purchaseData])
    .select();
  return { data, error };
};

export const getPendingPurchases = async () => {
  const { data, error } = await supabase
    .from('purchases')
    .select('*')
    .eq('payment_status', 'pending')
    .order('created_at', { ascending: false });
  return { data, error };
};

export const approvePurchase = async (purchaseId: string) => {
  const { data, error } = await supabase
    .from('purchases')
    .update({ 
      payment_status: 'approved',
      approved_at: new Date().toISOString()
    })
    .eq('id', purchaseId)
    .select();
  return { data, error };
};

export const getUserPurchases = async (userId: string) => {
  const { data, error } = await supabase
    .from('purchases')
    .select('*')
    .eq('user_id', userId)
    .eq('payment_status', 'approved')
    .order('created_at', { ascending: false });
  return { data, error };
};
