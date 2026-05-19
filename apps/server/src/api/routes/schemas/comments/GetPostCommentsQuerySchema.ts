import { z } from 'zod';

export const GetPostCommentsQuerySchema = z.object({
  pageSize: z.coerce.number().int().positive().max(100).default(10),
  cursorId: z.string().uuid().optional(),
  cursorCreatedAt: z.coerce.date().optional()
}).refine((query) => {
  return (query.cursorId === undefined) === (query.cursorCreatedAt === undefined);
}, {
  message: 'cursorId and cursorCreatedAt must be provided together'
});
