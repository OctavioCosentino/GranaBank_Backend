import { supabaseAdmin } from '../../config/supabase';
import { Transaction, Database } from '../../types/database.types';
import { BadRequestError } from '../../errors/app.error';

type TransactionInsert = Database['public']['Tables']['transactions']['Insert'];

export interface FindTransactionsOptions {
  page?: number;
  limit?: number;
  search?: string;
  type?: string;
}

export class TransactionsRepository {
  async findByUserId(
    userId: string,
    options: FindTransactionsOptions = {}
  ): Promise<{ transactions: Transaction[]; count: number }> {
    const page = options.page && options.page > 0 ? options.page : 1;
    const limit = options.limit && options.limit > 0 ? options.limit : 15;
    const offset = (page - 1) * limit;

    let query = supabaseAdmin
      .from('transactions')
      .select('*', { count: 'exact' })
      .eq('user_id', userId);

    // Filter by type if provided and not "ALL", "undefined" or "null"
    if (
      options.type &&
      options.type !== 'ALL' &&
      options.type !== 'undefined' &&
      options.type !== 'null'
    ) {
      query = query.eq('type', options.type);
    }

    // Case-insensitive partial search in the transaction title/name (ILIKE %search%)
    if (
      options.search &&
      options.search !== 'undefined' &&
      options.search !== 'null' &&
      options.search.trim() !== ''
    ) {
      query = query.ilike('name', `%${options.search.trim()}%`);
    }

    // Order by created_at DESC and apply pagination range
    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Supabase Query Error in findByUserId:', error);
      throw new BadRequestError(error.message, error);
    }

    return {
      transactions: data || [],
      count: count ?? 0,
    };
  }

  async findByIdAndUserId(id: string, userId: string): Promise<Transaction | null> {
    const { data, error } = await supabaseAdmin
      .from('transactions')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.error('Supabase Query Error in findByIdAndUserId:', error);
      throw new BadRequestError(error.message, error);
    }

    return data;
  }

  async create(transactionData: TransactionInsert): Promise<Transaction> {
    const { data, error } = await supabaseAdmin
      .from('transactions')
      .insert(transactionData)
      .select()
      .single();

    if (error) {
      console.error('Supabase Query Error in create transaction:', error);
      throw new BadRequestError(error.message, error);
    }

    return data;
  }
}

export const transactionsRepository = new TransactionsRepository();
