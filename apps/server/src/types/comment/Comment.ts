import { z } from 'zod';

export const CommentSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  postId: z.string().uuid(),
  text: z.string(),
  deletedAt: z.coerce.date().nullable(),
  updatedAt: z.coerce.date(),
  createdAt: z.coerce.date()
});

export type Comment = z.infer<typeof CommentSchema>;
