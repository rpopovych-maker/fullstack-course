import { HttpError } from 'src/api/errors/HttpError';
import { ICommentRepo } from 'src/types/comment/ICommentRepo';

export async function softDeleteComment(params: {
  commentId: string
  postId: string
  commentRepo: ICommentRepo
}) {
  const deletedAt = new Date();

  const comment = await params.commentRepo.softDeleteComment({
    commentId: params.commentId,
    postId: params.postId,
    deletedAt
  });

  if (!comment) {
    throw new HttpError(404, 'Comment not found');
  }

  return comment; 
}