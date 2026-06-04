import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { CommentRespSchema } from 'src/api/routes/schemas/comments/CommentRespSchema';
import { hasPermission } from 'src/api/hooks/permission.hook';
import { restoreSoftDeletedComment } from 'src/controllers/comment/restore-soft-deleted-comment';

const routes: FastifyPluginAsync = async function (f) {
  const fastify = f.withTypeProvider<ZodTypeProvider>();

  fastify.post(
    '/',
    {
      schema: {
        params: z.object({
          postId: z.string().uuid(),
          commentId: z.string().uuid()
        }),
        response: {
          200: CommentRespSchema
        }
      },
      preHandler: [
        hasPermission('restore:comments')
      ]
    },
    async (req) => {
      const comment = await restoreSoftDeletedComment({
        commentRepo: fastify.repos.commentRepo,
        commentId: req.params.commentId,
        postRepo: fastify.repos.postRepo,
        userRepo: fastify.repos.userRepo,
        postId: req.params.postId
      });

      return comment;
    }
  );
};

export default routes;
