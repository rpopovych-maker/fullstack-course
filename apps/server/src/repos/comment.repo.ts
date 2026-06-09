import { and, asc, desc, eq, gt, or, lt, getTableColumns, isNull, inArray, isNotNull } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { ICommentRepo } from 'src/types/comment/ICommentRepo';
import { CommentSchema } from 'src/types/comment/Comment';
import { commentsTable, postsTable, usersTable } from 'src/services/drizzle/schema';
import { GetPostCommentsResultSchema } from 'src/types/comment/GetPostCommentsResult';

export function getCommentRepo(db: NodePgDatabase): ICommentRepo {
  return {
    async getCommentsByUserId(userId, returnDeleted) {
      const comments = await db
        .select(getTableColumns(commentsTable))
        .from(commentsTable)
        .where(
          and(
            eq(commentsTable.userId, userId),
            returnDeleted ? undefined : isNull(commentsTable.deletedAt)
          )
        );

      return CommentSchema.array().parse(comments);
    },

    async getCommentsByPostId(postId, returnDeleted) {
      const comments = await db
        .select(getTableColumns(commentsTable))
        .from(commentsTable)
        .where(
          and(
            eq(commentsTable.postId, postId),
            returnDeleted ? undefined : isNull(commentsTable.deletedAt)
          )
        );

      return CommentSchema.array().parse(comments);
    },

    async deleteComment({ commentId, postId }, tx) {
      await (tx ?? db)
        .delete(commentsTable)
        .where(
          and(
            eq(commentsTable.id, commentId),
            eq(commentsTable.postId, postId)
          )
        ); 
    },
    
    async restoreSoftDeletedComment(commentId, postId) {
      const comments = await db
        .update(commentsTable)
        .set({ deletedAt: null })
        .where(and(
          eq(commentsTable.id, commentId),
          eq(commentsTable.postId, postId),
          isNotNull(commentsTable.deletedAt)
        ))
        .returning();
      
      return comments.length > 0 ? CommentSchema.parse(comments[0]) : null;
    },

    async restoreSoftDeletedCommentsByPostId(postId, deletedAt, tx) {
      return (tx ?? db)
        .update(commentsTable)
        .set({ deletedAt: null })
        .where(
          and(
            eq(commentsTable.deletedAt, deletedAt),
            inArray(
              commentsTable.postId,
              db
                .select({ id: postsTable.id })
                .from(postsTable)
                .where(eq(postsTable.id, postId))
            )
          )
        );
    },

    async restoreSoftDeletedCommentsByPostOwnerId(userId, deletedAt, tx) {
      return (tx ?? db)
        .update(commentsTable)
        .set({ deletedAt: null })
        .where(
          and(
            eq(commentsTable.deletedAt, deletedAt),
            inArray(
              commentsTable.postId,
              db
                .select({ id: postsTable.id })
                .from(postsTable)
                .where(eq(postsTable.userId, userId))
            )
          )
        );
    },

    async softDeleteCommentsByPostOwnerId(userId, deletedAt, tx) {
      return (tx ?? db)
        .update(commentsTable)
        .set({ deletedAt })
        .where(
          and(
            isNull(commentsTable.deletedAt),
            inArray(
              commentsTable.postId,
              db
                .select({ id: postsTable.id })
                .from(postsTable)
                .where(eq(postsTable.userId, userId))
            )
          )
        );
    },

    async softDeleteCommentsByPostId(postId, deletedAt, tx) {
      return (tx ?? db)
        .update(commentsTable)
        .set({ deletedAt })
        .where(and(eq(commentsTable.postId, postId), isNull(commentsTable.deletedAt)));
    },

    async softDeleteComment({ commentId, postId, deletedAt }) {
      const comments = await db
        .update(commentsTable)
        .set({ deletedAt })
        .where(and(
          eq(commentsTable.id, commentId),
          eq(commentsTable.postId, postId),
          isNull(commentsTable.deletedAt)
        ))
        .returning();
      
      return comments.length > 0 ? CommentSchema.parse(comments[0]) : null;
    },

    async getCommentById({ commentId, postId, returnDeleted }) {
      const comments = await db
        .select(getTableColumns(commentsTable))
        .from(commentsTable)
        .where(and(
          eq(commentsTable.id, commentId),
          eq(commentsTable.postId, postId),
          returnDeleted ? undefined : isNull(commentsTable.deletedAt)
        ));

      return comments.length > 0 ? CommentSchema.parse(comments[0]) : null;
    },

    async getCommentOwner(commentId) { 
      const comments = await db
        .select({ userId: commentsTable.userId })
        .from(commentsTable)
        .where(and(eq(commentsTable.id, commentId), isNull(commentsTable.deletedAt)));

      return comments.length > 0 ? comments[0].userId : null;
    },
    
    async createComment(data, tx) {
      const comments = await (tx ?? db)
        .insert(commentsTable)
        .values(data)
        .returning();
      
      return CommentSchema.parse(comments[0]);
    },

    async updateCommentById({ commentId, postId, data }) {
      const comments = await db
        .update(commentsTable)
        .set(data)
        .where(and(
          eq(commentsTable.id, commentId),
          eq(commentsTable.postId, postId),
          isNull(commentsTable.deletedAt)
        ))
        .returning();

      return comments.length > 0 ? CommentSchema.parse(comments[0]) : null;
    },

    async getPostCommentsPaginated({ postId, cursor, pageSize }) {
      const comments = await db
        .select({
          ...getTableColumns(commentsTable),
          author: {
            id: usersTable.id,
            username: usersTable.username
          }
        })
        .from(commentsTable)
        .innerJoin(usersTable, eq(commentsTable.userId, usersTable.id))
        .where(
          and(
            eq(commentsTable.postId, postId),
            isNull(commentsTable.deletedAt),
            cursor
              ? or(
                lt(commentsTable.createdAt, cursor.createdAt),
                and(eq(commentsTable.createdAt, cursor.createdAt), gt(commentsTable.id, cursor.id))
              )
              : undefined
          ))
        .limit(pageSize + 1)
        .orderBy(desc(commentsTable.createdAt), asc(commentsTable.id));

      const data = comments.slice(0, pageSize);
      const hasNextPage = comments.length > pageSize;
      const lastComment = data[data.length - 1];

      return GetPostCommentsResultSchema.parse({
        data,
        nextCursor: hasNextPage && lastComment
          ? {
            id: lastComment.id,
            createdAt: lastComment.createdAt
          }
          : null
      });
    }
  };
}
