export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      agent_outputs: {
        Row: {
          agent_name: string
          confidence_score: number | null
          created_at: string
          id: string
          result_summary: string | null
          role_description: string
          submission_id: string
        }
        Insert: {
          agent_name: string
          confidence_score?: number | null
          created_at?: string
          id?: string
          result_summary?: string | null
          role_description: string
          submission_id: string
        }
        Update: {
          agent_name?: string
          confidence_score?: number | null
          created_at?: string
          id?: string
          result_summary?: string | null
          role_description?: string
          submission_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "agent_outputs_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      insights_history: {
        Row: {
          circuit_type: string
          confidence: number
          created_at: string
          emergence_detected: boolean
          full_results: Json
          id: string
          insight: string
          novelty_score: number | null
          processing_depth: number
          question: string
          tension_points: number
          user_id: string | null
        }
        Insert: {
          circuit_type?: string
          confidence?: number
          created_at?: string
          emergence_detected?: boolean
          full_results: Json
          id?: string
          insight: string
          novelty_score?: number | null
          processing_depth?: number
          question: string
          tension_points?: number
          user_id?: string | null
        }
        Update: {
          circuit_type?: string
          confidence?: number
          created_at?: string
          emergence_detected?: boolean
          full_results?: Json
          id?: string
          insight?: string
          novelty_score?: number | null
          processing_depth?: number
          question?: string
          tension_points?: number
          user_id?: string | null
        }
        Relationships: []
      }
      submissions: {
        Row: {
          created_at: string
          id: string
          status: string
          user_input: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          status?: string
          user_input?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          status?: string
          user_input?: string | null
        }
        Relationships: []
      }
      void_reports: {
        Row: {
          created_at: string
          final_summary: string
          id: string
          submission_id: string
          tags: string[] | null
          verdict_category: string | null
        }
        Insert: {
          created_at?: string
          final_summary: string
          id?: string
          submission_id: string
          tags?: string[] | null
          verdict_category?: string | null
        }
        Update: {
          created_at?: string
          final_summary?: string
          id?: string
          submission_id?: string
          tags?: string[] | null
          verdict_category?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "void_reports_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "submissions"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
