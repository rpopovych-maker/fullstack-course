import { z } from 'zod';
import { UserRoleSchema } from './UserRole';

export const UserSchema = z.object({
  id: z.string().uuid(),
  subId: z.string().uuid(),
  stripeCustomerId: z.string().nullable().default(null),
  role: UserRoleSchema,
  email: z.string().email(),
  username: z.string(),
  deletedAt: z.coerce.date().nullable(),
  bannedAt: z.coerce.date().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date()
});

export type User = z.infer<typeof UserSchema>;
