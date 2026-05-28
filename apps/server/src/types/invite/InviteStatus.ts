import { z } from 'zod';

export const InviteStatusSchema = z.enum(['pending', 'accepted']);

export type InviteStatus = z.infer<typeof InviteStatusSchema>;
  