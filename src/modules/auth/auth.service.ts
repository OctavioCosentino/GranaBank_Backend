import { supabase, supabaseAdmin } from '../../config/supabase';
import { BadRequestError, UnauthorizedError } from '../../errors/app.error';
import { SignUpDTO, SignInDTO } from './auth.dto';
import { authRepository, AuthRepository } from './auth.repository';

export class AuthService {
  constructor(private readonly repository: AuthRepository = authRepository) {}

  async signUp(dto: SignUpDTO) {
    const { email, password, name } = dto;

    // Register user in Supabase Auth
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
      throw new BadRequestError('User registration failed');
    }

    // Ensure profile entry in public.profiles table
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

  async signIn(dto: SignInDTO) {
    const { email, password } = dto;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user || !data.session) {
      throw new UnauthorizedError(error?.message || 'Invalid email or password');
    }

    // Retrieve corresponding profile
    let profile = await this.repository.getProfileById(data.user.id);

    // If profile didn't exist yet, auto-create it from metadata or fallback
    if (!profile) {
      const fallbackName =
        data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'User';
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

  async refreshToken(refreshToken: string) {
    const { data, error } = await supabase.auth.refreshSession({
      refresh_token: refreshToken,
    });

    if (error || !data.session) {
      throw new UnauthorizedError(error?.message || 'Invalid or expired refresh token');
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

  async signOut(accessToken?: string) {
    if (accessToken) {
      // Supabase signOut can invalidate current user scope
      await supabase.auth.signOut();
    }
    return { success: true };
  }

  async getMe(userId: string) {
    const { data: userResp, error } = await supabaseAdmin.auth.admin.getUserById(userId);

    if (error || !userResp.user) {
      throw new UnauthorizedError('User not found');
    }

    const profile = await this.repository.getProfileById(userId);

    return {
      user: userResp.user,
      profile,
    };
  }
}

export const authService = new AuthService();

