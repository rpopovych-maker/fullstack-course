import { authRoutes } from '@/views/auth/auth.routes'
import { postsRoutes } from '@/views/posts/posts.routes'
import { adminRoutes } from '@/views/admin/admin.routes'

const routes: RouteRecordRaw[] = [
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  },

  ...postsRoutes,
  ...authRoutes,
  ...adminRoutes
]

export {
  routes
}
