import { count, desc, eq, getTableColumns } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { IPostRepo } from 'src/types/post/IPostRepo';
import { PostSchema } from 'src/types/post/Post';
import { commentsTable, postsTable } from 'src/services/drizzle/schema';
import { PostWithCommentsCountSchema } from 'src/types/post/PostWithCommentsCount';
import { PostWithCommentsSchema } from 'src/types/post/PostWithComments';

export function getPostRepo(db: NodePgDatabase): IPostRepo {
  return {
    async createPost(data) {
      const posts = await db.insert(postsTable).values(data).returning();
      return PostSchema.parse(posts[0]);
    },

    async updatePostById(id, data) {
      const posts = await db.update(postsTable).set(data).where(eq(postsTable.id, id)).returning();

      return posts.length > 0 ? PostSchema.parse(posts[0]) : null;
    },

    async getPostById(id: string) {
      const posts = await db.select().from(postsTable).where(eq(postsTable.id, id));

      if (!posts.length) {
        return null;
      }

      const comments = await db.select().from(commentsTable).where(eq(commentsTable.postId, id));

      return PostWithCommentsSchema.parse({
        ...posts[0],
        comments
      });
    },

    async getPosts({ page, pageSize }) {
      const offset = (page - 1) * pageSize;

      const posts = await db
        .select({
          ...getTableColumns(postsTable),
          commentsCount: count(commentsTable.id).as('commentsCount')
        })
        .from(postsTable)
        .leftJoin(commentsTable, eq(postsTable.id, commentsTable.postId))
        .groupBy(postsTable.id)
        .orderBy(desc(postsTable.createdAt))
        .limit(pageSize)
        .offset(offset)
      
       return PostWithCommentsCountSchema.array().parse(posts);
    }
  };
}
