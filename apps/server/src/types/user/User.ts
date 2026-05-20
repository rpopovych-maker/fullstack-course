import { z } from 'zod';

export const UserSchema = z.object({
  id: z.string().uuid(),
  subId: z.string().uuid(),
  email: z.string().email(),
  createdAt: z.date(),
  updatedAt: z.date()
});

export type User = z.infer<typeof UserSchema>;
