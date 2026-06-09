import { z } from 'zod';
import { CommentSchema } from 'src/types/comment/Comment';
import { TagSchema } from 'src/types/tag/Tag';
import { PostSchema } from './Post';

export const PostWithCommentsAndTagsSchema = PostSchema.extend({
  comments: CommentSchema.array(),
  tags: TagSchema.array()
});

export type PostWithCommentsAndTags = z.infer<typeof PostWithCommentsAndTagsSchema>;
