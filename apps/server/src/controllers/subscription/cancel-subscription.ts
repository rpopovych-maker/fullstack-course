import { HttpError } from 'src/api/errors/HttpError';
import { StripeService } from 'src/types/services/StripeService';
import { ISubscriptionRepo } from 'src/types/subscription/ISubscriptionRepo';

export async function cancelSubscription(params: {
  userId: string;
  subscriptionRepo: ISubscriptionRepo;
  stripeService: StripeService;
}) {
  const subscription = await params.subscriptionRepo.getCurrentSubscriptionByUserId(
    params.userId
  );

  if (!subscription) {
    throw new HttpError(404, 'Active subscription not found');
  }

  if (subscription.cancelAtPeriodEnd) {
    return;
  }

  await params.stripeService.scheduleSubscriptionCancellation(
    subscription.stripeSubscriptionId
  );
}