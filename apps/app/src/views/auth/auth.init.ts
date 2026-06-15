import { supabase } from '@/features/platform/supabase/supabase.client'
import { useQueryCache } from '@pinia/colada'

let authInitPromise: Promise<void> | null = null
let authStateUnsubscribe: (() => void) | null = null

export const initializeAuth = () => {
  subscribeToAuthChanges()

  authInitPromise ??= hydrateAuth()

  return authInitPromise
}

const hydrateAuth = async () => {
  const authStore = useAuthStore()

  authStore.user = null

  const { data } = await supabase.auth.getSession()

  if (!data.session) {
    return
  }

  try {
    await authStore.loadCurrentUser()
  } catch {
    authStore.user = null
  }
}

const invalidateSubscriptionCache = () => {
  const cache = useQueryCache()
  cache.invalidateQueries({ key: subscriptionQueryKeys.current() })
}

const subscribeToAuthChanges = () => {
  if (authStateUnsubscribe) {
    return
  }

  const authStore = useAuthStore()
  const { data } = supabase.auth.onAuthStateChange((event) => {
    if (event === 'SIGNED_OUT') {
      authStore.user = null
      invalidateSubscriptionCache()
      return
    }

    if (event === 'SIGNED_IN') {
      setTimeout(() => {
        void authStore.loadCurrentUser()
          .then(invalidateSubscriptionCache)
          .catch(() => {
            authStore.user = null
          })
      }, 0)
    }
  })

  authStateUnsubscribe = () => data.subscription.unsubscribe()
}
