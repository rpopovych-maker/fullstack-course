---
name: ui-design
description: UI design guidelines for apps/app. Use when building any user-facing screen, page, or component in the Vue frontend — picking layouts, spacing, colors, components, dark/light theme, or deciding how a feature should look. Treat the app like a real product, not a learning toy.
---

# UI design rules for `apps/app`

The backend is where the user is learning; the frontend is the **shop window**. It should look like a real, shipped product — not a course assignment. That means: simple, intentional, opinionated. Boring is fine. Half-finished is not.

## Mental model

When building a screen, imagine it being shown to a recruiter, a teammate, or a paying user. Would you be okay with what you see? If it looks like a CodePen demo with raw form fields and unstyled lists — keep going.

## Rules

### 1. Dark theme is the default

- The `dark` class is already on `<html>`. Build assuming dark mode. Don't add a theme toggle unless the user asks.
- Use Element Plus's dark CSS vars; don't hardcode colors. If you do reach for Tailwind colors, prefer neutral slate/zinc for surfaces and a single accent color (Element Plus's primary blue is fine — don't pick a new brand color).

### 2. Use Element Plus components — *as they come*

- Buttons → `el-button`. Tables → `el-table`. Forms → `el-form` + `el-form-item`. Modals → `el-dialog`. Drawers → `el-drawer`. Notifications → `ElMessage` / `ElNotification`. Pagination → `el-pagination`. Pickers → `el-date-picker` / `el-select`.
- **Use default sizes and variants.** Don't pass `size="large"` everywhere, don't customize `--el-color-primary`, don't override internal class names. EP looks fine out of the box; trust it.
- The only "customization" you should reach for: Tailwind utilities on the *wrapper* of an EP component to control layout/spacing. That's it.

### 3. Layout: simple, real, predictable

- Every page has a clear hierarchy: page title → primary action(s) → content. Use `el-page-header` or a plain heading + subtitle, then content.
- Put primary actions (Create, Save) in the top-right of a page header or modal footer. Destructive actions (Delete) get `type="danger"` and confirmation via `ElMessageBox.confirm`.
- Lists: `el-table` with sortable columns where it makes sense, `el-pagination` underneath, search/filter row above. Empty state via `el-empty`.
- Loading: use Pinia Colada's `isLoading` to drive `el-skeleton` for first-load and `v-loading` directive for inline refresh. Don't show full-page spinners after the initial load.

### 4. Spacing & rhythm

- Use Tailwind for spacing. A consistent 4 / 6 / 8 scale (`p-4`, `gap-6`, `space-y-8`) covers 95% of cases. Don't reach for arbitrary values like `p-[13px]`.
- Page content lives in a centered container with sensible max-width: e.g. `<div class="max-w-6xl mx-auto px-4 py-8">`. Don't let content stretch edge-to-edge on wide screens.
- Vertical rhythm > horizontal cleverness. Stacks of clearly-spaced sections beat dense grids.

### 5. Typography & content

- **Use the typography classes from `src/assets/styles/typography.css`**, not ad-hoc Tailwind text utilities. The file defines a single, consistent type scale (`t-h1` … `t-h4`, `t-body`, `t-body-sm`, `t-label`, `t-caption`, `t-muted`, `t-strong`, `t-code`, `t-display`). Bare `<h1>`–`<h4>` are also styled, so plain semantic markup works.
- Don't write `class="text-2xl font-semibold"` on a heading — write `<h1>` (already styled) or `class="t-h1"` if it's not a real heading element. If you find yourself wanting a size that isn't in the scale, the answer is almost always "use the closest existing class," not "add a one-off."
- If a new typographic role appears repeatedly (e.g. dashboard stat numbers), add it as a new `t-*` class in `typography.css` rather than spreading raw utilities.
- Use EP's default font stack. Don't import custom fonts.
- Real copy: "No posts yet" beats "EmptyState"; "Delete this post?" beats "Are you sure you want to perform this destructive action?". Write like a human.

### 6. Optimistic UI by default

- For mutations where the new state is locally computable (toggles, likes, list add/remove/reorder, simple edits), update the cache **before** the server responds. The UI should feel instant; waiting on a network round-trip is a regression.
- Use Pinia Colada's `useMutation` with `onMutate` to write the optimistic value into the relevant query cache and return a rollback snapshot. On `onError`, restore the snapshot and surface the failure with `ElMessage.error`. On `onSettled`, invalidate the query so the server's authoritative state replaces the optimistic guess.
- **When NOT to be optimistic:** mutations whose result the client can't predict (server-generated IDs you need immediately, validation that only the server can run, anything money/auth-related). For those, fall back to standard `isPending` + spinner on the action button.
- Don't disable the button after an optimistic mutation while waiting for the network — the whole point is that the user can keep going. Only disable on real `isPending` flows.
- Pair optimistic UI with **idempotent UI affordances**: e.g. don't immediately re-fetch and flicker the list; rely on cache invalidation to reconcile.
