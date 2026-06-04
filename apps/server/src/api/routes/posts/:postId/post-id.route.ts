import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { GetPostByIdRespSchema } from 'src/api/routes/schemas/posts/GetPostByIdRespSchema';
import { UpdatePostReqSchema } from 'src/api/routes/schemas/posts/UpdatePostReqSchema';
import { updatePostById } from 'src/controllers/post/update-post-by-id';
import { getPostById } from 'src/controllers/post/get-post-by-id';
import { PostRespSchema } from 'src/api/routes/schemas/posts/PostRespSchema';
import { hasPermission } from 'src/api/hooks/permission.hook';
import { isPostOwner } from 'src/controllers/post/is-post-owner';
import { softDeletePost } from 'src/controllers/post/soft-delete-post';

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
        body: UpdatePostReqSchema
      },
      preHandler: [
        hasPermission('update:posts', req =>
          isPostOwner({
            postRepo: fastify.repos.postRepo,
            postId: (req.params as { postId: string }).postId,
            userId: req.user!.id
          })
        )
      ]
    },
    async (req) => {
      const post = await updatePostById({
        postRepo: fastify.repos.postRepo,
        postToTagRepo: fastify.repos.postToTagRepo,
        transactionManager: fastify.transactionManager,
        postId: req.params.postId,
        title: req.body.title,
        description: req.body.description,
        tagIds: req.body.tagIds
      });
      return post;
    }
  );

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
      const post = await softDeletePost({
        postRepo: fastify.repos.postRepo,
        commentRepo: fastify.repos.commentRepo,
        transactionManager: fastify.transactionManager,
        postId: req.params.postId
      });
      
      return post;
    }
  );
};

export default routes;
