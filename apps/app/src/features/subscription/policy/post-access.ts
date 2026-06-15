export const ENTITLED_SUBSCRIPTION_STATUSES: TSubscriptionStatus[] = [
  'active',
  'trialing'
]

export const isProActive = (subscription: TCurrentSubscription): boolean => {
  return subscription !== null &&
    ENTITLED_SUBSCRIPTION_STATUSES.includes(subscription.status)
}

export const canReadFullPost = (params: {
  post: { userId: string; visibility: 'public' | 'members' }
  viewer: TUser | null
  subscription: TCurrentSubscription
}): boolean => {
  const { post, viewer, subscription } = params

  if (post.visibility === 'public') {
    return true
  }

  if (!viewer) {
    return false
  }

  if (viewer.id === post.userId) {
    return true
  }

  if (viewer.role === 'admin') {
    return true
  }

  return isProActive(subscription)
}
