import { Router } from 'express';
import { authController } from './auth.controller';
import { validate } from '../../middlewares/validate.middleware';
import { authenticate } from '../../middlewares/auth.middleware';
import { signUpSchema, signInSchema, refreshTokenSchema } from './auth.dto';

const router = Router();

router.post(
  '/register',
  validate({ body: signUpSchema }),
  authController.signUp
);

router.post(
  '/login',
  validate({ body: signInSchema }),
  authController.signIn
);

router.post(
  '/refresh',
  validate({ body: refreshTokenSchema }),
  authController.refreshToken
);

router.post(
  '/logout',
  authenticate,
  authController.signOut
);

router.get(
  '/me',
  authenticate,
  authController.getMe
);

export const authRoutes = router;

