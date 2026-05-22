import { z } from 'zod';

export const SignUpReqSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});
