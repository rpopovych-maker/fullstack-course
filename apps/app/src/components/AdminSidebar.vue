<template>
  <aside>
    <p class="t-label mb-3 px-3">
      Administration
    </p>

    <el-menu
      :default-active="activeRouteName"
      router
      aria-label="Administration"
    >
      <el-menu-item
        v-for="link in links"
        :key="link.name"
        :index="link.name"
        :route="{ name: link.name }"
      >
        {{ link.label }}
      </el-menu-item>
    </el-menu>
  </aside>
</template>

<script lang="ts" setup>
const route = useRoute()

const activeRouteName = computed(() => String(route.name ?? ''))

const links = [
  {
    label: 'Users',
    name: routeNames.adminUsers
  },
  {
    label: 'Archive',
    name: routeNames.adminArchive
  },
  {
    label: 'Invites',
    name: routeNames.adminInvites
  },
  {
    label: 'Tags',
    name: routeNames.adminTags
  }
]
</script>
