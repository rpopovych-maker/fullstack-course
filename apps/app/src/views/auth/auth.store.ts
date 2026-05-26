import { defineStore } from 'pinia'
import { authService } from './auth.service'
import { checkPermission, type TAction } from './permissions'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<TUser | null>(null)

  const isAuthenticated = computed(() => user.value !== null)

  const hasPermission = (action: TAction, resource?: { userId: string }) => {
    return checkPermission(user.value?.role, user.value?.id, action, resource)
  }

  const loadCurrentUser = async () => {
    user.value = await authService.getUser()

    return user.value
  }

  const signIn = async (email: string, password: string) => {
    await authService.signIn(email, password)
    return loadCurrentUser()
  }

  const signOut = async () => {
    await authService.signOut()
    user.value = null
  }

  return {
    user,
    isAuthenticated,
    hasPermission,
    loadCurrentUser,
    signIn,
    signOut
  }
})
