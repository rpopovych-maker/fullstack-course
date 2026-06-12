<script setup lang="ts">
import AppLayout from './AppLayout.vue'
</script>

<template>
  <AppLayout>
    <div class="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-10">
      <section
        class="w-full max-w-md rounded border border-zinc-800 bg-zinc-900 p-6 shadow-sm"
      >
        <slot />
      </section>
    </div>
  </AppLayout>
</template>
