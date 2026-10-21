import { z } from "zod";

export const createTransactionSchema = z
  .object({
    name: z.string().optional(),
    title: z.string().optional(),
    type: z.string().min(1, "Transaction type is required"),
    amount: z
      .number()
      .int("Amount must be an integer (e.g. in cents or base units)"),
  })
  .refine((data) => !!(data.name || data.title), {
    message: "Either title or name is required",
    path: ["title"],
  });

export type CreateTransactionDTO = z.infer<typeof createTransactionSchema>;

export const transactionQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => {
      const parsed = val ? parseInt(val, 10) : 1;
      return isNaN(parsed) || parsed < 1 ? 1 : parsed;
    }),
  limit: z
    .string()
    .optional()
    .transform((val) => {
      const parsed = val ? parseInt(val, 10) : 15;
      return isNaN(parsed) || parsed < 1 ? 15 : parsed;
    }),
  search: z
    .string()
    .optional()
    .transform((val) => {
      if (!val || val === "undefined" || val === "null" || !val.trim()) {
        return undefined;
      }
      return val.trim();
    }),
  type: z
    .string()
    .optional()
    .transform((val) => {
      if (
        !val ||
        val === "undefined" ||
        val === "null" ||
        val.toUpperCase() === "ALL" ||
        !val.trim()
      ) {
        return undefined;
      }
      return val.trim().toUpperCase();
    }),
});

export type TransactionQueryDTO = z.infer<typeof transactionQuerySchema>;

export const transactionIdParamSchema = z.object({
  id: z.string().uuid("Invalid transaction ID format, must be UUID"),
});

export type TransactionIdParamDTO = z.infer<typeof transactionIdParamSchema>;
