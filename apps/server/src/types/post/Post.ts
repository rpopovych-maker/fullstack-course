import { z } from 'zod';
import { PostVisibilitySchema } from './PostVisibility';

export const PostSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  title: z.string(),
  description: z.string(),
  visibility: PostVisibilitySchema,
  deletedAt: z.coerce.date().nullable(),
  updatedAt: z.coerce.date(),
  createdAt: z.coerce.date()
});

export type Post = z.infer<typeof PostSchema>;
