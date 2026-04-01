import { IEntityRepo } from 'src/types/entity/IEntityRepo';
import { Entity } from 'src/types/entity/Entity';

export async function createEntity(params: {
  entityRepo: IEntityRepo;
  data: Partial<Entity>;
}) {
  const entity = await params.entityRepo.createEntity(params.data);

  return entity;
}