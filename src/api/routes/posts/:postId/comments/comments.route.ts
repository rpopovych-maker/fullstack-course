import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { CommentRespSchema } from 'src/api/routes/schemas/comments/CommentRespSchema';
import { CreateCommentReqSchema } from 'src/api/routes/schemas/comments/CreateCommentReqSchema';
import { createComment } from 'src/controllers/comment/create-comment';
import { GetPostCommentsRespSchema } from 'src/api/routes/schemas/comments/GetPostCommentsRespSchema';
import { z } from 'zod';

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
          200: CommentRespSchema
        },
        body: CreateCommentReqSchema
      }
    },
    async (req) => {
      const comment = await createComment({
        commentRepo: fastify.repos.commentRepo,
        data: {
          ...req.body,
          postId: req.params.postId
        }
      });
      return comment;
    }
  );

  fastify.get(
    '/',
    {
      schema: {
        params: z.object({
          postId: z.string().uuid()
        }),
        response: {
          200: GetPostCommentsRespSchema
        }
      }
    },
    async (req) => {
      const comments = await fastify.repos.commentRepo.getPostComments(req.params.postId);
      return comments;
    }
  );
};

export default routes;
