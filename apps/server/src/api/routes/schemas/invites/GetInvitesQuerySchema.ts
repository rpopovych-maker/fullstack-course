import { InviteSchema } from 'src/types/invite/Invite';
import { SortOrderSchema } from 'src/types/SortOrder';
import { z } from 'zod';

export const GetInvitesQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(10),
  search: z.string().min(3).optional(),
  order: SortOrderSchema.optional(),
  orderBy: InviteSchema.keyof().optional()
});
