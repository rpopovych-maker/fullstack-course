export const actions = [
  'view:admin',
  'ban:users',
  'delete:users',
  'create:posts',
  'update:posts',
  'delete:posts',
  'restore:posts',
  'create:comments',
  'update:comments',
  'delete:comments',
  'restore:comments'
] as const

export type TAction = typeof actions[number]

type TRolePermissions = Partial<Record<TAction, { requireOwnership?: boolean }>>

const rolePermissions: Record<TUserRole, TRolePermissions> = {
  user: {
    'create:posts': {},
    'update:posts': { requireOwnership: true },
    'delete:posts': { requireOwnership: true },
    'create:comments': {},
    'update:comments': { requireOwnership: true },
    'delete:comments': { requireOwnership: true }
  },
  admin: {
    'view:admin': {},
    'ban:users': {},
    'delete:users': {},
    'create:posts': {},
    'update:posts': { requireOwnership: true },
    'delete:posts': {},
    'restore:posts': {},
    'create:comments': {},
    'update:comments': { requireOwnership: true },
    'delete:comments': {},
    'restore:comments': {}
  }
}

export function checkPermission (
  role: TUserRole | undefined,
  currentUserId: string | undefined,
  action: TAction,
  resource?: { userId: string }
): boolean {
  if (!role) {
    return false
  }

  const permission = rolePermissions[role]?.[action]
  if (!permission) {
    return false
  }

  if (!permission.requireOwnership) {
    return true
  }

  return resource != null &&
    currentUserId != null &&
    resource.userId === currentUserId
}

declare module 'vue-router' {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  interface RouteMeta {
    requireAuth?: boolean
    layout?: string
    requirePermission?: TAction
    allowAuthenticated?: boolean
  }
}
