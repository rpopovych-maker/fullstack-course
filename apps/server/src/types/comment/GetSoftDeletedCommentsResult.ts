import { z } from 'zod';
import { CommentSchema } from './Comment';

export const GetSoftDeletedCommentsResultSchema = z.object({
  data: CommentSchema.array(),
  page: z.number(),
  pageSize: z.number(),
  total: z.number(),
  totalPages: z.number()
});

export type GetSoftDeletedCommentsResult = z.infer<typeof GetSoftDeletedCommentsResultSchema>;
