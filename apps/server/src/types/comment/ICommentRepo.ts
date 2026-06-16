import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Comment } from './Comment';
import { CommentCursor } from './CommentCursor';
import { CommentWithAuthor } from './CommentWithAuthor';
import { PaginationResponse } from 'src/types/PaginationResponse';

type CreateCommentData =
  Pick<Comment, 'userId' | 'postId' | 'text'> &
  Partial<Pick<Comment, 'id' | 'deletedAt' | 'createdAt' | 'updatedAt'>>;

export interface ICommentRepo {
  getCommentById(params: {
    commentId: string,
    postId: string,
    returnDeleted?: boolean
  }): Promise<Comment | null>;
  createComment(
    data: CreateCommentData,
    tx?: NodePgDatabase
  ): Promise<Comment>;
  createComments(
    data: CreateCommentData[],
    tx?: NodePgDatabase
  ): Promise<Comment[]>;
  updateCommentById(params: {
    commentId: string;
    postId: string;
    data: Partial<Pick<Comment, 'text'>>
  }): Promise<Comment | null>;
  getPostCommentsPaginated(params: {
    postId: string;
    cursor?: CommentCursor;
    pageSize: number
  }): Promise<{
    data: CommentWithAuthor[]
    nextCursor: CommentCursor | null
  }>;
  getCommentsByPostId(
    postId: string,
    returnDeleted?: boolean
  ): Promise<Comment[]>;
  getCommentsByUserId(
    userId: string,
    returnDeleted?: boolean
  ): Promise<Comment[]>;
  getSoftDeletedComments(params: {
    page: number
    pageSize: number
  }): Promise<PaginationResponse<Comment>>;
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
  restoreSoftDeletedCommentsByPostOwnerId(
    userId: string,
    deletedAt: Date,
    tx?: NodePgDatabase
  ): Promise<void>;
  restoreSoftDeletedCommentsByPostId(
    postId: string,
    deletedAt: Date,
    tx?: NodePgDatabase
  ): Promise<void>;
  restoreSoftDeletedComment(
    commentId: string,
    postId: string
  ): Promise<Comment | null>;
  deleteComment(params: {
    commentId: string,
    postId: string,
  }, tx?: NodePgDatabase): Promise<void>;
}
