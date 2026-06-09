import { HttpError } from 'src/api/errors/HttpError';
import { IArchiveRepo } from 'src/types/archive/IArchiveRepo';
import { ICommentRepo } from 'src/types/comment/ICommentRepo';
import { ITransactionManager } from 'src/types/ITransaction';

export async function hardDeleteComment(params: {
  commentId: string
  postId: string
  commentRepo: ICommentRepo
  archiveRepo: IArchiveRepo
  transactionManager: ITransactionManager
}) {
  const comment = await params.commentRepo.getCommentById({
    commentId: params.commentId,
    postId: params.postId,
    returnDeleted: true
  });

  if (!comment) {
    throw new HttpError(404, 'Comment not found');
  }

  return params.transactionManager.execute(async ({ tx }) => {
    await params.archiveRepo.createArchive({
      originalEntityId: comment.id,
      entityType: 'comment',
      data: comment
    }, tx);

    await params.commentRepo.deleteComment({
      commentId: params.commentId,
      postId: params.postId
    }, tx);

    return comment;
  });
}
