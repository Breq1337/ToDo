# Configuração Supabase — Portal To Do Green

O portal usa **Supabase** para autenticação (e-mail/senha e Google) e banco de dados (PostgreSQL). Apenas **3 variáveis de ambiente** são necessárias; nenhum arquivo JSON de credenciais.

---

## 1. Variáveis de ambiente

No `.env.local` (desenvolvimento) ou no painel da hospedagem (produção):

| Variável | Onde obter | Uso |
|----------|------------|-----|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Dashboard → Project Settings → API → Project URL | Build + Runtime |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Idem → anon public key | Build + Runtime |
| `SUPABASE_SERVICE_ROLE_KEY` | Idem → service_role key (secret) | Runtime (APIs no servidor) |

Opcionais:

- `SUPABASE_BOOTSTRAP_SECRET` ou `SEED_SECRET` — para chamar `POST /api/admin/bootstrap` e `POST /api/admin/bootstrap-demo-allowlist` (primeiro admin e contas demo).
- `GEMINI_API_KEY` — para o Tutor Green (IA).

---

## 2. Criar projeto no Supabase

1. Acesse [supabase.com](https://supabase.com) e crie um projeto.
2. Em **Project Settings → API**, copie **Project URL** e **anon key** (e **service_role** para o servidor).
3. Em **Authentication → Providers**, ative **Email** e **Google** (se quiser login com Google).

---

## 3. Executar a migração SQL

No Supabase Dashboard, abra **SQL Editor** e execute o conteúdo do arquivo:

`supabase/migrations/20250226000000_initial_schema.sql`

Isso cria as tabelas: `allowlist`, `profiles`, `hubs`, `notifications`, `ranking`, `audit_logs`, e as políticas RLS.

---

## 4. Primeiro admin (bootstrap)

1. Crie um usuário no Supabase: **Authentication → Users → Add user** (e-mail e senha), ou faça sign-up pela aplicação.
2. Defina `SUPABASE_BOOTSTRAP_SECRET` no `.env.local` (ex.: `minha-chave-secreta-123`).
3. Com o servidor rodando, chame **uma vez**:

   ```bash
   curl -X POST http://localhost:3000/api/admin/bootstrap \
     -H "Content-Type: application/json" \
     -d '{"secret":"minha-chave-secreta-123","email":"admin@seudominio.com"}'
   ```

4. Faça login no portal com esse e-mail e senha. O usuário terá role **ADMIN**.

---

## 5. Contas demo (@todogreen.demo)

Com um admin logado, acesse **Portal → Painel Admin** e clique em **Criar contas demo**. Isso cria as contas (admin, gestor, rh, colaborador, motorista, hubops) com senha `123456`.

Se você criou os usuários manualmente no Supabase e não consegue entrar:

1. Defina `SUPABASE_BOOTSTRAP_SECRET` (ou `SEED_SECRET`) no `.env.local`.
2. Chame **uma vez**:

   ```bash
   curl -X POST http://localhost:3000/api/admin/bootstrap-demo-allowlist \
     -H "Content-Type: application/json" \
     -d '{"secret":"minha-chave-secreta-123"}'
   ```

---

## 6. Produção (Hostinger)

Configure no painel da aplicação Node.js:

- **Build:** `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Runtime:** `SUPABASE_SERVICE_ROLE_KEY` (e `GEMINI_API_KEY` se usar o Tutor)

Nenhum arquivo de credenciais (JSON) é necessário. Depois de salvar, faça um **novo deploy** para o build incluir as variáveis públicas.

---

## 7. Resumo rápido

| Passo | Ação |
|-------|------|
| 1 | Criar projeto no Supabase e copiar URL + chaves |
| 2 | Rodar o SQL da migração no SQL Editor |
| 3 | Ativar Email (e Google) em Authentication → Providers |
| 4 | Definir variáveis no .env.local ou painel |
| 5 | Chamar `POST /api/admin/bootstrap` para o primeiro admin |
| 6 | Fazer login e usar "Criar contas demo" no Painel Admin |
