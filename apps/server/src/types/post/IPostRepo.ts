import { SortOrder } from 'src/types/SortOrder';
import { Post } from './Post';
import { GetPostsResult } from './GetPostsResult';
import { PostOrderBy } from './PostOrderBy';
import { PostWithAuthor } from './PostWithAuthor';

export interface IPostRepo {
  createPost(data: Pick<Post, 'userId' | 'title' | 'description'>): Promise<Post>;
  updatePostById(
    postId: string,
    data: Partial<Pick<Post, 'title' | 'description'>>
  ): Promise<Post | null>;
  getPostById(id: string): Promise<PostWithAuthor | null>;
  getPosts(params: {
    page: number,
    pageSize: number,
    search?: string,
    orderBy?: PostOrderBy,
    order?: SortOrder,
    minCommentsCount?: number
  }): Promise<GetPostsResult>;
  getPostOwner(postId: string): Promise<string | null>;
}
