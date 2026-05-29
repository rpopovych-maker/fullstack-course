import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { UserRespSchema } from 'src/api/routes/schemas/user/UserRespSchema';
import { acceptInvite } from 'src/controllers/invite/accept-invite';
import { AcceptInviteReqSchema } from 'src/api/routes/schemas/invites/AcceptInviteReqSchema';
import { acceptInviteV2 } from 'src/controllers/invite-v2/accept-invite-v2';
import { AcceptInviteV2ReqSchema } from '../../schemas/invites/AcceptInviteV2ReqSchema';

const routes: FastifyPluginAsync = async function (f) {
  const fastify = f.withTypeProvider<ZodTypeProvider>();

  fastify.post('/', {
    schema: {
      response: {
        200: UserRespSchema
      },
      body: AcceptInviteReqSchema
    },
    config: {
      skipUserLookup: true
    }
  }, async req => {
    const user = await acceptInvite({
      identityService: fastify.identityService,
      identityUser: req.identityUser!,
      inviteRepo: fastify.repos.inviteRepo,
      transactionManager: fastify.transactionManager,
      userRepo: fastify.repos.userRepo,
      password: req.body.password,
      username: req.body.username
    });

    return user;
  });

  fastify.post('/v2/', {
    schema: {
      response: {
        200: UserRespSchema
      },
      body: AcceptInviteV2ReqSchema
    },
    config: {
      skipAuth: true
    }
  }, async req => {
    const user = await acceptInviteV2({
      identityService: fastify.identityService,
      email: req.body.email,
      expireAt: req.body.expireAt,
      signature: req.body.signature,
      signatureService: fastify.signatureService,
      inviteRepo: fastify.repos.inviteRepo,
      transactionManager: fastify.transactionManager,
      userRepo: fastify.repos.userRepo,
      password: req.body.password,
      username: req.body.username
    });

    return user;
  });
};

export default routes;
