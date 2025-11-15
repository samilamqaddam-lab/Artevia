export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      design_versions: {
        Row: {
          canvas: Json
          change_description: string | null
          created_at: string | null
          id: string
          preview_url: string | null
          project_id: string
          version_number: number
        }
        Insert: {
          canvas: Json
          change_description?: string | null
          created_at?: string | null
          id?: string
          preview_url?: string | null
          project_id: string
          version_number: number
        }
        Update: {
          canvas?: Json
          change_description?: string | null
          created_at?: string | null
          id?: string
          preview_url?: string | null
          project_id?: string
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "design_versions_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "design_versions_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "recent_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          checkout: Json | null
          created_at: string
          discount_amount: number | null
          discounts: Json | null
          id: string
          items: Json
          locale: string | null
          notes: string | null
          order_id: string
          quantity_total: number | null
          raw_payload: Json
          received_at: string
          review_eta: string | null
          status: string
          total_amount: number | null
          user_id: string | null
        }
        Insert: {
          checkout?: Json | null
          created_at?: string
          discount_amount?: number | null
          discounts?: Json | null
          id?: string
          items: Json
          locale?: string | null
          notes?: string | null
          order_id: string
          quantity_total?: number | null
          raw_payload: Json
          received_at: string
          review_eta?: string | null
          status?: string
          total_amount?: number | null
          user_id?: string | null
        }
        Update: {
          checkout?: Json | null
          created_at?: string
          discount_amount?: number | null
          discounts?: Json | null
          id?: string
          items?: Json
          locale?: string | null
          notes?: string | null
          order_id?: string
          quantity_total?: number | null
          raw_payload?: Json
          received_at?: string
          review_eta?: string | null
          status?: string
          total_amount?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      price_overrides: {
        Row: {
          created_at: string | null
          id: string
          method_id: string
          product_id: string
          tier_1_price: number
          tier_1_quantity: number
          tier_2_price: number
          tier_2_quantity: number
          tier_3_price: number
          tier_3_quantity: number
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          method_id: string
          product_id: string
          tier_1_price: number
          tier_1_quantity: number
          tier_2_price: number
          tier_2_quantity: number
          tier_3_price: number
          tier_3_quantity: number
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          method_id?: string
          product_id?: string
          tier_1_price?: number
          tier_1_quantity?: number
          tier_2_price?: number
          tier_2_quantity?: number
          tier_3_price?: number
          tier_3_quantity?: number
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          company_name: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          locale: string | null
          phone: string | null
          preferences: Json | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          company_name?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          locale?: string | null
          phone?: string | null
          preferences?: Json | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          company_name?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          locale?: string | null
          phone?: string | null
          preferences?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          canvas: Json
          created_at: string | null
          id: string
          is_public: boolean | null
          name: string
          preview_url: string | null
          product_id: string
          tags: string[] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          canvas: Json
          created_at?: string | null
          id?: string
          is_public?: boolean | null
          name: string
          preview_url?: string | null
          product_id: string
          tags?: string[] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          canvas?: Json
          created_at?: string | null
          id?: string
          is_public?: boolean | null
          name?: string
          preview_url?: string | null
          product_id?: string
          tags?: string[] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      shared_projects: {
        Row: {
          created_at: string | null
          id: string
          permission: string | null
          project_id: string
          shared_by: string
          shared_with_email: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          permission?: string | null
          project_id: string
          shared_by: string
          shared_with_email: string
        }
        Update: {
          created_at?: string | null
          id?: string
          permission?: string | null
          project_id?: string
          shared_by?: string
          shared_with_email?: string
        }
        Relationships: [
          {
            foreignKeyName: "shared_projects_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shared_projects_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "recent_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      recent_projects: {
        Row: {
          created_at: string | null
          id: string | null
          name: string | null
          owner_company: string | null
          owner_name: string | null
          preview_url: string | null
          product_id: string | null
          updated_at: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_user_role_debug: {
        Args: { user_id_param: string }
        Returns: {
          created_at: string
          role: string
          updated_at: string
        }[]
      }
      has_role: { Args: { required_role: string }; Returns: boolean }
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
