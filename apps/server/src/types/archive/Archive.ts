import { z } from 'zod';
import { ArchiveEntityTypeSchema } from './ArchiveEntityType';

export const ArchiveSchema = z.object({
  id: z.string().uuid(),
  entityType: ArchiveEntityTypeSchema,
  originalEntityId: z.string().uuid(),
  data: z.record(z.string(), z.unknown()),
  archivedAt: z.date()
});

export type Archive = z.infer<typeof ArchiveSchema>;
