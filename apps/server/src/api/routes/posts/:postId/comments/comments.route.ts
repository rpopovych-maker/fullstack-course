import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { CommentRespSchema } from 'src/api/routes/schemas/comments/CommentRespSchema';
import { CreateCommentReqSchema } from 'src/api/routes/schemas/comments/CreateCommentReqSchema';
import { createComment } from 'src/controllers/comment/create-comment';
import { getPostComments } from 'src/controllers/comment/get-post-comments';
import { GetPostCommentsQuerySchema } from 'src/api/routes/schemas/comments/GetPostCommentsQuerySchema';
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
        ...req.body,
        postId: req.params.postId,
        userId: req.user.id
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
        querystring: GetPostCommentsQuerySchema,
        response: {
          200: GetPostCommentsRespSchema
        }
      }
    },
    async (req) => {
      const cursor = req.query.cursorId && req.query.cursorCreatedAt
        ? {
          id: req.query.cursorId,
          createdAt: req.query.cursorCreatedAt
        }
        : undefined;

      const comments = await getPostComments({
        commentRepo: fastify.repos.commentRepo,
        postId: req.params.postId,
        cursor,
        pageSize: req.query.pageSize
      });

      return comments;
    }
  );
};

export default routes;
