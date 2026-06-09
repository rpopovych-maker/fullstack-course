import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { GetUsersQuerySchema } from 'src/api/routes/schemas/user/GetUsersQuerySchema';
import { GetUsersRespSchema } from 'src/api/routes/schemas/user/GetUsersRespSchema';
import { getSoftDeletedUsers } from 'src/controllers/user/get-soft-deleted-users';

const routes: FastifyPluginAsync = async function (f) {
  const fastify = f.withTypeProvider<ZodTypeProvider>();

  fastify.get('/', {
    schema: {
      querystring: GetUsersQuerySchema,
      response: {
        200: GetUsersRespSchema
      }
    }
  }, async req => {
    return getSoftDeletedUsers({
      page: req.query.page,
      pageSize: req.query.pageSize,
      search: req.query.search,
      order: req.query.order,
      orderBy: req.query.orderBy,
      userRepo: fastify.repos.userRepo
    });
  });
};

export default routes;
