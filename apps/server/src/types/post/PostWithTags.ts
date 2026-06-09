import { z } from 'zod';
import { TagSchema } from 'src/types/tag/Tag';
import { PostSchema } from './Post';

export const PostWithTagsSchema = PostSchema.extend({
  tags: TagSchema.array()
});

export type PostWithTags = z.infer<typeof PostWithTagsSchema>;
