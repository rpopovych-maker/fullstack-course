import { SortOrder } from 'src/types/SortOrder';
import { Post } from './Post';
import { GetPostsResult } from './GetPostsResult';
import { PostOrderBy } from './PostOrderBy';
import { PostWithAuthor } from './PostWithAuthor';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
export interface IPostRepo {
  createPost(
    data: Pick<Post, 'userId' | 'title' | 'description'>,
    tx?: NodePgDatabase
  ): Promise<Post>;
  updatePostById(
    postId: string,
    data: Partial<Pick<Post, 'title' | 'description'>>,
    tx?: NodePgDatabase
  ): Promise<Post | null>;
  getPostById(id: string, returnDeleted?: boolean): Promise<PostWithAuthor | null>;
  getPosts(params: {
    page: number,
    pageSize: number,
    search?: string,
    orderBy?: PostOrderBy,
    order?: SortOrder,
    tagIds?: string[],
    minCommentsCount?: number
  }): Promise<GetPostsResult>;
  getPostOwner(postId: string): Promise<string | null>;
  softDeletePostsByUserId(userId: string, deletedAt: Date, tx?: NodePgDatabase): Promise<void>
  softDeletePost(postId: string, deletedAt: Date, tx?: NodePgDatabase): Promise<Post | null>
  restoreSoftDeletedPostsByUserId(
    userId: string,
    deletedAt: Date,
    tx?: NodePgDatabase
  ): Promise<void>
  restoreSoftDeletedPost(
    postId: string,
    tx?: NodePgDatabase
  ): Promise<Post | null>
}
