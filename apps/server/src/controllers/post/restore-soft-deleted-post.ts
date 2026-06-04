import { HttpError } from 'src/api/errors/HttpError';
import { ICommentRepo } from 'src/types/comment/ICommentRepo';
import { ITransactionManager } from 'src/types/ITransaction';
import { IPostRepo } from 'src/types/post/IPostRepo';
import { IUserRepo } from 'src/types/user/IUserRepo';

export async function restoreSoftDeletedPost(params: {
  postId: string
  transactionManager: ITransactionManager
  postRepo: IPostRepo
  userRepo: IUserRepo
  commentRepo: ICommentRepo
}) {
  const post = await params.postRepo.getPostById(params.postId, true);

  if (!post || !post.deletedAt) {
    throw new HttpError(404, 'Post not found');
  }

  const user = await params.userRepo.getUserById(post.userId);

  if (!user) {
    throw new HttpError(409, 'Cannot restore post while its owner is deleted');
  }

  const deletedAt = post.deletedAt;

  return params.transactionManager.execute(async ({ tx }) => {

    const restoredPost = await params.postRepo.restoreSoftDeletedPost(params.postId, tx);

    if (!restoredPost) {
      throw new HttpError(404, 'Post not found');
    }

    await params.commentRepo.restoreSoftDeletedCommentsByPostId(params.postId, deletedAt, tx);

    return restoredPost;
  });
}