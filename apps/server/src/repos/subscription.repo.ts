import { desc, eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { subscriptionsTable } from 'src/services/drizzle/schema';
import { ISubscriptionRepo } from 'src/types/subscription/ISubscriptionRepo';
import { SubscriptionSchema } from 'src/types/subscription/Subscription';

export function getSubscriptionRepo(db: NodePgDatabase): ISubscriptionRepo {
  return {
    async upsertSubscription(data) {
      const subscriptions = await db
        .insert(subscriptionsTable)
        .values(data)
        .onConflictDoUpdate({
          target: subscriptionsTable.stripeSubscriptionId,
          set: data
        })
        .returning();

      return SubscriptionSchema.parse(subscriptions[0]);
    },
    async getLatestSubscriptionByUserId(userId) {
      const [subscription] = await db
        .select()
        .from(subscriptionsTable)
        .where(eq(subscriptionsTable.userId, userId))
        .orderBy(desc(subscriptionsTable.createdAt))
        .limit(1);

      return subscription ? SubscriptionSchema.parse(subscription) : null;
    }
  };
}
