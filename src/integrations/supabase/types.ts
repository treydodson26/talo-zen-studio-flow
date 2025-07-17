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
      attachments: {
        Row: {
          attachment_name: string | null
          created_at: string | null
          id: string
          message_id: string
          url: string | null
        }
        Insert: {
          attachment_name?: string | null
          created_at?: string | null
          id?: string
          message_id: string
          url?: string | null
        }
        Update: {
          attachment_name?: string | null
          created_at?: string | null
          id?: string
          message_id?: string
          url?: string | null
        }
        Relationships: []
      }
      campaign_performance: {
        Row: {
          campaign_end_time: string | null
          campaign_id: string
          campaign_start_time: string | null
          click_rate: number | null
          conversion_rate: number | null
          conversions: number | null
          created_at: string | null
          delivery_rate: number | null
          emails_bounced: number | null
          emails_delivered: number | null
          emails_failed: number | null
          emails_sent: number | null
          id: string
          last_updated: string | null
          open_rate: number | null
          revenue_generated: number | null
          spam_reports: number | null
          total_clicks: number | null
          total_opens: number | null
          total_recipients: number | null
          unique_clicks: number | null
          unique_opens: number | null
          unsubscribes: number | null
        }
        Insert: {
          campaign_end_time?: string | null
          campaign_id: string
          campaign_start_time?: string | null
          click_rate?: number | null
          conversion_rate?: number | null
          conversions?: number | null
          created_at?: string | null
          delivery_rate?: number | null
          emails_bounced?: number | null
          emails_delivered?: number | null
          emails_failed?: number | null
          emails_sent?: number | null
          id?: string
          last_updated?: string | null
          open_rate?: number | null
          revenue_generated?: number | null
          spam_reports?: number | null
          total_clicks?: number | null
          total_opens?: number | null
          total_recipients?: number | null
          unique_clicks?: number | null
          unique_opens?: number | null
          unsubscribes?: number | null
        }
        Update: {
          campaign_end_time?: string | null
          campaign_id?: string
          campaign_start_time?: string | null
          click_rate?: number | null
          conversion_rate?: number | null
          conversions?: number | null
          created_at?: string | null
          delivery_rate?: number | null
          emails_bounced?: number | null
          emails_delivered?: number | null
          emails_failed?: number | null
          emails_sent?: number | null
          id?: string
          last_updated?: string | null
          open_rate?: number | null
          revenue_generated?: number | null
          spam_reports?: number | null
          total_clicks?: number | null
          total_opens?: number | null
          total_recipients?: number | null
          unique_clicks?: number | null
          unique_opens?: number | null
          unsubscribes?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "campaign_performance_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "marketing_campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
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
            foreignKeyName: "class_attendance_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "upcoming_classes_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "class_attendance_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customer_summary"
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
            referencedRelation: "instructor_dashboard_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "classes_instructor_id_fkey"
            columns: ["instructor_id"]
            isOneToOne: false
            referencedRelation: "instructors"
            referencedColumns: ["id"]
          },
        ]
      }
      client_imports: {
        Row: {
          Address: string | null
          "Agree to Liability Waiver": boolean | null
          Birthday: string | null
          "Client Email": string | null
          "Client Name": string | null
          created_at: string | null
          "First Name": string | null
          "First Seen": string | null
          id: number
          "Last Name": string | null
          "Last Seen": string | null
          "Marketing Email Opt-in": boolean | null
          "Marketing Text Opt In": boolean | null
          "Phone Number": string | null
          "Pre-Arketa Milestone Count": number | null
          Tags: string | null
          "Transactional Text Opt In": boolean | null
          updated_at: string | null
        }
        Insert: {
          Address?: string | null
          "Agree to Liability Waiver"?: boolean | null
          Birthday?: string | null
          "Client Email"?: string | null
          "Client Name"?: string | null
          created_at?: string | null
          "First Name"?: string | null
          "First Seen"?: string | null
          id?: number
          "Last Name"?: string | null
          "Last Seen"?: string | null
          "Marketing Email Opt-in"?: boolean | null
          "Marketing Text Opt In"?: boolean | null
          "Phone Number"?: string | null
          "Pre-Arketa Milestone Count"?: number | null
          Tags?: string | null
          "Transactional Text Opt In"?: boolean | null
          updated_at?: string | null
        }
        Update: {
          Address?: string | null
          "Agree to Liability Waiver"?: boolean | null
          Birthday?: string | null
          "Client Email"?: string | null
          "Client Name"?: string | null
          created_at?: string | null
          "First Name"?: string | null
          "First Seen"?: string | null
          id?: number
          "Last Name"?: string | null
          "Last Seen"?: string | null
          "Marketing Email Opt-in"?: boolean | null
          "Marketing Text Opt In"?: boolean | null
          "Phone Number"?: string | null
          "Pre-Arketa Milestone Count"?: number | null
          Tags?: string | null
          "Transactional Text Opt In"?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
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
      communication_preferences: {
        Row: {
          class_reminders_email: boolean | null
          class_reminders_sms: boolean | null
          created_at: string | null
          customer_id: string
          emergency_notifications: boolean | null
          global_opt_out: boolean | null
          id: string
          marketing_emails: boolean | null
          marketing_sms: boolean | null
          max_marketing_emails_per_week: number | null
          max_marketing_sms_per_month: number | null
          newsletter: boolean | null
          opt_out_date: string | null
          opt_out_reason: string | null
          preferred_contact_hours_end: string | null
          preferred_contact_hours_start: string | null
          timezone: string | null
          transactional_emails: boolean | null
          transactional_sms: boolean | null
          updated_at: string | null
        }
        Insert: {
          class_reminders_email?: boolean | null
          class_reminders_sms?: boolean | null
          created_at?: string | null
          customer_id: string
          emergency_notifications?: boolean | null
          global_opt_out?: boolean | null
          id?: string
          marketing_emails?: boolean | null
          marketing_sms?: boolean | null
          max_marketing_emails_per_week?: number | null
          max_marketing_sms_per_month?: number | null
          newsletter?: boolean | null
          opt_out_date?: string | null
          opt_out_reason?: string | null
          preferred_contact_hours_end?: string | null
          preferred_contact_hours_start?: string | null
          timezone?: string | null
          transactional_emails?: boolean | null
          transactional_sms?: boolean | null
          updated_at?: string | null
        }
        Update: {
          class_reminders_email?: boolean | null
          class_reminders_sms?: boolean | null
          created_at?: string | null
          customer_id?: string
          emergency_notifications?: boolean | null
          global_opt_out?: boolean | null
          id?: string
          marketing_emails?: boolean | null
          marketing_sms?: boolean | null
          max_marketing_emails_per_week?: number | null
          max_marketing_sms_per_month?: number | null
          newsletter?: boolean | null
          opt_out_date?: string | null
          opt_out_reason?: string | null
          preferred_contact_hours_end?: string | null
          preferred_contact_hours_start?: string | null
          timezone?: string | null
          transactional_emails?: boolean | null
          transactional_sms?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "communication_preferences_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: true
            referencedRelation: "customer_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "communication_preferences_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: true
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      communication_sequences: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          sequence_type: string
          target_customer_segment: string[] | null
          target_lead_stage: string[] | null
          total_steps: number
          trigger_event: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          sequence_type: string
          target_customer_segment?: string[] | null
          target_lead_stage?: string[] | null
          total_steps?: number
          trigger_event: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          sequence_type?: string
          target_customer_segment?: string[] | null
          target_lead_stage?: string[] | null
          total_steps?: number
          trigger_event?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "communication_sequences_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      communication_templates: {
        Row: {
          category: string
          content_html: string | null
          content_text: string
          created_at: string | null
          created_by: string | null
          id: string
          is_active: boolean | null
          is_automated: boolean | null
          name: string
          parent_template_id: string | null
          send_delay_hours: number | null
          subject_line: string | null
          template_type: string
          trigger_event: string | null
          updated_at: string | null
          variables_available: string[] | null
          version: string | null
        }
        Insert: {
          category: string
          content_html?: string | null
          content_text: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          is_automated?: boolean | null
          name: string
          parent_template_id?: string | null
          send_delay_hours?: number | null
          subject_line?: string | null
          template_type: string
          trigger_event?: string | null
          updated_at?: string | null
          variables_available?: string[] | null
          version?: string | null
        }
        Update: {
          category?: string
          content_html?: string | null
          content_text?: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          is_automated?: boolean | null
          name?: string
          parent_template_id?: string | null
          send_delay_hours?: number | null
          subject_line?: string | null
          template_type?: string
          trigger_event?: string | null
          updated_at?: string | null
          variables_available?: string[] | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "communication_templates_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "communication_templates_parent_template_id_fkey"
            columns: ["parent_template_id"]
            isOneToOne: false
            referencedRelation: "communication_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      communications_sent: {
        Row: {
          clicked_at: string | null
          communication_type: string
          content_html: string | null
          content_text: string
          created_at: string | null
          customer_id: string | null
          delivered_at: string | null
          failed_at: string | null
          failure_reason: string | null
          id: string
          instructor_id: string | null
          lead_id: string | null
          opened_at: string | null
          replied_at: string | null
          sendgrid_message_id: string | null
          sent_at: string | null
          sequence_id: string | null
          sequence_step_id: string | null
          status: string | null
          subject_line: string | null
          template_id: string | null
          twilio_message_sid: string | null
          unsubscribed_at: string | null
        }
        Insert: {
          clicked_at?: string | null
          communication_type: string
          content_html?: string | null
          content_text: string
          created_at?: string | null
          customer_id?: string | null
          delivered_at?: string | null
          failed_at?: string | null
          failure_reason?: string | null
          id?: string
          instructor_id?: string | null
          lead_id?: string | null
          opened_at?: string | null
          replied_at?: string | null
          sendgrid_message_id?: string | null
          sent_at?: string | null
          sequence_id?: string | null
          sequence_step_id?: string | null
          status?: string | null
          subject_line?: string | null
          template_id?: string | null
          twilio_message_sid?: string | null
          unsubscribed_at?: string | null
        }
        Update: {
          clicked_at?: string | null
          communication_type?: string
          content_html?: string | null
          content_text?: string
          created_at?: string | null
          customer_id?: string | null
          delivered_at?: string | null
          failed_at?: string | null
          failure_reason?: string | null
          id?: string
          instructor_id?: string | null
          lead_id?: string | null
          opened_at?: string | null
          replied_at?: string | null
          sendgrid_message_id?: string | null
          sent_at?: string | null
          sequence_id?: string | null
          sequence_step_id?: string | null
          status?: string | null
          subject_line?: string | null
          template_id?: string | null
          twilio_message_sid?: string | null
          unsubscribed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "communications_sent_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customer_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "communications_sent_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "communications_sent_instructor_id_fkey"
            columns: ["instructor_id"]
            isOneToOne: false
            referencedRelation: "instructor_dashboard_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "communications_sent_instructor_id_fkey"
            columns: ["instructor_id"]
            isOneToOne: false
            referencedRelation: "instructors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "communications_sent_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "communications_sent_sequence_id_fkey"
            columns: ["sequence_id"]
            isOneToOne: false
            referencedRelation: "communication_sequences"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "communications_sent_sequence_step_id_fkey"
            columns: ["sequence_step_id"]
            isOneToOne: false
            referencedRelation: "sequence_steps"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "communications_sent_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "communication_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      contacts: {
        Row: {
          created_at: string | null
          email: string
          email_messages: string[] | null
          id: string
          name: string | null
          role: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          email_messages?: string[] | null
          id?: string
          name?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          email_messages?: string[] | null
          id?: string
          name?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      conversation_log: {
        Row: {
          id: string
          incoming_message: string
          lead_id: string | null
          outgoing_response: string
          timestamp: string | null
        }
        Insert: {
          id?: string
          incoming_message: string
          lead_id?: string | null
          outgoing_response: string
          timestamp?: string | null
        }
        Update: {
          id?: string
          incoming_message?: string
          lead_id?: string | null
          outgoing_response?: string
          timestamp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conversation_log_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
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
            referencedRelation: "customer_summary"
            referencedColumns: ["id"]
          },
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
            referencedRelation: "customer_summary"
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
      daily_imports: {
        Row: {
          created_at: string | null
          error_count: number | null
          file_name: string | null
          file_path: string | null
          id: string
          import_date: string
          processed_count: number | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          error_count?: number | null
          file_name?: string | null
          file_path?: string | null
          id?: string
          import_date: string
          processed_count?: number | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          error_count?: number | null
          file_name?: string | null
          file_path?: string | null
          id?: string
          import_date?: string
          processed_count?: number | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      daily_metrics: {
        Row: {
          active_customers_count: number | null
          app_sessions: number | null
          cancelled_classes_count: number | null
          churned_customers_count: number | null
          class_utilization_rate: number | null
          created_at: string | null
          customer_lifetime_value_avg: number | null
          email_click_rate: number | null
          email_open_rate: number | null
          emails_sent_count: number | null
          id: string
          instructor_payroll_total: number | null
          instructor_utilization_rate: number | null
          lead_conversion_count: number | null
          lead_conversion_rate: number | null
          metric_date: string
          new_customers_count: number | null
          new_leads_count: number | null
          online_bookings_count: number | null
          revenue_per_customer: number | null
          sms_sent_count: number | null
          substitute_filled_rate: number | null
          substitute_requests_count: number | null
          total_class_attendance: number | null
          total_classes_completed: number | null
          total_classes_scheduled: number | null
          total_revenue: number | null
          updated_at: string | null
          website_visits: number | null
        }
        Insert: {
          active_customers_count?: number | null
          app_sessions?: number | null
          cancelled_classes_count?: number | null
          churned_customers_count?: number | null
          class_utilization_rate?: number | null
          created_at?: string | null
          customer_lifetime_value_avg?: number | null
          email_click_rate?: number | null
          email_open_rate?: number | null
          emails_sent_count?: number | null
          id?: string
          instructor_payroll_total?: number | null
          instructor_utilization_rate?: number | null
          lead_conversion_count?: number | null
          lead_conversion_rate?: number | null
          metric_date: string
          new_customers_count?: number | null
          new_leads_count?: number | null
          online_bookings_count?: number | null
          revenue_per_customer?: number | null
          sms_sent_count?: number | null
          substitute_filled_rate?: number | null
          substitute_requests_count?: number | null
          total_class_attendance?: number | null
          total_classes_completed?: number | null
          total_classes_scheduled?: number | null
          total_revenue?: number | null
          updated_at?: string | null
          website_visits?: number | null
        }
        Update: {
          active_customers_count?: number | null
          app_sessions?: number | null
          cancelled_classes_count?: number | null
          churned_customers_count?: number | null
          class_utilization_rate?: number | null
          created_at?: string | null
          customer_lifetime_value_avg?: number | null
          email_click_rate?: number | null
          email_open_rate?: number | null
          emails_sent_count?: number | null
          id?: string
          instructor_payroll_total?: number | null
          instructor_utilization_rate?: number | null
          lead_conversion_count?: number | null
          lead_conversion_rate?: number | null
          metric_date?: string
          new_customers_count?: number | null
          new_leads_count?: number | null
          online_bookings_count?: number | null
          revenue_per_customer?: number | null
          sms_sent_count?: number | null
          substitute_filled_rate?: number | null
          substitute_requests_count?: number | null
          total_class_attendance?: number | null
          total_classes_completed?: number | null
          total_classes_scheduled?: number | null
          total_revenue?: number | null
          updated_at?: string | null
          website_visits?: number | null
        }
        Relationships: []
      }
      emails: {
        Row: {
          body: string | null
          created_at: string | null
          date: string | null
          id: string
          labels: string[] | null
          message_id: string
          processed: boolean | null
          subject: string | null
          updated_at: string | null
        }
        Insert: {
          body?: string | null
          created_at?: string | null
          date?: string | null
          id?: string
          labels?: string[] | null
          message_id: string
          processed?: boolean | null
          subject?: string | null
          updated_at?: string | null
        }
        Update: {
          body?: string | null
          created_at?: string | null
          date?: string | null
          id?: string
          labels?: string[] | null
          message_id?: string
          processed?: boolean | null
          subject?: string | null
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
            referencedRelation: "instructor_dashboard_view"
            referencedColumns: ["id"]
          },
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
            foreignKeyName: "instructor_payments_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "upcoming_classes_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "instructor_payments_instructor_id_fkey"
            columns: ["instructor_id"]
            isOneToOne: false
            referencedRelation: "instructor_dashboard_view"
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
      integration_logs: {
        Row: {
          affected_entities: string[] | null
          completed_at: string | null
          created_at: string | null
          duration_ms: number | null
          endpoint_url: string | null
          error_code: string | null
          error_message: string | null
          http_method: string | null
          id: string
          integration_name: string
          operation_direction: string
          operation_type: string
          records_failed: number | null
          records_processed: number | null
          records_success: number | null
          request_id: string | null
          request_payload: Json | null
          response_payload: Json | null
          retry_count: number | null
          started_at: string | null
          status: string
        }
        Insert: {
          affected_entities?: string[] | null
          completed_at?: string | null
          created_at?: string | null
          duration_ms?: number | null
          endpoint_url?: string | null
          error_code?: string | null
          error_message?: string | null
          http_method?: string | null
          id?: string
          integration_name: string
          operation_direction: string
          operation_type: string
          records_failed?: number | null
          records_processed?: number | null
          records_success?: number | null
          request_id?: string | null
          request_payload?: Json | null
          response_payload?: Json | null
          retry_count?: number | null
          started_at?: string | null
          status: string
        }
        Update: {
          affected_entities?: string[] | null
          completed_at?: string | null
          created_at?: string | null
          duration_ms?: number | null
          endpoint_url?: string | null
          error_code?: string | null
          error_message?: string | null
          http_method?: string | null
          id?: string
          integration_name?: string
          operation_direction?: string
          operation_type?: string
          records_failed?: number | null
          records_processed?: number | null
          records_success?: number | null
          request_id?: string | null
          request_payload?: Json | null
          response_payload?: Json | null
          retry_count?: number | null
          started_at?: string | null
          status?: string
        }
        Relationships: []
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
          current_day: number | null
          email: string
          estimated_value: number | null
          first_class_date: string | null
          first_name: string | null
          full_name: string | null
          id: string
          interests: string | null
          last_message_date: string | null
          last_message_sent_day: number | null
          messages_sent: string[] | null
          name: string
          notes: string | null
          phone: string | null
          source: string | null
          stage: string | null
          trial_end_date: string | null
          trial_start_date: string | null
          trial_status: string | null
          updated_at: string
        }
        Insert: {
          assigned_staff?: string | null
          contacted_at?: string | null
          conversion_probability?: number | null
          converted_at?: string | null
          created_at?: string
          current_day?: number | null
          email: string
          estimated_value?: number | null
          first_class_date?: string | null
          first_name?: string | null
          full_name?: string | null
          id?: string
          interests?: string | null
          last_message_date?: string | null
          last_message_sent_day?: number | null
          messages_sent?: string[] | null
          name: string
          notes?: string | null
          phone?: string | null
          source?: string | null
          stage?: string | null
          trial_end_date?: string | null
          trial_start_date?: string | null
          trial_status?: string | null
          updated_at?: string
        }
        Update: {
          assigned_staff?: string | null
          contacted_at?: string | null
          conversion_probability?: number | null
          converted_at?: string | null
          created_at?: string
          current_day?: number | null
          email?: string
          estimated_value?: number | null
          first_class_date?: string | null
          first_name?: string | null
          full_name?: string | null
          id?: string
          interests?: string | null
          last_message_date?: string | null
          last_message_sent_day?: number | null
          messages_sent?: string[] | null
          name?: string
          notes?: string | null
          phone?: string | null
          source?: string | null
          stage?: string | null
          trial_end_date?: string | null
          trial_start_date?: string | null
          trial_status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      marketing_campaigns: {
        Row: {
          ab_test_duration_hours: number | null
          ab_test_percentage: number | null
          ab_winner_criteria: string | null
          actual_send_date: string | null
          campaign_type: string
          content_html: string | null
          content_text: string | null
          created_at: string | null
          created_by: string | null
          exclude_segments: string[] | null
          id: string
          is_ab_test: boolean | null
          name: string
          preview_text: string | null
          scheduled_send_date: string | null
          send_immediately: boolean | null
          send_timezone: string | null
          status: string | null
          subject_line: string
          target_segments: string[] | null
          target_tags: string[] | null
          track_clicks: boolean | null
          track_opens: boolean | null
          updated_at: string | null
        }
        Insert: {
          ab_test_duration_hours?: number | null
          ab_test_percentage?: number | null
          ab_winner_criteria?: string | null
          actual_send_date?: string | null
          campaign_type: string
          content_html?: string | null
          content_text?: string | null
          created_at?: string | null
          created_by?: string | null
          exclude_segments?: string[] | null
          id?: string
          is_ab_test?: boolean | null
          name: string
          preview_text?: string | null
          scheduled_send_date?: string | null
          send_immediately?: boolean | null
          send_timezone?: string | null
          status?: string | null
          subject_line: string
          target_segments?: string[] | null
          target_tags?: string[] | null
          track_clicks?: boolean | null
          track_opens?: boolean | null
          updated_at?: string | null
        }
        Update: {
          ab_test_duration_hours?: number | null
          ab_test_percentage?: number | null
          ab_winner_criteria?: string | null
          actual_send_date?: string | null
          campaign_type?: string
          content_html?: string | null
          content_text?: string | null
          created_at?: string | null
          created_by?: string | null
          exclude_segments?: string[] | null
          id?: string
          is_ab_test?: boolean | null
          name?: string
          preview_text?: string | null
          scheduled_send_date?: string | null
          send_immediately?: boolean | null
          send_timezone?: string | null
          status?: string | null
          subject_line?: string
          target_segments?: string[] | null
          target_tags?: string[] | null
          track_clicks?: boolean | null
          track_opens?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "marketing_campaigns_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      message_history: {
        Row: {
          channel: string | null
          content: string
          day_number: number | null
          id: string
          lead_id: string | null
          message_type: string
          sent_at: string | null
          subject: string | null
        }
        Insert: {
          channel?: string | null
          content: string
          day_number?: number | null
          id?: string
          lead_id?: string | null
          message_type: string
          sent_at?: string | null
          subject?: string | null
        }
        Update: {
          channel?: string | null
          content?: string
          day_number?: number | null
          id?: string
          lead_id?: string | null
          message_type?: string
          sent_at?: string | null
          subject?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "message_history_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      message_sequences: {
        Row: {
          created_at: string | null
          day_number: number
          id: string
          is_active: boolean | null
          message_template: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          day_number: number
          id?: string
          is_active?: boolean | null
          message_template: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          day_number?: number
          id?: string
          is_active?: boolean | null
          message_template?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      message_templates: {
        Row: {
          active: boolean | null
          body: string
          channel: string | null
          created_at: string | null
          day_number: number | null
          id: string
          subject: string | null
          template_key: string
        }
        Insert: {
          active?: boolean | null
          body: string
          channel?: string | null
          created_at?: string | null
          day_number?: number | null
          id?: string
          subject?: string | null
          template_key: string
        }
        Update: {
          active?: boolean | null
          body?: string
          channel?: string | null
          created_at?: string | null
          day_number?: number | null
          id?: string
          subject?: string | null
          template_key?: string
        }
        Relationships: []
      }
      playbook: {
        Row: {
          active: boolean | null
          agent: string | null
          created_at: string | null
          description: string | null
          id: string
          name: string
          prompt: string | null
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          agent?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          prompt?: string | null
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          agent?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          prompt?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      scheduled_reports: {
        Row: {
          created_at: string | null
          created_by: string | null
          custom_filters: Json | null
          date_range_days: number | null
          day_of_month: number | null
          day_of_week: number | null
          frequency: string
          id: string
          include_charts: boolean | null
          include_raw_data: boolean | null
          is_active: boolean | null
          last_sent_at: string | null
          next_send_at: string | null
          recipient_emails: string[]
          recipient_user_ids: string[] | null
          report_name: string
          report_type: string
          send_time: string | null
          timezone: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          custom_filters?: Json | null
          date_range_days?: number | null
          day_of_month?: number | null
          day_of_week?: number | null
          frequency: string
          id?: string
          include_charts?: boolean | null
          include_raw_data?: boolean | null
          is_active?: boolean | null
          last_sent_at?: string | null
          next_send_at?: string | null
          recipient_emails: string[]
          recipient_user_ids?: string[] | null
          report_name: string
          report_type: string
          send_time?: string | null
          timezone?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          custom_filters?: Json | null
          date_range_days?: number | null
          day_of_month?: number | null
          day_of_week?: number | null
          frequency?: string
          id?: string
          include_charts?: boolean | null
          include_raw_data?: boolean | null
          is_active?: boolean | null
          last_sent_at?: string | null
          next_send_at?: string | null
          recipient_emails?: string[]
          recipient_user_ids?: string[] | null
          report_name?: string
          report_type?: string
          send_time?: string | null
          timezone?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "scheduled_reports_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      sent_messages: {
        Row: {
          created_at: string | null
          delivery_status: string | null
          id: string
          lead_id: string
          message_content: string
          phone_number: string
          sent_at: string | null
          sequence_day: number
          whatsapp_message_id: string | null
        }
        Insert: {
          created_at?: string | null
          delivery_status?: string | null
          id?: string
          lead_id: string
          message_content: string
          phone_number: string
          sent_at?: string | null
          sequence_day: number
          whatsapp_message_id?: string | null
        }
        Update: {
          created_at?: string | null
          delivery_status?: string | null
          id?: string
          lead_id?: string
          message_content?: string
          phone_number?: string
          sent_at?: string | null
          sequence_day?: number
          whatsapp_message_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sent_messages_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      sequence_steps: {
        Row: {
          created_at: string | null
          delay_days: number
          delay_hours: number
          id: string
          is_active: boolean | null
          send_conditions: Json | null
          send_time: string | null
          sequence_id: string
          skip_conditions: Json | null
          step_number: number
          template_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          delay_days?: number
          delay_hours?: number
          id?: string
          is_active?: boolean | null
          send_conditions?: Json | null
          send_time?: string | null
          sequence_id: string
          skip_conditions?: Json | null
          step_number: number
          template_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          delay_days?: number
          delay_hours?: number
          id?: string
          is_active?: boolean | null
          send_conditions?: Json | null
          send_time?: string | null
          sequence_id?: string
          skip_conditions?: Json | null
          step_number?: number
          template_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sequence_steps_sequence_id_fkey"
            columns: ["sequence_id"]
            isOneToOne: false
            referencedRelation: "communication_sequences"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sequence_steps_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "communication_templates"
            referencedColumns: ["id"]
          },
        ]
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
            foreignKeyName: "substitute_requests_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "upcoming_classes_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "substitute_requests_filled_by_instructor_id_fkey"
            columns: ["filled_by_instructor_id"]
            isOneToOne: false
            referencedRelation: "instructor_dashboard_view"
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
            referencedRelation: "instructor_dashboard_view"
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
            referencedRelation: "instructor_dashboard_view"
            referencedColumns: ["id"]
          },
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
      system_settings: {
        Row: {
          allowed_values: string[] | null
          created_at: string | null
          default_value: string | null
          description: string | null
          environment: string | null
          id: string
          is_required: boolean | null
          is_sensitive: boolean | null
          last_modified_by: string | null
          requires_admin: boolean | null
          setting_category: string
          setting_key: string
          setting_type: string | null
          setting_value: string | null
          updated_at: string | null
          validation_regex: string | null
        }
        Insert: {
          allowed_values?: string[] | null
          created_at?: string | null
          default_value?: string | null
          description?: string | null
          environment?: string | null
          id?: string
          is_required?: boolean | null
          is_sensitive?: boolean | null
          last_modified_by?: string | null
          requires_admin?: boolean | null
          setting_category: string
          setting_key: string
          setting_type?: string | null
          setting_value?: string | null
          updated_at?: string | null
          validation_regex?: string | null
        }
        Update: {
          allowed_values?: string[] | null
          created_at?: string | null
          default_value?: string | null
          description?: string | null
          environment?: string | null
          id?: string
          is_required?: boolean | null
          is_sensitive?: boolean | null
          last_modified_by?: string | null
          requires_admin?: boolean | null
          setting_category?: string
          setting_key?: string
          setting_type?: string | null
          setting_value?: string | null
          updated_at?: string | null
          validation_regex?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "system_settings_last_modified_by_fkey"
            columns: ["last_modified_by"]
            isOneToOne: false
            referencedRelation: "users"
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
      webhook_events: {
        Row: {
          actions_performed: string[] | null
          created_at: string | null
          entities_updated: string[] | null
          error_message: string | null
          event_data: Json
          event_id: string | null
          event_type: string
          headers: Json | null
          id: string
          idempotency_key: string | null
          processed_at: string | null
          processing_attempts: number | null
          processing_result: Json | null
          processing_status: string | null
          received_at: string | null
          source_system: string
          updated_at: string | null
        }
        Insert: {
          actions_performed?: string[] | null
          created_at?: string | null
          entities_updated?: string[] | null
          error_message?: string | null
          event_data: Json
          event_id?: string | null
          event_type: string
          headers?: Json | null
          id?: string
          idempotency_key?: string | null
          processed_at?: string | null
          processing_attempts?: number | null
          processing_result?: Json | null
          processing_status?: string | null
          received_at?: string | null
          source_system: string
          updated_at?: string | null
        }
        Update: {
          actions_performed?: string[] | null
          created_at?: string | null
          entities_updated?: string[] | null
          error_message?: string | null
          event_data?: Json
          event_id?: string | null
          event_type?: string
          headers?: Json | null
          id?: string
          idempotency_key?: string | null
          processed_at?: string | null
          processing_attempts?: number | null
          processing_result?: Json | null
          processing_status?: string | null
          received_at?: string | null
          source_system?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      whatsapp_conversations: {
        Row: {
          created_at: string | null
          id: string
          lead_id: string | null
          message_content: string
          message_type: string
          phone_number: string
          timestamp: string | null
          whatsapp_message_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          lead_id?: string | null
          message_content: string
          message_type: string
          phone_number: string
          timestamp?: string | null
          whatsapp_message_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          lead_id?: string | null
          message_content?: string
          message_type?: string
          phone_number?: string
          timestamp?: string | null
          whatsapp_message_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_conversations_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      customer_metrics_view: {
        Row: {
          address: string | null
          birthday: string | null
          calculated_status: string | null
          email: string | null
          estimated_lifetime_value: number | null
          first_class_date: string | null
          first_seen: string | null
          id: string | null
          is_active_member: boolean | null
          last_class_date: string | null
          last_seen: string | null
          marketing_email_opt_in: string | null
          marketing_text_opt_in: string | null
          name: string | null
          phone: string | null
          tags: string | null
          total_classes_attended: number | null
        }
        Relationships: []
      }
      customer_summary: {
        Row: {
          address: string | null
          arketa_id: string | null
          arketa_last_sync: string | null
          birthday: string | null
          calculated_segment: string | null
          created_at: string | null
          customer_segment: string | null
          email: string | null
          email_opt_in: boolean | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          first_class_date: string | null
          first_name: string | null
          id: string | null
          last_attended_date: string | null
          last_class_date: string | null
          last_name: string | null
          lead_source: string | null
          liability_waiver_signed: boolean | null
          liability_waiver_signed_at: string | null
          lifetime_value: number | null
          marketing_email_opt_in: boolean | null
          marketing_text_opt_in: boolean | null
          phone: string | null
          recent_classes_count: number | null
          referral_source: string | null
          sms_opt_in: boolean | null
          tags: string[] | null
          total_classes_attended: number | null
          transactional_text_opt_in: boolean | null
          updated_at: string | null
        }
        Relationships: []
      }
      instructor_dashboard_view: {
        Row: {
          base_rate: number | null
          email: string | null
          full_name: string | null
          id: string | null
          is_active: boolean | null
          pending_substitute_requests: number | null
          per_student_rate: number | null
          phone: string | null
          this_month_earnings: number | null
          upcoming_classes_count: number | null
        }
        Relationships: []
      }
      upcoming_classes_view: {
        Row: {
          class_date: string | null
          class_type_name: string | null
          difficulty_level: string | null
          duration_minutes: number | null
          end_time: string | null
          id: string | null
          instructor_email: string | null
          instructor_name: string | null
          max_capacity: number | null
          room_location: string | null
          spots_available: number | null
          start_time: string | null
          status: string | null
          students_enrolled: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      calculate_instructor_payment: {
        Args: {
          p_instructor_id: string
          p_class_id: string
          p_is_substitute?: boolean
        }
        Returns: number
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_customer_metrics_summary: {
        Args: Record<PropertyKey, never>
        Returns: {
          total_clients: number
          active_members: number
          trial_members: number
          new_this_month: number
          no_purchases: number
          first_class_booked: number
          intro_offer: number
          bought_membership: number
          retention_risk: number
        }[]
      }
      get_filtered_customers: {
        Args: { filter_stage?: string }
        Returns: {
          id: string
          name: string
          email: string
          phone: string
          marketing_email_opt_in: string
          marketing_text_opt_in: string
          tags: string
          first_seen: string
          last_seen: string
          birthday: string
          address: string
          total_classes_attended: number
          last_class_date: string
          first_class_date: string
          calculated_status: string
          is_active_member: boolean
          estimated_lifetime_value: number
        }[]
      }
      update_customer_segments: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
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
