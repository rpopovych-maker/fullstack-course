import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { GetPostByIdRespSchema } from 'src/api/routes/schemas/posts/GetPostByIdRespSchema';
import { UpdatePostByIdReqSchema } from 'src/api/routes/schemas/posts/UpdatePostByIdReqSchema';
import { updatePostById } from 'src/controllers/post/update-post-by-id';
import { getPostById } from 'src/controllers/post/get-post-by-id';
import { PostRespSchema } from 'src/api/routes/schemas/posts/PostRespSchema';

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
      }
    },
    async (req) => {
      const entity = await getPostById({
        postRepo: fastify.repos.postRepo,
        postId: req.params.postId
      });
      return entity;
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
      }
    },
    async (req) => {
      const entity = await updatePostById({
        postRepo: fastify.repos.postRepo,
        postId: req.params.postId,
        data: req.body
      });
      return entity;
    }
  );
};

export default routes;
