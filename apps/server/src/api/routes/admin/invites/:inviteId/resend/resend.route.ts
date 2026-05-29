import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { InviteRespSchema } from 'src/api/routes/schemas/invites/InviteRespSchema';
import { resendInviteV2 } from 'src/controllers/invite-v2/resend-invite-v2';
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

  fastify.post('/v2/', {
    schema: {
      response: {
        200: InviteRespSchema
      },
      params: z.object({
        inviteId: z.string().uuid()
      })
    }
  }, async (req) => {
    return await resendInviteV2({
      inviteId: req.params.inviteId,
      emailService: fastify.emailService,
      inviteRepo: fastify.repos.inviteRepo,
      signatureService: fastify.signatureService
    });
  });
};

export default routes;
