import { z } from 'zod';
import { InviteSchema } from './Invite';

export const GetInvitesResultSchema = z.object({
  data: z.array(InviteSchema),
  page: z.number(),
  pageSize: z.number(),
  total: z.number(),
  totalPages: z.number()
});

export type GetInvitesResult = z.infer<typeof GetInvitesResultSchema>;
