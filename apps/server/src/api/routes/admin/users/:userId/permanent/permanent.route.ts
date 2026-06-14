import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { UserRespSchema } from 'src/api/routes/schemas/user/UserRespSchema';
import { hardDeleteUser } from 'src/controllers/user/hard-delete-user';
import { z } from 'zod';

const routes: FastifyPluginAsync = async function (f) {
  const fastify = f.withTypeProvider<ZodTypeProvider>();

  fastify.delete('/', {
    schema: {
      params: z.object({
        userId: z.string().uuid()
      }),
      response: {
        200: UserRespSchema
      }
    }
  }, async req => {
    return hardDeleteUser({
      userId: req.params.userId,
      archiveRepo: fastify.repos.archiveRepo,
      commentRepo: fastify.repos.commentRepo,
      postRepo: fastify.repos.postRepo,
      subscriptionRepo: fastify.repos.subscriptionRepo,
      userRepo: fastify.repos.userRepo,
      transactionManager: fastify.transactionManager
    });
  });
};

export default routes;
