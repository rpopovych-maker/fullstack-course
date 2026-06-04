import { z } from 'zod';

export const CommentSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  postId: z.string().uuid(),
  text: z.string(),
  deletedAt: z.date().nullable(),
  updatedAt: z.date(),
  createdAt: z.date()
});

export type Comment = z.infer<typeof CommentSchema>;
