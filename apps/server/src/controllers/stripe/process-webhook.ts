import { HttpError } from 'src/api/errors/HttpError';
import { StripeService } from 'src/types/services/StripeService';
import { ISubscriptionRepo } from 'src/types/subscription/ISubscriptionRepo';

export async function processWebhook(params: {
  stripeService: StripeService;
  subscriptionRepo: ISubscriptionRepo
  payload: unknown;
  signature: string | string[] | undefined;
}) {
  if (typeof params.signature !== 'string') {
    throw new HttpError(400, 'Missing Stripe signature');
  }

  if (!Buffer.isBuffer(params.payload)) {
    throw new HttpError(400, 'Missing raw request body');
  }

  let event;

  try {
    event = params.stripeService.constructWebhookEvent(
      params.payload,
      params.signature
    );
  } catch (error) {
    throw new HttpError(400, 'Invalid Stripe webhook signature', error);
  }

  switch (event.type) {
  case 'customer.subscription.created':
  case 'customer.subscription.updated':
  case 'customer.subscription.deleted': {
    const subscription = event.data.object;
    const item = subscription.items.data[0];
    const userId = subscription.metadata.userId;

    if (!userId) {
      throw new HttpError(400, 'Stripe subscription is missing userId metadata');
    }

    if (!item) {
      throw new HttpError(400, 'Stripe subscription has no items');
    }

    const customerId = typeof subscription.customer === 'string'
      ? subscription.customer
      : subscription.customer.id;

    await params.subscriptionRepo.upsertSubscription({
      userId,
      stripeSubscriptionId: subscription.id,
      stripeCustomerId: customerId,
      stripePriceId: item.price.id,
      status: subscription.status,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      currentPeriodStart: new Date(item.current_period_start * 1000),
      currentPeriodEnd: new Date(item.current_period_end * 1000),
      canceledAt: subscription.canceled_at
        ? new Date(subscription.canceled_at * 1000)
        : null
    });

    break;
  }

  default:
    break;
  }
}
