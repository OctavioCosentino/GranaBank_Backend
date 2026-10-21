import { Router } from "express";
import { authRoutes } from "../modules/auth/auth.routes";
import { profileRoutes } from "../modules/profiles/profiles.routes";
import { cardRoutes } from "../modules/cards/cards.routes";
import { transactionRoutes } from "../modules/transactions/transactions.routes";
import { sendSuccess } from "../utils/response.util";

const router = Router();

/**
 * Health check endpoint for uptime and monitoring.
 */
router.get("/health", (_req, res) => {
  sendSuccess(
    res,
    { status: "healthy", timestamp: new Date().toISOString() },
    200,
    "GranaBank API is running",
  );
});

// Domain modules mounting
router.use("/auth", authRoutes);
router.use("/profiles", profileRoutes);
router.use("/cards", cardRoutes);
router.use("/transactions", transactionRoutes);

export const apiRouter = router;
