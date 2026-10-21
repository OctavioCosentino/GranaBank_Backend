import { supabaseAdmin } from '../../config/supabase';
import { Profile } from '../../types/database.types';

export class ProfilesRepository {
  async findById(id: string): Promise<Profile | null> {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data;
  }

  async update(id: string, updates: Partial<Profile>): Promise<Profile> {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  }
}

export const profilesRepository = new ProfilesRepository();

