
import { FastifyInstance, preHandlerAsyncHookHandler } from 'fastify';
import { HttpError } from 'src/api/errors/HttpError';

export function getAuthHook(fastify: FastifyInstance): preHandlerAsyncHookHandler {
  return async function (request) {
    if (request.routeOptions.config.skipAuth) {
      return;
    }

    const header = request.headers.authorization;

    if (!header?.startsWith('Bearer ')) {
      throw new HttpError(401, 'Unauthorized');
    }

    const token = header.split(' ')[1];

    try {
      request.identityUser = await fastify.identityService.identify(token);
    } catch (error) {
      throw new HttpError(401, 'Unauthorized', error);
    }

    if (!request.routeOptions.config.skipUserLookup) {
      const user = await fastify.repos.userRepo.getUserBySubId(request.identityUser.subId);
      
      if (!user) {
        throw new HttpError(404, 'User not found');
      }

      request.user = user;
    }
  };
}