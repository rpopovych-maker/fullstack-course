import { Post } from './Post';
import { PostWithComments } from './PostWithComments';
import { PostWithCommentsCount } from './PostWithCommentsCount';

export interface IPostRepo {
  createPost(data: Pick<Post, 'title' | 'description'>): Promise<Post>;
  updatePostById(
    id: string,
    data: Partial<Pick<Post, 'title' | 'description'>>
  ): Promise<Post | null>;
  getPostById(id: string): Promise<PostWithComments | null>;
  getPosts(params: { page: number; pageSize: number }): Promise<PostWithCommentsCount[]>;
}
