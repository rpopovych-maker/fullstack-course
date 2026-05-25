import { z } from 'zod';
import { UserSchema } from 'src/types/user/User';

export const GetUsersResultSchema = z.object({
  data: z.array(UserSchema),
  page: z.number(),
  pageSize: z.number(),
  total: z.number(),
  totalPages: z.number()
});

export type GetUsersResult = z.infer<typeof GetUsersResultSchema>;
