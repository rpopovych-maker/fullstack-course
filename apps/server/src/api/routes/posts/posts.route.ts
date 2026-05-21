import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { createPost } from 'src/controllers/post/create-post';
import { getPosts } from 'src/controllers/post/get-posts';
import { GetPostsRespSchema } from 'src/api/routes/schemas/posts/GetPostsRespSchema';
import { CreatePostReqSchema } from 'src/api/routes/schemas/posts/CreatePostReqSchema';
import { PostRespSchema } from 'src/api/routes/schemas/posts/PostRespSchema';
import { GetPostsQuerySchema } from 'src/api/routes/schemas/posts/GetPostsQuerySchema';

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
        userId: req.user.id,
        ...req.body
      });

      return post;
    }
  );

  fastify.get(
    '/',
    {
      schema: {
        querystring: GetPostsQuerySchema,
        response: {
          200: GetPostsRespSchema
        }
      },
      config: {
        skipAuth: true
      }
    },
    async (req) => {
      const posts = await getPosts({
        postRepo: fastify.repos.postRepo,
        page: req.query.page,
        pageSize: req.query.pageSize,
        search: req.query.search,
        orderBy: req.query.orderBy,
        order: req.query.order,
        minCommentsCount: req.query.minCommentsCount
      });
      return posts;
    }
  );
};

export default routes;
