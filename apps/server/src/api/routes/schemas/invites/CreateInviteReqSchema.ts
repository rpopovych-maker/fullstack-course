import { z } from 'zod';

export const CreateInviteReqSchema = z.object({
  email: z.string().email()
});