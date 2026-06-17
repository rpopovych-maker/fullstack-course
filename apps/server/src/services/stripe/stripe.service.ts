import { StripeService } from 'src/types/services/StripeService';
import Stripe from 'stripe';

export function getStripeService(params: {
  secretKey: string,
  proPriceId: string,
  clientAppUrl: string
  webhookSecret: string
}): StripeService {
  const stripeClient = new Stripe(params.secretKey);

  return {
    createCustomer({ email, userId }) {
      return stripeClient.customers.create({
        email,
        metadata: {
          userId
        }
      }, {
        idempotencyKey: `customer:${userId}`
      });
    },

    async createProCheckoutSession({ customerId, userId }) {
      return stripeClient.checkout.sessions.create({
        mode: 'subscription',
        line_items: [{
          price: params.proPriceId,
          quantity: 1
        }],
        customer: customerId,
        client_reference_id: userId,
        subscription_data: {
          metadata: {
            userId
          }
        },
        success_url: `${params.clientAppUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${params.clientAppUrl}/pricing`
      });
      // Note: removed for local development for easier testing
      // {
      //   idempotencyKey: `pro-checkout:${userId}`
      // }
    },

    constructWebhookEvent(payload, signature) {
      return stripeClient.webhooks.constructEvent(
        payload,
        signature,
        params.webhookSecret
      );
    },

    scheduleSubscriptionCancellation(subscriptionId) {
      return stripeClient.subscriptions.update(subscriptionId, {
        cancel_at_period_end: true
      });
    }
  };
}
