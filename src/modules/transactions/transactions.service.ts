import {
  TransactionsRepository,
  transactionsRepository,
} from "./transactions.repository";
import { CreateTransactionDTO, TransactionQueryDTO } from "./transactions.dto";
import { NotFoundError } from "../../errors/app.error";

/**
 * Returns a human-friendly subtitle according to transaction type.
 */
const getSubtitleForType = (type: string): string => {
  switch (type?.toUpperCase()) {
    case "CASH_IN":
      return "Pago recibido";
    case "CASH_OUT":
      return "Pago enviado";
    case "SUS":
    case "SUBSCRIPTION":
      return "Suscripción";
    case "TRANSFER":
      return "Transferencia";
    default:
      return "Movimiento";
  }
};

/**
 * Handles business logic for transactions, filtering, and pagination.
 */
export class TransactionsService {
  constructor(
    private readonly repository: TransactionsRepository = transactionsRepository,
  ) {}

  /**
   * Retrieves paginated, filtered user transactions.
   */
  async getUserTransactions(userId: string, query: TransactionQueryDTO) {
    const page = query.page || 1;
    const limit = query.limit || 15;

    const { transactions, count } = await this.repository.findByUserId(userId, {
      page,
      limit,
      search: query.search,
      type: query.type,
    });

    const total_pages = count > 0 ? Math.ceil(count / limit) : 0;
    const has_next_page = page < total_pages;

    const formattedData = transactions.map((t) => ({
      id: t.id,
      type: t.type,
      title: t.name,
      subtitle: getSubtitleForType(t.type),
      amount: t.amount,
      user_id: t.user_id,
      created_at: t.created_at,
    }));

    return {
      data: formattedData,
      pagination: {
        page,
        limit,
        total_items: count,
        total_pages,
        has_next_page,
      },
    };
  }

  /**
   * Retrieves a single transaction by ID and user ID.
   */
  async getTransactionById(id: string, userId: string) {
    const transaction = await this.repository.findByIdAndUserId(id, userId);
    if (!transaction) {
      throw new NotFoundError(`Transaction with ID ${id} not found`);
    }

    return {
      id: transaction.id,
      type: transaction.type,
      title: transaction.name,
      subtitle: getSubtitleForType(transaction.type),
      amount: transaction.amount,
      user_id: transaction.user_id,
      created_at: transaction.created_at,
    };
  }

  /**
   * Creates a new transaction record for a user.
   */
  async createTransaction(userId: string, dto: CreateTransactionDTO) {
    const title = dto.title || dto.name || "Sin título";
    const transaction = await this.repository.create({
      user_id: userId,
      name: title,
      type: dto.type,
      amount: dto.amount,
    });

    return {
      id: transaction.id,
      type: transaction.type,
      title: transaction.name,
      subtitle: getSubtitleForType(transaction.type),
      amount: transaction.amount,
      user_id: transaction.user_id,
      created_at: transaction.created_at,
    };
  }
}

export const transactionsService = new TransactionsService();
