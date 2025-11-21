import { createClient } from '@supabase/supabase-js'
import { Database } from '../types/database'

const supabaseUrl = import.meta.env.VITE_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY!
const supabaseAnonKey = import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseServiceKey || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables. Please set VITE_PUBLIC_SUPABASE_URL, VITE_SUPABASE_SERVICE_ROLE_KEY, and VITE_PUBLIC_SUPABASE_ANON_KEY in your .env.local')
}

// Client for server-side operations (full access)
export const supabaseAdmin = createClient<Database>(
    supabaseUrl,
    supabaseServiceKey,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    }
)

// Client for client-side operations (row-level security)
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

export default supabase
