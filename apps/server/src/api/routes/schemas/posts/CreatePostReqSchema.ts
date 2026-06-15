import z from 'zod';
import { PostVisibilitySchema } from 'src/types/post/PostVisibility';

export const CreatePostReqSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  tagIds: z.string().uuid().array().optional(),
  visibility: PostVisibilitySchema.optional()
});
