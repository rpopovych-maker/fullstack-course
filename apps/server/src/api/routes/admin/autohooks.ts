import { FastifyPluginAsync } from 'fastify';
import { getAdminHook } from 'src/api/hooks/admin.hook';

const hooks: FastifyPluginAsync = async function (fastify) {
  fastify.addHook('preHandler', getAdminHook());
};

export default hooks;