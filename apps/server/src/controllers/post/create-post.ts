import { IPostToTagRepo } from 'src/types/IPostTagsRepo';
import { ITransactionManager } from 'src/types/ITransaction';
import { IPostRepo } from 'src/types/post/IPostRepo';
import { PostVisibility } from 'src/types/post/PostVisibility';

export async function createPost(params: {
  postRepo: IPostRepo;
  postToTagRepo: IPostToTagRepo
  transactionManager: ITransactionManager
  title: string;
  description: string;
  userId: string;
  tagIds?: string[]
  visibility?: PostVisibility
}) {
  return params.transactionManager.execute(async ({ tx }) => {
    const post = await params.postRepo.createPost({
      title: params.title,
      description: params.description,
      userId: params.userId,
      visibility: params.visibility ?? 'public'
    }, tx);

    if (params.tagIds?.length) {
      await params.postToTagRepo.createPostTags(post.id, params.tagIds, tx);
    }

    return post;
  });
}
