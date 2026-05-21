import type { Pinia } from 'pinia'
import { supabase } from '@/features/platform/supabase/supabase.client'
import { useAuthStore } from './auth.store'

let authInitPromise: Promise<void> | null = null
let authStateUnsubscribe: (() => void) | null = null

export const initializeAuth = (pinia: Pinia) => {
  subscribeToAuthChanges(pinia)

  if (!authInitPromise) {
    authInitPromise = hydrateAuth(pinia)
  }

  return authInitPromise
}

export const getAuthInitPromise = () => authInitPromise ?? Promise.resolve()

const hydrateAuth = async (pinia: Pinia) => {
  const authStore = useAuthStore(pinia)

  authStore.user = null

  const { data } = await supabase.auth.getSession()

  if (!data.session) {
    return
  }

  try {
    await authStore.loadCurrentUser()
  } catch {
    await supabase.auth.signOut()
    authStore.user = null
  }
}

const subscribeToAuthChanges = (pinia: Pinia) => {
  if (authStateUnsubscribe) {
    return
  }

  const authStore = useAuthStore(pinia)
  const { data } = supabase.auth.onAuthStateChange((event) => {
    if (event === 'SIGNED_OUT') {
      authStore.user = null
      return
    }

    if (event === 'SIGNED_IN') {
      setTimeout(() => {
        void authStore.loadCurrentUser().catch(() => {
          authStore.user = null
        })
      }, 0)
    }
  })

  authStateUnsubscribe = () => data.subscription.unsubscribe()
}
