<template>
  <div class="mx-auto max-w-lg px-4 py-16">
    <el-result
      :icon="isPending ? undefined : resultIcon"
      :title="title"
      :sub-title="subtitle"
    >
      <template v-if="isPending" #icon>
        <span class="spinner" aria-label="Loading" />
      </template>
      <template #extra>
        <el-button
          v-if="!isProActive"
          type="primary"
          plain
          @click="goToPosts"
        >
          Go to posts
        </el-button>
        <el-button
          v-else
          type="primary"
          @click="goToPosts"
        >
          Start exploring
        </el-button>
      </template>
    </el-result>
  </div>
</template>

<script lang="ts" setup>
const router = useRouter()

const POLL_INTERVAL_MS = 2_000
const POLL_TIMEOUT_MS = 20_000

const { isProActive, refetch } = useSubscription()
const startedAt = Date.now()
const hasTimedOut = ref(false)

const isPending = computed(() => !isProActive.value && !hasTimedOut.value)
const resultIcon = computed(() => isProActive.value ? 'success' : 'warning')

const title = computed(() => {
  if (isProActive.value) {
    return 'Welcome to Pro'
  }
  if (hasTimedOut.value) {
    return 'Finalizing your subscription…'
  }
  return 'Confirming your subscription'
})

const subtitle = computed(() => {
  if (isProActive.value) {
    return 'Your subscription is active. Enjoy member-only posts.'
  }
  if (hasTimedOut.value) {
    return 'This is taking a little longer than expected. Your subscription should activate shortly.'
  }
  return 'Just a moment while we activate your access.'
})

const { pause } = useIntervalFn(() => {
  if (isProActive.value) {
    pause()
    setTimeout(goToPosts, 1_200)
    return
  }
  if (Date.now() - startedAt > POLL_TIMEOUT_MS) {
    hasTimedOut.value = true
    pause()
    return
  }
  void refetch()
}, POLL_INTERVAL_MS, { immediateCallback: true })

watch(isProActive, (active) => {
  if (active) {
    pause()
    setTimeout(goToPosts, 1_200)
  }
})

function goToPosts () {
  router.push({ name: routeNames.posts })
}
</script>

<style scoped>
.spinner {
  display: inline-block;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  border: 4px solid rgba(255, 255, 255, 0.12);
  border-top-color: var(--el-color-primary);
  animation: spinner-rotate 0.9s linear infinite;
}

@keyframes spinner-rotate {
  to {
    transform: rotate(360deg);
  }
}
</style>
