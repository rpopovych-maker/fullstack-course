import { HttpError } from 'src/api/errors/HttpError';
import { ICommentRepo } from 'src/types/comment/ICommentRepo';
import { IPostRepo } from 'src/types/post/IPostRepo';
import { IUserRepo } from 'src/types/user/IUserRepo';

export async function restoreSoftDeletedComment(params: {
  commentId: string
  postId: string
  commentRepo: ICommentRepo
  userRepo: IUserRepo
  postRepo: IPostRepo
}) {
  const comment = await params.commentRepo.getCommentById({
    commentId: params.commentId,
    postId: params.postId,
    returnDeleted: true
  });

  if (!comment) {
    throw new HttpError(404, 'Comment not found');
  }

  const post = await params.postRepo.getPostById(params.postId);

  if (!post) {
    throw new HttpError(404, 'Post not found');
  }

  const commentOwner = await params.userRepo.getUserById(comment.userId);

  if (!commentOwner) {
    throw new HttpError(409, 'Cannot restore comment while its owner is deleted');
  }

  const restoredComment = await params.commentRepo.restoreSoftDeletedComment(
    params.commentId,
    params.postId
  );

  if (!restoredComment) {
    throw new HttpError(404, 'Comment not found');
  }

  return restoredComment;
}