import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { hardDeleteComment } from 'src/controllers/comment/hard-delete-comment';
import { hasPermission } from 'src/api/hooks/permission.hook';
import { isCommentOwner } from 'src/controllers/comment/is-comment-owner';

const routes: FastifyPluginAsync = async function (f) {
  const fastify = f.withTypeProvider<ZodTypeProvider>();

  fastify.delete(
    '/',
    {
      schema: {
        params: z.object({
          postId: z.string().uuid(),
          commentId: z.string().uuid()
        })
      },
      preHandler: [
        hasPermission('delete:comments', req =>
          isCommentOwner({
            commentRepo: fastify.repos.commentRepo,
            commentId: (req.params as { commentId: string }).commentId,
            userId: req.user!.id
          })
        )
      ]
    },
    async (req) => {
      return hardDeleteComment({
        archiveRepo: fastify.repos.archiveRepo,
        commentRepo: fastify.repos.commentRepo,
        commentId: req.params.commentId,
        postId: req.params.postId,
        transactionManager: fastify.transactionManager
      });
    }
  );
};

export default routes;
