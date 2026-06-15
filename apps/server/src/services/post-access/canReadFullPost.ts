import { PostVisibility } from 'src/types/post/PostVisibility';
import { Subscription } from 'src/types/subscription/Subscription';
import { ENTITLED_SUBSCRIPTION_STATUSES } from 'src/types/subscription/SubscriptionStatus';
import { User } from 'src/types/user/User';

export function canReadFullPost(params: {
  post: { userId: string; visibility: PostVisibility };
  viewer: User;
  currentSubscription: Subscription | null;
}): boolean {
  const { post, viewer, currentSubscription } = params;

  if (post.visibility === 'public') {
    return true;
  }

  if (viewer.id === post.userId) {
    return true;
  }

  if (viewer.role === 'admin') {
    return true;
  }

  return (
    currentSubscription !== null
    && ENTITLED_SUBSCRIPTION_STATUSES.includes(currentSubscription.status)
  );
}
