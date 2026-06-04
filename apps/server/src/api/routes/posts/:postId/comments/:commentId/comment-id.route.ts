import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { updateCommentById } from 'src/controllers/comment/update-comment-by-id';
import { CommentRespSchema } from 'src/api/routes/schemas/comments/CommentRespSchema';
import { UpdateCommentByIdReqSchema } from 'src/api/routes/schemas/comments/UpdateCommentByIdReqSchema';
import { hasPermission } from 'src/api/hooks/permission.hook';
import { isCommentOwner } from 'src/controllers/comment/is-comment-owner';
import { softDeleteComment } from 'src/controllers/comment/soft-delete-comment';

const routes: FastifyPluginAsync = async function (f) {
  const fastify = f.withTypeProvider<ZodTypeProvider>();

  fastify.patch(
    '/',
    {
      schema: {
        params: z.object({
          postId: z.string().uuid(),
          commentId: z.string().uuid()
        }),
        response: {
          200: CommentRespSchema
        },
        body: UpdateCommentByIdReqSchema
      },
      preHandler: [
        hasPermission('update:comments', req =>
          isCommentOwner({
            commentRepo: fastify.repos.commentRepo,
            commentId: (req.params as { commentId: string }).commentId,
            userId: req.user!.id
          })
        )
      ]
    },
    async (req) => {
      const comment = await updateCommentById({
        commentRepo: fastify.repos.commentRepo,
        commentId: req.params.commentId,
        postId: req.params.postId,
        data: req.body
      });
      return comment;
    }
  );

  fastify.delete(
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
      const comment = await softDeleteComment({
        commentRepo: fastify.repos.commentRepo,
        commentId: req.params.commentId,
        postId: req.params.postId
      });

      return comment;
    }
  );
};

export default routes;
