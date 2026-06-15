import { HttpError } from 'src/api/errors/HttpError';
import { canReadFullPost } from 'src/services/post-access/canReadFullPost';
import { ICommentRepo } from 'src/types/comment/ICommentRepo';
import { IPostRepo } from 'src/types/post/IPostRepo';
import { Subscription } from 'src/types/subscription/Subscription';
import { User } from 'src/types/user/User';

export async function createComment(params: {
  commentRepo: ICommentRepo;
  postRepo: IPostRepo
  postId: string;
  text: string;
  userId: string;
  viewer: User;
  currentSubscription: Subscription | null;
}) {
  const post = await params.postRepo.getPostById(params.postId);

  if (!post) {
    throw new HttpError(404, 'Post not found');
  }

  const canRead = canReadFullPost({
    post,
    viewer: params.viewer,
    currentSubscription: params.currentSubscription
  });

  if (!canRead) {
    throw new HttpError(403, 'Forbidden');
  }

  const comment = await params.commentRepo.createComment({
    postId: params.postId,
    text: params.text,
    userId: params.userId
  });

  return comment;
}
