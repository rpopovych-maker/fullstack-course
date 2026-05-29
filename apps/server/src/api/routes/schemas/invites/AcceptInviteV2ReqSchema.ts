import { z } from 'zod';

export const AcceptInviteV2ReqSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  username: z.string().min(3),
  expireAt: z.string().datetime(),
  signature: z.string().min(1)
});
