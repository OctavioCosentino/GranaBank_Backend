import { Request, Response, NextFunction } from "express";
import { cardsService, CardsService } from "./cards.service";
import { sendSuccess } from "../../utils/response.util";
import { CreateCardDTO } from "./cards.dto";
import { UnauthorizedError } from "../../errors/app.error";

/**
 * Controller handling HTTP requests for cards.
 */
export class CardsController {
  constructor(private readonly service: CardsService = cardsService) {}

  /**
   * GET /api/v1/cards - Lists authenticated user's cards.
   */
  getUserCards = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      if (!req.user) {
        throw new UnauthorizedError("Unauthorized");
      }
      const cards = await this.service.getUserCards(req.user.id);
      sendSuccess(res, cards, 200, "Cards retrieved successfully");
    } catch (err) {
      next(err);
    }
  };

  /**
   * GET /api/v1/cards/:id - Retrieves a specific card.
   */
  getCardById = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      if (!req.user) {
        throw new UnauthorizedError("Unauthorized");
      }
      const cardId = req.params.id as string;
      const card = await this.service.getCardById(cardId, req.user.id);
      sendSuccess(res, card, 200, "Card retrieved successfully");
    } catch (err) {
      next(err);
    }
  };

  /**
   * POST /api/v1/cards - Creates a new card for the user.
   */
  createCard = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      if (!req.user) {
        throw new UnauthorizedError("Unauthorized");
      }
      const dto: CreateCardDTO = req.body;
      const card = await this.service.createCard(req.user.id, dto);
      sendSuccess(res, card, 201, "Card created successfully");
    } catch (err) {
      next(err);
    }
  };

  /**
   * DELETE /api/v1/cards/:id - Deletes a card.
   */
  deleteCard = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      if (!req.user) {
        throw new UnauthorizedError("Unauthorized");
      }
      const cardId = req.params.id as string;
      await this.service.deleteCard(cardId, req.user.id);
      sendSuccess(res, null, 200, "Card deleted successfully");
    } catch (err) {
      next(err);
    }
  };
}

export const cardsController = new CardsController();
