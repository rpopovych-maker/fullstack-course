import { z } from 'zod';

export const GetTagsQuerySchema = z.object({
  search: z.string().optional()
});
