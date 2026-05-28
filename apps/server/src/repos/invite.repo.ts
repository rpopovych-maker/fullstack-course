import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { invitesTable } from 'src/services/drizzle/schema';
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

    async getInvites() {
      const invites = await db
        .select()
        .from(invitesTable);
      
      return InviteSchema.array().parse(invites);
    }
  };
}
