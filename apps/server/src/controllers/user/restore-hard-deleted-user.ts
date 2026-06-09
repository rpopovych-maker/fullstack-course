import { HttpError } from 'src/api/errors/HttpError';
import { IArchiveRepo } from 'src/types/archive/IArchiveRepo';
import { Comment, CommentSchema } from 'src/types/comment/Comment';
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

  const commentedPostIds = [
    ...new Set(commentsOnOtherUsersPosts.map(comment => comment.postId))
  ];
  const existingPostIds = new Set(
    await params.postRepo.getExistingPostIds(commentedPostIds)
  );
  const restorableCommentsOnOtherUsersPosts = commentsOnOtherUsersPosts.filter(comment =>
    existingPostIds.has(comment.postId)
  );

  return params.transactionManager.execute(async ({ tx }) => {
    const restoredUser = await params.userRepo.createUser(user, tx);
    const commentsOnRestoredPosts: Comment[] = [];

    for (const post of posts) {
      const { comments, tags, ...postData } = post;
      const restoredPost = await params.postRepo.createPost(postData, tx);

      await params.postToTagRepo.createPostTags(
        restoredPost.id,
        tags.map(tag => tag.id),
        tx
      );

      commentsOnRestoredPosts.push(...comments);
    }

    await params.commentRepo.createComments([
      ...commentsOnRestoredPosts,
      ...restorableCommentsOnOtherUsersPosts
    ], tx);

    await params.archiveRepo.deleteArchiveById(params.archiveId, tx);

    return restoredUser;
  });
}
