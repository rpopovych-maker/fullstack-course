import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { InviteRespSchema } from 'src/api/routes/schemas/invites/InviteRespSchema';
import { CreateInviteReqSchema } from 'src/api/routes/schemas/invites/CreateInviteReqSchema';
import { inviteUser } from 'src/controllers/invite/invite-user';

const routes: FastifyPluginAsync = async function (f) {
  const fastify = f.withTypeProvider<ZodTypeProvider>();

  fastify.post('/', {
    schema: {
      response: {
        200: InviteRespSchema
      },
      body: CreateInviteReqSchema
    }
  }, async (req) => {
    const invite = await inviteUser({
      email: req.body.email,
      identityService: fastify.identityService,
      inviteRepo: fastify.repos.inviteRepo,
      userId: req.user!.id
    });

    return invite;
  });
};

export default routes;
