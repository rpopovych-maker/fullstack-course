import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { CurrentSubscriptionRespSchema } from 'src/api/routes/schemas/subscriptions/CurrentSubscriptionRespSchema';

const routes: FastifyPluginAsync = async function (f) {
  const fastify = f.withTypeProvider<ZodTypeProvider>();

  fastify.get(
    '/',
    {
      schema: {
        response: {
          200: CurrentSubscriptionRespSchema
        }
      }
    },
    async (req) => {
      return req.userCurrentSubscription;
    }
  );
};

export default routes;
