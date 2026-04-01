import { IPostRepo } from 'src/types/post/IPostRepo';
import { Post } from 'src/types/post/Post';

export async function createPost(params: {
  postRepo: IPostRepo;
  data: Pick<Post, 'title' | 'description'>;
}) {
  const post = await params.postRepo.createPost(params.data);

  return post;
}
