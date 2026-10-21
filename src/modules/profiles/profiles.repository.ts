import { supabaseAdmin } from "../../config/supabase";
import { Profile } from "../../types/database.types";
import { BadRequestError } from "../../errors/app.error";

/**
 * Encapsulates database queries for the 'profiles' table in Supabase.
 */
export class ProfilesRepository {
  /**
   * Finds a user profile by user UUID.
   */
  async findById(id: string): Promise<Profile | null> {
    const { data, error } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      throw new BadRequestError(error.message, error);
    }

    return data;
  }

  /**
   * Updates user profile fields.
   */
  async update(id: string, updates: Partial<Profile>): Promise<Profile> {
    const { data, error } = await supabaseAdmin
      .from("profiles")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new BadRequestError(error.message, error);
    }

    return data;
  }
}

export const profilesRepository = new ProfilesRepository();
