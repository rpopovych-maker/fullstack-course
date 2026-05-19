import { z } from 'zod';

export const CommentCursorSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.date()
});

export type CommentCursor = z.infer<typeof CommentCursorSchema>;