import { Tag } from './Tag';

export interface ITagRepo {
  getTags(search?: string): Promise<Tag[]>
  createTag(data: Pick<Tag, 'name'>): Promise<Tag>
  updateTag(id: string, data: Pick<Tag, 'name'>): Promise<Tag | null>
  deleteTag(id: string): Promise<Tag | null>
}
