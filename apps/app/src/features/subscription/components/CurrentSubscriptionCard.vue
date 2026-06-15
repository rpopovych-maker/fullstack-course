<template>
  <el-card shadow="never" class="current-subscription-card">
    <div class="space-y-5">
      <div class="flex items-start justify-between gap-3">
        <div class="space-y-1">
          <p class="t-caption">Your subscription</p>
          <h2 class="inline-flex items-center gap-2">
            Pro
            <el-tag :type="statusTagType" size="small">{{ statusLabel }}</el-tag>
          </h2>
        </div>
        <Icon name="lock" class="text-yellow-400" />
      </div>

      <el-divider class="!my-0" />

      <dl class="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <dt class="t-caption">{{ periodEndLabel }}</dt>
          <dd class="t-body-sm">{{ formattedPeriodEnd }}</dd>
        </div>
        <div v-if="subscription.currentPeriodStart">
          <dt class="t-caption">Started</dt>
          <dd class="t-body-sm">{{ formatDate(subscription.currentPeriodStart) }}</dd>
        </div>
      </dl>

      <el-alert
        v-if="isCanceledAtPeriodEnd"
        title="Cancellation scheduled"
        type="warning"
        :description="`Your access will end on ${formattedPeriodEnd}. You can keep using Pro features until then.`"
        show-icon
        :closable="false"
      />

      <div v-else class="flex justify-end">
        <el-button
          type="danger"
          plain
          :loading="cancelMutation.isLoading.value"
          @click="confirmCancel"
        >
          Cancel subscription
        </el-button>
      </div>
    </div>
  </el-card>
</template>

<script lang="ts" setup>
import { ElMessage, ElMessageBox } from 'element-plus'

const props = defineProps<{
  subscription: TSubscription
}>()

const cancelMutation = useCancelSubscriptionMutation()

const isCanceledAtPeriodEnd = computed(() => props.subscription.cancelAtPeriodEnd)

const statusLabel = computed(() => {
  const status = props.subscription.status
  return status.charAt(0).toUpperCase() + status.slice(1)
})

const statusTagType = computed<'success' | 'warning' | 'danger' | 'info'>(() => {
  if (isCanceledAtPeriodEnd.value) {
    return 'warning'
  }
  switch (props.subscription.status) {
    case 'active':
    case 'trialing':
      return 'success'
    case 'past_due':
    case 'unpaid':
    case 'incomplete':
      return 'warning'
    case 'canceled':
    case 'incomplete_expired':
      return 'danger'
    default:
      return 'info'
  }
})

const periodEndLabel = computed(() => isCanceledAtPeriodEnd.value ? 'Access ends' : 'Renews on')

const formattedPeriodEnd = computed(() => formatDate(props.subscription.currentPeriodEnd))

function formatDate (value: string | null) {
  if (!value) {
    return '—'
  }
  return new Date(value).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

async function confirmCancel () {
  try {
    await ElMessageBox.confirm(
      'You will keep access to Pro features until the end of your current billing period. Continue?',
      'Cancel subscription',
      {
        confirmButtonText: 'Cancel subscription',
        cancelButtonText: 'Keep subscription',
        type: 'warning',
        confirmButtonClass: 'el-button--danger'
      }
    )
  } catch {
    return
  }

  try {
    await cancelMutation.mutateAsync()
    ElMessage.success('Subscription cancellation scheduled')
  } catch {
    ElMessage.error('Failed to cancel subscription')
  }
}
</script>

<style scoped>
.current-subscription-card :deep(.el-card__body) {
  padding: 1.5rem;
}
</style>
