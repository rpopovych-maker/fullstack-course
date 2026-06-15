import { ENTITLED_SUBSCRIPTION_STATUSES, isProActive } from '../policy/post-access'

export const useSubscription = () => {
  const authStore = useAuthStore()
  const { data, isLoading, refetch } = useCurrentSubscriptionQuery({
    enabled: () => authStore.isAuthenticated
  })

  const subscription = computed(() => data.value ?? null)
  const isProActiveRef = computed(() => isProActive(subscription.value))
  const isCanceledAtPeriodEnd = computed(() => {
    return subscription.value?.cancelAtPeriodEnd === true
  })

  return {
    subscription,
    isProActive: isProActiveRef,
    isCanceledAtPeriodEnd,
    isLoading,
    refetch,
    ENTITLED_SUBSCRIPTION_STATUSES
  }
}
