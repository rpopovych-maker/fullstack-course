import type { Stripe as StripeClient } from 'stripe';

export interface StripeService {
  createProCheckoutSession(data: {
    userId: string
    customerId: string
  }): ReturnType<StripeClient['checkout']['sessions']['create']>;
  createCustomer(data: {
    userId: string;
    email: string;
  }): ReturnType<StripeClient['customers']['create']>;
  constructWebhookEvent(
    payload: Buffer,
    signature: string
  ): ReturnType<StripeClient['webhooks']['constructEvent']>;
  scheduleSubscriptionCancellation(
    subscriptionId: string
  ): ReturnType<StripeClient['subscriptions']['update']>;
  cancelSubscription(
    subscriptionId: string
  ): ReturnType<StripeClient['subscriptions']['cancel']>;
}
