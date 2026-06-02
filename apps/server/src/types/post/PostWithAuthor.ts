import { z } from 'zod';
import { PostSchema } from './Post';
import { AuthorSchema } from 'src/types/user/Author';
import { TagSchema } from '../tag/Tag';

export const PostWithAuthorSchema = PostSchema.extend({
  author: AuthorSchema,
  tags: TagSchema.array()
});

export type PostWithAuthor = z.infer<typeof PostWithAuthorSchema>;
