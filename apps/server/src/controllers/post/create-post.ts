import { IPostRepo } from 'src/types/post/IPostRepo';

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
