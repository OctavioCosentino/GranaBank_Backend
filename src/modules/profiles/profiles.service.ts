import { ProfilesRepository, profilesRepository } from "./profiles.repository";
import { UpdateProfileDTO } from "./profiles.dto";
import { NotFoundError } from "../../errors/app.error";

/**
 * Handles business logic for user profiles.
 */
export class ProfilesService {
  constructor(
    private readonly repository: ProfilesRepository = profilesRepository,
  ) {}

  /**
   * Retrieves profile by user ID or throws 404.
   */
  async getProfile(userId: string) {
    const profile = await this.repository.findById(userId);
    if (!profile) {
      throw new NotFoundError("User profile not found");
    }
    return profile;
  }

  /**
   * Updates profile fields for a user.
   */
  async updateProfile(userId: string, dto: UpdateProfileDTO) {
    await this.getProfile(userId);
    return await this.repository.update(userId, dto);
  }
}

export const profilesService = new ProfilesService();
