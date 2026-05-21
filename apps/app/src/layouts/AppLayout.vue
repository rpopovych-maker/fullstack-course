<script setup lang="ts">
import { useAuthStore } from '@/views/auth/auth.store'

const authStore = useAuthStore()
const router = useRouter()

const signOut = async () => {
  await authStore.signOut()
  await router.push({ name: routeNames.signIn })
}

const userInitial = computed(() => {
  return authStore.user?.email.trim().charAt(0).toUpperCase() || '?'
})
</script>

<template>
  <div class="min-h-screen bg-[var(--el-bg-color-page)]">
    <header class="sticky top-0 z-10 border-b border-[var(--el-border-color-lighter)] bg-[var(--el-bg-color-page)]/85 backdrop-blur">
      <div class="max-w-6xl mx-auto h-16 px-4 flex items-center justify-between gap-4">
        <RouterLink
          :to="{ name: routeNames.posts }"
          class="t-h4 no-underline"
        >
          Fullstack Course
        </RouterLink>

        <nav class="flex items-center gap-2">
          <RouterLink
            :to="{ name: routeNames.posts }"
            class="t-body-sm no-underline px-2 py-1 rounded hover:bg-[var(--el-fill-color-light)]"
          >
            Posts
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

          <el-dropdown
            v-else
            @command="signOut"
          >
            <button
              class="flex items-center gap-2 rounded px-2 py-1 text-left hover:bg-[var(--el-fill-color-light)]"
              type="button"
            >
              <el-avatar :size="28">
                {{ userInitial }}
              </el-avatar>
              <span class="t-body-sm hidden sm:inline">{{ authStore.user?.email }}</span>
            </button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="sign-out">
                  Sign out
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </nav>
      </div>
    </header>

    <main>
      <slot />
    </main>
  </div>
</template>
