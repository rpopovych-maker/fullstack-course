<script setup lang="ts">
import AuthLayout from '@/layouts/AuthLayout.vue'
import AppLayout from '@/layouts/AppLayout.vue'
import AdminLayout from '@/layouts/AdminLayout.vue'
import { hideSplashScreen } from 'vite-plugin-splash-screen/runtime'
import { initializeAuth } from '@/views/auth/auth.init'

const route = useRoute()

const layouts = {
  AppLayout,
  AuthLayout,
  AdminLayout
}

const currentLayout = computed(() => {
  const layoutName = route.meta.layout as keyof typeof layouts | undefined

  return layouts[layoutName ?? 'AppLayout'] ?? AppLayout
})

initializeAuth().finally(() => {
  hideSplashScreen()
})
</script>

<template>
  <component :is="currentLayout">
    <router-view />
  </component>

  <Modals />
</template>
