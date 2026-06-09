import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { GetArchivesQuerySchema } from 'src/api/routes/schemas/archive/GetArchivesQuerySchema';
import { GetSoftDeletedCommentsRespSchema } from 'src/api/routes/schemas/archive/GetSoftDeletedCommentsRespSchema';
import { getSoftDeletedComments } from 'src/controllers/comment/get-soft-deleted-comments';

const routes: FastifyPluginAsync = async function (f) {
  const fastify = f.withTypeProvider<ZodTypeProvider>();

  fastify.get('/', {
    schema: {
      querystring: GetArchivesQuerySchema,
      response: {
        200: GetSoftDeletedCommentsRespSchema
      }
    }
  }, async req => {
    return getSoftDeletedComments({
      commentRepo: fastify.repos.commentRepo,
      page: req.query.page,
      pageSize: req.query.pageSize
    });
  });
};

export default routes;
