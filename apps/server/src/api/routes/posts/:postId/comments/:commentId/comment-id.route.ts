import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { updateCommentById } from 'src/controllers/comment/update-comment-by-id';
import { CommentRespSchema } from 'src/api/routes/schemas/comments/CommentRespSchema';
import { UpdateCommentByIdReqSchema } from 'src/api/routes/schemas/comments/UpdateCommentByIdReqSchema';

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
      }
    },
    async (req) => {
      const entity = await updateCommentById({
        commentRepo: fastify.repos.commentRepo,
        commentId: req.params.commentId,
        data: req.body
      });
      return entity;
    }
  );
};

export default routes;
