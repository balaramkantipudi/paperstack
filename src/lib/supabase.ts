import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Missing Supabase environment variables. Please check your .env.local file.');
}

export const supabase = createClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseAnonKey || 'placeholder'
);

// Helper to get the current user's ID from Clerk session
// Note: This requires the Clerk session token to be passed in headers for RLS
// For simple client-side queries where RLS allows access based on user_id column:
export const getSupabaseClientWithAuth = async (getToken: () => Promise<string | null>) => {
    const token = await getToken();

    if (!token) return supabase;

    return createClient(
        supabaseUrl || '',
        supabaseAnonKey || '',
        {
            global: {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
        }
    );
};
