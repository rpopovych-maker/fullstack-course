import { canReadFullPost } from 'src/services/post-access/canReadFullPost';
import { truncateText } from 'src/utils/truncate-text';
import { IPostRepo } from 'src/types/post/IPostRepo';
import { PostOrderBy } from 'src/types/post/PostOrderBy';
import { SortOrder } from 'src/types/SortOrder';
import { Subscription } from 'src/types/subscription/Subscription';
import { User } from 'src/types/user/User';

export async function getPosts(params: {
  postRepo: IPostRepo,
  page: number,
  pageSize: number
  search?: string
  orderBy?: PostOrderBy
  order?: SortOrder
  minCommentsCount?: number
  tagIds?: string[]
  viewer: User
  currentSubscription: Subscription | null
}) {
  const posts = await params.postRepo.getPosts({
    page: params.page,
    pageSize: params.pageSize,
    search: params.search,
    orderBy: params.orderBy,
    order: params.order,
    minCommentsCount: params.minCommentsCount,
    tagIds: params.tagIds
  });

  const data = posts.data.map(post => {
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
  });

  return { ...posts, data };
}
