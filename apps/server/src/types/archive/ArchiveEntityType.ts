import { z } from 'zod';

export const ArchiveEntityTypeSchema = z.enum(['user', 'post', 'comment']);

export type ArchiveEntityType = z.infer<typeof ArchiveEntityTypeSchema>;