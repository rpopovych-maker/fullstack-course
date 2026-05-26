import { IPostRepo } from 'src/types/post/IPostRepo';

export async function isPostOwner(params: {
  postRepo: IPostRepo;
  postId: string;
  userId: string;
}) {
  const postOwner = await params.postRepo.getPostOwner(params.postId);
  
  return postOwner === params.userId;
}
