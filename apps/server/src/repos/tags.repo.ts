import { eq, ilike } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { tagsTable } from 'src/services/drizzle/schema';
import { ITagRepo } from 'src/types/tag/ITagRepo';
import { TagSchema } from 'src/types/tag/Tag';

export function getTagsRepo(db: NodePgDatabase): ITagRepo {
  return {
    async getTags(search) {
      const tags = await db
        .select()
        .from(tagsTable)
        .where(search ? ilike(tagsTable.name, `%${search}%`) : undefined);
      
      return TagSchema.array().parse(tags);
    },

    async createTag(data) {
      const tags = await db.insert(tagsTable).values(data).returning();
      return TagSchema.parse(tags[0]);
    },

    async updateTag(id, data) {
      const tags = await db.update(tagsTable).set(data).where(eq(tagsTable.id, id)).returning();
      return tags.length > 0 ? TagSchema.parse(tags[0]) : null;
    },

    async deleteTag(id) {
      const tags = await db.delete(tagsTable).where(eq(tagsTable.id, id)).returning();
      return tags.length > 0 ? TagSchema.parse(tags[0]) : null;
    }
  };
}
