import { ICommentRepo } from 'src/types/comment/ICommentRepo';
import { Comment } from 'src/types/comment/Comment';

export async function createComment(params: {
  commentRepo: ICommentRepo;
  data: Pick<Comment, 'postId' | 'text'>;
}) {
  const comment = await params.commentRepo.createComment(params.data);

  return comment;
}
