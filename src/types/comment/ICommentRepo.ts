import { Comment } from './Comment';

export interface ICommentRepo {
  createComment(data: Pick<Comment, 'postId' | 'text'>): Promise<Comment>;
  updateCommentById(id: string, data: Partial<Pick<Comment, 'text'>>): Promise<Comment | null>;
  getPostComments(postId: string): Promise<Comment[]>;
}
