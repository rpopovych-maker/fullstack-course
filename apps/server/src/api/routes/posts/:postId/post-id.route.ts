import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { GetPostByIdRespSchema } from 'src/api/routes/schemas/posts/GetPostByIdRespSchema';
import { UpdatePostByIdReqSchema } from 'src/api/routes/schemas/posts/UpdatePostByIdReqSchema';
import { updatePostById } from 'src/controllers/post/update-post-by-id';
import { getPostById } from 'src/controllers/post/get-post-by-id';
import { PostRespSchema } from 'src/api/routes/schemas/posts/PostRespSchema';
import { hasPermission } from 'src/api/hooks/permission.hook';
import { isPostOwner } from 'src/controllers/post/is-post-owner';

const routes: FastifyPluginAsync = async function (f) {
  const fastify = f.withTypeProvider<ZodTypeProvider>();

  fastify.get(
    '/',
    {
      schema: {
        params: z.object({
          postId: z.string().uuid()
        }),
        response: {
          200: GetPostByIdRespSchema
        }
      },
      config: {
        skipAuth: true
      }
    },
    async (req) => {
      const post = await getPostById({
        postRepo: fastify.repos.postRepo,
        postId: req.params.postId
      });
      return post;
    }
  );

  fastify.patch(
    '/',
    {
      schema: {
        params: z.object({
          postId: z.string().uuid()
        }),
        response: {
          200: PostRespSchema
        },
        body: UpdatePostByIdReqSchema
      },
      preHandler: [
        hasPermission('update:posts', req =>
          isPostOwner({
            postRepo: fastify.repos.postRepo,
            postId: (req.params as { postId: string }).postId,
            userId: req.user.id
          })
        )
      ]
    },
    async (req) => {
      const post = await updatePostById({
        postRepo: fastify.repos.postRepo,
        postId: req.params.postId,
        data: req.body
      });
      return post;
    }
  );
};

export default routes;
