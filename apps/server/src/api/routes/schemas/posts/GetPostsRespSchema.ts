import { z } from 'zod';
import { paginationResponseSchema } from 'src/types/PaginationResponse';
import { PostWithCommentsCountSchema } from 'src/types/post/PostWithCommentsCount';

export const GetPostsRespSchema = paginationResponseSchema(
  PostWithCommentsCountSchema.extend({
    isLocked: z.boolean().default(false)
  })
);
