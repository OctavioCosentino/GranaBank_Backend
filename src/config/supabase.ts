import { createClient } from '@supabase/supabase-js';
import { env } from './env';
import { Database } from '../types/database.types';

/**
 * Standard Supabase client using the public anon key.
 * Used for public or auth-driven operations (signup, signin, refresh).
 */
export const supabase = createClient<Database>(
  env.SUPABASE_URL,
  env.SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);

/**
 * Supabase Admin client using the service role key.
 * Has full access, bypassing RLS. Use for trusted server operations
 * and admin authentication methods.
 */
export const supabaseAdmin = createClient<Database>(
  env.SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);

/**
 * Creates a Supabase client scoped to an authenticated user's JWT.
 * Postgres RLS policies (e.g. auth.uid() = user_id) will be respected.
 */
export const createScopedSupabaseClient = (accessToken: string) => {
  return createClient<Database>(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
};

