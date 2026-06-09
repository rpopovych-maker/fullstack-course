import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { PostRespSchema } from 'src/api/routes/schemas/posts/PostRespSchema';
import { hardDeletePost } from 'src/controllers/post/hard-delete-post';
import { hasPermission } from 'src/api/hooks/permission.hook';
import { isPostOwner } from 'src/controllers/post/is-post-owner';

const routes: FastifyPluginAsync = async function (f) {
  const fastify = f.withTypeProvider<ZodTypeProvider>();

  fastify.delete(
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
      preHandler: [
        hasPermission('delete:posts', req =>
          isPostOwner({
            postRepo: fastify.repos.postRepo,
            postId: (req.params as { postId: string }).postId,
            userId: req.user!.id
          })
        )
      ]
    },
    async (req) => {
      return hardDeletePost({
        archiveRepo: fastify.repos.archiveRepo,
        commentRepo: fastify.repos.commentRepo,
        postRepo: fastify.repos.postRepo,
        postId: req.params.postId,
        transactionManager: fastify.transactionManager
      });
    }
  );
};

export default routes;
