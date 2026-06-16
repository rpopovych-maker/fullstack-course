import { z } from 'zod';
import { PostWithAuthorSchema } from 'src/types/post/PostWithAuthor';
import { TagSchema } from 'src/types/tag/Tag';

export const GetPostByIdRespSchema = PostWithAuthorSchema.extend({
  tags: TagSchema.array(),
  isLocked: z.boolean().default(false)
});
