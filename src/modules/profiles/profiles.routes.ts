import { Router } from "express";
import { profilesController } from "./profiles.controller";
import { authenticate } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { updateProfileSchema } from "./profiles.dto";

const router = Router();

// Protect all profile endpoints with JWT authentication
router.use(authenticate);

// Profile endpoints
router.get("/me", profilesController.getMyProfile);
router.patch(
  "/me",
  validate({ body: updateProfileSchema }),
  profilesController.updateMyProfile,
);

export const profileRoutes = router;
