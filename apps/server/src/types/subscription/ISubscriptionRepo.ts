import { Subscription } from './Subscription';

export interface ISubscriptionRepo {
  upsertSubscription(data: Pick<Subscription, 'cancelAtPeriodEnd' | 'canceledAt' | 'currentPeriodEnd' | 'currentPeriodStart' | 'status' | 'stripeCustomerId' | 'stripePriceId' | 'stripeSubscriptionId' | 'userId'>): Promise<Subscription>
  getLatestSubscriptionByUserId(userId: string): Promise<Subscription | null>;
}
