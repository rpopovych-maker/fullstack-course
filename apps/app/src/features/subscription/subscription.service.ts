class SubscriptionService {
  getCurrent () {
    return apiClient.get('/api/subscriptions/current/')
  }

  createCheckout () {
    return apiClient.post('/api/subscriptions/checkout/')
  }

  cancel () {
    return apiClient.post('/api/subscriptions/cancel/')
  }
}

export const subscriptionService = new SubscriptionService()
