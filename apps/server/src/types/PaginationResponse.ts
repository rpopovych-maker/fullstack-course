import { z } from 'zod';

export const paginationResponseSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    data: z.array(itemSchema),
    page: z.number(),
    pageSize: z.number(),
    total: z.number(),
    totalPages: z.number()
  });

export type PaginationResponse<T> = z.infer<
  ReturnType<typeof paginationResponseSchema<z.ZodType<T>>>
>;
