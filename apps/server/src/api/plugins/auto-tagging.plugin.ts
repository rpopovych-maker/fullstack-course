import { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';

const plugin: FastifyPluginAsync = async function (fastify) {
  fastify.addHook('onRoute', (routeOptions) => {
    if (!routeOptions.url) {
      return;
    }

    const tag = routeOptions.url.startsWith('/api/admin')
      ? 'admin'
      : routeOptions.url.match(/^\/api\/([^/]+)/)?.[1] ?? 'default';

    routeOptions.schema ??= {};

    const existingTags = routeOptions.schema.tags || [];
    routeOptions.schema.tags = [...existingTags, tag];
  });
};

export default fp(plugin, '5.x');