import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { GetArchivesQuerySchema } from 'src/api/routes/schemas/archive/GetArchivesQuerySchema';
import { GetArchivesRespSchema } from 'src/api/routes/schemas/archive/GetArchivesRespSchema';
import { getArchivesByEntityType } from 'src/controllers/archive/get-archives-by-entity-type';

const routes: FastifyPluginAsync = async function (f) {
  const fastify = f.withTypeProvider<ZodTypeProvider>();

  fastify.get('/', {
    schema: {
      querystring: GetArchivesQuerySchema,
      response: {
        200: GetArchivesRespSchema
      }
    }
  }, async req => {
    return getArchivesByEntityType({
      archiveRepo: fastify.repos.archiveRepo,
      entityType: 'comment',
      page: req.query.page,
      pageSize: req.query.pageSize
    });
  });
};

export default routes;
