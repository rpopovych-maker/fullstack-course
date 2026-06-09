import { HttpError } from 'src/api/errors/HttpError';
import { IArchiveRepo } from 'src/types/archive/IArchiveRepo';
import { CommentSchema } from 'src/types/comment/Comment';
import { ICommentRepo } from 'src/types/comment/ICommentRepo';
import { IPostToTagRepo } from 'src/types/IPostTagsRepo';
import { ITransactionManager } from 'src/types/ITransaction';
import { IPostRepo } from 'src/types/post/IPostRepo';
import { PostWithCommentsAndTagsSchema } from 'src/types/post/PostWithCommentsAndTags';
import { IUserRepo } from 'src/types/user/IUserRepo';
import { UserSchema } from 'src/types/user/User';

export async function restoreHardDeletedUser(params: {
  archiveId: string
  transactionManager: ITransactionManager
  userRepo: IUserRepo
  postRepo: IPostRepo
  commentRepo: ICommentRepo
  postToTagRepo: IPostToTagRepo
  archiveRepo: IArchiveRepo
}) {
  const archivedUser = await params.archiveRepo.getArchiveById(params.archiveId);

  if (!archivedUser) {
    throw new HttpError(404, 'Archived user not found');
  }

  if (archivedUser.entityType !== 'user') {
    throw new HttpError(400, 'Archive entry is not a user');
  }

  const {
    posts: archivedPosts,
    commentsOnOtherUsersPosts: archivedComments,
    ...archivedUserData
  } = archivedUser.data;

  const user = UserSchema.parse(archivedUserData);
  const posts = PostWithCommentsAndTagsSchema.array().parse(archivedPosts);
  const commentsOnOtherUsersPosts = CommentSchema.array().parse(archivedComments);

  for (const comment of commentsOnOtherUsersPosts) {
    const post = await params.postRepo.getPostById(comment.postId);

    if (!post) {
      throw new HttpError(409, 'Cannot restore user while a commented post is deleted');
    }
  }

  return params.transactionManager.execute(async ({ tx }) => {
    const restoredUser = await params.userRepo.createUser(user, tx);

    for (const post of posts) {
      const { comments, tags, ...postData } = post;
      const restoredPost = await params.postRepo.createPost(postData, tx);

      await params.postToTagRepo.createPostTags(
        restoredPost.id,
        tags.map(tag => tag.id),
        tx
      );

      for (const comment of comments) {
        await params.commentRepo.createComment(comment, tx);
      }
    }

    for (const comment of commentsOnOtherUsersPosts) {
      await params.commentRepo.createComment(comment, tx);
    }

    await params.archiveRepo.deleteArchiveById(params.archiveId, tx);

    return restoredUser;
  });
}
