import { IPostRepo } from 'src/types/post/IPostRepo';
import { PostOrderBy } from 'src/types/post/PostOrderBy';
import { SortOrder } from 'src/types/SortOrder';

export async function getPosts(params: {
  postRepo: IPostRepo,
  page: number,
  pageSize: number
  search?: string
  orderBy?: PostOrderBy
  order?: SortOrder
  minCommentsCount?: number
}) {
  const posts = await params.postRepo.getPosts({
    page: params.page,
    pageSize: params.pageSize,
    search: params.search,
    orderBy: params.orderBy,
    order: params.order,
    minCommentsCount: params.minCommentsCount
  });

  return posts;
}
