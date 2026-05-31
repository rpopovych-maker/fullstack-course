import { HttpError } from 'src/api/errors/HttpError';
import { ITagRepo } from 'src/types/tag/ITagRepo';

export async function deleteTag(params: {
  tagRepo: ITagRepo
  id: string
}) {
  const tag = await params.tagRepo.deleteTag(params.id);

  if (!tag) {
    throw new HttpError(404, 'Tag not found');
  }

  return tag;
}
