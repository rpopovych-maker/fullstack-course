import { HttpError } from 'src/api/errors/HttpError';
import { IArchiveRepo } from 'src/types/archive/IArchiveRepo';
import { ICommentRepo } from 'src/types/comment/ICommentRepo';
import { IPostToTagRepo } from 'src/types/IPostTagsRepo';
import { ITransactionManager } from 'src/types/ITransaction';
import { IPostRepo } from 'src/types/post/IPostRepo';
import { CommentSchema } from 'src/types/comment/Comment';
import { PostSchema } from 'src/types/post/Post';
import { TagSchema } from 'src/types/tag/Tag';
import { IUserRepo } from 'src/types/user/IUserRepo';
import { z } from 'zod';

export async function restoreHardDeletedPost(params: {
  archiveId: string
  transactionManager: ITransactionManager
  postRepo: IPostRepo
  userRepo: IUserRepo
  commentRepo: ICommentRepo
  postToTagRepo: IPostToTagRepo
  archiveRepo: IArchiveRepo
}) {
  const archivedPost = await params.archiveRepo.getArchiveById(params.archiveId);

  if (!archivedPost) {
    throw new HttpError(404, 'Archived post not found');
  }

  if (archivedPost.entityType !== 'post') {
    throw new HttpError(400, 'Archive entry is not a post');
  }

  const archivedPostData = z.record(z.string(), z.unknown()).parse(archivedPost.data.post);
  const { tags: archivedTags, ...postData } = archivedPostData;
  const post = PostSchema.parse(postData);
  const tags = TagSchema.array().parse(archivedTags);
  const comments = CommentSchema.array().parse(archivedPost.data.comments);

  const postOwner = await params.userRepo.getUserById(post.userId);

  if (!postOwner) {
    throw new HttpError(409, 'Cannot restore post while its owner is deleted');
  }

  const commentOwnerIds = [...new Set(comments.map(comment => comment.userId))];

  for (const commentOwnerId of commentOwnerIds) {
    const commentOwner = await params.userRepo.getUserById(commentOwnerId);

    if (!commentOwner) {
      throw new HttpError(409, 'Cannot restore post while a comment owner is deleted');
    }
  }

  return params.transactionManager.execute(async ({ tx }) => {
    const restoredPost = await params.postRepo.createPost(post, tx);

    await params.postToTagRepo.createPostTags(
      restoredPost.id,
      tags.map(tag => tag.id),
      tx
    );

    for (const comment of comments) {
      await params.commentRepo.createComment(comment, tx);
    }

    await params.archiveRepo.deleteArchiveById(params.archiveId, tx);

    return restoredPost;
  });
}
