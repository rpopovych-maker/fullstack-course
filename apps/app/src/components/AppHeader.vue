<template>
  <header
    class="sticky top-0 z-10 border-b border-zinc-800 bg-zinc-950/85 backdrop-blur"
  >
    <div class="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4">
      <div class="flex items-center gap-3">
        <RouterLink
          :to="{ name: routeNames.posts }"
          class="t-h4 no-underline"
        >
          Fullstack Course
        </RouterLink>
        <el-tag v-if="isAdmin">
          Admin
        </el-tag>
      </div>

      <nav class="flex items-center gap-2">
        <RouterLink
          v-if="authStore.isAuthenticated"
          #default="{ navigate }"
          :to="{ name: routeNames.posts }"
          custom
        >
          <el-button text @click="navigate">
            Posts
          </el-button>
        </RouterLink>

        <RouterLink
          v-if="authStore.isAuthenticated"
          #default="{ navigate }"
          :to="{ name: routeNames.pricing }"
          custom
        >
          <el-button text @click="navigate">
            {{ isProActive ? 'Subscription' : 'Pricing' }}
          </el-button>
        </RouterLink>

        <RouterLink
          v-if="isAdmin"
          #default="{ navigate }"
          :to="{ name: routeNames.adminUsers }"
          custom
        >
          <el-button text @click="navigate">
            Admin
          </el-button>
        </RouterLink>

        <RouterLink
          v-if="!authStore.isAuthenticated"
          #default="{ navigate }"
          :to="{ name: routeNames.signIn }"
          custom
        >
          <el-button
            type="primary"
            @click="navigate"
          >
            Sign In
          </el-button>
        </RouterLink>

        <UserDropdown v-else />
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
const authStore = useAuthStore()
const { isProActive } = useSubscription()
const isAdmin = computed(() => authStore.user?.role === 'admin')
</script>
