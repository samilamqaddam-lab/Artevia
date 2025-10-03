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
          checkout: Record<string, unknown> | null;
          notes: string | null;
          items: unknown[];
          discounts: unknown[] | null;
          raw_payload: Record<string, unknown>;
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
          checkout?: Record<string, unknown> | null;
          notes?: string | null;
          items: unknown[];
          discounts?: unknown[] | null;
          raw_payload: Record<string, unknown>;
        };
        Update: {
          status?: string;
          review_eta?: string | null;
          locale?: string | null;
          quantity_total?: number | null;
          total_amount?: number | null;
          discount_amount?: number | null;
          checkout?: Record<string, unknown> | null;
          notes?: string | null;
          items?: unknown[];
          discounts?: unknown[] | null;
          raw_payload?: Record<string, unknown>;
        };
      };
    };
  };
};
