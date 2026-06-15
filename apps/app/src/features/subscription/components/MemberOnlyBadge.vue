<template>
  <span
    class="member-badge inline-flex items-center gap-1 rounded-full px-2 py-0.5 t-caption"
    :class="{ 'member-badge--locked': locked }"
    :title="locked ? 'Subscribe to unlock' : 'Members only'"
  >
    <Icon name="lock" />
    Members
  </span>
</template>

<script lang="ts" setup>
const { locked = false } = defineProps<{
  locked?: boolean
}>()
</script>

<style scoped>
.member-badge {
  background-color: rgba(250, 204, 21, 0.08);
  border: 1px solid rgba(250, 204, 21, 0.25);
  color: rgb(250, 204, 21);
}

.member-badge--locked {
  background-color: rgba(250, 204, 21, 0.14);
  border-color: rgba(250, 204, 21, 0.45);
}
</style>
