import { z } from 'zod';

export const AuthorSchema = z.object({
  id: z.string().uuid(),
  username: z.string()
});

export type Author = z.infer<typeof AuthorSchema>;
