import { authRoutes } from '@/views/auth/auth.routes'
import { postsRoutes } from '@/views/posts/posts.routes'

const routes: RouteRecordRaw[] = [
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  },

  ...postsRoutes,
  ...authRoutes
]

export {
  routes
}
