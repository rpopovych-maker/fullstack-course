import type { FastifyRequest, preHandlerAsyncHookHandler } from 'fastify';
import { HttpError } from 'src/api/errors/HttpError';
import { UserRole } from 'src/types/user/UserRole';

const actions = [
  'create:posts',
  'update:posts',
  'create:comments',
  'update:comments'
] as const;

type Action = (typeof actions)[number];

interface Permission {
  action: Action;
  requireOwnership?: boolean;
}

const rolePermissions: Record<UserRole, Permission[]> = {
  user: [
    { action: 'create:posts' },
    { action: 'update:posts', requireOwnership: true },
    { action: 'create:comments' },
    { action: 'update:comments', requireOwnership: true }
  ],
  admin: actions.map(e => ({ action: e }))
};

export function hasPermission(
  action: Action,
  ownershipCheck?: (req: FastifyRequest) => Promise<boolean>
): preHandlerAsyncHookHandler {
  return async function (req) {
    if (!req.user) {
      throw new HttpError(401, 'Unauthorized');
    }

    const permission = rolePermissions[req.user.role]?.find(p => p.action === action);

    if (!permission) {
      throw new HttpError(403, 'Forbidden');
    }

    if (!permission.requireOwnership) {
      return;
    }

    if (!ownershipCheck) {
      throw new Error(`Ownership check function must be provided for ${action}`);
    }

    if (!(await ownershipCheck(req))) {
      throw new HttpError(403, 'Forbidden');
    }
  };
}
