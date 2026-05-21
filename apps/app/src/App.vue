<script setup lang="ts">
import AuthLayout from '@/layouts/AuthLayout.vue'
import AppLayout from '@/layouts/AppLayout.vue'
import { getAuthInitPromise } from '@/views/auth/auth.init'

const route = useRoute()
const isAuthReady = ref(false)

const layouts = {
  AppLayout,
  AuthLayout
}

const currentLayout = computed(() => {
  const layoutName = route.meta.layout as keyof typeof layouts | undefined

  return layouts[layoutName || 'AppLayout'] || AppLayout
})

getAuthInitPromise().finally(() => {
  isAuthReady.value = true
})
</script>

<template>
  <div
    v-if="!isAuthReady"
    class="min-h-screen flex items-center justify-center px-4"
  >
    <div class="space-y-2 text-center">
      <div class="t-label">
        Loading
      </div>
      <div class="t-caption">
        Preparing your session
      </div>
    </div>
  </div>

  <component
    :is="currentLayout"
    v-else
  >
    <router-view />
  </component>

  <Modals />
</template>
