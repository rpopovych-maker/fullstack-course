import { HttpError } from 'src/api/errors/HttpError';
import { IArchiveRepo } from 'src/types/archive/IArchiveRepo';
import { CommentSchema } from 'src/types/comment/Comment';
import { ICommentRepo } from 'src/types/comment/ICommentRepo';
import { ITransactionManager } from 'src/types/ITransaction';
import { IPostRepo } from 'src/types/post/IPostRepo';
import { IUserRepo } from 'src/types/user/IUserRepo';

export async function restoreHardDeletedComment(params: {
  archiveId: string
  commentRepo: ICommentRepo
  postRepo: IPostRepo
  userRepo: IUserRepo
  archiveRepo: IArchiveRepo
  transactionManager: ITransactionManager
}) {
  const archivedComment = await params.archiveRepo.getArchiveById(params.archiveId);
  
  if (!archivedComment) {
    throw new HttpError(404, 'Archived comment not found');
  }

  if (archivedComment.entityType !== 'comment') {
    throw new HttpError(400, 'Archive entry is not a comment');
  }

  const comment = CommentSchema.parse(archivedComment.data);

  const commentOwner = await params.userRepo.getUserById(comment.userId);

  if (!commentOwner) {
    throw new HttpError(409, 'Cannot restore comment while its owner is deleted');
  }

  const post = await params.postRepo.getPostById(comment.postId);

  if (!post) {
    throw new HttpError(409, 'Cannot restore comment while its post is deleted');
  }

  return params.transactionManager.execute(async ({ tx }) => { 
    const restoredComment = await params.commentRepo.createComment(comment, tx);

    await params.archiveRepo.deleteArchiveById(params.archiveId, tx);

    return restoredComment;
  });
}
