import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { CreatePostReqSchema } from 'src/api/routes/schemas/posts/CreatePostReqSchema';
import { GetPostsRespSchema } from 'src/api/routes/schemas/posts/GetPostsRespSchema';
import { createPost } from 'src/controllers/post/create-post';
import { PostRespSchema } from '../schemas/posts/PostRespSchema';

const routes: FastifyPluginAsync = async function (f) {
  const fastify = f.withTypeProvider<ZodTypeProvider>();

  fastify.post(
    '/',
    {
      schema: {
        response: {
          200: PostRespSchema
        },
        body: CreatePostReqSchema
      }
    },
    async (req) => {
      const post = await createPost({
        postRepo: fastify.repos.postRepo,
        data: req.body
      });
      return post;
    }
  );

  fastify.get(
    '/',
    {
      schema: {
        response: {
          200: GetPostsRespSchema
        }
      }
    },
    async () => {
      const posts = await fastify.repos.postRepo.getAllPosts();
      return posts;
    }
  );
};

export default routes;
