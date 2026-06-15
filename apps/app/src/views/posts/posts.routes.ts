export const postsRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: { name: routeNames.posts }
  },
  {
    path: '/posts',
    name: routeNames.posts,
    component: () => import('./Posts.vue'),
    meta: {
      requireAuth: true
    }
  },
  {
    path: '/posts/:postId',
    name: routeNames.postDetail,
    component: () => import('./PostDetail.vue'),
    meta: {
      requireAuth: true
    }
  }
]
