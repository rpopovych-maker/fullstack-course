import { HttpError } from 'src/api/errors/HttpError';
import { ITagRepo } from 'src/types/tag/ITagRepo';

export async function updateTag(params: {
  tagRepo: ITagRepo
  name: string
  id: string
}) {
  const tag = await params.tagRepo.updateTag(params.id, {
    name: params.name
  });

  if (!tag) {
    throw new HttpError(404, 'Tag not found');
  }

  return tag;
}
