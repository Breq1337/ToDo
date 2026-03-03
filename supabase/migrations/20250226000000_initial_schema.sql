-- To Do Green Portal — Supabase schema (replaces Firestore)
-- Run in Supabase SQL Editor or via supabase db push

-- allowlist: email -> role/hub (replaces Firestore allowlist)
CREATE TABLE IF NOT EXISTS public.allowlist (
  email text PRIMARY KEY,
  active boolean NOT NULL DEFAULT true,
  role_default text NOT NULL DEFAULT 'EMPLOYEE' CHECK (role_default IN ('ADMIN', 'MANAGER', 'EMPLOYEE', 'DRIVER', 'HUB_OPS')),
  hub_id text,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- profiles: one per auth.users.id (replaces Firestore users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  role text NOT NULL DEFAULT 'EMPLOYEE' CHECK (role IN ('ADMIN', 'MANAGER', 'EMPLOYEE', 'DRIVER', 'HUB_OPS')),
  hub_id text,
  status text NOT NULL DEFAULT 'active',
  display_name text,
  phone text,
  address text,
  city text,
  state text,
  zip_code text,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- hubs
CREATE TABLE IF NOT EXISTS public.hubs (
  id text PRIMARY KEY,
  name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- notifications
CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "to" text NOT NULL,
  "from" text NOT NULL,
  title text NOT NULL,
  body text NOT NULL DEFAULT '',
  read boolean NOT NULL DEFAULT false,
  priority text NOT NULL DEFAULT 'NORMAL',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notifications_to_created ON public.notifications ("to", created_at DESC);

-- ranking
CREATE TABLE IF NOT EXISTS public.ranking (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  points integer NOT NULL DEFAULT 0,
  display_name text,
  email text,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ranking_points ON public.ranking (points DESC);

-- audit_logs (optional, for future use)
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  action text NOT NULL,
  user_id uuid REFERENCES auth.users(id),
  details jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- RLS: allowlist and server-only tables — no direct client access (APIs use service_role)
ALTER TABLE public.allowlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ranking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Allowlist: no policy (only service_role can read/write)
CREATE POLICY "allowlist_service_only" ON public.allowlist FOR ALL USING (false);

-- Profiles: user can read own row
CREATE POLICY "profiles_read_own" ON public.profiles FOR SELECT USING (auth.uid() = id);
-- Writes only via service_role (API)
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Hubs: authenticated read
CREATE POLICY "hubs_read_auth" ON public.hubs FOR SELECT TO authenticated USING (true);

-- Notifications: read own (to = uid or to = 'all')
CREATE POLICY "notifications_read_own" ON public.notifications FOR SELECT
  USING (auth.uid()::text = "to" OR "to" = 'all');
-- Insert/update/delete via service_role only (API)
CREATE POLICY "notifications_no_client_write" ON public.notifications FOR ALL USING (false);

-- Ranking: all authenticated can read
CREATE POLICY "ranking_read_auth" ON public.ranking FOR SELECT TO authenticated USING (true);
-- Write only via service_role
CREATE POLICY "ranking_no_client_write" ON public.ranking FOR ALL USING (false);

-- Audit logs: service only
CREATE POLICY "audit_logs_service_only" ON public.audit_logs FOR ALL USING (false);

-- Trigger: create profile on signup (optional — we also upsert on sync)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role, status, updated_at)
  VALUES (
    NEW.id,
    COALESCE(NEW.email, ''),
    'EMPLOYEE',
    'active',
    now()
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
