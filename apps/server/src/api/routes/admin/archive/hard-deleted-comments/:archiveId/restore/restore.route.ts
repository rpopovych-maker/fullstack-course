import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { CommentRespSchema } from 'src/api/routes/schemas/comments/CommentRespSchema';
import { restoreHardDeletedComment } from 'src/controllers/comment/restore-hard-deleted-comment';
import { z } from 'zod';

const routes: FastifyPluginAsync = async function (f) {
  const fastify = f.withTypeProvider<ZodTypeProvider>();

  fastify.post('/', {
    schema: {
      params: z.object({
        archiveId: z.string().uuid()
      }),
      response: {
        200: CommentRespSchema
      }
    }
  }, async req => {
    return restoreHardDeletedComment({
      archiveId: req.params.archiveId,
      archiveRepo: fastify.repos.archiveRepo,
      commentRepo: fastify.repos.commentRepo,
      postRepo: fastify.repos.postRepo,
      userRepo: fastify.repos.userRepo,
      transactionManager: fastify.transactionManager
    });
  });
};

export default routes;
