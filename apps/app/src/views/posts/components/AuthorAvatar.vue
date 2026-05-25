<template>
  <el-avatar
    :size="size"
    :style="avatarStyle"
  >
    {{ initial }}
  </el-avatar>
</template>

<script setup lang="ts">
const {
  username,
  size = 32
} = defineProps<{
  username: string
  size?: number
}>()

const avatarColors = [
  '#3b82f6',
  '#14b8a6',
  '#22c55e',
  '#f59e0b',
  '#ef4444',
  '#ec4899',
  '#8b5cf6',
  '#06b6d4',
  '#84cc16',
  '#f97316'
]

const getUsernameHash = (value: string) => {
  return [...value].reduce((hash, char) => {
    return ((hash << 5) - hash) + char.charCodeAt(0)
  }, 0)
}

const initial = computed(() => {
  return username?.charAt(0).toUpperCase() ?? '?'
})

const avatarColor = computed(() => {
  const value = username ?? '?'
  const index = Math.abs(getUsernameHash(value)) % avatarColors.length

  return avatarColors[index]
})

const avatarStyle = computed(() => ({
  backgroundColor: avatarColor.value,
  color: '#ffffff',
  fontWeight: 600
}))
</script>
