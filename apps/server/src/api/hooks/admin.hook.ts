
import { preHandlerAsyncHookHandler } from 'fastify';
import { HttpError } from 'src/api/errors/HttpError';

export function getAdminHook(): preHandlerAsyncHookHandler {
  return async function (request) {
    if (request.user?.role !== 'admin') {
      throw new HttpError(403, 'Forbidden');
    }
  };
}