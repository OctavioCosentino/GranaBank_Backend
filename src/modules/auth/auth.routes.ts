import { Router } from "express";
import { authController } from "./auth.controller";
import { validate } from "../../middlewares/validate.middleware";
import { authenticate } from "../../middlewares/auth.middleware";
import { signUpSchema, signInSchema, refreshTokenSchema } from "./auth.dto";

const router = Router();

// Public auth endpoints
router.post(
  "/register",
  validate({ body: signUpSchema }),
  authController.signUp,
);
router.post("/login", validate({ body: signInSchema }), authController.signIn);
router.post(
  "/refresh",
  validate({ body: refreshTokenSchema }),
  authController.refreshToken,
);

// Protected auth endpoints
router.post("/logout", authenticate, authController.signOut);
router.get("/me", authenticate, authController.getMe);

export const authRoutes = router;
