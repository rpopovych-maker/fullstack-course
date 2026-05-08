export const postsRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: routeNames.posts,
    component: () => import('./Posts.vue')
  },
  {
    path: '/posts/:postId',
    name: routeNames.postDetail,
    component: () => import('./PostDetail.vue')
  }
]
