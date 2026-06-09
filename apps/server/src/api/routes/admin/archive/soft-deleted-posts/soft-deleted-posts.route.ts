import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { GetArchivesQuerySchema } from 'src/api/routes/schemas/archive/GetArchivesQuerySchema';
import { GetSoftDeletedPostsRespSchema } from 'src/api/routes/schemas/archive/GetSoftDeletedPostsRespSchema';
import { getSoftDeletedPosts } from 'src/controllers/post/get-soft-deleted-posts';

const routes: FastifyPluginAsync = async function (f) {
  const fastify = f.withTypeProvider<ZodTypeProvider>();

  fastify.get('/', {
    schema: {
      querystring: GetArchivesQuerySchema,
      response: {
        200: GetSoftDeletedPostsRespSchema
      }
    }
  }, async req => {
    return getSoftDeletedPosts({
      postRepo: fastify.repos.postRepo,
      page: req.query.page,
      pageSize: req.query.pageSize
    });
  });
};

export default routes;
