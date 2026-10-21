import { supabase, supabaseAdmin } from "../../config/supabase";
import { BadRequestError, UnauthorizedError } from "../../errors/app.error";
import { SignUpDTO, SignInDTO } from "./auth.dto";
import { authRepository, AuthRepository } from "./auth.repository";

/**
 * Handles business logic for user authentication via Supabase Auth and Profiles table.
 */
export class AuthService {
  constructor(private readonly repository: AuthRepository = authRepository) {}

  /**
   * Registers a user in Supabase Auth and creates their profile.
   */
  async signUp(dto: SignUpDTO) {
    const { email, password, name } = dto;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });

    if (error) {
      throw new BadRequestError(error.message);
    }

    if (!data.user) {
      throw new BadRequestError("User registration failed");
    }

    const profile = await this.repository.createProfile({
      id: data.user.id,
      name,
    });

    return {
      user: data.user,
      session: data.session,
      profile,
    };
  }

  /**
   * Authenticates user with credentials and returns tokens and profile.
   */
  async signIn(dto: SignInDTO) {
    const { email, password } = dto;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user || !data.session) {
      throw new UnauthorizedError(
        error?.message || "Invalid email or password",
      );
    }

    let profile = await this.repository.getProfileById(data.user.id);

    if (!profile) {
      const fallbackName =
        data.user.user_metadata?.name ||
        data.user.email?.split("@")[0] ||
        "User";
      profile = await this.repository.createProfile({
        id: data.user.id,
        name: fallbackName,
      });
    }

    return {
      user: data.user,
      session: {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        expires_in: data.session.expires_in,
        token_type: data.session.token_type,
      },
      profile,
    };
  }

  /**
   * Refreshes user access token using a refresh token.
   */
  async refreshToken(refreshToken: string) {
    const { data, error } = await supabase.auth.refreshSession({
      refresh_token: refreshToken,
    });

    if (error || !data.session) {
      throw new UnauthorizedError(
        error?.message || "Invalid or expired refresh token",
      );
    }

    return {
      session: {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        expires_in: data.session.expires_in,
        token_type: data.session.token_type,
      },
      user: data.user,
    };
  }

  /**
   * Signs out the user session.
   */
  async signOut(accessToken?: string) {
    if (accessToken) {
      await supabase.auth.signOut();
    }
    return { success: true };
  }

  /**
   * Fetches the current authenticated user and linked profile.
   */
  async getMe(userId: string) {
    const { data: userResp, error } =
      await supabaseAdmin.auth.admin.getUserById(userId);

    if (error || !userResp.user) {
      throw new UnauthorizedError("User not found");
    }

    const profile = await this.repository.getProfileById(userId);

    return {
      user: userResp.user,
      profile,
    };
  }
}

export const authService = new AuthService();
