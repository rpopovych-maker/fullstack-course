import { and, asc, count, desc, eq, ilike, isNotNull, isNull, or } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { usersTable } from 'src/services/drizzle/schema';
import { GetUsersResultSchema } from 'src/types/user/GetUsersResult';
import { IUserRepo } from 'src/types/user/IUserRepo';
import { UserSchema } from 'src/types/user/User';

export function getUserRepo(db: NodePgDatabase): IUserRepo {
  return {
    async restoreSoftDeletedUser(id, tx) {
      const users = await (tx ?? db)
        .update(usersTable)
        .set({ deletedAt: null })
        .where(and(
          isNotNull(usersTable.deletedAt),
          eq(usersTable.id, id)
        ))
        .returning();
      
      return users.length > 0 ? UserSchema.parse(users[0]) : null;
    },

    async softDeleteUser(id, deletedAt, tx) {
      const users = await (tx ?? db)
        .update(usersTable)
        .set({ deletedAt })
        .where(and(
          isNull(usersTable.deletedAt),
          eq(usersTable.id, id)
        ))
        .returning();
      
      return users.length > 0 ? UserSchema.parse(users[0]) : null;
    },
  
    async banUser(id) {
      const users = await db
        .update(usersTable)
        .set({ bannedAt: new Date() })
        .where(eq(usersTable.id, id))
        .returning();
      
      return users.length > 0 ? UserSchema.parse(users[0]) : null;
    },

    async unbanUser(id) {
      const users = await db
        .update(usersTable)
        .set({ bannedAt: null })
        .where(eq(usersTable.id, id))
        .returning();
      
      return users.length > 0 ? UserSchema.parse(users[0]) : null;
    },

    async getUserBySubId(subId) {
      const users = await db
        .select()
        .from(usersTable)
        .where(and(
          isNull(usersTable.deletedAt),
          eq(usersTable.subId, subId)
        ));

      return users.length > 0 ? UserSchema.parse(users[0]) : null;
    },

    async getUserById(id, returnDeleted) {
      const users = await db
        .select()
        .from(usersTable)
        .where(and(
          returnDeleted ? undefined : isNull(usersTable.deletedAt),
          eq(usersTable.id, id)
        ));

      return users.length > 0 ? UserSchema.parse(users[0]) : null;
    },

    async createUser(data, tx) {
      const result = await (tx ?? db)
        .insert(usersTable)
        .values(data)
        .returning();

      return UserSchema.parse(result[0]);
    },

    async getUsers({ page, pageSize, search, order, orderBy }) {
      const offset = (page - 1) * pageSize;

      const searchCondition = search
        ? or(ilike(usersTable.username, `%${search}%`), ilike(usersTable.email, `%${search}%`))
        : undefined;
      
      const sortDirection = order === 'asc' ? asc : desc;
      
      const users = await db
        .select()
        .from(usersTable)
        .where(and(isNull(usersTable.deletedAt), searchCondition))
        .orderBy(sortDirection(orderBy ? usersTable[orderBy] : usersTable.createdAt))
        .limit(pageSize)
        .offset(offset);
      
      const totalResult = await db
        .select({ total: count() })
        .from(usersTable)
        .where(and(isNull(usersTable.deletedAt), searchCondition));
      
      const total = totalResult[0]?.total ?? 0;   

      return GetUsersResultSchema.parse({
        data: users,
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize)
      });
    }
  };
}
