import { Request, Response, NextFunction } from 'express';
import { profilesService, ProfilesService } from './profiles.service';
import { sendSuccess } from '../../utils/response.util';
import { UpdateProfileDTO } from './profiles.dto';
import { UnauthorizedError } from '../../errors/app.error';

export class ProfilesController {
  constructor(private readonly service: ProfilesService = profilesService) {}

  getMyProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('Unauthorized');
      }
      const profile = await this.service.getProfile(req.user.id);
      sendSuccess(res, profile, 200, 'Profile retrieved successfully');
    } catch (err) {
      next(err);
    }
  };

  updateMyProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('Unauthorized');
      }
      const dto: UpdateProfileDTO = req.body;
      const updated = await this.service.updateProfile(req.user.id, dto);
      sendSuccess(res, updated, 200, 'Profile updated successfully');
    } catch (err) {
      next(err);
    }
  };
}

export const profilesController = new ProfilesController();

