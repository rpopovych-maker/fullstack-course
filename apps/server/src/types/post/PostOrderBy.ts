import { z } from 'zod';
import { PostWithCommentsCountSchema } from './PostWithCommentsCount';

export const PostOrderBySchema = PostWithCommentsCountSchema.pick({
  title: true,
  createdAt: true,
  commentsCount: true
}).keyof();

export type PostOrderBy = z.infer<typeof PostOrderBySchema>;