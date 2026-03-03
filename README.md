# 🌱 ToDo Green

ToDo Green é uma plataforma web moderna construída com **Next.js**, focada em **gestão de tarefas, colaboração e aprendizado assistido por IA**, utilizando **Supabase** como backend e **Gemini AI** como tutor inteligente.

O projeto foi desenvolvido com foco em **performance, escalabilidade e deploy em ambientes Node.js**, como **Hostinger VPS**.

---

# 🚀 Tecnologias Utilizadas

## Frontend
- Next.js
- React
- TypeScript
- TailwindCSS

## Backend / Infraestrutura
- Supabase (Auth + PostgreSQL)
- Node.js
- Next.js API Routes

## Inteligência Artificial
- Google Gemini API

## Infraestrutura / Deploy
- Hostinger VPS
- Nginx
- PM2
- Certbot (SSL)

---

# ✨ Funcionalidades

- 🔐 Autenticação segura com Supabase Auth
- 👤 Portal de usuários
- 💬 Sistema de mensagens interno
- 🤖 Tutor inteligente com Gemini AI
- 📊 Estrutura preparada para painel administrativo
- ⚡ Build otimizado com Next.js Standalone
- 🌍 Deploy em produção com Nginx + PM2

---

# 📦 Estrutura do Projeto

ToDo/
│
├── app/                 # Rotas e páginas Next.js
├── components/          # Componentes reutilizáveis
├── lib/                 # Integrações (Supabase / APIs)
├── public/              # Arquivos estáticos
├── styles/              # Estilos globais
│
├── .env.example         # Exemplo de variáveis de ambiente
├── package.json
└── README.md

---

# ⚙️ Instalação

## 1️⃣ Clonar o repositório

git clone https://github.com/Breq1337/ToDo.git

cd ToDo

---

## 2️⃣ Instalar dependências

npm install

---

## 3️⃣ Criar arquivo .env.local

Crie um arquivo `.env.local` na raiz do projeto.

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

GEMINI_API_KEY=

NODE_ENV=development

---

# ▶️ Rodar o projeto localmente

npm run dev

O projeto ficará disponível em:

http://localhost:3000

---

# 🗄️ Configuração do Supabase

1. Crie um projeto em

https://supabase.com

2. Copie as chaves do painel:

Project Settings → API

3. Configure as variáveis no `.env`

4. Configure as Redirect URLs em

Authentication → URL Configuration

Exemplo:

http://localhost:3000
https://seudominio.com

---

# 🤖 Configuração do Gemini AI

1. Acesse

https://aistudio.google.com/

2. Gere uma API Key

3. Adicione no `.env`

GEMINI_API_KEY=

---

# 📜 Licença

Este projeto é distribuído sob a licença MIT.

---

# 👨‍💻 Autor

Guilherme Rocha Bianchini

GitHub:
https://github.com/Breq1337

---

# ⭐ Contribuições

Contribuições são bem-vindas.

1. Fork do projeto
2. Criar uma branch

git checkout -b minha-feature

3. Commit

git commit -m "nova feature"

4. Push

git push origin minha-feature

5. Abrir Pull Request
