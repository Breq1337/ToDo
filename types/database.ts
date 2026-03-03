/**
 * Phase 2 — Database types (Supabase).
 * Match supabase/migrations schema. RLS enforced in DB.
 */

export type Role = "ADMIN" | "MANAGER" | "EMPLOYEE" | "DRIVER" | "HUB_OPS";

export type ContentType = "text" | "video" | "pdf" | "interactive_cards" | "scenario_simulations";

export interface User {
  id: string;
  email: string;
  role: Role;
  hub_id: string | null;
  full_name: string | null;
  avatar_url: string | null;
  is_driver: boolean;
  is_allowlisted: boolean;
  status: "active" | "inactive" | "pending";
  created_at: string;
  updated_at: string;
}

export interface Hub {
  id: string;
  name: string;
  location_metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface Track {
  id: string;
  slug: string;
  name_pt: string;
  name_en: string;
  description_pt: string | null;
  description_en: string | null;
  target_roles: Role[];
  is_required: boolean;
  is_published: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface Module {
  id: string;
  track_id: string;
  slug: string;
  title_pt: string;
  title_en: string;
  content_type: ContentType;
  content_pt: string | null;
  content_en: string | null;
  media_url: string | null;
  order_index: number;
  is_published: boolean;
  estimated_minutes: number;
  created_at: string;
  updated_at: string;
}

export interface Quiz {
  id: string;
  module_id: string | null;
  track_id: string;
  title_pt: string;
  title_en: string;
  passing_score: number;
  max_attempts: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface QuizQuestion {
  id: string;
  quiz_id: string;
  question_pt: string;
  question_en: string;
  type: "mcq" | "multi_select" | "short_answer";
  options: Record<string, unknown> | null;
  correct_answer: Record<string, unknown> | null;
  points: number;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface Assignment {
  id: string;
  user_id: string | null;
  hub_id: string | null;
  track_id: string;
  assigned_by: string | null;
  due_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Progress {
  id: string;
  user_id: string;
  module_id: string;
  completed_at: string | null;
  time_spent_seconds: number;
  created_at: string;
  updated_at: string;
}

export interface QuizAttempt {
  id: string;
  user_id: string;
  quiz_id: string;
  attempt_number: number;
  score: number;
  passed: boolean;
  answers_payload: Record<string, unknown> | null;
  completed_at: string;
  created_at: string;
}

export interface Certificate {
  id: string;
  user_id: string;
  track_id: string;
  pdf_url: string | null;
  issued_at: string;
  created_at: string;
}

export interface AiInteraction {
  id: string;
  user_id: string | null;
  session_id: string;
  mode: string;
  prompt_version: string;
  model_id: string;
  anonymized: boolean;
  created_at: string;
}
