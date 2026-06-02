import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { getPostRepo } from './post.repo';
import { getCommentRepo } from './comment.repo';
import { getUserRepo } from './user.repo';
import { getInviteRepo } from './invite.repo';
import { getTagsRepo } from './tags.repo';
import { getPostToTagRepo } from './post-to-tag.repo';

export function getRepos(db: NodePgDatabase) {
  return {
    postRepo: getPostRepo(db),
    commentRepo: getCommentRepo(db),
    userRepo: getUserRepo(db),
    inviteRepo: getInviteRepo(db),
    tagsRepo: getTagsRepo(db),
    postToTagRepo: getPostToTagRepo(db)
  };
}

export type IRepos = ReturnType<typeof getRepos>;
