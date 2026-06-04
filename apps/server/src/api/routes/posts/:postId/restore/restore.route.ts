import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { PostRespSchema } from 'src/api/routes/schemas/posts/PostRespSchema';
import { hasPermission } from 'src/api/hooks/permission.hook';
import { restoreSoftDeletedPost } from 'src/controllers/post/restore-soft-deleted-post';

const routes: FastifyPluginAsync = async function (f) {
  const fastify = f.withTypeProvider<ZodTypeProvider>();

  fastify.post(
    '/',
    {
      schema: {
        params: z.object({
          postId: z.string().uuid()
        }),
        response: {
          200: PostRespSchema
        }
      },
      preHandler: [hasPermission('restore:posts')]
    },
    async (req) => {
      const post = await restoreSoftDeletedPost({
        postRepo: fastify.repos.postRepo,
        commentRepo: fastify.repos.commentRepo,
        userRepo: fastify.repos.userRepo,
        transactionManager: fastify.transactionManager,
        postId: req.params.postId
      });
      
      return post;
    }
  );
};

export default routes;
