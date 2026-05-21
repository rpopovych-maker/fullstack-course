import { defineStore } from 'pinia'
import { authService } from './auth.service'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<TUser | null>(null)

  const isAuthenticated = computed(() => user.value !== null)

  const loadCurrentUser = async () => {
    user.value = await authService.getUser()

    return user.value
  }

  return {
    user,
    isAuthenticated,
    loadCurrentUser
  }
})
