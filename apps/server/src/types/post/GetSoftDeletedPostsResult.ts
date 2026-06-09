import { z } from 'zod';
import { PostSchema } from './Post';

export const GetSoftDeletedPostsResultSchema = z.object({
  data: PostSchema.array(),
  page: z.number(),
  pageSize: z.number(),
  total: z.number(),
  totalPages: z.number()
});

export type GetSoftDeletedPostsResult = z.infer<typeof GetSoftDeletedPostsResultSchema>;
