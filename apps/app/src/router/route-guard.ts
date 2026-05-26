import { useAuthStore } from '@/views/auth/auth.store'
import { getAuthInitPromise } from '@/views/auth/auth.init'
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'

export const routeGuard = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  await getAuthInitPromise()

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

  if (to.meta.requirePermission && !authStore.hasPermission(to.meta.requirePermission)) {
    next({ name: routeNames.posts })
    return
  }

  if (to.path.startsWith('/auth') && authStore.isAuthenticated) {
    next({ name: routeNames.posts })
    return
  }

  next()
}
