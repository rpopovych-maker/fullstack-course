import { HttpError } from 'src/api/errors/HttpError';
import { ICommentRepo } from 'src/types/comment/ICommentRepo';
import { ITransactionManager } from 'src/types/ITransaction';
import { IPostRepo } from 'src/types/post/IPostRepo';
import { IdentityService } from 'src/types/services/IdentityService';
import { StripeService } from 'src/types/services/StripeService';
import { ISubscriptionRepo } from 'src/types/subscription/ISubscriptionRepo';
import { TERMINAL_SUBSCRIPTION_STATUSES } from 'src/types/subscription/SubscriptionStatus';
import { IUserRepo } from 'src/types/user/IUserRepo';

export async function softDeleteUser(params: {
  userId: string
  transactionManager: ITransactionManager
  userRepo: IUserRepo
  postRepo: IPostRepo
  commentRepo: ICommentRepo
  subscriptionRepo: ISubscriptionRepo
  stripeService: StripeService
  identityService: IdentityService
}) {
  const existingUser = await params.userRepo.getUserById(params.userId);

  if (!existingUser) {
    throw new HttpError(404, 'User not found');
  }

  const subscription = await params.subscriptionRepo.getLatestSubscriptionByUserId(
    params.userId
  );

  if (
    subscription
    && !subscription.cancelAtPeriodEnd
    && !TERMINAL_SUBSCRIPTION_STATUSES.includes(subscription.status)
  ) {
    await params.stripeService.scheduleSubscriptionCancellation(
      subscription.stripeSubscriptionId
    );
  }

  await params.identityService.banUser(existingUser.subId);

  const deletedAt = new Date();

  return params.transactionManager.execute(async ({ tx }) => {
    const user = await params.userRepo.softDeleteUser(params.userId, deletedAt, tx);

    if (!user) {
      throw new HttpError(404, 'User not found');
    }

    await params.postRepo.softDeletePostsByUserId(user.id, deletedAt, tx);

    await params.commentRepo.softDeleteCommentsByPostOwnerId(user.id, deletedAt, tx);

    return user;
  });
}
