import { ICommentRepo } from 'src/types/comment/ICommentRepo';
import { CommentCursor } from 'src/types/comment/CommentCursor';

export async function getPostComments(params: {
  commentRepo: ICommentRepo;
  postId: string;
  cursor?: CommentCursor;
  pageSize: number;
}) {
  const comments = await params.commentRepo.getPostComments({
    postId: params.postId,
    cursor: params.cursor,
    pageSize: params.pageSize
  });

  return comments;
}
