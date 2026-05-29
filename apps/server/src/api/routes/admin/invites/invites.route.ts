import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { InviteRespSchema } from 'src/api/routes/schemas/invites/InviteRespSchema';
import { CreateInviteReqSchema } from 'src/api/routes/schemas/invites/CreateInviteReqSchema';
import { createInvite } from 'src/controllers/invite/create-invite';
import { createInviteV2 } from 'src/controllers/invite-v2/create-invite-v2';

const routes: FastifyPluginAsync = async function (f) {
  const fastify = f.withTypeProvider<ZodTypeProvider>();

  fastify.get('/', {
    schema: {
      response: {
        200: InviteRespSchema.array()
      }
    }
  }, async () => {
    return fastify.repos.inviteRepo.getInvites();
  });

  fastify.post('/', {
    schema: {
      response: {
        200: InviteRespSchema
      },
      body: CreateInviteReqSchema
    }
  }, async (req) => {
    const invite = await createInvite({
      email: req.body.email,
      identityService: fastify.identityService,
      inviteRepo: fastify.repos.inviteRepo,
      userId: req.user!.id
    });

    return invite;
  });

  fastify.post('/v2/', {
    schema: {
      response: {
        200: InviteRespSchema
      },
      body: CreateInviteReqSchema
    }
  }, async (req) => {
    return await createInviteV2({
      email: req.body.email,
      emailService: fastify.emailService,
      identityService: fastify.identityService,
      inviteRepo: fastify.repos.inviteRepo,
      signatureService: fastify.signatureService,
      userId: req.user!.id
    });
  });
};

export default routes;
