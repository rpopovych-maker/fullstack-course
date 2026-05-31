import { asc, count, desc, eq, ilike } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { invitesTable } from 'src/services/drizzle/schema';
import { GetInvitesResultSchema } from 'src/types/invite/GetInvitesResult';
import { IInviteRepo } from 'src/types/invite/IInviteRepo';
import { InviteSchema } from 'src/types/invite/Invite';

export function getInviteRepo(db: NodePgDatabase): IInviteRepo {
  return {
    async createInvite(data) {
      const invites = await db
        .insert(invitesTable)
        .values(data)
        .returning();
      
      return InviteSchema.parse(invites[0]); 
    },

    async updateInviteById(id, data, tx) {
      const invites = await (tx ?? db)
        .update(invitesTable)
        .set(data)
        .where(eq(invitesTable.id, id))
        .returning();
      
      return invites.length > 0 ? InviteSchema.parse(invites[0]) : null;
    },

    async getInviteById(id) {
      const invites = await db
        .select()
        .from(invitesTable)
        .where(eq(invitesTable.id, id));
      
      return invites.length > 0 ? InviteSchema.parse(invites[0]) : null;
    },

    async getInviteBySubId(subId) {
      const invites = await db
        .select()
        .from(invitesTable)
        .where(eq(invitesTable.subId, subId));
      
      return invites.length > 0 ? InviteSchema.parse(invites[0]) : null;
    },

    async getInviteByEmail(email) {
      const invites = await db
        .select()
        .from(invitesTable)
        .where(eq(invitesTable.email, email));
      
      return invites.length > 0 ? InviteSchema.parse(invites[0]) : null;
    },

    async getInvites({ page, pageSize, search, order, orderBy }) {
      const offset = (page - 1) * pageSize;

      const sortDirection = order === 'asc' ? asc : desc;  
      const searchCondition = search ? ilike(invitesTable.email, `%${search}%`) : undefined;

      const invites = await db
        .select()
        .from(invitesTable)
        .orderBy(sortDirection(orderBy ? invitesTable[orderBy] : invitesTable.sentAt))
        .where(searchCondition)
        .limit(pageSize)
        .offset(offset);
      
      const totalResult = await db
        .select({ total: count() })
        .from(invitesTable)
        .where(searchCondition);
      
      const total = totalResult[0]?.total ?? 0;     
      
      return GetInvitesResultSchema.parse({
        data: invites,
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize)
      });
    }
  };
}
