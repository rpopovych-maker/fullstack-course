import { z } from 'zod';

export const AcceptInviteReqSchema = z.object({
  password: z.string().min(8),
  username: z.string().min(3)
});