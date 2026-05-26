import { ICommentRepo } from 'src/types/comment/ICommentRepo';

export async function isCommentOwner(params: {
  commentRepo: ICommentRepo;
  commentId: string;
  userId: string;
}) {
  const commentOwner = await params.commentRepo.getCommentOwner(params.commentId);
  
  return commentOwner === params.userId;
}
