import { HttpError } from 'src/api/errors/HttpError';
import { canReadFullPost } from 'src/services/post-access/canReadFullPost';
import { truncateText } from 'src/utils/truncate-text';
import { IPostToTagRepo } from 'src/types/IPostTagsRepo';
import { IPostRepo } from 'src/types/post/IPostRepo';
import { Subscription } from 'src/types/subscription/Subscription';
import { User } from 'src/types/user/User';

export async function getPostById(params: {
  postRepo: IPostRepo;
  postToTagRepo: IPostToTagRepo;
  postId: string;
  viewer: User;
  currentSubscription: Subscription | null;
}) {
  const post = await params.postRepo.getPostById(params.postId);

  if (!post) {
    throw new HttpError(404, 'Post not found');
  }

  const tags = await params.postToTagRepo.getTagsByPostId(params.postId);
  
  const postWithTags = {
    ...post,
    tags
  };

  const canRead = canReadFullPost({
    post,
    viewer: params.viewer,
    currentSubscription: params.currentSubscription
  });

  if (canRead) {
    return postWithTags;
  }

  return {
    ...postWithTags,
    description: truncateText(postWithTags.description),
    isLocked: true
  };
}
