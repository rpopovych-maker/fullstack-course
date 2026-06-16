import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Tag } from './tag/Tag';

export interface IPostToTagRepo {
  getTagsByPostId(postId: string): Promise<Tag[]>
  createPostTags(postId: string, tagIds: string[], tx?: NodePgDatabase): Promise<void>
  createPostTagsForPosts(
    data: Array<{
      postId: string
      tagIds: string[]
    }>,
    tx?: NodePgDatabase
  ): Promise<void>
  updatePostTags(postId: string, tagIds: string[], tx?: NodePgDatabase): Promise<void>
}
