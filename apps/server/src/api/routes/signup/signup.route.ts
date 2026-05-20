import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { signUp } from 'src/controllers/signup/sign-up';
import { SignUpRespSchema } from 'src/api/routes/schemas/signup/SignUpRespSchema';

const routes: FastifyPluginAsync = async function (f) {
  const fastify = f.withTypeProvider<ZodTypeProvider>();

  fastify.post(
    '/',
    {
      schema: {
        response: {
          200: SignUpRespSchema
        }
      }
    },
    async (req) => {
      const user = await signUp({
        userRepo: fastify.repos.userRepo,
        subId: '',
        email: ''
      });
      return user;
    }
  );
};

export default routes;
