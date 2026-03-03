-- Phase 2 — To Do Green Portal: initial schema + RLS
-- Run in Supabase SQL Editor or via supabase db push

-- Roles enum (stored in app; here for reference)
-- ADMIN, MANAGER, EMPLOYEE, DRIVER, HUB_OPS

-- Allowlisted domains (e.g. @todogreen.com.br)
CREATE TABLE IF NOT EXISTS allowed_domains (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  domain text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now()
);

-- Drivers pre-registration (allowlist)
CREATE TABLE IF NOT EXISTS driver_allowlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text,
  phone text,
  driver_code text UNIQUE,
  verified_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Hubs
CREATE TABLE IF NOT EXISTS hubs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  location_metadata jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Users (extends auth.users via 1:1 profile)
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  role text NOT NULL CHECK (role IN ('ADMIN','MANAGER','EMPLOYEE','DRIVER','HUB_OPS')),
  hub_id uuid REFERENCES hubs(id),
  full_name text,
  avatar_url text,
  is_driver boolean DEFAULT false,
  is_allowlisted boolean DEFAULT false,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active','inactive','pending')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tracks
CREATE TABLE IF NOT EXISTS tracks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name_pt text NOT NULL,
  name_en text NOT NULL,
  description_pt text,
  description_en text,
  target_roles text[] NOT NULL DEFAULT '{}',
  is_required boolean DEFAULT false,
  is_published boolean DEFAULT true,
  order_index int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Modules
CREATE TABLE IF NOT EXISTS modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  track_id uuid NOT NULL REFERENCES tracks(id) ON DELETE CASCADE,
  slug text NOT NULL,
  title_pt text NOT NULL,
  title_en text NOT NULL,
  content_type text NOT NULL CHECK (content_type IN ('text','video','pdf','interactive_cards','scenario_simulations')),
  content_pt text,
  content_en text,
  media_url text,
  order_index int NOT NULL DEFAULT 0,
  is_published boolean DEFAULT true,
  estimated_minutes int NOT NULL DEFAULT 5,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_modules_track ON modules(track_id);

-- Quizzes
CREATE TABLE IF NOT EXISTS quizzes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id uuid REFERENCES modules(id),
  track_id uuid NOT NULL REFERENCES tracks(id) ON DELETE CASCADE,
  title_pt text NOT NULL,
  title_en text NOT NULL,
  passing_score int NOT NULL DEFAULT 70,
  max_attempts int NOT NULL DEFAULT 3,
  is_published boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS quiz_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id uuid NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  question_pt text NOT NULL,
  question_en text NOT NULL,
  type text NOT NULL CHECK (type IN ('mcq','multi_select','short_answer')),
  options jsonb,
  correct_answer jsonb,
  points int NOT NULL DEFAULT 1,
  order_index int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Assignments (user or hub level)
CREATE TABLE IF NOT EXISTS assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  hub_id uuid REFERENCES hubs(id),
  track_id uuid NOT NULL REFERENCES tracks(id) ON DELETE CASCADE,
  assigned_by uuid REFERENCES users(id),
  due_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT assignment_target CHECK (user_id IS NOT NULL OR hub_id IS NOT NULL)
);

-- Progress
CREATE TABLE IF NOT EXISTS progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  module_id uuid NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
  completed_at timestamptz,
  time_spent_seconds int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, module_id)
);

-- Quiz attempts
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  quiz_id uuid NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  attempt_number int NOT NULL,
  score int NOT NULL,
  passed boolean NOT NULL,
  answers_payload jsonb,
  completed_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Certificates
CREATE TABLE IF NOT EXISTS certificates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  track_id uuid NOT NULL REFERENCES tracks(id) ON DELETE CASCADE,
  pdf_url text,
  issued_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, track_id)
);

-- AI interactions (anonymized logs)
CREATE TABLE IF NOT EXISTS ai_interactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  session_id text NOT NULL,
  mode text NOT NULL,
  prompt_version text NOT NULL,
  model_id text NOT NULL,
  anonymized boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Storage bucket for certificates + training media (create via Dashboard or API)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('certificates', 'certificates', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('training-media', 'training-media', true);

-- RLS: enable on all tables
ALTER TABLE allowed_domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE driver_allowlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE hubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_interactions ENABLE ROW LEVEL SECURITY;

-- Users: read own row; admins read all
CREATE POLICY "users_select_own" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "users_select_admin" ON users FOR SELECT USING (
  EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'ADMIN')
);

-- Tracks & modules: all authenticated can read published
CREATE POLICY "tracks_select_published" ON tracks FOR SELECT
  USING (is_published = true AND auth.role() = 'authenticated');

CREATE POLICY "modules_select_published" ON modules FOR SELECT
  USING (is_published = true AND auth.role() = 'authenticated');

-- Progress: own only; managers/admins see team via service role in app
CREATE POLICY "progress_select_own" ON progress FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "progress_insert_own" ON progress FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "progress_update_own" ON progress FOR UPDATE USING (user_id = auth.uid());

-- Quiz attempts: own only
CREATE POLICY "quiz_attempts_select_own" ON quiz_attempts FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "quiz_attempts_insert_own" ON quiz_attempts FOR INSERT WITH CHECK (user_id = auth.uid());

-- Certificates: read own
CREATE POLICY "certificates_select_own" ON certificates FOR SELECT USING (user_id = auth.uid());

-- Assignments: read own or by hub (app logic)
CREATE POLICY "assignments_select_own" ON assignments FOR SELECT
  USING (user_id = auth.uid() OR EXISTS (
    SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.hub_id = assignments.hub_id
  ));

-- Trigger to create user profile on signup (run after auth.users insert)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, role, is_allowlisted, status)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      (SELECT 'EMPLOYEE' FROM allowed_domains ad WHERE NEW.email LIKE '%@' || ad.domain),
      (SELECT 'DRIVER' FROM driver_allowlist da WHERE (da.email = NEW.email OR da.driver_code IS NOT NULL LIMIT 1)),
      'EMPLOYEE'
    ),
    (EXISTS (SELECT 1 FROM allowed_domains ad WHERE NEW.email LIKE '%@' || ad.domain)
     OR EXISTS (SELECT 1 FROM driver_allowlist da WHERE da.email = NEW.email)),
    'active'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Run in Supabase Dashboard: link to auth.users insert
-- CREATE TRIGGER on_auth_user_created
--   AFTER INSERT ON auth.users
--   FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
