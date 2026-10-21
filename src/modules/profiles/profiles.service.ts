import { ProfilesRepository, profilesRepository } from './profiles.repository';
import { UpdateProfileDTO } from './profiles.dto';
import { NotFoundError } from '../../errors/app.error';

export class ProfilesService {
  constructor(private readonly repository: ProfilesRepository = profilesRepository) {}

  async getProfile(userId: string) {
    const profile = await this.repository.findById(userId);
    if (!profile) {
      throw new NotFoundError('User profile not found');
    }
    return profile;
  }

  async updateProfile(userId: string, dto: UpdateProfileDTO) {
    // Check if exists
    await this.getProfile(userId);
    return await this.repository.update(userId, dto);
  }
}

export const profilesService = new ProfilesService();

