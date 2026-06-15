import { HttpError } from 'src/api/errors/HttpError';
import { IPostToTagRepo } from 'src/types/IPostTagsRepo';
import { ITransactionManager } from 'src/types/ITransaction';
import { IPostRepo } from 'src/types/post/IPostRepo';
import { PostVisibility } from 'src/types/post/PostVisibility';

export async function updatePostById(params: {
  postRepo: IPostRepo;
  postToTagRepo: IPostToTagRepo
  transactionManager: ITransactionManager
  postId: string;
  title?: string;
  description?: string;
  tagIds?: string[]
  visibility?: PostVisibility
}) {
  return params.transactionManager.execute(async ({ tx }) => {
    const post = await params.postRepo.updatePostById(params.postId, {
      title: params.title,
      description: params.description,
      visibility: params.visibility
    }, tx);

    if (!post) {
      throw new HttpError(404, 'Post not found');
    }

    if (params.tagIds) {
      await params.postToTagRepo.updatePostTags(post.id, params.tagIds, tx);
    }

    return post;
  });
}
