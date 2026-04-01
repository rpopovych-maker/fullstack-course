import { z } from 'zod';
import { PostSchema } from './Post';

export const PostWithCommentsCountSchema = PostSchema.extend({
  commentsCount: z.number()
});

export type PostWithCommentsCount = z.infer<typeof PostWithCommentsCountSchema>;
