import { HttpError } from 'src/api/errors/HttpError';
import { ICommentRepo } from 'src/types/comment/ICommentRepo';
import { ITransactionManager } from 'src/types/ITransaction';
import { IPostRepo } from 'src/types/post/IPostRepo';

export async function softDeletePost(params: {
  postId: string
  transactionManager: ITransactionManager
  postRepo: IPostRepo
  commentRepo: ICommentRepo
}) {
  const deletedAt = new Date();

  return params.transactionManager.execute(async ({ tx }) => {
    const post = await params.postRepo.softDeletePost(params.postId, deletedAt, tx);

    if (!post) {
      throw new HttpError(404, 'Post not found');
    }

    await params.commentRepo.softDeleteCommentsByPostId(post.id, deletedAt, tx);

    return post;
  });
}