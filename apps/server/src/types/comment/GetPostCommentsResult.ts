import { z } from 'zod';
import { CommentSchema } from './Comment';
import { CommentCursorSchema } from './CommentCursor';

export const GetPostCommentsResultSchema = z.object({
  data: z.array(CommentSchema),
  nextCursor: CommentCursorSchema.nullable()
});

export type GetPostCommentsResult = z.infer<typeof GetPostCommentsResultSchema>;
