import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { ICommentRepo } from 'src/types/comment/ICommentRepo';
import { CommentSchema } from 'src/types/comment/Comment';
import { commentsTable } from 'src/services/drizzle/schema';

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

    async getPostComments(postId) {
      const comments = await db
        .select()
        .from(commentsTable)
        .where(eq(commentsTable.postId, postId));
      return CommentSchema.array().parse(comments);
    }
  };
}
