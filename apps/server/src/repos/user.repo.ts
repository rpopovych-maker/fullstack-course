import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { usersTable } from 'src/services/drizzle/schema';
import { IUserRepo } from 'src/types/user/IUserRepo';
import { UserSchema } from 'src/types/user/User';

export function getUserRepo(db: NodePgDatabase): IUserRepo {
  return {
    async getUserBySubId(subId) {
      const users = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.subId, subId));

      return users.length > 0 ? UserSchema.parse(users[0]) : null
    }
  };
}
