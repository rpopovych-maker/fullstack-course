import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { UserRespSchema } from 'src/api/routes/schemas/user/UserRespSchema';

const routes: FastifyPluginAsync = async function (f) {
  const fastify = f.withTypeProvider<ZodTypeProvider>();

  fastify.get('/', {
    schema: {
      response: {
        200: UserRespSchema
      }
    }
  }, async req => req.user);
};

export default routes;
