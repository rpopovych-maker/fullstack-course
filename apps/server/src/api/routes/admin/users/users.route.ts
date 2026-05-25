import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { GetUsersQuerySchema } from 'src/api/routes/schemas/admin/GetUsersQuerySchema';
import { getUsers } from 'src/controllers/admin/get-users';
import { GetUsersRespSchema } from 'src/api/routes/schemas/admin/GetUsersRespSchema';

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
    const users = await getUsers({
      page: req.query.page,
      pageSize: req.query.pageSize,
      search: req.query.search,
      userRepo: fastify.repos.userRepo
    });

    return users;
  });
};

export default routes;
