-- Performance Advisor (lints 0003 auth_rls_initplan e 0001 unindexed_foreign_keys)

-- auth.uid() avaliado uma vez por query, não por linha; restrito a quem está logado
DROP POLICY IF EXISTS "profiles_read_own" ON public.profiles;
CREATE POLICY "profiles_read_own" ON public.profiles
  FOR SELECT TO authenticated
  USING ((SELECT auth.uid()) = id);

-- FK audit_logs.user_id → auth.users sem índice de cobertura
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON public.audit_logs (user_id);

-- idx_notifications_to_created aparece como "unused" só porque o banco é novo:
-- GET /api/notifications filtra por "to" e ordena por created_at — mantido.
