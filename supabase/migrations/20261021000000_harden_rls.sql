-- Hardening de RLS — To Do Green Portal
-- O app lê/escreve estas tabelas só via service_role (rotas /api/*), que ignora RLS.
-- Nenhum client component acessa o banco com a anon key, então as policies abaixo
-- eram superfície de ataque sem uso. RLS ligado + sem policy = negado para anon/authenticated.

-- profiles: usuário não pode alterar role/email/hub direto pela anon key
DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;

-- ranking: expunha e-mail de todos os usuários para qualquer conta autenticada
DROP POLICY IF EXISTS "ranking_read_auth" ON public.ranking;

-- notifications: sem "TO authenticated", avisos to='all' eram legíveis com a anon key
DROP POLICY IF EXISTS "notifications_read_own" ON public.notifications;

-- SECURITY DEFINER sem search_path fixo (lint 0011_function_search_path_mutable)
ALTER FUNCTION public.handle_new_user() SET search_path = '';
