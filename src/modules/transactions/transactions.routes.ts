import { Router } from "express";
import { transactionsController } from "./transactions.controller";
import { authenticate } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import {
  createTransactionSchema,
  transactionQuerySchema,
  transactionIdParamSchema,
} from "./transactions.dto";

const router = Router();

// Protect all transaction endpoints with JWT authentication
router.use(authenticate);

// Transaction endpoints
router.get(
  "/",
  validate({ query: transactionQuerySchema }),
  transactionsController.getUserTransactions,
);
router.post(
  "/",
  validate({ body: createTransactionSchema }),
  transactionsController.createTransaction,
);
router.get(
  "/:id",
  validate({ params: transactionIdParamSchema }),
  transactionsController.getTransactionById,
);

export const transactionRoutes = router;
