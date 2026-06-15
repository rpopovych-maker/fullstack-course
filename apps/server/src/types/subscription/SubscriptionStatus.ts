import { z } from 'zod';

export const SubscriptionStatusSchema = z.enum([
  'active',
  'canceled',
  'incomplete',
  'incomplete_expired',
  'past_due',
  'paused',
  'trialing',
  'unpaid'
]);

export type SubscriptionStatus = z.infer<
  typeof SubscriptionStatusSchema
>;

export const ENTITLED_SUBSCRIPTION_STATUSES: SubscriptionStatus[] = [
  'active',
  'trialing'
];

export const TERMINAL_SUBSCRIPTION_STATUSES: SubscriptionStatus[] = [
  'canceled',
  'incomplete_expired'
];