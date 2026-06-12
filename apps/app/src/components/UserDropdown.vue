<template>
  <el-dropdown @command="handleCommand">
    <el-button text>
      <span class="flex items-center gap-2">
        <AuthorAvatar
          :username="authStore.user?.username ?? ''"
          :size="28"
        />
        <span class="t-body-sm hidden sm:inline">{{ authStore.user?.email }}</span>
      </span>
    </el-button>

    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item command="sign-out">
          Sign out
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
const authStore = useAuthStore()
const router = useRouter()

async function handleCommand (command: string) {
  if (command !== 'sign-out') {
    return
  }

  await authStore.signOut()
  await router.push({ name: routeNames.signIn })
}
</script>
