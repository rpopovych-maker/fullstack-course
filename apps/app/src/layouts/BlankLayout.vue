<script setup lang="ts">
import { useAuthStore } from '@/views/auth/auth.store'

const authStore = useAuthStore()
</script>

<template>
  <div class="min-h-screen">
    <header class="border-b border-[var(--el-border-color)] bg-[var(--el-bg-color)]/80 backdrop-blur">
      <div class="max-w-6xl mx-auto h-16 px-4 flex items-center justify-between gap-4">
        <RouterLink
          :to="{ name: routeNames.posts }"
          class="t-h4 no-underline"
        >
          Fullstack Course
        </RouterLink>

        <RouterLink
          v-if="!authStore.isAuthenticated"
          v-slot="{ navigate }"
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

        <el-dropdown v-else>
          <button
            class="flex items-center gap-2 rounded px-2 py-1 text-left hover:bg-[var(--el-fill-color-light)]"
            type="button"
          >
            <span class="t-body-sm">{{ authStore.user?.email }}</span>
          </button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item disabled>
                Signed in
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </header>

    <main>
      <slot />
    </main>
  </div>
</template>
