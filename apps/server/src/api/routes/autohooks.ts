import { FastifyPluginAsync } from 'fastify';
import { getAuthHook } from 'src/api/hooks/auth.hook';

const hooks: FastifyPluginAsync = async function (fastify) {
  fastify.addHook('preHandler', getAuthHook(fastify))
};

export default hooks;