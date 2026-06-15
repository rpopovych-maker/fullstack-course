import { z } from 'zod';
import { PostWithAuthorSchema } from 'src/types/post/PostWithAuthor';

export const GetPostByIdRespSchema = PostWithAuthorSchema.extend({
  isLocked: z.boolean().default(false)
});
