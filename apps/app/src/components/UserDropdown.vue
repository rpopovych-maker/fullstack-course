<template>
  <el-dropdown @command="handleCommand">
    <el-button text>
      <span class="flex items-center gap-2">
        <AuthorAvatar
          :username="authStore.user?.username ?? ''"
          :size="28"
        />
        <span class="t-body-sm hidden sm:inline">{{ authStore.user?.email }}</span>
        <el-tag v-if="isProActive" type="success" size="small">Pro</el-tag>
      </span>
    </el-button>

    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item command="subscription">
          <span class="inline-flex items-center gap-2">
            <Icon name="lock" />
            {{ isProActive ? 'Manage subscription' : 'Subscribe' }}
          </span>
        </el-dropdown-item>
        <el-dropdown-item command="sign-out" divided>
          Sign out
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
const authStore = useAuthStore()
const router = useRouter()
const { isProActive } = useSubscription()

async function handleCommand (command: string) {
  if (command === 'subscription') {
    await router.push({ name: routeNames.pricing })
    return
  }

  if (command === 'sign-out') {
    await authStore.signOut()
    await router.push({ name: routeNames.signIn })
  }
}
</script>
