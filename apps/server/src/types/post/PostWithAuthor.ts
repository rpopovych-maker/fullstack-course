import { z } from 'zod';
import { PostSchema } from './Post';
import { AuthorSchema } from 'src/types/user/Author';

export const PostWithAuthorSchema = PostSchema.extend({
  author: AuthorSchema
});

export type PostWithAuthor = z.infer<typeof PostWithAuthorSchema>;
