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
        path: 'sign-up/invite',
        name: routeNames.invite,
        component: () => import('./Invite.vue')
      },
      {
        path: 'sign-up/invite-v2',
        component: () => import('./Invite.vue')
      },
      {
        path: 'sign-in',
        name: routeNames.signIn,
        component: () => import('./SignIn.vue')
      },
      {
        path: 'forgot-password',
        name: routeNames.forgotPassword,
        component: () => import('./ForgotPassword.vue')
      },
      {
        path: 'reset-password',
        name: routeNames.resetPassword,
        meta: {
          allowAuthenticated: true
        },
        component: () => import('./ResetPassword.vue')
      }
    ]
  }
]
