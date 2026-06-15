type TSubscription = NonNullable<TResponse<'/api/subscriptions/current/', 'get'>>
type TSubscriptionStatus = TSubscription['status']
type TCurrentSubscription = TResponse<'/api/subscriptions/current/', 'get'>
type TCreateCheckoutResp = TResponse<'/api/subscriptions/checkout/', 'post'>
