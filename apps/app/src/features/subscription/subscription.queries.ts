import { useMutation, useQuery, useQueryCache } from '@pinia/colada'

export const subscriptionQueryKeys = {
  all: ['subscription'] as const,
  current: () => [...subscriptionQueryKeys.all, 'current'] as const
}

export const useCurrentSubscriptionQuery = (options?: {
  enabled?: MaybeRefOrGetter<boolean>
}) => useQuery({
  key: subscriptionQueryKeys.current(),
  query: () => subscriptionService.getCurrent(),
  enabled: options?.enabled,
  staleTime: 60_000
})

export const useCreateCheckoutMutation = () => {
  return useMutation({
    mutation: () => subscriptionService.createCheckout()
  })
}

export const useCancelSubscriptionMutation = () => {
  const cache = useQueryCache()

  return useMutation({
    mutation: () => subscriptionService.cancel(),
    onSettled: () => cache.invalidateQueries({ key: subscriptionQueryKeys.current() })
  })
}
