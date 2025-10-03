export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export type Database = {
  public: {
    Tables: {
      orders: {
        Row: {
          id: string;
          order_id: string;
          status: string;
          received_at: string;
          review_eta: string | null;
          locale: string | null;
          quantity_total: number | null;
          total_amount: number | null;
          discount_amount: number | null;
          checkout: Json | null;
          notes: string | null;
          items: Json[];
          discounts: Json[] | null;
          raw_payload: Json;
          created_at: string;
        };
        Insert: {
          order_id: string;
          status?: string;
          received_at: string;
          review_eta?: string | null;
          locale?: string | null;
          quantity_total?: number | null;
          total_amount?: number | null;
          discount_amount?: number | null;
          checkout?: Json | null;
          notes?: string | null;
          items: Json[];
          discounts?: Json[] | null;
          raw_payload: Json;
        };
        Update: {
          status?: string;
          review_eta?: string | null;
          locale?: string | null;
          quantity_total?: number | null;
          total_amount?: number | null;
          discount_amount?: number | null;
          checkout?: Json | null;
          notes?: string | null;
          items?: Json[];
          discounts?: Json[] | null;
          raw_payload?: Json;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
