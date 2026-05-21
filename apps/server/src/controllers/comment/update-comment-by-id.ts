import { ICommentRepo } from 'src/types/comment/ICommentRepo';
import { Comment } from 'src/types/comment/Comment';
import { HttpError } from 'src/api/errors/HttpError';

export async function updateCommentById(params: {
  commentRepo: ICommentRepo;
  commentId: string;
  userId: string;
  postId: string;
  data: Partial<Pick<Comment, 'text'>>;
}) {
  const comment = await params.commentRepo.updateCommentById({
    commentId: params.commentId,
    userId: params.userId,
    postId: params.postId,
    data: params.data
  });

  if (!comment) {
    throw new HttpError(404, 'Comment not found');
  }

  return comment;
}
