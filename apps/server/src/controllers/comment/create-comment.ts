import { HttpError } from 'src/api/errors/HttpError';
import { ICommentRepo } from 'src/types/comment/ICommentRepo';
import { IPostRepo } from 'src/types/post/IPostRepo';

export async function createComment(params: {
  commentRepo: ICommentRepo;
  postRepo: IPostRepo
  postId: string;
  text: string;
  userId: string;
}) {
  const post = await params.postRepo.getPostById(params.postId);

  if (!post) {
    throw new HttpError(404, 'Post not found');
  }

  const comment = await params.commentRepo.createComment({
    postId: params.postId,
    text: params.text,
    userId: params.userId
  });

  return comment;
}
