import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { getPostRepo } from './post.repo';
import { getCommentRepo } from './comment.repo';
import { getUserRepo } from './user.repo';
import { getInviteRepo } from './invite.repo';
import { getTagsRepo } from './tags.repo';
import { getPostToTagRepo } from './post-to-tag.repo';
import { getArchiveRepo } from './archive.repo';
import { getSubscriptionRepo } from './subscription.repo';

export function getRepos(db: NodePgDatabase) {
  return {
    postRepo: getPostRepo(db),
    commentRepo: getCommentRepo(db),
    userRepo: getUserRepo(db),
    inviteRepo: getInviteRepo(db),
    tagsRepo: getTagsRepo(db),
    postToTagRepo: getPostToTagRepo(db),
    archiveRepo: getArchiveRepo(db),
    subscriptionRepo: getSubscriptionRepo(db)
  };
}

export type IRepos = ReturnType<typeof getRepos>;
