import z from 'zod';

export const UpsertTagReqSchema = z.object({
  name: z.string().trim().min(1).max(100)
});