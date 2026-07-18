# Plano do Frontend — Feira

## Objetivo

SPA React que consome 100% dos endpoints da API (`../api`), com UI/UX de marketplace, tipagem TypeScript, toasts (Sonner) e auth em localStorage.

## Escopo desta etapa (skills)

Criar o playbook em `front/skills/`. A implementação do app acontece **depois**, ao rodar o orchestrator.

## Stack travada

- React + Vite + TypeScript
- Tailwind CSS
- React Router
- TanStack Query
- Sonner (toasts)
- React Hook Form + Zod
- localStorage para tokens
- Stripe.js (tela de pagamento, test mode)

## Marca / visual

- Nome: **Feira**
- Fontes: Fraunces (display) + DM Sans (UI)
- Cores: petróleo `#0B3D3A`, coral `#E85D4C`, off-white `#F7F4EF`
- Evitar: Inter, roxo-indigo, dashboard genérico, cards no hero

## Skills

| # | Skill |
|---|--------|
| 00 | orchestrator |
| 01 | architecture |
| 02 | coding-standards |
| 03 | design-system |
| 04 | scaffold |
| 05 | types |
| 06 | api-client |
| 07 | api-modules |
| 08 | auth |
| 09 | toasts |
| 10 | layout |
| 11 | pages-storefront |
| 12 | pages-seller |
| 13 | pages-admin |
| 14 | routes |
| 15 | stripe-checkout |
| 16 | polish-qa |

## Depois das skills

1. Agente executa `00-orchestrator`
2. Implementa 01→16
3. `npm run dev` → `http://localhost:5173`
