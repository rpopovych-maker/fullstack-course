import { IPostRepo } from 'src/types/post/IPostRepo';
import { Post } from 'src/types/post/Post';

export async function updatePostById(params: {
  postRepo: IPostRepo;
  postId: string;
  data: Partial<Pick<Post, 'title' | 'description'>>;
}) {
  const post = await params.postRepo.updatePostById(params.postId, params.data);

  if (!post) {
    throw new Error('Post not found');
  }

  return post;
}
