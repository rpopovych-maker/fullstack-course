import { z } from 'zod';
import { PostSchema } from './Post';
import { CommentSchema } from 'src/types/comment/Comment';

export const PostWithCommentsSchema = PostSchema.extend({
  comments: z.array(CommentSchema)
});

export type PostWithComments = z.infer<typeof PostWithCommentsSchema>;
