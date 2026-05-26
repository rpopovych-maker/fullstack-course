<template>
  <div class="min-h-screen bg-(--el-bg-color-page)">
    <AppHeader />

    <main class="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-6 md:grid-cols-[14rem_1fr]">
      <aside class="space-y-1">
        <RouterLink
          :to="{ name: routeNames.adminUsers }"
          active-class="bg-(--el-fill-color) text-(--el-color-primary)"
          class="t-body-sm flex items-center gap-2 rounded px-3 py-2 no-underline hover:bg-(--el-fill-color-light)"
        >
          Users
        </RouterLink>
      </aside>

      <section class="min-w-0">
        <slot />
      </section>
    </main>
  </div>
</template>
