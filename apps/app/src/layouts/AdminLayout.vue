<template>
  <div class="min-h-screen bg-(--el-bg-color-page)">
    <AppHeader />

    <main class="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-6 md:grid-cols-[14rem_1fr]">
      <AdminSidebar />

      <section class="min-w-0">
        <slot />
      </section>
    </main>
  </div>
</template>
