import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { UserRespSchema } from 'src/api/routes/schemas/user/UserRespSchema';
import { softDeleteUser } from 'src/controllers/user/soft-delete-user';
import { z } from 'zod';

const routes: FastifyPluginAsync = async function (f) {
  const fastify = f.withTypeProvider<ZodTypeProvider>();

  fastify.delete('/', {
    schema: {
      response: {
        200: UserRespSchema
      },
      params: z.object({
        userId: z.string().uuid() 
      })
    }
  }, async req => {
    const user = softDeleteUser({
      userId: req.params.userId,
      commentRepo: fastify.repos.commentRepo,
      postRepo: fastify.repos.postRepo,
      subscriptionRepo: fastify.repos.subscriptionRepo,
      stripeService: fastify.stripeService,
      identityService: fastify.identityService,
      userRepo: fastify.repos.userRepo,
      transactionManager: fastify.transactionManager
    });
    
    return user;
  });
};

export default routes;
