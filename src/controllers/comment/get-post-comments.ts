import { ICommentRepo } from 'src/types/comment/ICommentRepo';

export async function getPostComments(params: { commentRepo: ICommentRepo; postId: string }) {
  const comments = await params.commentRepo.getPostComments(params.postId);
  return comments;
}
