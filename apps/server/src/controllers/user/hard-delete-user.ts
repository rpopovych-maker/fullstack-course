import { HttpError } from 'src/api/errors/HttpError';
import { IArchiveRepo } from 'src/types/archive/IArchiveRepo';
import { ICommentRepo } from 'src/types/comment/ICommentRepo';
import { ITransactionManager } from 'src/types/ITransaction';
import { IPostRepo } from 'src/types/post/IPostRepo';
import { ISubscriptionRepo } from 'src/types/subscription/ISubscriptionRepo';
import { TERMINAL_SUBSCRIPTION_STATUSES } from 'src/types/subscription/SubscriptionStatus';
import { IUserRepo } from 'src/types/user/IUserRepo';

export async function hardDeleteUser(params: {
  userId: string
  transactionManager: ITransactionManager
  userRepo: IUserRepo
  postRepo: IPostRepo
  commentRepo: ICommentRepo
  archiveRepo: IArchiveRepo
  subscriptionRepo: ISubscriptionRepo
}) {
  const user = await params.userRepo.getUserById(params.userId, true);

  if (!user) {
    throw new HttpError(404, 'User not found');
  }

  const subscription = await params.subscriptionRepo.getLatestSubscriptionByUserId(
    params.userId
  );

  if (subscription && !TERMINAL_SUBSCRIPTION_STATUSES.includes(subscription.status)) {
    throw new HttpError(409, 'Cannot delete a user with a current subscription');
  }

  const posts = await params.postRepo.getPostsWithCommentsAndTagsByUserId(params.userId, true);
  const userComments = await params.commentRepo.getCommentsByUserId(params.userId, true);
  const userPostIds = new Set(posts.map(post => post.id));
  const commentsOnOtherUsersPosts = userComments
    .filter(comment => !userPostIds.has(comment.postId));

  return params.transactionManager.execute(async ({ tx }) => {
    await params.archiveRepo.createArchive({
      originalEntityId: user.id,
      entityType: 'user',
      data: {
        ...user,
        posts,
        commentsOnOtherUsersPosts
      }
    }, tx);

    await params.userRepo.deleteUser(user.id, tx);

    return user;
  });
}
