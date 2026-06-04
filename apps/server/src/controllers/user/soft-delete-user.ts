import { HttpError } from 'src/api/errors/HttpError';
import { ICommentRepo } from 'src/types/comment/ICommentRepo';
import { ITransactionManager } from 'src/types/ITransaction';
import { IPostRepo } from 'src/types/post/IPostRepo';
import { IUserRepo } from 'src/types/user/IUserRepo';

export async function softDeleteUser(params: {
  userId: string
  transactionManager: ITransactionManager
  userRepo: IUserRepo
  postRepo: IPostRepo
  commentRepo: ICommentRepo
}) {
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