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

- **`.vue` block order is `template` → `script` → `style`.** Always.

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

- **Use canonical Tailwind v4 class names.** No deprecated aliases. Follow "this can be written as…" hints from the IDE. Lint/IDE warnings about non-canonical classes must be fixed, not silenced.

- **Use reactive props destructuring with default values, not `withDefaults`.** 

- **Use VueUse before writing a custom composable.**

- **UI design**  See `.claude/skills/ui-design/SKILL.md` for the full design rules.

- **Use Pinia Colada for server state, plain Pinia stores only for true client state.** Anything that's "data fetched from the API" (lists, detail views, mutations) should be a `useQuery` / `useMutation` from `@pinia/colada`, not a hand-rolled Pinia store with `loading` / `error` / `data` refs.
