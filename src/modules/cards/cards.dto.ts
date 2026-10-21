import { z } from 'zod';

export const createCardSchema = z.object({
  cardholder: z.string().min(2, 'Cardholder name is required'),
  expiration_date: z
    .string()
    .min(4, 'Expiration date is required (e.g. MM/YY)'),
  last_four: z
    .string()
    .length(4, 'Last four must be exactly 4 digits')
    .regex(/^\d{4}$/, 'Last four must contain digits only'),
});

export type CreateCardDTO = z.infer<typeof createCardSchema>;

export const cardIdParamSchema = z.object({
  id: z.string().uuid('Invalid card ID format, must be UUID'),
});

export type CardIdParamDTO = z.infer<typeof cardIdParamSchema>;

