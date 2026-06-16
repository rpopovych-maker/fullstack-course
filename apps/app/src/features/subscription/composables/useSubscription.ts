export const useSubscription = () => {
  const ENTITLED_SUBSCRIPTION_STATUSES: TSubscriptionStatus[] = [
    'active',
    'trialing'
  ]

  const authStore = useAuthStore()
  const { data, isLoading, refetch } = useCurrentSubscriptionQuery({
    enabled: () => authStore.isAuthenticated
  })

  const subscription = computed(() => data.value ?? null)
  const isProActive = computed(() => {
    const currentSubscription = subscription.value

    return currentSubscription !== null &&
      ENTITLED_SUBSCRIPTION_STATUSES.includes(currentSubscription.status)
  })
  const isCanceledAtPeriodEnd = computed(() => {
    return subscription.value?.cancelAtPeriodEnd === true
  })

  return {
    subscription,
    isProActive,
    isCanceledAtPeriodEnd,
    isLoading,
    refetch
  }
}
