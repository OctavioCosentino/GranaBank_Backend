export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type TransactionType = 'INCOME' | 'EXPENSE' | 'TRANSFER' | string;

export type Profile = {
  id: string;
  created_at: string;
  name: string;
};

export type Card = {
  id: string;
  created_at: string;
  cardholder: string;
  user_id: string;
  expiration_date: string;
  last_four: string;
};

export type Transaction = {
  id: string;
  created_at: string;
  name: string;
  type: TransactionType;
  amount: number;
  user_id: string;
};

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: {
          id: string;
          created_at?: string;
          name: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          name?: string;
        };
        Relationships: [
          {
            foreignKeyName: string;
            columns: string[];
            isOneToOne?: boolean;
            referencedRelation: string;
            referencedColumns: string[];
          }
        ] | [];
      };
      cards: {
        Row: Card;
        Insert: {
          id?: string;
          created_at?: string;
          cardholder: string;
          user_id: string;
          expiration_date: string;
          last_four: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          cardholder?: string;
          user_id?: string;
          expiration_date?: string;
          last_four?: string;
        };
        Relationships: [
          {
            foreignKeyName: string;
            columns: string[];
            isOneToOne?: boolean;
            referencedRelation: string;
            referencedColumns: string[];
          }
        ] | [];
      };
      transactions: {
        Row: Transaction;
        Insert: {
          id?: string;
          created_at?: string;
          name: string;
          type: TransactionType;
          amount: number;
          user_id: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          name?: string;
          type?: TransactionType;
          amount?: number;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: string;
            columns: string[];
            isOneToOne?: boolean;
            referencedRelation: string;
            referencedColumns: string[];
          }
        ] | [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

