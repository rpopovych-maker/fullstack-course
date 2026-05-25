import { z } from 'zod';
import { CommentSchema } from './Comment';
import { AuthorSchema } from 'src/types/user/Author';

export const CommentWithAuthorSchema = CommentSchema.extend({
  author: AuthorSchema
});

export type CommentWithAuthor = z.infer<typeof CommentWithAuthorSchema>;
