import { z } from 'zod';
import { CommentWithAuthorSchema } from './CommentWithAuthor';
import { CommentCursorSchema } from './CommentCursor';

export const GetPostCommentsResultSchema = z.object({
  data: z.array(CommentWithAuthorSchema),
  nextCursor: CommentCursorSchema.nullable()
});

export type GetPostCommentsResult = z.infer<typeof GetPostCommentsResultSchema>;
