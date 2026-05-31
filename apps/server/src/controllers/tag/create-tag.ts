import { ITagRepo } from 'src/types/tag/ITagRepo';

export async function createTag(params: {
  tagRepo: ITagRepo
  name: string
}) {
  const tag = await params.tagRepo.createTag({
    name: params.name
  });

  return tag;
}
