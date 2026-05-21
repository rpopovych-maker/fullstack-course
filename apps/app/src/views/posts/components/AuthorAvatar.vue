<template>
  <el-avatar :size="size">
    {{ initial }}
  </el-avatar>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/views/auth/auth.store'

const props = withDefaults(defineProps<{
  userId?: string
  size?: number
}>(), {
  size: 32
})

const authStore = useAuthStore()

const initial = computed(() => {
  const user = authStore.user
  const email = user && props.userId === user.id ? user.email : ''

  return email.trim().charAt(0).toUpperCase() || '?'
})
</script>
