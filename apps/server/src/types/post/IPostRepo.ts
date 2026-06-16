import { SortOrder } from 'src/types/SortOrder';
import { Post } from './Post';
import { PostOrderBy } from './PostOrderBy';
import { PostWithAuthor } from './PostWithAuthor';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { PostWithCommentsAndTags } from './PostWithCommentsAndTags';
import { PostWithTags } from './PostWithTags';
import { PostWithCommentsCount } from './PostWithCommentsCount';
import { PaginationResponse } from 'src/types/PaginationResponse';
export interface IPostRepo {
  createPost(
    data: Pick<Post, 'userId' | 'title' | 'description'> &
      Partial<Pick<Post, 'id' | 'deletedAt' | 'createdAt' | 'updatedAt' | 'visibility'>>,
    tx?: NodePgDatabase
  ): Promise<Post>;
  createPosts(
    data: Array<
      Pick<Post, 'userId' | 'title' | 'description'> &
        Partial<Pick<Post, 'id' | 'deletedAt' | 'createdAt' | 'updatedAt' | 'visibility'>>
    >,
    tx?: NodePgDatabase
  ): Promise<Post[]>;
  updatePostById(
    postId: string,
    data: Partial<Pick<Post, 'title' | 'description' | 'visibility'>>,
    tx?: NodePgDatabase
  ): Promise<Post | null>;
  getPostById(
    id: string,
    returnDeleted?: boolean
  ): Promise<PostWithAuthor | null>;
  getExistingPostIds(ids: string[]): Promise<string[]>;
  getPostWithTagsById(
    id: string,
    returnDeleted?: boolean
  ): Promise<PostWithTags | null>;
  getPosts(params: {
    page: number,
    pageSize: number,
    search?: string,
    orderBy?: PostOrderBy,
    order?: SortOrder,
    tagIds?: string[],
    minCommentsCount?: number
  }): Promise<PaginationResponse<PostWithCommentsCount>>;
  getPostOwner(postId: string): Promise<string | null>;
  getPostsWithCommentsAndTagsByUserId(
    userId: string,
    returnDeleted?: boolean
  ): Promise<PostWithCommentsAndTags[]>;
  getSoftDeletedPosts(params: {
    page: number
    pageSize: number
  }): Promise<PaginationResponse<Post>>;
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
  deletePost(postId: string, tx?: NodePgDatabase): Promise<void>
}
