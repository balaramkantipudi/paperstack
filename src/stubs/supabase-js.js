// Stub implementation for @supabase/supabase-js
export function createClient() {
  return {
    auth: {
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      signIn: () => Promise.resolve({ data: null, error: null }),
      signOut: () => Promise.resolve({ error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          single: () => Promise.resolve({ data: null, error: null }),
          limit: () => Promise.resolve({ data: [], error: null }),
          order: () => ({
            limit: () => Promise.resolve({ data: [], error: null }),
          }),
          count: () => Promise.resolve({ count: 0, error: null }),
          in: () => ({
            eq: () => Promise.resolve({ data: [], error: null }),
          }),
          gte: () => ({
            lte: () => Promise.resolve({ data: [], error: null }),
          }),
          not: () => Promise.resolve({ data: [], error: null }),
        }),
        in: () => ({
          eq: () => Promise.resolve({ data: [], error: null }),
        }),
        order: () => ({
          limit: () => Promise.resolve({ data: [], error: null }),
        }),
      }),
      insert: () => ({
        select: () => ({
          single: () => Promise.resolve({ data: null, error: null }),
        }),
      }),
      update: () => ({
        eq: () => ({
          select: () => ({
            single: () => Promise.resolve({ data: null, error: null }),
          }),
        }),
        in: () => Promise.resolve({ data: null, error: null }),
      }),
      delete: () => ({
        eq: () => Promise.resolve({ error: null }),
        in: () => ({
          eq: () => Promise.resolve({ error: null }),
        }),
      }),
      upsert: () => Promise.resolve({ error: null }),
    }),
    storage: {
      from: () => ({
        upload: () => Promise.resolve({ data: { path: 'stub-path' }, error: null }),
        getPublicUrl: () => ({ data: { publicUrl: 'https://example.com/stub-url' } }),
      }),
    },
  };
}

export const supabaseAdmin = createClient();
export const supabase = createClient();

export default { createClient, supabaseAdmin, supabase };
