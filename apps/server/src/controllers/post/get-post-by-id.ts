import { HttpError } from 'src/api/errors/HttpError';
import { canReadFullPost } from 'src/services/post-access/canReadFullPost';
import { truncateText } from 'src/utils/truncate-text';
import { IPostRepo } from 'src/types/post/IPostRepo';
import { Subscription } from 'src/types/subscription/Subscription';
import { User } from 'src/types/user/User';

export async function getPostById(params: {
  postRepo: IPostRepo;
  postId: string;
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

  if (canRead) {
    return post;
  }

  return {
    ...post,
    description: truncateText(post.description),
    isLocked: true
  };
}
