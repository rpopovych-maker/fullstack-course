import { ITagRepo } from 'src/types/tag/ITagRepo';

export async function getTags(params: {
  tagRepo: ITagRepo
  search?: string
}) {
  const tags = await params.tagRepo.getTags(params.search);

  return tags;
}
