# Fullstack Course

A personal learning monorepo focused on **backend development** in Node.js. The project is structured as a fullstack application (Vue frontend + Fastify backend) so that backend work has a real client to talk to, but the user's focus is the server.

## How to collaborate here

- **`apps/server`** — this is where the user is **learning**. Do not write large changes here unsolicited. Prefer to explain, suggest, and review. When asked to implement, keep diffs small and explain the reasoning. The user wants to understand every line.
- **`apps/app`** — AI-written by default. Move quickly here. The user does not want to spend time hand-crafting frontend code; the goal is just to have a working client that consumes the API.

## Stack

- Monorepo: pnpm workspaces (`apps/*`)
- Backend: Node.js, Fastify, TypeScript, Drizzle ORM, PostgreSQL, Zod, Swagger
- Frontend: Vue 3, Vite, TypeScript, Pinia, Element Plus, Tailwind
