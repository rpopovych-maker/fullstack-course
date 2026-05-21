export const postsRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: { name: routeNames.posts }
  },
  {
    path: '/posts',
    name: routeNames.posts,
    component: () => import('./Posts.vue')
  },
  {
    path: '/posts/:postId',
    name: routeNames.postDetail,
    component: () => import('./PostDetail.vue')
  }
]
