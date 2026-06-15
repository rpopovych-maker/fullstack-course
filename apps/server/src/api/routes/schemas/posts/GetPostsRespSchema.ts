import { z } from 'zod';
import { PostWithCommentsCountSchema } from 'src/types/post/PostWithCommentsCount';

export const GetPostsRespSchema = z.object({
  data: z.array(
    PostWithCommentsCountSchema.extend({
      isLocked: z.boolean().default(false)
    })
  ),
  page: z.number(),
  pageSize: z.number(),
  total: z.number(),
  totalPages: z.number()
});
