import { Comment } from './Comment';
import { CommentCursor } from './CommentCursor';
import { GetPostCommentsResult } from './GetPostCommentsResult';

export interface ICommentRepo {
  createComment(data: Pick<Comment, 'userId' | 'postId' | 'text'>): Promise<Comment>;
  updateCommentById(params: {
    commentId: string;
    postId: string;
    data: Partial<Pick<Comment, 'text'>>
  }): Promise<Comment | null>;
  getPostComments(params: {
    postId: string;
    cursor?: CommentCursor;
    pageSize: number
  }): Promise<GetPostCommentsResult>;
  getCommentOwner(commentId: string): Promise<string | null>;
}
