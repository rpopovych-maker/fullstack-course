## Collaboration rules in this folder

- **Prefer existing patterns over inventing new ones.** The repo follows Softonix Vue guidelines (see `README.md` and `architecture.md`). When in doubt, mirror what's already there.
- **Generated API types are the source of truth** — never hand-write request/response types that already exist in `src/features/platform/api/schema.ts`. Regenerate after backend changes (see below).
- **Use Pinia Colada for server state, plain Pinia stores only for true client state.** Anything that's "data fetched from the API" (lists, detail views, mutations) should be a `useQuery` / `useMutation` from `@pinia/colada`, not a hand-rolled Pinia store with `loading` / `error` / `data` refs.
- **Use Element Plus components by default.** Need a button, table, form, modal, drawer, dropdown, date picker, pagination, message/notification? Use Element Plus. Don't roll a custom component when an EP one exists.
- **Don't over-customize Element Plus.** Stick to default styles, default sizes, default variants. Use Tailwind only for layout (spacing, grid, flex) — not to override EP internals. If EP doesn't look right out of the box, that's usually fine; ship it.
- **Use VueUse before writing a custom composable.** `useLocalStorage`, `useDebounce`, `useElementVisibility`, `useEventListener`, `useClipboard`, `useMediaQuery`, etc. — check VueUse first. Only write a custom composable if there's no equivalent.
- **UI design ethos: real project, not a learning project.** Even though the backend is the focus, the frontend should *look* like a real product — clean, simple, intentional. See `.claude/skills/ui-design/SKILL.md` for the full design rules. Default to **dark theme** (the `dark` class is already set on `<html>`).

## Stack

- **Vue 3** + Composition API, `<script setup>`
- **Vite** with auto-import (`unplugin-auto-import`, `unplugin-vue-components`)
- **Pinia** + **Pinia Colada** for state (Colada for server state, Pinia for client state); **Vue Router** for routing
- **Element Plus** for UI, **Tailwind v4** for layout utilities, **dark theme by default**
- **Axios** for HTTP, **VueUse** for composables
- **TypeScript** with `vue-tsc`; types for the API are generated from the server's Swagger spec via `openapi-typescript`

## Layout

```
src/
├── App.vue
├── main.ts
├── router/        # vue-router setup
├── store/         # pinia stores
├── layouts/       # page layouts
├── views/         # route-level pages
├── features/      # feature modules (the main place to add code)
│   └── platform/
│       └── api/
│           └── schema.ts   # GENERATED from server's OpenAPI — do not edit
├── components/    # shared UI components
├── composables/   # shared composables
├── services/      # API client setup, etc.
├── plugins/       # Vue plugins
├── utils/
└── types/
```

See `architecture.md` for the full feature-module convention.

## Conventions to preserve

- **Auto-imports are on** for Vue, VueUse, and components — don't add redundant `import` statements for things that auto-import already covers.
- **Feature-first organization**: new functionality goes in `src/features/<feature>/` with its own `api/`, `components/`, `composables/`, etc. Don't dump everything into top-level `components/`.
- **Use generated types** (`schema.ts`) for all API calls; don't redefine DTOs by hand.
- **Pinia Colada queries live in `<entity>.queries.ts`** files. These are auto-imported (config: `src/store/*.queries.ts`, `src/features/**/*.queries.ts`, `src/views/**/*.queries.ts`) — do not write `import { usePostsQuery } from ...` in components, just call it. Each file exports a `<entity>QueryKeys` object plus `useXxxQuery` / `useXxxMutation` composables built on `@pinia/colada`. Derived keys spread the base: `[...postsQueryKeys.posts, id]`. Example:

  ```ts
  import { useMutation, useQuery, useQueryCache } from '@pinia/colada'

  export const postsQueryKeys = {
    posts: ['posts']
  }

  export const usePostsQuery = () => {
    return useQuery({
      key: postsQueryKeys.posts,
      query: () => postsService.getPosts(),
      placeholderData: []
    })
  }

  export const usePostQuery = (id: string) => {
    return useQuery({
      key: [...postsQueryKeys.posts, id],
      query: () => postsService.getPostById(id)
    })
  }
  ```

- **Tailwind for layout, Element Plus for components, no overrides.** Don't deep-style EP class names; if you need a slightly different look, prefer composition (slots, Tailwind on wrappers) over CSS overrides.
