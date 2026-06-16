import { eq, getTableColumns } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { postToTagTable, tagsTable } from 'src/services/drizzle/schema';
import { IPostToTagRepo } from 'src/types/IPostTagsRepo';
import { TagSchema } from 'src/types/tag/Tag';

export function getPostToTagRepo(db: NodePgDatabase): IPostToTagRepo {
  return {
    async getTagsByPostId(postId) {
      const tags = await db
        .select(getTableColumns(tagsTable))
        .from(postToTagTable)
        .innerJoin(tagsTable, eq(tagsTable.id, postToTagTable.tagId))
        .where(eq(postToTagTable.postId, postId));

      return TagSchema.array().parse(tags);
    },

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

    async createPostTagsForPosts(data, tx) {
      const postTags = data.flatMap(({ postId, tagIds }) =>
        tagIds.map(tagId => ({
          postId,
          tagId
        }))
      );

      if (!postTags.length) {
        return;
      }

      await (tx ?? db)
        .insert(postToTagTable)
        .values(postTags);
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
