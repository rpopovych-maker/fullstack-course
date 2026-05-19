import { IPostRepo } from 'src/types/post/IPostRepo';

export async function getPosts(params: {
  postRepo: IPostRepo,
  page: number,
  pageSize: number
  search?: string
}) {
  const posts = await params.postRepo.getPosts({
    page: params.page,
    pageSize: params.pageSize,
    search: params.search
  });
  
  return posts;
}
