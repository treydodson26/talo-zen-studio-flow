export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      class_attendance: {
        Row: {
          arketa_booking_id: string | null
          attendance_status: string | null
          booking_date: string | null
          checked_in_at: string | null
          class_id: string
          created_at: string | null
          customer_id: string
          id: string
          notes: string | null
          payment_amount: number | null
          payment_status: string | null
          updated_at: string | null
        }
        Insert: {
          arketa_booking_id?: string | null
          attendance_status?: string | null
          booking_date?: string | null
          checked_in_at?: string | null
          class_id: string
          created_at?: string | null
          customer_id: string
          id?: string
          notes?: string | null
          payment_amount?: number | null
          payment_status?: string | null
          updated_at?: string | null
        }
        Update: {
          arketa_booking_id?: string | null
          attendance_status?: string | null
          booking_date?: string | null
          checked_in_at?: string | null
          class_id?: string
          created_at?: string | null
          customer_id?: string
          id?: string
          notes?: string | null
          payment_amount?: number | null
          payment_status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "class_attendance_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "class_attendance_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      class_types: {
        Row: {
          color_code: string | null
          created_at: string | null
          description: string | null
          difficulty_level: string | null
          duration_minutes: number
          equipment_needed: string[] | null
          id: string
          is_active: boolean | null
          max_capacity: number | null
          name: string
          special_instructions: string | null
          updated_at: string | null
        }
        Insert: {
          color_code?: string | null
          created_at?: string | null
          description?: string | null
          difficulty_level?: string | null
          duration_minutes?: number
          equipment_needed?: string[] | null
          id?: string
          is_active?: boolean | null
          max_capacity?: number | null
          name: string
          special_instructions?: string | null
          updated_at?: string | null
        }
        Update: {
          color_code?: string | null
          created_at?: string | null
          description?: string | null
          difficulty_level?: string | null
          duration_minutes?: number
          equipment_needed?: string[] | null
          id?: string
          is_active?: boolean | null
          max_capacity?: number | null
          name?: string
          special_instructions?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      classes: {
        Row: {
          arketa_class_id: string | null
          cancellation_reason: string | null
          class_date: string
          class_type_id: string
          created_at: string | null
          current_enrollment: number | null
          end_time: string
          id: string
          instructor_id: string | null
          max_capacity: number
          room_location: string | null
          special_notes: string | null
          start_time: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          arketa_class_id?: string | null
          cancellation_reason?: string | null
          class_date: string
          class_type_id: string
          created_at?: string | null
          current_enrollment?: number | null
          end_time: string
          id?: string
          instructor_id?: string | null
          max_capacity: number
          room_location?: string | null
          special_notes?: string | null
          start_time: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          arketa_class_id?: string | null
          cancellation_reason?: string | null
          class_date?: string
          class_type_id?: string
          created_at?: string | null
          current_enrollment?: number | null
          end_time?: string
          id?: string
          instructor_id?: string | null
          max_capacity?: number
          room_location?: string | null
          special_notes?: string | null
          start_time?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "classes_class_type_id_fkey"
            columns: ["class_type_id"]
            isOneToOne: false
            referencedRelation: "class_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "classes_instructor_id_fkey"
            columns: ["instructor_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          Address: string | null
          "Agree to Liability Waiver": string | null
          Birthday: string | null
          "Client Email": string | null
          "Client Name": string | null
          created_at: string | null
          "First Name": string | null
          "First Seen": string | null
          id: string
          "Last Name": string | null
          "Last Seen": string | null
          "Marketing Email Opt-in": string | null
          "Marketing Text Opt In": string | null
          "Phone Number": string | null
          "Pre-Arketa Milestone Count": string | null
          Tags: string | null
          "Transactional Text Opt In": string | null
          updated_at: string | null
        }
        Insert: {
          Address?: string | null
          "Agree to Liability Waiver"?: string | null
          Birthday?: string | null
          "Client Email"?: string | null
          "Client Name"?: string | null
          created_at?: string | null
          "First Name"?: string | null
          "First Seen"?: string | null
          id?: string
          "Last Name"?: string | null
          "Last Seen"?: string | null
          "Marketing Email Opt-in"?: string | null
          "Marketing Text Opt In"?: string | null
          "Phone Number"?: string | null
          "Pre-Arketa Milestone Count"?: string | null
          Tags?: string | null
          "Transactional Text Opt In"?: string | null
          updated_at?: string | null
        }
        Update: {
          Address?: string | null
          "Agree to Liability Waiver"?: string | null
          Birthday?: string | null
          "Client Email"?: string | null
          "Client Name"?: string | null
          created_at?: string | null
          "First Name"?: string | null
          "First Seen"?: string | null
          id?: string
          "Last Name"?: string | null
          "Last Seen"?: string | null
          "Marketing Email Opt-in"?: string | null
          "Marketing Text Opt In"?: string | null
          "Phone Number"?: string | null
          "Pre-Arketa Milestone Count"?: string | null
          Tags?: string | null
          "Transactional Text Opt In"?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      customer_lifecycle_events: {
        Row: {
          created_at: string | null
          customer_id: string
          event_date: string | null
          event_description: string | null
          event_type: string
          id: string
          metadata: Json | null
        }
        Insert: {
          created_at?: string | null
          customer_id: string
          event_date?: string | null
          event_description?: string | null
          event_type: string
          id?: string
          metadata?: Json | null
        }
        Update: {
          created_at?: string | null
          customer_id?: string
          event_date?: string | null
          event_description?: string | null
          event_type?: string
          id?: string
          metadata?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_lifecycle_events_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_notes: {
        Row: {
          author_user_id: string | null
          created_at: string | null
          customer_id: string
          id: string
          is_private: boolean | null
          note_text: string
          note_type: string | null
          updated_at: string | null
        }
        Insert: {
          author_user_id?: string | null
          created_at?: string | null
          customer_id: string
          id?: string
          is_private?: boolean | null
          note_text: string
          note_type?: string | null
          updated_at?: string | null
        }
        Update: {
          author_user_id?: string | null
          created_at?: string | null
          customer_id?: string
          id?: string
          is_private?: boolean | null
          note_text?: string
          note_type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_notes_author_user_id_fkey"
            columns: ["author_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_notes_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          address: string | null
          arketa_id: string | null
          arketa_last_sync: string | null
          birthday: string | null
          created_at: string | null
          customer_segment: string | null
          email: string
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          first_class_date: string | null
          first_name: string
          id: string
          last_class_date: string | null
          last_name: string
          lead_source: string | null
          liability_waiver_signed: boolean | null
          liability_waiver_signed_at: string | null
          lifetime_value: number | null
          marketing_email_opt_in: boolean | null
          marketing_text_opt_in: boolean | null
          phone: string | null
          referral_source: string | null
          tags: string[] | null
          total_classes_attended: number | null
          transactional_text_opt_in: boolean | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          arketa_id?: string | null
          arketa_last_sync?: string | null
          birthday?: string | null
          created_at?: string | null
          customer_segment?: string | null
          email: string
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          first_class_date?: string | null
          first_name: string
          id?: string
          last_class_date?: string | null
          last_name: string
          lead_source?: string | null
          liability_waiver_signed?: boolean | null
          liability_waiver_signed_at?: string | null
          lifetime_value?: number | null
          marketing_email_opt_in?: boolean | null
          marketing_text_opt_in?: boolean | null
          phone?: string | null
          referral_source?: string | null
          tags?: string[] | null
          total_classes_attended?: number | null
          transactional_text_opt_in?: boolean | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          arketa_id?: string | null
          arketa_last_sync?: string | null
          birthday?: string | null
          created_at?: string | null
          customer_segment?: string | null
          email?: string
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          first_class_date?: string | null
          first_name?: string
          id?: string
          last_class_date?: string | null
          last_name?: string
          lead_source?: string | null
          liability_waiver_signed?: boolean | null
          liability_waiver_signed_at?: string | null
          lifetime_value?: number | null
          marketing_email_opt_in?: boolean | null
          marketing_text_opt_in?: boolean | null
          phone?: string | null
          referral_source?: string | null
          tags?: string[] | null
          total_classes_attended?: number | null
          transactional_text_opt_in?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      instructor_availability: {
        Row: {
          availability_type: string | null
          created_at: string | null
          day_of_week: number
          end_time: string
          id: string
          instructor_id: string
          is_recurring: boolean | null
          notes: string | null
          specific_date: string | null
          start_time: string
          updated_at: string | null
        }
        Insert: {
          availability_type?: string | null
          created_at?: string | null
          day_of_week: number
          end_time: string
          id?: string
          instructor_id: string
          is_recurring?: boolean | null
          notes?: string | null
          specific_date?: string | null
          start_time: string
          updated_at?: string | null
        }
        Update: {
          availability_type?: string | null
          created_at?: string | null
          day_of_week?: number
          end_time?: string
          id?: string
          instructor_id?: string
          is_recurring?: boolean | null
          notes?: string | null
          specific_date?: string | null
          start_time?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "instructor_availability_instructor_id_fkey"
            columns: ["instructor_id"]
            isOneToOne: false
            referencedRelation: "instructors"
            referencedColumns: ["id"]
          },
        ]
      }
      instructor_payments: {
        Row: {
          base_amount: number
          bonus_amount: number | null
          class_id: string | null
          created_at: string | null
          gusto_payment_id: string | null
          id: string
          instructor_id: string
          notes: string | null
          payment_date: string | null
          payment_method: string | null
          payment_period_end: string
          payment_period_start: string
          payment_status: string | null
          per_student_amount: number
          student_count: number
          substitute_multiplier: number | null
          total_amount: number
          updated_at: string | null
        }
        Insert: {
          base_amount?: number
          bonus_amount?: number | null
          class_id?: string | null
          created_at?: string | null
          gusto_payment_id?: string | null
          id?: string
          instructor_id: string
          notes?: string | null
          payment_date?: string | null
          payment_method?: string | null
          payment_period_end: string
          payment_period_start: string
          payment_status?: string | null
          per_student_amount?: number
          student_count?: number
          substitute_multiplier?: number | null
          total_amount: number
          updated_at?: string | null
        }
        Update: {
          base_amount?: number
          bonus_amount?: number | null
          class_id?: string | null
          created_at?: string | null
          gusto_payment_id?: string | null
          id?: string
          instructor_id?: string
          notes?: string | null
          payment_date?: string | null
          payment_method?: string | null
          payment_period_end?: string
          payment_period_start?: string
          payment_status?: string | null
          per_student_amount?: number
          student_count?: number
          substitute_multiplier?: number | null
          total_amount?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "instructor_payments_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "instructor_payments_instructor_id_fkey"
            columns: ["instructor_id"]
            isOneToOne: false
            referencedRelation: "instructors"
            referencedColumns: ["id"]
          },
        ]
      }
      instructors: {
        Row: {
          base_rate: number
          bio: string | null
          certifications: Json | null
          contract_end_date: string | null
          contract_start_date: string | null
          created_at: string | null
          default_availability: Json | null
          id: string
          is_active: boolean | null
          max_classes_per_week: number | null
          min_notice_hours: number | null
          per_student_rate: number
          preferred_class_types: string[] | null
          preferred_contact_method: string | null
          specialties: string[] | null
          substitute_multiplier: number | null
          travel_radius_miles: number | null
          updated_at: string | null
          user_id: string | null
          w9_submitted: boolean | null
        }
        Insert: {
          base_rate?: number
          bio?: string | null
          certifications?: Json | null
          contract_end_date?: string | null
          contract_start_date?: string | null
          created_at?: string | null
          default_availability?: Json | null
          id?: string
          is_active?: boolean | null
          max_classes_per_week?: number | null
          min_notice_hours?: number | null
          per_student_rate?: number
          preferred_class_types?: string[] | null
          preferred_contact_method?: string | null
          specialties?: string[] | null
          substitute_multiplier?: number | null
          travel_radius_miles?: number | null
          updated_at?: string | null
          user_id?: string | null
          w9_submitted?: boolean | null
        }
        Update: {
          base_rate?: number
          bio?: string | null
          certifications?: Json | null
          contract_end_date?: string | null
          contract_start_date?: string | null
          created_at?: string | null
          default_availability?: Json | null
          id?: string
          is_active?: boolean | null
          max_classes_per_week?: number | null
          min_notice_hours?: number | null
          per_student_rate?: number
          preferred_class_types?: string[] | null
          preferred_contact_method?: string | null
          specialties?: string[] | null
          substitute_multiplier?: number | null
          travel_radius_miles?: number | null
          updated_at?: string | null
          user_id?: string | null
          w9_submitted?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "instructors_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_activities: {
        Row: {
          activity_date: string | null
          activity_description: string
          activity_type: string
          completed: boolean | null
          created_at: string | null
          id: string
          lead_id: string
          next_action: string | null
          outcome: string | null
          scheduled_follow_up: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          activity_date?: string | null
          activity_description: string
          activity_type: string
          completed?: boolean | null
          created_at?: string | null
          id?: string
          lead_id: string
          next_action?: string | null
          outcome?: string | null
          scheduled_follow_up?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          activity_date?: string | null
          activity_description?: string
          activity_type?: string
          completed?: boolean | null
          created_at?: string | null
          id?: string
          lead_id?: string
          next_action?: string | null
          outcome?: string | null
          scheduled_follow_up?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lead_activities_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_activities_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          assigned_staff: string | null
          contacted_at: string | null
          conversion_probability: number | null
          converted_at: string | null
          created_at: string
          email: string
          estimated_value: number | null
          id: string
          interests: string | null
          name: string
          notes: string | null
          phone: string | null
          source: string | null
          stage: string | null
          updated_at: string
        }
        Insert: {
          assigned_staff?: string | null
          contacted_at?: string | null
          conversion_probability?: number | null
          converted_at?: string | null
          created_at?: string
          email: string
          estimated_value?: number | null
          id?: string
          interests?: string | null
          name: string
          notes?: string | null
          phone?: string | null
          source?: string | null
          stage?: string | null
          updated_at?: string
        }
        Update: {
          assigned_staff?: string | null
          contacted_at?: string | null
          conversion_probability?: number | null
          converted_at?: string | null
          created_at?: string
          email?: string
          estimated_value?: number | null
          id?: string
          interests?: string | null
          name?: string
          notes?: string | null
          phone?: string | null
          source?: string | null
          stage?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      substitute_requests: {
        Row: {
          class_id: string
          created_at: string | null
          filled_at: string | null
          filled_by_instructor_id: string | null
          id: string
          min_notice_provided_hours: number | null
          reason: string | null
          requesting_instructor_id: string
          special_requirements: string | null
          status: string | null
          substitute_rate_multiplier: number | null
          updated_at: string | null
          urgency_level: string | null
        }
        Insert: {
          class_id: string
          created_at?: string | null
          filled_at?: string | null
          filled_by_instructor_id?: string | null
          id?: string
          min_notice_provided_hours?: number | null
          reason?: string | null
          requesting_instructor_id: string
          special_requirements?: string | null
          status?: string | null
          substitute_rate_multiplier?: number | null
          updated_at?: string | null
          urgency_level?: string | null
        }
        Update: {
          class_id?: string
          created_at?: string | null
          filled_at?: string | null
          filled_by_instructor_id?: string | null
          id?: string
          min_notice_provided_hours?: number | null
          reason?: string | null
          requesting_instructor_id?: string
          special_requirements?: string | null
          status?: string | null
          substitute_rate_multiplier?: number | null
          updated_at?: string | null
          urgency_level?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "substitute_requests_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "substitute_requests_filled_by_instructor_id_fkey"
            columns: ["filled_by_instructor_id"]
            isOneToOne: false
            referencedRelation: "instructors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "substitute_requests_requesting_instructor_id_fkey"
            columns: ["requesting_instructor_id"]
            isOneToOne: false
            referencedRelation: "instructors"
            referencedColumns: ["id"]
          },
        ]
      }
      substitute_responses: {
        Row: {
          availability_confirmed: boolean | null
          created_at: string | null
          id: string
          notes: string | null
          responding_instructor_id: string
          response: string
          response_time: string | null
          substitute_request_id: string
        }
        Insert: {
          availability_confirmed?: boolean | null
          created_at?: string | null
          id?: string
          notes?: string | null
          responding_instructor_id: string
          response: string
          response_time?: string | null
          substitute_request_id: string
        }
        Update: {
          availability_confirmed?: boolean | null
          created_at?: string | null
          id?: string
          notes?: string | null
          responding_instructor_id?: string
          response?: string
          response_time?: string | null
          substitute_request_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "substitute_responses_responding_instructor_id_fkey"
            columns: ["responding_instructor_id"]
            isOneToOne: false
            referencedRelation: "instructors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "substitute_responses_substitute_request_id_fkey"
            columns: ["substitute_request_id"]
            isOneToOne: false
            referencedRelation: "substitute_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      user_sessions: {
        Row: {
          created_at: string | null
          device_info: Json | null
          expires_at: string
          id: string
          ip_address: unknown | null
          last_activity_at: string | null
          session_token: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          device_info?: Json | null
          expires_at: string
          id?: string
          ip_address?: unknown | null
          last_activity_at?: string | null
          session_token: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          device_info?: Json | null
          expires_at?: string
          id?: string
          ip_address?: unknown | null
          last_activity_at?: string | null
          session_token?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          full_name: string
          id: string
          is_active: boolean | null
          last_login_at: string | null
          password_hash: string | null
          phone: string | null
          profile_image_url: string | null
          role: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          full_name: string
          id?: string
          is_active?: boolean | null
          last_login_at?: string | null
          password_hash?: string | null
          phone?: string | null
          profile_image_url?: string | null
          role: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          full_name?: string
          id?: string
          is_active?: boolean | null
          last_login_at?: string | null
          password_hash?: string | null
          phone?: string | null
          profile_image_url?: string | null
          role?: string
          updated_at?: string | null
        }
        Relationships: []
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
