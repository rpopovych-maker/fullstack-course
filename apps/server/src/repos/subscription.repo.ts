import { and, eq, inArray } from 'drizzle-orm';
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
    async getCurrentSubscriptionByUserId(userId) {
      const subscriptions = await db
        .select()
        .from(subscriptionsTable)
        .where(
          and(
            eq(subscriptionsTable.userId, userId),
            inArray(subscriptionsTable.status, [
              'active',
              'incomplete',
              'past_due',
              'paused',
              'trialing',
              'unpaid'
            ])
          )
        );
      
      return subscriptions.length > 0 ? SubscriptionSchema.parse(subscriptions[0]) : null;
    }
  };
}
