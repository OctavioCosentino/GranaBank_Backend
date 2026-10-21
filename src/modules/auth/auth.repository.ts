import { supabaseAdmin } from '../../config/supabase';
import { Profile } from '../../types/database.types';

export class AuthRepository {
  async createProfile(data: { id: string; name: string }): Promise<Profile> {
    const { data: profile, error } = await supabaseAdmin
      .from('profiles')
      .upsert(
        {
          id: data.id,
          name: data.name,
        },
        { onConflict: 'id' }
      )
      .select()
      .single();

    if (error) {
      throw error;
    }

    return profile;
  }

  async getProfileById(userId: string): Promise<Profile | null> {
    const { data: profile, error } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return profile;
  }
}

export const authRepository = new AuthRepository();

