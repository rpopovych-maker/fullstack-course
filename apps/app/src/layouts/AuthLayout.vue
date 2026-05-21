<script setup lang="ts">
import AppLayout from './AppLayout.vue'
</script>

<template>
  <AppLayout>
    <div class="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-10">
      <section class="w-full max-w-md rounded border border-[var(--el-border-color-lighter)] bg-[var(--el-bg-color)] p-6 shadow-sm">
        <slot />
      </section>
    </div>
  </AppLayout>
</template>
