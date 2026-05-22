import { z } from 'zod';
import { PostWithAuthorSchema } from './PostWithAuthor';

export const PostWithCommentsCountSchema = PostWithAuthorSchema.extend({
  commentsCount: z.number()
});

export type PostWithCommentsCount = z.infer<typeof PostWithCommentsCountSchema>;
