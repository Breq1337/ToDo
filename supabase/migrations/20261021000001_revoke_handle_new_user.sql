-- handle_new_user é função de trigger (auth.users → profiles); ninguém precisa chamá-la direto.
-- Resolve os lints 0028/0029 (SECURITY DEFINER executável por anon/authenticated).
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
