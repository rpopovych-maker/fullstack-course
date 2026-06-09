import { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';

const plugin: FastifyPluginAsync = async function (fastify) {
  fastify.addHook('onRoute', (routeOptions) => {
    if (!routeOptions.url) {
      return;
    }

    const [, apiSegment, resourceSegment, adminResourceSegment] =
      routeOptions.url.split('/');

    const tag = apiSegment === 'api' && resourceSegment === 'admin'
      ? `admin/${adminResourceSegment ?? 'default'}`
      : resourceSegment ?? 'default';

    routeOptions.schema ??= {};

    const existingTags = routeOptions.schema.tags || [];
    routeOptions.schema.tags = [...existingTags, tag];
  });
};

export default fp(plugin, '5.x');
