import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { InviteRespSchema } from 'src/api/routes/schemas/invites/InviteRespSchema';
import { resendInvite } from 'src/controllers/invite/resend-invite';
import { z } from 'zod';

const routes: FastifyPluginAsync = async function (f) {
  const fastify = f.withTypeProvider<ZodTypeProvider>();

  fastify.post('/', {
    schema: {
      response: {
        200: InviteRespSchema
      },
      params: z.object({
        inviteId: z.string().uuid()
      })
    }
  }, async (req) => {
    const invite = await resendInvite({
      inviteId: req.params.inviteId,
      identityService: fastify.identityService,
      inviteRepo: fastify.repos.inviteRepo
    });

    return invite;
  });
};

export default routes;
