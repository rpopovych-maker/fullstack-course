<template>
  <header
    class="sticky top-0 z-10 border-b border-(--el-border-color-lighter) bg-(--el-bg-color-page)/85 backdrop-blur"
  >
    <div class="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4">
      <div class="flex items-center gap-3">
        <RouterLink
          :to="{ name: routeNames.posts }"
          class="t-h4 no-underline"
        >
          Fullstack Course
        </RouterLink>
        <span
          v-if="isAdminRoute"
          class="t-caption rounded bg-(--el-fill-color-light) px-2 py-0.5"
        >
          Admin
        </span>
      </div>

      <nav class="flex items-center gap-2">
        <RouterLink
          :to="{ name: routeNames.posts }"
          class="t-body-sm rounded px-2 py-1 no-underline hover:bg-(--el-fill-color-light)"
        >
          Posts
        </RouterLink>

        <RouterLink
          v-if="authStore.hasPermission('view:admin')"
          :to="{ name: routeNames.adminUsers }"
          class="t-body-sm rounded px-2 py-1 no-underline hover:bg-(--el-fill-color-light)"
        >
          Admin
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

        <el-dropdown
          v-else
          @command="signOut"
        >
          <button
            class="flex items-center gap-2 rounded px-2 py-1 text-left hover:bg-(--el-fill-color-light)"
            type="button"
          >
            <AuthorAvatar
              :username="authStore.user?.username ?? ''"
              :size="28"
            />
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
</template>

<script setup lang="ts">
import { useAuthStore } from '@/views/auth/auth.store'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

const isAdminRoute = computed(() => route.meta.layout === 'AdminLayout')

const signOut = async () => {
  await authStore.signOut()
  await router.push({ name: routeNames.signIn })
}
</script>
