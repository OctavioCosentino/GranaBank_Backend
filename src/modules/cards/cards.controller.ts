import { Request, Response, NextFunction } from 'express';
import { cardsService, CardsService } from './cards.service';
import { sendSuccess } from '../../utils/response.util';
import { CreateCardDTO } from './cards.dto';
import { UnauthorizedError } from '../../errors/app.error';

export class CardsController {
  constructor(private readonly service: CardsService = cardsService) {}

  getUserCards = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('Unauthorized');
      }
      const cards = await this.service.getUserCards(req.user.id);
      sendSuccess(res, cards, 200, 'Cards retrieved successfully');
    } catch (err) {
      next(err);
    }
  };

  getCardById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('Unauthorized');
      }
      const cardId = req.params.id as string;
      const card = await this.service.getCardById(cardId, req.user.id);
      sendSuccess(res, card, 200, 'Card retrieved successfully');
    } catch (err) {
      next(err);
    }
  };

  createCard = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('Unauthorized');
      }
      const dto: CreateCardDTO = req.body;
      const card = await this.service.createCard(req.user.id, dto);
      sendSuccess(res, card, 201, 'Card created successfully');
    } catch (err) {
      next(err);
    }
  };

  deleteCard = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('Unauthorized');
      }
      const cardId = req.params.id as string;
      await this.service.deleteCard(cardId, req.user.id);
      sendSuccess(res, null, 200, 'Card deleted successfully');
    } catch (err) {
      next(err);
    }
  };
}

export const cardsController = new CardsController();

