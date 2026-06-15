import { z } from 'zod';

export const PostVisibilitySchema = z.enum(['public', 'members']);

export type PostVisibility = z.infer<typeof PostVisibilitySchema>;
