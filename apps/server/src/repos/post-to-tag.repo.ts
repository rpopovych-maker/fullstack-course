import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { postToTagTable } from 'src/services/drizzle/schema';
import { IPostToTagRepo } from 'src/types/IPostTagsRepo';

export function getPostToTagRepo(db: NodePgDatabase): IPostToTagRepo {
  return {
    async createPostTags(postId, tagIds, tx) {
      if (!tagIds.length) {
        return;
      }

      await (tx ?? db)
        .insert(postToTagTable)
        .values(tagIds.map((tagId) => ({
          postId,
          tagId
        })));
    },

    async updatePostTags(postId, tagIds, tx) {
      await (tx ?? db)
        .delete(postToTagTable)
        .where(eq(postToTagTable.postId, postId));
      
      if (tagIds.length) {
        await (tx ?? db)
          .insert(postToTagTable)
          .values(tagIds.map(tagId => ({ postId, tagId })));
      }
    }
  };
};
