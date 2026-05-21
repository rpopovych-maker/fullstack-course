export const authRoutes: RouteRecordRaw[] = [
  {
    path: '/auth',
    redirect: { name: routeNames.signIn },
    meta: {
      layout: 'AuthLayout'
    },
    children: [
      {
        path: 'sign-up',
        name: routeNames.signUp,
        component: () => import('./SignUp.vue')
      },
      {
        path: 'sign-in',
        name: routeNames.signIn,
        component: () => import('./SignIn.vue')
      }
    ]
  }
]
