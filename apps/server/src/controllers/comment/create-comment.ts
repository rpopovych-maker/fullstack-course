import { ICommentRepo } from 'src/types/comment/ICommentRepo';
import { Comment } from 'src/types/comment/Comment';

export async function createComment(params: {
  commentRepo: ICommentRepo;
  postId: string;
  text: string;
  userId: string;
}) {
  const comment = await params.commentRepo.createComment({
    postId: params.postId,
    text: params.text,
    userId: params.userId
  });

  return comment;
}
