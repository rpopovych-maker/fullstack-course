import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { signUp } from 'src/controllers/signup/sign-up';
import { SignUpReqSchema } from 'src/api/routes/schemas/sign-up/SignUpReqSchema';

const routes: FastifyPluginAsync = async function (f) {
  const fastify = f.withTypeProvider<ZodTypeProvider>();

  fastify.post('/', {
    schema: {
      body: SignUpReqSchema
    },
    config: {
      skipAuth: true
    }
  }, async req => signUp({
      identityService: fastify.identityService,
      userRepo: fastify.repos.userRepo,
      email: req.body.email,
      password: req.body.password,
      username: req.body.username
  }));
};

export default routes;
