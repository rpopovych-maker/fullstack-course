import { initializeAuth } from '@/views/auth/auth.init'
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'

export const routeGuard = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  await initializeAuth()

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

  if (
    to.meta.allowedRoles?.length &&
    (!authStore.user?.role || !to.meta.allowedRoles.includes(authStore.user.role))
  ) {
    next({ name: routeNames.posts })
    return
  }

  if (to.path.startsWith('/auth') && authStore.isAuthenticated) {
    next({ name: routeNames.posts })
    return
  }

  next()
}
