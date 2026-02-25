export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.1";
  };
  public: {
    Tables: {
      assignments: {
        Row: {
          created_at: string | null;
          custom_note: string | null;
          id: string;
          item_id: string | null;
          user_name: string;
        };
        Insert: {
          created_at?: string | null;
          custom_note?: string | null;
          id?: string;
          item_id?: string | null;
          user_name: string;
        };
        Update: {
          created_at?: string | null;
          custom_note?: string | null;
          id?: string;
          item_id?: string | null;
          user_name?: string;
        };
        Relationships: [
          {
            foreignKeyName: "assignments_item_id_fkey";
            columns: ["item_id"];
            isOneToOne: false;
            referencedRelation: "items";
            referencedColumns: ["id"];
          }
        ];
      };
      categories: {
        Row: {
          icon: string | null;
          id: string;
          name: string;
          sort_order: number;
        };
        Insert: {
          icon?: string | null;
          id: string;
          name: string;
          sort_order?: number;
        };
        Update: {
          icon?: string | null;
          id?: string;
          name?: string;
          sort_order?: number;
        };
        Relationships: [];
      };
      customers: {
        Row: {
          created_at: string | null;
          customer_info: Json;
          id: number;
          order_id: number | null;
          order_status: string;
        };
        Insert: {
          created_at?: string | null;
          customer_info?: Json;
          id?: number;
          order_id?: number | null;
          order_status?: string;
        };
        Update: {
          created_at?: string | null;
          customer_info?: Json;
          id?: number;
          order_id?: number | null;
          order_status?: string;
        };
        Relationships: [
          {
            foreignKeyName: "customers_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "orders";
            referencedColumns: ["id"];
          }
        ];
      };
      items: {
        Row: {
          category_id: string | null;
          id: string;
          name: string;
          note: string | null;
          slot_limit: number | null;
          sort_order: number;
        };
        Insert: {
          category_id?: string | null;
          id: string;
          name: string;
          note?: string | null;
          slot_limit?: number | null;
          sort_order?: number;
        };
        Update: {
          category_id?: string | null;
          id?: string;
          name?: string;
          note?: string | null;
          slot_limit?: number | null;
          sort_order?: number;
        };
        Relationships: [
          {
            foreignKeyName: "items_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          }
        ];
      };
      orders: {
        Row: {
          base_price: number | null;
          contract_end_date: string | null;
          contract_start_date: string | null;
          created_at: string | null;
          current_price: number | null;
          id: number;
          next_billing_date: string | null;
          payment_deadline: string | null;
        };
        Insert: {
          base_price?: number | null;
          contract_end_date?: string | null;
          contract_start_date?: string | null;
          created_at?: string | null;
          current_price?: number | null;
          id?: number;
          next_billing_date?: string | null;
          payment_deadline?: string | null;
        };
        Update: {
          base_price?: number | null;
          contract_end_date?: string | null;
          contract_start_date?: string | null;
          created_at?: string | null;
          current_price?: number | null;
          id?: number;
          next_billing_date?: string | null;
          payment_deadline?: string | null;
        };
        Relationships: [];
      };
      subscriptions: {
        Row: {
          amount_paid: number | null;
          bandwidth_speed: string | null;
          billing_plan: string | null;
          bonus_months: number | null;
          created_at: string | null;
          customer_id: number | null;
          end_date: string;
          id: number;
          install_date: string | null;
          next_billing_date: string | null;
          payment_deadline: string | null;
          remarks: string | null;
          start_date: string;
        };
        Insert: {
          amount_paid?: number | null;
          bandwidth_speed?: string | null;
          billing_plan?: string | null;
          bonus_months?: number | null;
          created_at?: string | null;
          customer_id?: number | null;
          end_date: string;
          id?: number;
          install_date?: string | null;
          next_billing_date?: string | null;
          payment_deadline?: string | null;
          remarks?: string | null;
          start_date: string;
        };
        Update: {
          amount_paid?: number | null;
          bandwidth_speed?: string | null;
          billing_plan?: string | null;
          bonus_months?: number | null;
          created_at?: string | null;
          customer_id?: number | null;
          end_date?: string;
          id?: number;
          install_date?: string | null;
          next_billing_date?: string | null;
          payment_deadline?: string | null;
          remarks?: string | null;
          start_date?: string;
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
      DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] &
      DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
  ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
  : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
