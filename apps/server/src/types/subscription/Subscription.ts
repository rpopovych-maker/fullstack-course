import { z } from 'zod';
import { SubscriptionStatusSchema } from './SubscriptionStatus';

export const SubscriptionSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  stripeSubscriptionId: z.string(),
  stripeCustomerId: z.string(),
  stripePriceId: z.string(),
  status: SubscriptionStatusSchema,
  cancelAtPeriodEnd: z.boolean(),
  currentPeriodStart: z.coerce.date().nullable(),
  currentPeriodEnd: z.coerce.date().nullable(),
  canceledAt: z.coerce.date().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date()
});

export type Subscription = z.infer<typeof SubscriptionSchema>;