import { Request, Response, NextFunction } from 'express';
import { authService, AuthService } from './auth.service';
import { sendSuccess } from '../../utils/response.util';
import { SignUpDTO, SignInDTO, RefreshTokenDTO } from './auth.dto';
import { UnauthorizedError } from '../../errors/app.error';

export class AuthController {
  constructor(private readonly service: AuthService = authService) {}

  signUp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto: SignUpDTO = req.body;
      const result = await this.service.signUp(dto);
      sendSuccess(res, result, 201, 'User registered successfully');
    } catch (err) {
      next(err);
    }
  };

  signIn = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto: SignInDTO = req.body;
      const result = await this.service.signIn(dto);
      sendSuccess(res, result, 200, 'User logged in successfully');
    } catch (err) {
      next(err);
    }
  };

  refreshToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { refreshToken }: RefreshTokenDTO = req.body;
      const result = await this.service.refreshToken(refreshToken);
      sendSuccess(res, result, 200, 'Session refreshed successfully');
    } catch (err) {
      next(err);
    }
  };

  signOut = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.service.signOut(req.token);
      sendSuccess(res, null, 200, 'User logged out successfully');
    } catch (err) {
      next(err);
    }
  };

  getMe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('Unauthorized');
      }
      const result = await this.service.getMe(req.user.id);
      sendSuccess(res, result, 200, 'Current user profile fetched successfully');
    } catch (err) {
      next(err);
    }
  };
}

export const authController = new AuthController();

