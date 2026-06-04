import { HttpError } from 'src/api/errors/HttpError';
import { ICommentRepo } from 'src/types/comment/ICommentRepo';
import { ITransactionManager } from 'src/types/ITransaction';
import { IPostRepo } from 'src/types/post/IPostRepo';
import { IUserRepo } from 'src/types/user/IUserRepo';

export async function restoreSoftDeletedUser(params: {
  userId: string
  transactionManager: ITransactionManager
  userRepo: IUserRepo
  postRepo: IPostRepo
  commentRepo: ICommentRepo
}) {
  const user = await params.userRepo.getUserById(params.userId, true);

  if (!user || !user.deletedAt) {
    throw new HttpError(404, 'User not found');
  }

  const deletedAt = user.deletedAt;

  return params.transactionManager.execute(async ({ tx }) => {

    const restoredUser = await params.userRepo.restoreSoftDeletedUser(params.userId, tx);

    if (!restoredUser) {
      throw new HttpError(404, 'User not found');
    }

    await params.postRepo.restoreSoftDeletedPostsByUserId(user.id, deletedAt, tx);

    await params.commentRepo.restoreSoftDeletedCommentsByPostOwnerId(user.id, deletedAt, tx);

    return restoredUser;
  });
}