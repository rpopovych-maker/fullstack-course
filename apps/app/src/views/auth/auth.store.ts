import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<TUser | null>(null)

  const isAuthenticated = computed(() => user.value !== null)

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
    loadCurrentUser,
    signIn,
    signOut
  }
})
