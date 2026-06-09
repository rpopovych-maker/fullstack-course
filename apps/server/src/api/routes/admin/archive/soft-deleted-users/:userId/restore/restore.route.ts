import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { UserRespSchema } from 'src/api/routes/schemas/user/UserRespSchema';
import { restoreSoftDeletedUser } from 'src/controllers/user/restore-soft-deleted-user';
import { z } from 'zod';

const routes: FastifyPluginAsync = async function (f) {
  const fastify = f.withTypeProvider<ZodTypeProvider>();

  fastify.post('/', {
    schema: {
      params: z.object({
        userId: z.string().uuid()
      }),
      response: {
        200: UserRespSchema
      }
    }
  }, async req => {
    return restoreSoftDeletedUser({
      userId: req.params.userId,
      commentRepo: fastify.repos.commentRepo,
      postRepo: fastify.repos.postRepo,
      userRepo: fastify.repos.userRepo,
      transactionManager: fastify.transactionManager
    });
  });
};

export default routes;
