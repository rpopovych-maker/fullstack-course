import { HttpError } from 'src/api/errors/HttpError';
import { IArchiveRepo } from 'src/types/archive/IArchiveRepo';
import { ICommentRepo } from 'src/types/comment/ICommentRepo';
import { ITransactionManager } from 'src/types/ITransaction';
import { IPostRepo } from 'src/types/post/IPostRepo';

export async function hardDeletePost(params: {
  postId: string
  transactionManager: ITransactionManager
  postRepo: IPostRepo
  commentRepo: ICommentRepo
  archiveRepo: IArchiveRepo
}) {
  const post = await params.postRepo.getPostWithTagsById(params.postId, true);

  if (!post) {
    throw new HttpError(404, 'Post not found');
  }

  const comments = await params.commentRepo.getCommentsByPostId(post.id, true);

  return params.transactionManager.execute(async ({ tx }) => {
    await params.archiveRepo.createArchive({
      originalEntityId: post.id,
      entityType: 'post',
      data: {
        post,
        comments
      }
    }, tx);

    await params.postRepo.deletePost(post.id, tx);

    return post;
  });
}
