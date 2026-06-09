import { IArchiveRepo } from 'src/types/archive/IArchiveRepo';
import { ArchiveEntityType } from 'src/types/archive/ArchiveEntityType';

export async function getArchivesByEntityType(params: {
  archiveRepo: IArchiveRepo
  entityType: ArchiveEntityType
  page: number
  pageSize: number
}) {
  return params.archiveRepo.getArchivesByEntityType({
    entityType: params.entityType,
    page: params.page,
    pageSize: params.pageSize
  });
}
