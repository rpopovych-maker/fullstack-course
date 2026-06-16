import { paginationResponseSchema } from 'src/types/PaginationResponse';
import { ArchiveSchema } from 'src/types/archive/Archive';

export const GetArchivesRespSchema = paginationResponseSchema(ArchiveSchema);
