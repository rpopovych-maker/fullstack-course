import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { cancelSubscription } from 'src/controllers/subscription/cancel-subscription';

const routes: FastifyPluginAsync = async function (f) {
  const fastify = f.withTypeProvider<ZodTypeProvider>();

  fastify.post('/', {},
    async (req, reply) => {
      await cancelSubscription({
        stripeService: fastify.stripeService,
        subscriptionRepo: fastify.repos.subscriptionRepo,
        userId: req.user!.id
      });

      return reply.status(204).send();
    });
};

export default routes;
