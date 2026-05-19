import { SortOrder } from 'src/types/SortOrder';
import { Post } from './Post';
import { GetPostsResult } from './GetPostsResult';
import { PostOrderBy } from './PostOrderBy';

export interface IPostRepo {
  createPost(data: Pick<Post, 'title' | 'description'>): Promise<Post>;
  updatePostById(
    id: string,
    data: Partial<Pick<Post, 'title' | 'description'>>
  ): Promise<Post | null>;
  getPostById(id: string): Promise<Post | null>;
  getPosts(params: {
    page: number;
    pageSize: number,
    search?: string,
    orderBy?: PostOrderBy,
    order?: SortOrder,
    minCommentsCount?: number
  }): Promise<GetPostsResult>;
}
