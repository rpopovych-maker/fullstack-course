import { HttpError } from 'src/api/errors/HttpError';
import { StripeService } from 'src/types/services/StripeService';
import { ISubscriptionRepo } from 'src/types/subscription/ISubscriptionRepo';
import { TERMINAL_SUBSCRIPTION_STATUSES } from 'src/types/subscription/SubscriptionStatus';

export async function cancelSubscription(params: {
  userId: string;
  subscriptionRepo: ISubscriptionRepo;
  stripeService: StripeService;
}) {
  const subscription = await params.subscriptionRepo.getLatestSubscriptionByUserId(
    params.userId
  );

  if (!subscription || TERMINAL_SUBSCRIPTION_STATUSES.includes(subscription.status)) {
    throw new HttpError(404, 'Active subscription not found');
  }

  if (subscription.cancelAtPeriodEnd) {
    return;
  }

  await params.stripeService.scheduleSubscriptionCancellation(
    subscription.stripeSubscriptionId
  );
}
