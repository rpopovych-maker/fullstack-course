import { FastifyPluginAsync } from 'fastify';
import { processWebhook } from 'src/controllers/stripe/process-webhook';

const routes: FastifyPluginAsync = async function (fastify) {
  fastify.post('/', {
    config: {
      skipAuth: true,
      rawBody: true
    }
  }, async (req, reply) => {
    await processWebhook({
      stripeService: fastify.stripeService,
      subscriptionRepo: fastify.repos.subscriptionRepo,
      userRepo: fastify.repos.userRepo,
      payload: req.rawBody,
      signature: req.headers['stripe-signature']
    });

    return reply.status(204).send();
  });
};

export default routes;
