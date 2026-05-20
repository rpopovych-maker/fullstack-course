import { z } from 'zod';

export const IdentityUserSchema = z.object({
  subId: z.string().uuid(),
  email: z.string().email()
});

export type IdentityUser = z.infer<typeof IdentityUserSchema>;
