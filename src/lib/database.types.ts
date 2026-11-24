export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          extensions?: Json;
          operationName?: string;
          query?: string;
          variables?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      applications: {
        Row: {
          candidate_id: string;
          created_at: string;
          id: string;
          job_id: string;
          note: string;
          resume_path: string | null;
          status: Database["public"]["Enums"]["application_status"];
          trade: Database["public"]["Enums"]["industry"] | null;
          updated_at: string;
        };
        ComputedFields: never;
        Insert: {
          candidate_id?: string;
          created_at?: string;
          id?: string;
          job_id: string;
          note?: string;
          resume_path?: string | null;
          status?: Database["public"]["Enums"]["application_status"];
          trade?: Database["public"]["Enums"]["industry"] | null;
          updated_at?: string;
        };
        Update: {
          candidate_id?: string;
          created_at?: string;
          id?: string;
          job_id?: string;
          note?: string;
          resume_path?: string | null;
          status?: Database["public"]["Enums"]["application_status"];
          trade?: Database["public"]["Enums"]["industry"] | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "applications_candidate_id_fkey";
            columns: ["candidate_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "applications_job_id_fkey";
            columns: ["job_id"];
            isOneToOne: false;
            referencedRelation: "jobs";
            referencedColumns: ["id"];
          },
        ];
      };
      employer_invites: {
        Row: {
          accepted_at: string | null;
          accepted_by: string | null;
          created_at: string;
          email: string;
          employer_id: string;
          expires_at: string;
          id: string;
          token: string;
        };
        ComputedFields: never;
        Insert: {
          accepted_at?: string | null;
          accepted_by?: string | null;
          created_at?: string;
          email: string;
          employer_id: string;
          expires_at?: string;
          id?: string;
          token?: string;
        };
        Update: {
          accepted_at?: string | null;
          accepted_by?: string | null;
          created_at?: string;
          email?: string;
          employer_id?: string;
          expires_at?: string;
          id?: string;
          token?: string;
        };
        Relationships: [
          {
            foreignKeyName: "employer_invites_accepted_by_fkey";
            columns: ["accepted_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "employer_invites_employer_id_fkey";
            columns: ["employer_id"];
            isOneToOne: false;
            referencedRelation: "employers";
            referencedColumns: ["id"];
          },
        ];
      };
      employer_members: {
        Row: {
          created_at: string;
          employer_id: string;
          user_id: string;
        };
        ComputedFields: never;
        Insert: {
          created_at?: string;
          employer_id: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          employer_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "employer_members_employer_id_fkey";
            columns: ["employer_id"];
            isOneToOne: false;
            referencedRelation: "employers";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "employer_members_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      employers: {
        Row: {
          created_at: string;
          id: string;
          name: string;
          notes: string;
          updated_at: string;
        };
        ComputedFields: never;
        Insert: {
          created_at?: string;
          id?: string;
          name: string;
          notes?: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
          notes?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      job_internal: {
        Row: {
          client_name: string;
          employer_id: string | null;
          job_id: string;
          notes: string;
          updated_at: string;
        };
        ComputedFields: never;
        Insert: {
          client_name?: string;
          employer_id?: string | null;
          job_id: string;
          notes?: string;
          updated_at?: string;
        };
        Update: {
          client_name?: string;
          employer_id?: string | null;
          job_id?: string;
          notes?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "job_internal_employer_id_fkey";
            columns: ["employer_id"];
            isOneToOne: false;
            referencedRelation: "employers";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "job_internal_job_id_fkey";
            columns: ["job_id"];
            isOneToOne: true;
            referencedRelation: "jobs";
            referencedColumns: ["id"];
          },
        ];
      };
      jobs: {
        Row: {
          city: string;
          created_at: string;
          created_by: string | null;
          description: string;
          employment_type: Database["public"]["Enums"]["employment_type"];
          id: string;
          industry: Database["public"]["Enums"]["industry"];
          pay_max: number | null;
          pay_min: number | null;
          pay_period: Database["public"]["Enums"]["pay_period"] | null;
          published_at: string | null;
          requirements: string;
          slug: string;
          state: string;
          status: Database["public"]["Enums"]["job_status"];
          summary: string;
          title: string;
          updated_at: string;
        };
        ComputedFields: never;
        Insert: {
          city: string;
          created_at?: string;
          created_by?: string | null;
          description?: string;
          employment_type?: Database["public"]["Enums"]["employment_type"];
          id?: string;
          industry: Database["public"]["Enums"]["industry"];
          pay_max?: number | null;
          pay_min?: number | null;
          pay_period?: Database["public"]["Enums"]["pay_period"] | null;
          published_at?: string | null;
          requirements?: string;
          slug: string;
          state: string;
          status?: Database["public"]["Enums"]["job_status"];
          summary?: string;
          title: string;
          updated_at?: string;
        };
        Update: {
          city?: string;
          created_at?: string;
          created_by?: string | null;
          description?: string;
          employment_type?: Database["public"]["Enums"]["employment_type"];
          id?: string;
          industry?: Database["public"]["Enums"]["industry"];
          pay_max?: number | null;
          pay_min?: number | null;
          pay_period?: Database["public"]["Enums"]["pay_period"] | null;
          published_at?: string | null;
          requirements?: string;
          slug?: string;
          state?: string;
          status?: Database["public"]["Enums"]["job_status"];
          summary?: string;
          title?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "jobs_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          created_at: string;
          email: string;
          full_name: string;
          id: string;
          phone: string;
          role: Database["public"]["Enums"]["user_role"];
          trade: Database["public"]["Enums"]["industry"] | null;
          updated_at: string;
        };
        ComputedFields: never;
        Insert: {
          created_at?: string;
          email?: string;
          full_name?: string;
          id: string;
          phone?: string;
          role?: Database["public"]["Enums"]["user_role"];
          trade?: Database["public"]["Enums"]["industry"] | null;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          email?: string;
          full_name?: string;
          id?: string;
          phone?: string;
          role?: Database["public"]["Enums"]["user_role"];
          trade?: Database["public"]["Enums"]["industry"] | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      search_requests: {
        Row: {
          company: string;
          contact_name: string;
          created_at: string;
          email: string;
          id: string;
          location: string;
          phone: string;
          roles: string;
          staff_notes: string;
          status: Database["public"]["Enums"]["search_request_status"];
          updated_at: string;
        };
        ComputedFields: never;
        Insert: {
          company: string;
          contact_name: string;
          created_at?: string;
          email: string;
          id?: string;
          location?: string;
          phone?: string;
          roles: string;
          staff_notes?: string;
          status?: Database["public"]["Enums"]["search_request_status"];
          updated_at?: string;
        };
        Update: {
          company?: string;
          contact_name?: string;
          created_at?: string;
          email?: string;
          id?: string;
          location?: string;
          phone?: string;
          roles?: string;
          staff_notes?: string;
          status?: Database["public"]["Enums"]["search_request_status"];
          updated_at?: string;
        };
        Relationships: [];
      };
      shortlist: {
        Row: {
          application_id: string;
          created_at: string;
          id: string;
          released_at: string | null;
          released_by: string | null;
          summary: string;
          updated_at: string;
          years_experience: number | null;
        };
        ComputedFields: never;
        Insert: {
          application_id: string;
          created_at?: string;
          id?: string;
          released_at?: string | null;
          released_by?: string | null;
          summary?: string;
          updated_at?: string;
          years_experience?: number | null;
        };
        Update: {
          application_id?: string;
          created_at?: string;
          id?: string;
          released_at?: string | null;
          released_by?: string | null;
          summary?: string;
          updated_at?: string;
          years_experience?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "shortlist_application_id_fkey";
            columns: ["application_id"];
            isOneToOne: true;
            referencedRelation: "applications";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "shortlist_released_by_fkey";
            columns: ["released_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      accept_employer_invite: { Args: { p_token: string }; Returns: string };
      employer_can_read_resume: { Args: { p_name: string }; Returns: boolean };
      employer_candidates: {
        Args: { p_job_id: string };
        Returns: {
          email: string;
          full_name: string;
          has_resume: boolean;
          label: string;
          phone: string;
          released_at: string;
          shortlist_id: string;
          summary: string;
          trade: Database["public"]["Enums"]["industry"];
          years_experience: number;
        }[];
      };
      employer_resume_path: {
        Args: { p_shortlist_id: string };
        Returns: string;
      };
      employer_searches: {
        Args: Record<PropertyKey, never>;
        Returns: {
          city: string;
          employer_name: string;
          industry: Database["public"]["Enums"]["industry"];
          job_id: string;
          job_status: Database["public"]["Enums"]["job_status"];
          released: number;
          shortlisted: number;
          state: string;
          title: string;
        }[];
      };
      has_applied: { Args: { p_job_id: string }; Returns: boolean };
      is_staff: { Args: Record<PropertyKey, never>; Returns: boolean };
      job_is_open: { Args: { p_job_id: string }; Returns: boolean };
      my_employer_ids: { Args: Record<PropertyKey, never>; Returns: string[] };
    };
    Enums: {
      application_status:
        | "new"
        | "reviewing"
        | "interviewing"
        | "placed"
        | "not_selected";
      employment_type:
        | "Full-time"
        | "Contract"
        | "Contract-to-hire"
        | "Part-time";
      industry:
        | "Engineering"
        | "Architecture"
        | "Data Centers & Critical Infrastructure"
        | "Construction"
        | "Telecommunications";
      job_status: "draft" | "open" | "closed";
      pay_period: "hour" | "year";
      search_request_status: "new" | "contacted" | "active" | "closed";
      user_role: "candidate" | "recruiter" | "admin" | "employer";
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
    : never = never,
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
    : never = never,
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
    : never = never,
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
    : never = never,
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
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      application_status: [
        "new",
        "reviewing",
        "interviewing",
        "placed",
        "not_selected",
      ],
      employment_type: [
        "Full-time",
        "Contract",
        "Contract-to-hire",
        "Part-time",
      ],
      industry: [
        "Engineering",
        "Architecture",
        "Data Centers & Critical Infrastructure",
        "Construction",
        "Telecommunications",
      ],
      job_status: ["draft", "open", "closed"],
      pay_period: ["hour", "year"],
      search_request_status: ["new", "contacted", "active", "closed"],
      user_role: ["candidate", "recruiter", "admin", "employer"],
    },
  },
} as const;
