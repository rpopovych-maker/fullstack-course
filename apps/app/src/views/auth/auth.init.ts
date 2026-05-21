import type { Pinia } from 'pinia'
import { supabase } from '@/features/platform/supabase/supabase.client'
import { useAuthStore } from './auth.store'

let authInitPromise: Promise<void> | null = null

export const initializeAuth = (pinia: Pinia) => {
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
