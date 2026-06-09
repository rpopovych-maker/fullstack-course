import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { UserRespSchema } from 'src/api/routes/schemas/user/UserRespSchema';
import { restoreHardDeletedUser } from 'src/controllers/user/restore-hard-deleted-user';
import { z } from 'zod';

const routes: FastifyPluginAsync = async function (f) {
  const fastify = f.withTypeProvider<ZodTypeProvider>();

  fastify.post('/', {
    schema: {
      params: z.object({
        archiveId: z.string().uuid()
      }),
      response: {
        200: UserRespSchema
      }
    }
  }, async req => {
    return restoreHardDeletedUser({
      archiveId: req.params.archiveId,
      archiveRepo: fastify.repos.archiveRepo,
      commentRepo: fastify.repos.commentRepo,
      postRepo: fastify.repos.postRepo,
      postToTagRepo: fastify.repos.postToTagRepo,
      userRepo: fastify.repos.userRepo,
      transactionManager: fastify.transactionManager
    });
  });
};

export default routes;
