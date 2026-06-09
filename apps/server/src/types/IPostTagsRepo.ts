import { NodePgDatabase } from 'drizzle-orm/node-postgres';

export interface IPostToTagRepo {
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
