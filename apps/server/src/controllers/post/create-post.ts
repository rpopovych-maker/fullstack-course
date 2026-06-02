import { IPostToTagRepo } from 'src/types/IPostTagsRepo';
import { ITransactionManager } from 'src/types/ITransaction';
import { IPostRepo } from 'src/types/post/IPostRepo';

export async function createPost(params: {
  postRepo: IPostRepo;
  postToTagRepo: IPostToTagRepo
  transactionManager: ITransactionManager
  title: string;
  description?: string | null;
  userId: string;
  tagIds?: string[]
}) {
  return params.transactionManager.execute(async ({ tx }) => {
    const post = await params.postRepo.createPost({
      title: params.title,
      description: params.description,
      userId: params.userId
    }, tx);

    if (params.tagIds?.length) {
      await params.postToTagRepo.createPostTags(post.id, params.tagIds, tx);
    }

    return post;
  });
}
