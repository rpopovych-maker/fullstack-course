<template>
  <div class="mx-auto max-w-2xl px-4 py-10 space-y-8">
    <header class="space-y-2 text-center">
      <h1>{{ isProActive ? 'Manage subscription' : 'Go Pro' }}</h1>
      <p class="t-muted">
        {{ isProActive
          ? 'Your subscription details and billing controls.'
          : 'Unlock member-only posts and support the project.' }}
      </p>
    </header>

    <div v-if="isLoading" class="space-y-3">
      <el-skeleton :rows="6" animated />
    </div>

    <CurrentSubscriptionCard
      v-if="!isLoading && subscription"
      :subscription="subscription"
    />

    <el-card v-if="!isLoading && !isProActive" shadow="hover" class="pro-card">
      <div class="space-y-6 p-2">
        <div class="space-y-1">
          <p class="t-caption">Single plan</p>
          <h2 class="inline-flex items-baseline gap-2">
            Pro
            <span class="t-body t-muted">— full access</span>
          </h2>
        </div>

        <ul class="space-y-2">
          <li
            v-for="feature in features"
            :key="feature"
            class="flex items-start gap-2 t-body-sm"
          >
            <Icon name="lock" class="mt-1 shrink-0 text-yellow-400" />
            <span>{{ feature }}</span>
          </li>
        </ul>

        <el-divider class="!my-0" />

        <div class="flex flex-wrap items-center justify-between gap-4">
          <span class="t-caption">Billed monthly · cancel anytime.</span>
          <el-button
            type="primary"
            size="large"
            :loading="checkoutMutation.isLoading.value"
            @click="startCheckout"
          >
            Subscribe
          </el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { ElMessage } from 'element-plus'

const { subscription, isProActive, isLoading } = useSubscription()
const checkoutMutation = useCreateCheckoutMutation()

const features = [
  'Read all member-only posts in full',
  'Comment on member-only threads',
  'Support ongoing development'
]

async function startCheckout () {
  try {
    const { url } = await checkoutMutation.mutateAsync()
    window.location.href = url
  } catch {
    ElMessage.error('Could not start checkout. Please try again.')
  }
}
</script>

<style scoped>
.pro-card {
  background-image: linear-gradient(
    135deg,
    rgba(250, 204, 21, 0.06) 0%,
    rgba(255, 255, 255, 0.02) 100%
  );
  border: 1px solid rgba(250, 204, 21, 0.18);
}
</style>
