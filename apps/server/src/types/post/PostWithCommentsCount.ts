import { z } from 'zod';
import { PostWithAuthorSchema } from './PostWithAuthor';
import { TagSchema } from '../tag/Tag';

export const PostWithCommentsCountSchema = PostWithAuthorSchema.extend({
  tags: TagSchema.array(),
  commentsCount: z.number()
});

export type PostWithCommentsCount = z.infer<typeof PostWithCommentsCountSchema>;
