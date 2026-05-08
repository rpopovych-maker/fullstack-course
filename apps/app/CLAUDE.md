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

- **`.vue` block order is `template` → `script` → `style`.** Always. Even when there's no `<style>` block, keep `<template>` above `<script>` so the file reads top-down (markup first, behavior next). New components and refactors must follow this order.

- **Shared types live in a `*.types.d.ts` file per feature, not inline.** For each feature folder (e.g. `views/posts/`), create one ambient `<entity>.types.d.ts` and put all DTO-derived aliases there. The file has **no `import`/`export` statements** so the types are picked up globally — just like `features/platform/api/dts/index.d.ts`. Then reference those names directly from queries, services, and components. Do **not** redeclare types like `type TComment = TResponse<'/api/posts/{postId}/', 'get'>['comments'][number]` inside a `.vue` file or a `.queries.ts` file. Example:
  ```ts
  // views/posts/post.types.d.ts (no imports, no exports)
  type TPostList = TResponse<'/api/posts/', 'get'>
  type TPostListItem = TPostList[number]
  type TPostDetail = TResponse<'/api/posts/{postId}/', 'get'>
  type TComment = TPostDetail['comments'][number]
  type TCreatePostBody = TRequestBody<'/api/posts/', 'post'>
  ```

- **Extract reusable presentational components instead of inlining.** Loading skeletons, empty states, error placeholders, and similar repeating chunks belong in their own `*.vue` file in the feature's `components/` folder (e.g. `PostSkeleton.vue` consumed by both `Posts.vue` and `PostDetail.vue`). Don't sprinkle bare `<el-skeleton>` blocks around the codebase.

- **No clever string-prefix flags or other hacky branches.** Don't tag client-only state by prefixing IDs (e.g. `id.startsWith('optimistic-')`) and then branching on the prefix in the UI. If you need to distinguish transient state, model it explicitly — or, more often, trust the cache/invalidation lifecycle to converge and don't add the branch at all. If you find yourself reaching for a workaround like this, stop and rethink.

- **Use canonical Tailwind v4 class names.** No deprecated aliases. Specifically: `wrap-break-word` (not `break-words`), `border-(--var-name)` (not `border-[var(--var-name)]`), and follow any other "this can be written as…" hints from the IDE. Lint/IDE warnings about non-canonical classes must be fixed, not silenced.

- **Use reactive props destructuring with default values, not `withDefaults`.** Vue 3.5+ keeps destructured props reactive, so `const { count = 6 } = defineProps<{ count?: number }>()` is the canonical form. Don't write `withDefaults(defineProps<...>(), { count: 6 })`. Note: if you pass a destructured prop into a function/composable that needs reactivity (a watcher, a `useTimeAgo` getter, etc.), wrap the access in a getter — `useTimeAgo(() => createdAt)` — so reactivity isn't lost.
