import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Archive } from './Archive';
import { ArchiveEntityType } from './ArchiveEntityType';
import { PaginationResponse } from 'src/types/PaginationResponse';

export interface IArchiveRepo {
  createArchive: (data: Pick<Archive, 'originalEntityId' | 'entityType' | 'data'>, tx?: NodePgDatabase) => Promise<Archive>;
  getArchiveById: (id: string) => Promise<Archive | null>;
  getArchivesByEntityType: (params: {
    entityType: ArchiveEntityType,
    page: number,
    pageSize: number
  }) => Promise<PaginationResponse<Archive>>;
  deleteArchiveById: (id: string, tx?: NodePgDatabase) => Promise<void>;
}
