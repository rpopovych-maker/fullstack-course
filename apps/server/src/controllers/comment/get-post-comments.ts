import { ICommentRepo } from 'src/types/comment/ICommentRepo';
import { CommentCursor } from 'src/types/comment/CommentCursor';
import { HttpError } from 'src/api/errors/HttpError';
import { IPostRepo } from 'src/types/post/IPostRepo';

export async function getPostComments(params: {
  commentRepo: ICommentRepo;
  postRepo: IPostRepo;
  postId: string;
  cursor?: CommentCursor;
  pageSize: number;
}) {
  const post = await params.postRepo.getPostById(params.postId);

  if (!post) {
    throw new HttpError(404, 'Post not found');
  }
  
  const comments = await params.commentRepo.getPostComments({
    postId: params.postId,
    cursor: params.cursor,
    pageSize: params.pageSize
  });

  return comments;
}
