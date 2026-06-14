import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { createCheckoutSession } from 'src/controllers/subscription/create-checkout-session';
import { CreateCheckoutSessionRespSchema } from 'src/api/routes/schemas/subscriptions/CreateCheckoutSessionRespSchema';

const routes: FastifyPluginAsync = async function (f) {
  const fastify = f.withTypeProvider<ZodTypeProvider>();

  fastify.post('/', {
    schema: {
      response: {
        200: CreateCheckoutSessionRespSchema
      }
    }
  }, async (req) => {
    return createCheckoutSession({
      stripeService: fastify.stripeService,
      subscriptionRepo: fastify.repos.subscriptionRepo,
      userRepo: fastify.repos.userRepo,
      stripeCustomerId: req.user!.stripeCustomerId,
      userId: req.user!.id,
      email: req.user!.email
    });
  });
};

export default routes;
