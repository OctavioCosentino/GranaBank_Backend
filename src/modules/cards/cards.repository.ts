import { supabaseAdmin } from '../../config/supabase';
import { Card, Database } from '../../types/database.types';

type CardInsert = Database['public']['Tables']['cards']['Insert'];

export class CardsRepository {
  async findByUserId(userId: string): Promise<Card[]> {
    const { data, error } = await supabaseAdmin
      .from('cards')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data || [];
  }

  async findByIdAndUserId(id: string, userId: string): Promise<Card | null> {
    const { data, error } = await supabaseAdmin
      .from('cards')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data;
  }

  async create(cardData: CardInsert): Promise<Card> {
    const { data, error } = await supabaseAdmin
      .from('cards')
      .insert(cardData)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  }

  async delete(id: string, userId: string): Promise<boolean> {
    const { error, count } = await supabaseAdmin
      .from('cards')
      .delete({ count: 'exact' })
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      throw error;
    }

    return (count ?? 0) > 0;
  }
}

export const cardsRepository = new CardsRepository();

