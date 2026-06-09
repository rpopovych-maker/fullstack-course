import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { PostRespSchema } from 'src/api/routes/schemas/posts/PostRespSchema';
import { restoreHardDeletedPost } from 'src/controllers/post/restore-hard-deleted-post';
import { z } from 'zod';

const routes: FastifyPluginAsync = async function (f) {
  const fastify = f.withTypeProvider<ZodTypeProvider>();

  fastify.post('/', {
    schema: {
      params: z.object({
        archiveId: z.string().uuid()
      }),
      response: {
        200: PostRespSchema
      }
    }
  }, async req => {
    return restoreHardDeletedPost({
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
