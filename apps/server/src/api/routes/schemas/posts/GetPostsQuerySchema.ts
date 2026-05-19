import { PostOrderBySchema } from 'src/types/post/PostOrderBy';
import { SortOrderSchema } from 'src/types/SortOrder';
import { z } from 'zod';

export const GetPostsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(10),
  search: z.string().min(3).optional(),
  orderBy: PostOrderBySchema.optional(),
  order: SortOrderSchema.optional(),
  minCommentsCount: z.coerce.number().int().nonnegative().optional()
});
