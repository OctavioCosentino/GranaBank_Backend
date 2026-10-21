import { supabaseAdmin } from "../../config/supabase";
import { Profile } from "../../types/database.types";
import { BadRequestError } from "../../errors/app.error";

/**
 * Handles database operations related to user authentication and profiles.
 */
export class AuthRepository {
  /**
   * Upserts a profile record for an authenticated user.
   */
  async createProfile(data: { id: string; name: string }): Promise<Profile> {
    const { data: profile, error } = await supabaseAdmin
      .from("profiles")
      .upsert(
        {
          id: data.id,
          name: data.name,
        },
        { onConflict: "id" },
      )
      .select()
      .single();

    if (error) {
      throw new BadRequestError(error.message, error);
    }

    return profile;
  }

  /**
   * Finds a user profile by ID.
   */
  async getProfileById(userId: string): Promise<Profile | null> {
    const { data: profile, error } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      throw new BadRequestError(error.message, error);
    }

    return profile;
  }
}

export const authRepository = new AuthRepository();
