import { useAuthStore } from '@/views/auth/auth.store'
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'

export const routeGuard = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const authStore = useAuthStore()

  if (to.meta.requireAuth && !authStore.isAuthenticated) {
    next({
      name: routeNames.signIn,
      query: {
        redirect: to.fullPath
      }
    })
    return
  }

  if (to.path.startsWith('/auth') && authStore.isAuthenticated) {
    next({ name: routeNames.posts })
    return
  }

  next()
}
