import { Request, Response, NextFunction } from "express";
import {
  transactionsService,
  TransactionsService,
} from "./transactions.service";
import { sendSuccess } from "../../utils/response.util";
import { CreateTransactionDTO, TransactionQueryDTO } from "./transactions.dto";
import { UnauthorizedError } from "../../errors/app.error";

/**
 * Controller handling HTTP requests for transactions.
 */
export class TransactionsController {
  constructor(
    private readonly service: TransactionsService = transactionsService,
  ) {}

  /**
   * GET /api/v1/transactions - Lists paginated user transactions with search and filters.
   */
  getUserTransactions = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      if (!req.user) {
        throw new UnauthorizedError("Unauthorized");
      }
      const query = req.query as unknown as TransactionQueryDTO;
      const result = await this.service.getUserTransactions(req.user.id, query);
      sendSuccess(
        res,
        result.data,
        200,
        "Transactions retrieved successfully",
        result.pagination,
      );
    } catch (err) {
      next(err);
    }
  };

  /**
   * GET /api/v1/transactions/:id - Retrieves a specific transaction by ID.
   */
  getTransactionById = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      if (!req.user) {
        throw new UnauthorizedError("Unauthorized");
      }
      const transactionId = req.params.id as string;
      const transaction = await this.service.getTransactionById(
        transactionId,
        req.user.id,
      );
      sendSuccess(res, transaction, 200, "Transaction retrieved successfully");
    } catch (err) {
      next(err);
    }
  };

  /**
   * POST /api/v1/transactions - Creates a new transaction.
   */
  createTransaction = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      if (!req.user) {
        throw new UnauthorizedError("Unauthorized");
      }
      const dto: CreateTransactionDTO = req.body;
      const transaction = await this.service.createTransaction(
        req.user.id,
        dto,
      );
      sendSuccess(res, transaction, 201, "Transaction created successfully");
    } catch (err) {
      next(err);
    }
  };
}

export const transactionsController = new TransactionsController();
