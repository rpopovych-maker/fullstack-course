import { and, asc, desc, eq, gt, or, lt } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { ICommentRepo } from 'src/types/comment/ICommentRepo';
import { CommentSchema } from 'src/types/comment/Comment';
import { commentsTable } from 'src/services/drizzle/schema';
import { GetPostCommentsResultSchema } from 'src/types/comment/GetPostCommentsResult';

export function getCommentRepo(db: NodePgDatabase): ICommentRepo {
  return {
    async createComment(data) {
      const comments = await db.insert(commentsTable).values(data).returning();
      return CommentSchema.parse(comments[0]);
    },

    async updateCommentById(id, data) {
      const comments = await db
        .update(commentsTable)
        .set(data)
        .where(eq(commentsTable.id, id))
        .returning();

      return comments.length > 0 ? CommentSchema.parse(comments[0]) : null;
    },

    async getPostComments({ postId, cursor, pageSize }) {
      const comments = await db
        .select()
        .from(commentsTable)
        .where(
          and(
            eq(commentsTable.postId, postId),
            cursor
              ? or(
                lt(commentsTable.createdAt, cursor.createdAt),
                and(eq(commentsTable.createdAt, cursor.createdAt), gt(commentsTable.id, cursor.id)),
              )
              : undefined,
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
