import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { createPost } from 'src/controllers/post/create-post';
import { getPosts } from 'src/controllers/post/get-posts';
import { GetPostsRespSchema } from 'src/api/routes/schemas/posts/GetPostsRespSchema';
import { CreatePostReqSchema } from 'src/api/routes/schemas/posts/CreatePostReqSchema';
import { PostRespSchema } from 'src/api/routes/schemas/posts/PostRespSchema';
import { GetPostsQuerySchema } from 'src/api/routes/schemas/posts/GetPostsQuerySchema';
import { hasPermission } from 'src/api/hooks/permission.hook';

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
      },
      preHandler: [hasPermission('create:posts')]
    },
    async (req) => {
      const post = await createPost({
        postRepo: fastify.repos.postRepo,
        postToTagRepo: fastify.repos.postToTagRepo,
        transactionManager: fastify.transactionManager,
        userId: req.user!.id,
        title: req.body.title,
        description: req.body.description,
        tagIds: req.body.tagIds,
        visibility: req.body.visibility
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
        minCommentsCount: req.query.minCommentsCount,
        tagIds: req.query.tagIds,
        viewer: req.user!,
        currentSubscription: req.userCurrentSubscription ?? null
      });
      return posts;
    }
  );
};

export default routes;
