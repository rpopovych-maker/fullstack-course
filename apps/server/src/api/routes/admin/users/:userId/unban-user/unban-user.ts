import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { unbanUser } from 'src/controllers/user/unban-user';
import { z } from 'zod';

const routes: FastifyPluginAsync = async function (f) {
  const fastify = f.withTypeProvider<ZodTypeProvider>();

  fastify.post('/', {
    schema: {
      params: z.object({
        userId: z.string().uuid() 
      })
    }
  }, async req => {
   await unbanUser({
      userId: req.params.userId,
      userRepo: fastify.repos.userRepo,
      identityService: fastify.identityService
    });
  });
};

export default routes;
