import { count, desc, eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { archivesTable } from 'src/services/drizzle/schema';
import { ArchiveSchema } from 'src/types/archive/Archive';
import { IArchiveRepo } from 'src/types/archive/IArchiveRepo';

export function getArchiveRepo(db: NodePgDatabase): IArchiveRepo {
  return {
    async createArchive(data, tx) {
      const [archive] = await (tx ?? db)
        .insert(archivesTable)
        .values(data)
        .returning();
      
      return ArchiveSchema.parse(archive);
    },

    async getArchiveById(id) {
      const archives = await db
        .select()
        .from(archivesTable)
        .where(eq(archivesTable.id, id));
      
      return archives.length > 0 ? ArchiveSchema.parse(archives[0]) : null;
    },

    async getArchivesByEntityType({ entityType, page, pageSize }) {
      const offset = (page - 1) * pageSize;

      const archives = await db
        .select()
        .from(archivesTable)
        .where(eq(archivesTable.entityType, entityType))
        .orderBy(desc(archivesTable.archivedAt))
        .limit(pageSize)
        .offset(offset);

      const totalResult = await db
        .select({ total: count() })
        .from(archivesTable)
        .where(eq(archivesTable.entityType, entityType));

      const total = totalResult[0]?.total ?? 0;

      return {
        data: ArchiveSchema.array().parse(archives),
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize)
      };
    },

    async deleteArchiveById(id, tx) {
      await (tx ?? db)
        .delete(archivesTable)
        .where(eq(archivesTable.id, id));
    }
  };
}
