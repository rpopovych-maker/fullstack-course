import { postsRoutes } from '@/views/posts/posts.routes'

const routes: RouteRecordRaw[] = [
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  },

  ...postsRoutes
]

export {
  routes
}
