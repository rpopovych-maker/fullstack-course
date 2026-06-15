import { HttpError } from 'src/api/errors/HttpError';
import { StripeService } from 'src/types/services/StripeService';
import { ISubscriptionRepo } from 'src/types/subscription/ISubscriptionRepo';
import { TERMINAL_SUBSCRIPTION_STATUSES } from 'src/types/subscription/SubscriptionStatus';
import { IUserRepo } from 'src/types/user/IUserRepo';

export async function createCheckoutSession(params: {
  stripeService: StripeService
  userRepo: IUserRepo
  subscriptionRepo: ISubscriptionRepo
  userId: string
  email: string
  stripeCustomerId: string | null
}) {
  const existingSubscription = await params.subscriptionRepo.getLatestSubscriptionByUserId(
    params.userId
  );

  if (
    existingSubscription
    && !TERMINAL_SUBSCRIPTION_STATUSES.includes(existingSubscription.status)
  ) {
    throw new HttpError(409, 'User already has a current subscription');
  }
  
  let customerId = params.stripeCustomerId;

  if (!customerId) {
    const customer = await params.stripeService.createCustomer({
      email: params.email,
      userId: params.userId
    });

    customerId = customer.id;

    const user = await params.userRepo.updateUser(params.userId, {
      stripeCustomerId: customerId
    });

    if (!user) {
      throw new HttpError(500, 'Could not save Stripe customer');
    }
  }

  const session = await params.stripeService.createProCheckoutSession({
    customerId,
    userId: params.userId
  });

  if (!session.url) {
    throw new HttpError(500, 'Stripe Checkout URL was not created');
  }

  return {
    url: session.url
  };
}
