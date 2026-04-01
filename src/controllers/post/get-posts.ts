import { IPostRepo } from 'src/types/post/IPostRepo';

export async function getPosts(params: { postRepo: IPostRepo }) {
  const posts = await params.postRepo.getAllPosts();
  return posts;
}
