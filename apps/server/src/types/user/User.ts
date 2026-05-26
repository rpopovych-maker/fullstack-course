import { z } from 'zod';
import { UserRoleSchema } from './UserRole';

export const UserSchema = z.object({
  id: z.string().uuid(),
  subId: z.string().uuid(),
  role: UserRoleSchema,
  email: z.string().email(),
  username: z.string(),
  bannedAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date()
});

export type User = z.infer<typeof UserSchema>;
  