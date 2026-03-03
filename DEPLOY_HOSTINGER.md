# Deploy ToDo Green na Hostinger (Supabase + Gemini)

Este guia prepara o projeto Next.js para deploy na Hostinger com **Supabase** (Auth + PostgreSQL), API Gemini (Tutor) e todas as rotas de API. A hospedagem compartilhada simples **não** suporta Node.js; use **VPS** ou **Cloud/Business com Node.js**.

---

## Pré-requisitos

- Conta na [Hostinger](https://www.hostinger.com.br) (VPS ou plano Cloud/Business com Node.js)
- Domínio (ou subdomínio) apontando para o servidor
- Repositório no GitHub (ou outro) acessível pelo servidor
- Projeto no [Supabase](https://supabase.com) (URL + anon key + service_role key) e opcionalmente Gemini API Key

Para configuração detalhada do Supabase (migração SQL, primeiro admin, contas demo), veja **[SUPABASE_SETUP.md](SUPABASE_SETUP.md)**.

---

## 1. Variáveis de ambiente

Configure no painel da Hostinger (ou no servidor em `.env.production`). **Apenas 3 variáveis obrigatórias** para o portal; nenhum arquivo JSON.

**Build** (para as `NEXT_PUBLIC_*` serem injetadas no bundle):

| Variável | Onde obter |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Dashboard → Project Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Idem → anon public key |

**Runtime:**

| Variável | Onde obter |
|----------|-------------|
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Dashboard → Project Settings → API → service_role key (secret) |

Opcionais: `GEMINI_API_KEY` (Tutor), `SUPABASE_BOOTSTRAP_SECRET` ou `SEED_SECRET` (bootstrap/seed).

- As variáveis `NEXT_PUBLIC_*` são gravadas **no momento do build**. Configure-as antes do deploy e faça um **novo build** após alterá-las.
- Se aparecer "Configure NEXT_PUBLIC_SUPABASE_*…", confira que as variáveis estão no painel e dispare um novo deploy.

---

## 2. Supabase (antes do deploy)

1. Crie um projeto em [supabase.com](https://supabase.com).
2. Execute o SQL da migração em **SQL Editor**: `supabase/migrations/20250226000000_initial_schema.sql`.
3. Em **Authentication → URL Configuration**, adicione a URL do site em produção (ex.: `https://seudominio.com`) em **Redirect URLs**.
4. Em **Authentication → Providers**, ative **Email** e **Google** (se for usar login com Google).

---

## 3. Opção A: Deploy em VPS Hostinger (recomendado)

Fluxo: VPS → Node.js (NVM) → repositório → build Next.js (standalone) → PM2 → Nginx → SSL (Certbot).

### 3.1 Contratar VPS e acessar por SSH

- Contrate um VPS na Hostinger (ex.: KVM1 ou superior).
- Anote o **IP** e faça login por SSH: `ssh root@SEU_IP` (ou o usuário fornecido).

### 3.2 Apontar domínio para o VPS

- No painel do domínio (Hostinger ou onde estiver o DNS), crie um registro **A** apontando para o IP do VPS (ex.: `@` ou `painel` para subdomínio).

### 3.3 Instalar Node.js (NVM + Node 20)

```bash
# Instalar NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc   # ou source ~/.nvm/nvm.sh

# Instalar e usar Node 20 LTS
nvm install 20
nvm use 20
node -v   # deve mostrar v20.x.x
npm -v
```

### 3.4 Clonar repositório e instalar dependências

Ajuste `SEU_USUARIO/ToDoV2` para o seu repositório.

```bash
cd /var/www
mkdir -p todogreen && cd todogreen
git clone https://github.com/SEU_USUARIO/ToDoV2.git .
cd ToDo
```

### 3.5 Variáveis de ambiente no VPS

Crie o arquivo de produção na pasta **ToDo** (não commitar):

```bash
nano /var/www/todogreen/ToDo/.env.production
```

Cole as variáveis da **secção 1** com os valores reais. Exemplo mínimo:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
GEMINI_API_KEY=...
NODE_ENV=production
```

### 3.6 Build e preparar standalone

Na pasta **ToDo**:

```bash
cd /var/www/todogreen/ToDo
npm ci
npm run build
```

Em seguida, copie os estáticos para dentro do standalone (obrigatório para o Next.js com `output: 'standalone'`):

```bash
cp -r .next/static .next/standalone/.next/
cp -r public .next/standalone/public 2>/dev/null || true
```

### 3.7 Rodar com PM2 (restart automático)

Instale PM2 globalmente. Para o Next.js carregar as variáveis de `.env.production`, use um arquivo de configuração do PM2.

Crie `/var/www/todogreen/ToDo/ecosystem.config.cjs`:

```javascript
module.exports = {
  apps: [{
    name: 'todogreen',
    cwd: '/var/www/todogreen/ToDo',
    script: 'node',
    args: '.next/standalone/server.js',
    env_file: '/var/www/todogreen/ToDo/.env.production',
    env: { NODE_ENV: 'production' },
    instances: 1,
    exec_mode: 'fork',
  }],
};
```

Em seguida:

```bash
npm install -g pm2
cd /var/www/todogreen/ToDo
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
```

Siga a instrução que o `pm2 startup` mostrar para ativar o script no boot. O app estará escutando na porta **3000** (padrão do Next.js).

Se a sua versão do PM2 não suportar `env_file`, coloque as variáveis em um script que exporta e roda o servidor, por exemplo `start.sh`: `set -a; source .env.production; set +a; exec node .next/standalone/server.js`, e no ecosystem use `script: './start.sh'`.

### 3.8 Nginx como reverse proxy

Instale o Nginx e crie um virtual host:

```bash
apt update && apt install -y nginx
nano /etc/nginx/sites-available/todogreen
```

Conteúdo (substitua `seudominio.com` pelo seu domínio):

```nginx
server {
    listen 80;
    server_name seudominio.com www.seudominio.com;
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Ative o site e recarregue o Nginx:

```bash
ln -s /etc/nginx/sites-available/todogreen /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

### 3.9 SSL com Certbot (HTTPS)

```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d seudominio.com -d www.seudominio.com
```

Siga as instruções. O Certbot ajusta o Nginx para HTTPS e renova o certificado automaticamente.

### 3.10 Firewall (opcional mas recomendado)

Libere apenas SSH, HTTP e HTTPS:

```bash
ufw allow 22
ufw allow 80
ufw allow 443
ufw enable
ufw status
```

---

## 4. Opção B: Hostinger Cloud/Business com Node.js

Se o seu plano tiver recurso **Node.js** e integração com GitHub:

1. No painel Hostinger, conecte o repositório (GitHub).
2. Configure o **diretório raiz** do build para a pasta do app (ex.: `ToDo` se o repositório for a raiz do monorepo).
3. **Comando de build:** `npm ci && npm run build`.
4. **Comando de start:** após o build, use o start do Next.js (ex.: `npm run start` na pasta `ToDo`) ou o comando que a Hostinger fornecer para apps Node. Se houver opção de “start command”, use: `node .next/standalone/server.js` (após garantir que `.next/static` e `public` estejam no lugar certo; alguns painéis fazem o build na raiz do app e já incluem isso).
5. **Variáveis de ambiente:** no painel da aplicação Node, preencha as variáveis da secção 1 (Supabase + opcional Gemini). Nenhum arquivo JSON é necessário.

Documentação oficial Hostinger Node.js:  
[https://support.hostinger.com/en/articles/1583245-how-to-deploy-a-nodejs-website-in-hostinger](https://support.hostinger.com/en/articles/1583245-how-to-deploy-a-nodejs-website-in-hostinger)

Se o plano permitir apenas site estático (sem Node.js long-running), use a **Opção A (VPS)** para ter Supabase, Gemini e APIs funcionando.

---

## 5. Pós-deploy: testes mínimos

Após o deploy, valide:

1. **Site público:** abra `https://seudominio.com` e confira a página inicial.
2. **Portal:** acesse `https://seudominio.com/portal` (ou a rota configurada).
3. **Login:** faça login com um usuário Supabase (e-mail/senha ou Google). Confirme que não há erro de redirect ou domínio.
4. **Tutor (Gemini):** em **Portal → Tutor**, envie uma mensagem e confirme que a resposta da IA aparece (isso valida `GEMINI_API_KEY` e a rota `/api/portal/tutor`).
5. **Mensagens:** em **Portal → Mensagens**, confira a lista e, se possível, envie uma mensagem para outro usuário (valida PostgreSQL e APIs de notificações).

Se algum item falhar, confira: variáveis de ambiente (Supabase e Gemini), Redirect URLs no Supabase Authentication, e logs do PM2 (`pm2 logs todogreen`) ou logs do painel Hostinger.

---

## 6. Atualizações futuras (VPS)

Para atualizar o app após mudanças no código:

```bash
cd /var/www/todogreen
git pull
cd ToDo
npm ci
npm run build
cp -r .next/static .next/standalone/.next/
cp -r public .next/standalone/public 2>/dev/null || true
pm2 restart todogreen
```

---

## 7. Resumo rápido (VPS)

| Passo | Comando / ação |
|-------|-----------------|
| Node | NVM + `nvm install 20` |
| Código | `git clone` em `/var/www/todogreen`, `cd ToDo` |
| Env | Criar `.env.production` com variáveis Supabase (secção 1) |
| Build | `npm ci && npm run build` |
| Standalone | `cp -r .next/static .next/standalone/.next/` e `cp -r public .next/standalone/public` |
| Processo | PM2: `node .next/standalone/server.js` com env de produção |
| Proxy | Nginx proxy para `http://127.0.0.1:3000` |
| SSL | `certbot --nginx` |
| Supabase | Adicionar URL do site em Redirect URLs (Authentication) |

Com isso, o projeto fica com **Supabase, API Gemini e tudo funcional** como no `npm run dev`, em produção na Hostinger.
