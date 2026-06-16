import { z } from 'zod';
import { CommentWithAuthorSchema } from 'src/types/comment/CommentWithAuthor';
import { CommentCursorSchema } from 'src/types/comment/CommentCursor';

export const GetPostCommentsRespSchema = z.object({
  data: CommentWithAuthorSchema.array(),
  nextCursor: CommentCursorSchema.nullable()
});
