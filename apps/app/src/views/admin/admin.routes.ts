export const adminRoutes: RouteRecordRaw[] = [
  {
    path: '/admin',
    redirect: { name: routeNames.adminUsers },
    meta: {
      layout: 'AdminLayout',
      requireAuth: true,
      requirePermission: 'view:admin'
    },
    children: [
      {
        path: 'users',
        name: routeNames.adminUsers,
        component: () => import('./Users.vue')
      }
    ]
  }
]
