import { ICommentRepo } from 'src/types/comment/ICommentRepo';
import { CommentCursor } from 'src/types/comment/CommentCursor';
import { HttpError } from 'src/api/errors/HttpError';
import { IPostRepo } from 'src/types/post/IPostRepo';
import { canReadFullPost } from 'src/services/post-access/canReadFullPost';
import { Subscription } from 'src/types/subscription/Subscription';
import { User } from 'src/types/user/User';

export async function getPostComments(params: {
  commentRepo: ICommentRepo;
  postRepo: IPostRepo;
  postId: string;
  cursor?: CommentCursor;
  pageSize: number;
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
    return { data: [], nextCursor: null };
  }

  const comments = await params.commentRepo.getPostCommentsPaginated({
    postId: params.postId,
    cursor: params.cursor,
    pageSize: params.pageSize
  });

  return comments;
}
