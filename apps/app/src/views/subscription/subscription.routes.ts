export const subscriptionRoutes: RouteRecordRaw[] = [
  {
    path: '/pricing',
    name: routeNames.pricing,
    component: () => import('./Pricing.vue'),
    meta: {
      requireAuth: true
    }
  },
  {
    path: '/success',
    name: routeNames.success,
    component: () => import('./Success.vue'),
    meta: {
      requireAuth: true
    }
  }
]
