import { NodePgDatabase } from 'drizzle-orm/node-postgres';
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
  softDeleteCommentsByPostOwnerId(
    userId: string,
    deletedAt: Date,
    tx?: NodePgDatabase
  ): Promise<void>;
  softDeleteCommentsByPostId(
    postId: string,
    deletedAt: Date,
    tx?: NodePgDatabase
  ): Promise<void>;
  softDeleteComment(params: {
    commentId: string,
    postId: string,
    deletedAt: Date
  }): Promise<Comment | null>;
}
