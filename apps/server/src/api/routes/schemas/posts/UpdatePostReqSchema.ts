import z from 'zod';

export const UpdatePostReqSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().optional(),
  tagIds: z.string().uuid().array().optional()
});