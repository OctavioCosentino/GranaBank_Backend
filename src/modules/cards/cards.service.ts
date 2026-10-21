import { CardsRepository, cardsRepository } from "./cards.repository";
import { CreateCardDTO } from "./cards.dto";
import { NotFoundError } from "../../errors/app.error";

/**
 * Handles business logic for user credit/debit cards.
 */
export class CardsService {
  constructor(private readonly repository: CardsRepository = cardsRepository) {}

  /**
   * Retrieves all cards for a user.
   */
  async getUserCards(userId: string) {
    return await this.repository.findByUserId(userId);
  }

  /**
   * Retrieves a specific card by its ID, ensuring user ownership.
   */
  async getCardById(id: string, userId: string) {
    const card = await this.repository.findByIdAndUserId(id, userId);
    if (!card) {
      throw new NotFoundError(`Card with ID ${id} not found`);
    }
    return card;
  }

  /**
   * Creates and persists a new card for a user.
   */
  async createCard(userId: string, dto: CreateCardDTO) {
    return await this.repository.create({
      user_id: userId,
      cardholder: dto.cardholder,
      expiration_date: dto.expiration_date,
      last_four: dto.last_four,
    });
  }

  /**
   * Deletes a user card by ID.
   */
  async deleteCard(id: string, userId: string) {
    const deleted = await this.repository.delete(id, userId);
    if (!deleted) {
      throw new NotFoundError(
        `Card with ID ${id} not found or already deleted`,
      );
    }
    return { success: true };
  }
}

export const cardsService = new CardsService();
