import { z } from 'zod';

export const PostSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  title: z.string(),
  description: z.string().optional().nullable(),
  deletedAt: z.coerce.date().nullable(),
  updatedAt: z.coerce.date(),
  createdAt: z.coerce.date()
});

export type Post = z.infer<typeof PostSchema>;
