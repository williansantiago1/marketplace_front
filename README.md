# Vitrine — Frontend
## Importante:

Para que o front funcione corretamente, clone o repositório da api: https://github.com/williansantiago1/marketplace_api e faça o apontamento da url da api rodando

SPA React do marketplace **Vitrine**. Consome a API em `../api`.

## Stack

React + Vite + TypeScript + Tailwind + React Router + TanStack Query + Axios + Sonner + RHF/Zod + Stripe.js

## Como rodar

1. Suba a API (`cd ../api && npm run dev`) com Postgres + seed
2. Na API, `CORS_ORIGIN=http://localhost:5173`
3. Aqui:

```bash
npm install
npm run dev
```

Abra `http://localhost:5173`

## Env

```env
VITE_API_URL=/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

Proxy do Vite encaminha `/api` → `localhost:3333`.

## Contas seed

| E-mail | Senha | Role |
|--------|-------|------|
| cliente1@marketplace.com | Senha123! | CUSTOMER |
| seller1@marketplace.com | Senha123! | SELLER |
| admin@marketplace.com | Senha123! | ADMIN |
# marketplace_front
