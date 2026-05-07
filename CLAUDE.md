# Fullstack Course

A personal learning monorepo focused on **backend development** in Node.js. The project is structured as a fullstack application (Vue frontend + Fastify backend) so that backend work has a real client to talk to, but the user's focus is the server.

## How to collaborate here

- **`apps/server`** — this is where the user is **learning**. Do not write large changes here unsolicited. Prefer to explain, suggest, and review. When asked to implement, keep diffs small and explain the reasoning. The user wants to understand every line.
- **`apps/app`** — AI-written by default. Move quickly here. The user does not want to spend time hand-crafting frontend code; the goal is just to have a working client that consumes the API.

If a task touches both, split the work accordingly: thoughtful and pedagogical on the server, fast and pragmatic on the app.

## Stack

- Monorepo: pnpm workspaces (`apps/*`)
- Backend: Node.js, Fastify, TypeScript, Drizzle ORM, PostgreSQL, Zod, Swagger
- Frontend: Vue 3, Vite, TypeScript, Pinia, Element Plus, Tailwind
- Local infra: Docker Compose for Postgres (`apps/server/docker-compose.local.yml`)

## Course roadmap

The server is being built incrementally to follow a fullstack crash course. Current and upcoming topics:

1. **BE tech stack setup** — Fastify + TS, Drizzle, Postgres, Zod, Swagger
2. **Database & ORM** — Docker Postgres, migrations, posts/comments CRUD with relations
3. **Pagination, search, sorting** — limit/offset + cursor pagination, multi-field sorting, filtering by comments count
4. **Auth via AWS Cognito** — email+password register/login, server middleware, 401 handling, password reset, link users to posts/comments
5. **Roles (Admin/User)** — admin page with user list, deactivate user via Cognito, 403 vs 401
6. **Invitations** — invite/resend/accept flow, email delivery via Resend/SendGrid/Loops
7. **Many-to-many: tags** — tag CRUD admin page, attach tags to posts, multi-tag filter on search
8. **Soft vs hard delete** — admin delete users + cascading entities, archive list, restore, DB transactions

When suggesting changes on the server, prefer approaches that align with the **current** course step. Do not jump ahead and pull in concepts the user has not learned yet (e.g., don't introduce Cognito wiring before the auth step).
