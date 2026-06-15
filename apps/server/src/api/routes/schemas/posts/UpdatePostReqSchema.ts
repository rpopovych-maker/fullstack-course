import z from 'zod';
import { PostVisibilitySchema } from 'src/types/post/PostVisibility';

export const UpdatePostReqSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().optional(),
  tagIds: z.string().uuid().array().optional(),
  visibility: PostVisibilitySchema.optional()
});
