import { IPostRepo } from 'src/types/post/IPostRepo';

export async function getSoftDeletedPosts(params: {
  postRepo: IPostRepo
  page: number
  pageSize: number
}) {
  return params.postRepo.getSoftDeletedPosts({
    page: params.page,
    pageSize: params.pageSize
  });
}
