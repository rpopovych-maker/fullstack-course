import { z } from 'zod';
import { InviteStatusSchema } from './InviteStatus';

export const InviteSchema = z.object({
  id: z.string().uuid(),
  subId: z.string().uuid(),
  email: z.string().email(),
  status: InviteStatusSchema,
  invitedByUserId: z.string().uuid(),
  sentAt: z.date(),
  resentAt: z.date().nullable(),
  acceptedAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date()
});

export type Invite = z.infer<typeof InviteSchema>;
  