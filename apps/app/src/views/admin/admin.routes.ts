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
      },
      {
        path: 'archive',
        name: routeNames.adminArchive,
        component: () => import('./Archive.vue')
      },
      {
        path: 'invites',
        name: routeNames.adminInvites,
        component: () => import('./Invites.vue')
      },
      {
        path: 'tags',
        name: routeNames.adminTags,
        component: () => import('./Tags.vue')
      }
    ]
  }
]
