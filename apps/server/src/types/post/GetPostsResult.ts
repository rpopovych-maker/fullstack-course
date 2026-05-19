import { z } from 'zod';
import { PostWithCommentsCountSchema } from './PostWithCommentsCount';

export const GetPostsResultSchema = z.object({
  data: z.array(PostWithCommentsCountSchema),
  page: z.number(),
  pageSize: z.number(),
  total: z.number(),
  totalPages: z.number()
});

export type GetPostsResult = z.infer<typeof GetPostsResultSchema>;
