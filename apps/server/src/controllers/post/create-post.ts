import { IPostRepo } from 'src/types/post/IPostRepo';
import { Post } from 'src/types/post/Post';

export async function createPost(params: {
  postRepo: IPostRepo;
  title: string;
  description?: string | null;
  userId: string;
}) {
  const post = await params.postRepo.createPost({
    title: params.title,
    description: params.description,
    userId: params.userId
  });

  return post;
}
