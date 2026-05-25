import { desc, eq, ilike, or } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { usersTable } from 'src/services/drizzle/schema';
import { GetUsersResultSchema } from 'src/types/admin/GetUsersResult';
import { IUserRepo } from 'src/types/user/IUserRepo';
import { UserSchema } from 'src/types/user/User';

export function getUserRepo(db: NodePgDatabase): IUserRepo {
  return {
    async getUserBySubId(subId) {
      const users = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.subId, subId));

      return users.length > 0 ? UserSchema.parse(users[0]) : null;
    },

    async createUser(data) {
      const result = await (db)
        .insert(usersTable)
        .values(data)
        .returning();

      return UserSchema.parse(result[0]);
    },

    async getUsers({ page, pageSize, search }) {
      const offset = (page - 1) * pageSize;

      const searchCondition = search
        ? or(ilike(usersTable.username, `%${search}%`), ilike(usersTable.email, `%${search}%`))
        : undefined;
      
      const users = await db
        .select()
        .from(usersTable)
        .where(searchCondition)
        .orderBy(desc(usersTable.createdAt))
        .limit(pageSize)
        .offset(offset);
      
      const allUsers = await db
        .select()
        .from(usersTable)
        .where(searchCondition);
      
      return GetUsersResultSchema.parse({
        data: users,
        page,
        pageSize,
        total: allUsers.length,
        totalPages: Math.ceil(allUsers.length / pageSize)
      });
    }
  };
}
