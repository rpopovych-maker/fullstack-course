<template>
  <aside class="space-y-1">
    <RouterLink
      v-for="link in links"
      :key="link.name"
      :to="{ name: link.name }"
      active-class="bg-(--el-fill-color) text-(--el-color-primary)"
      class="t-body-sm flex items-center gap-2 rounded px-3 py-2 no-underline hover:bg-(--el-fill-color-light)"
    >
      {{ link.label }}
    </RouterLink>
  </aside>
</template>

<script lang="ts" setup>
const links = [
  {
    label: 'Users',
    name: routeNames.adminUsers
  },
  {
    label: 'Invites',
    name: routeNames.adminInvites
  }
]
</script>
