import { z } from 'zod';
import { ArchiveSchema } from 'src/types/archive/Archive';

export const GetArchivesRespSchema = z.object({
  data: z.array(ArchiveSchema),
  page: z.number(),
  pageSize: z.number(),
  total: z.number(),
  totalPages: z.number()
});
