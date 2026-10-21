import { Router } from 'express';
import { cardsController } from './cards.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { createCardSchema, cardIdParamSchema } from './cards.dto';

const router = Router();

// All card routes require authentication
router.use(authenticate);

router.get('/', cardsController.getUserCards);

router.post(
  '/',
  validate({ body: createCardSchema }),
  cardsController.createCard
);

router.get(
  '/:id',
  validate({ params: cardIdParamSchema }),
  cardsController.getCardById
);

router.delete(
  '/:id',
  validate({ params: cardIdParamSchema }),
  cardsController.deleteCard
);

export const cardRoutes = router;

