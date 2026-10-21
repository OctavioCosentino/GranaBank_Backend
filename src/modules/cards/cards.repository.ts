import { supabaseAdmin } from "../../config/supabase";
import { Card, Database } from "../../types/database.types";
import { BadRequestError } from "../../errors/app.error";

type CardInsert = Database["public"]["Tables"]["cards"]["Insert"];

/**
 * Encapsulates database queries for the 'cards' table in Supabase.
 */
export class CardsRepository {
  /**
   * Retrieves all cards belonging to a specific user.
   */
  async findByUserId(userId: string): Promise<Card[]> {
    const { data, error } = await supabaseAdmin
      .from("cards")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      throw new BadRequestError(error.message, error);
    }

    return data || [];
  }

  /**
   * Finds a card by its ID and user ID.
   */
  async findByIdAndUserId(id: string, userId: string): Promise<Card | null> {
    const { data, error } = await supabaseAdmin
      .from("cards")
      .select("*")
      .eq("id", id)
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      throw new BadRequestError(error.message, error);
    }

    return data;
  }

  /**
   * Inserts a new card record.
   */
  async create(cardData: CardInsert): Promise<Card> {
    const { data, error } = await supabaseAdmin
      .from("cards")
      .insert(cardData)
      .select()
      .single();

    if (error) {
      throw new BadRequestError(error.message, error);
    }

    return data;
  }

  /**
   * Deletes a card by its ID for a given user.
   */
  async delete(id: string, userId: string): Promise<boolean> {
    const { error, count } = await supabaseAdmin
      .from("cards")
      .delete({ count: "exact" })
      .eq("id", id)
      .eq("user_id", userId);

    if (error) {
      throw new BadRequestError(error.message, error);
    }

    return (count ?? 0) > 0;
  }
}

export const cardsRepository = new CardsRepository();
