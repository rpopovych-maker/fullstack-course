import { authRoutes } from '@/views/auth/auth.routes'
import { postsRoutes } from '@/views/posts/posts.routes'
import { adminRoutes } from '@/views/admin/admin.routes'
import { subscriptionRoutes } from '@/views/subscription/subscription.routes'

const routes: RouteRecordRaw[] = [
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  },

  ...postsRoutes,
  ...authRoutes,
  ...adminRoutes,
  ...subscriptionRoutes
]

export {
  routes
}
