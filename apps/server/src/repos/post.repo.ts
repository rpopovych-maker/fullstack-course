import { and, asc, count, desc, eq, getTableColumns, gte, ilike, or, sql } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { IPostRepo } from 'src/types/post/IPostRepo';
import { PostSchema } from 'src/types/post/Post';
import { commentsTable, postsTable, usersTable } from 'src/services/drizzle/schema';
import { GetPostsResultSchema } from 'src/types/post/GetPostsResult';
import { PostWithAuthorSchema } from 'src/types/post/PostWithAuthor';

export function getPostRepo(db: NodePgDatabase): IPostRepo {
  return {
    async createPost(data) {
      const posts = await db.insert(postsTable).values(data).returning();
      return PostSchema.parse(posts[0]);
    },

    async updatePostById(postId, userId, data) {
      const posts = await db
        .update(postsTable)
        .set(data)
        .where(and(eq(postsTable.userId, userId), eq(postsTable.id, postId)))
        .returning();

      return posts.length > 0 ? PostSchema.parse(posts[0]) : null;
    },

    async getPostById(id: string) {
      const posts = await db
        .select({
          ...getTableColumns(postsTable),
          author: {
            id: usersTable.id,
            username: usersTable.username
          }
        })
        .from(postsTable)
        .innerJoin(usersTable, eq(postsTable.userId, usersTable.id))
        .where(eq(postsTable.id, id));

      return posts.length > 0 ? PostWithAuthorSchema.parse(posts[0]) : null;
    },

    async getPosts({ page, pageSize, search, orderBy, order, minCommentsCount }) {
      const offset = (page - 1) * pageSize;
      const commentsCount = count(commentsTable.id);

      const searchTerm = search?.trim();

      const searchCondition = searchTerm
        ? or(
          ilike(postsTable.title, `%${searchTerm}%`),
          ilike(postsTable.description, `%${searchTerm}%`),
          sql`${postsTable.title} % ${searchTerm}`,
          sql`${postsTable.description} % ${searchTerm}`
        )
        : undefined;

      const sortDirection = order === 'asc' ? asc : desc;

      const orderByColumn = orderBy === 'commentsCount'
        ? commentsCount
        : postsTable[orderBy || 'createdAt'];

      const searchRank = sql<number>`greatest(
        similarity(${postsTable.title}, ${searchTerm}),
        similarity(${postsTable.description}, ${searchTerm})
      )`;

      const sortExpressions = searchTerm && !orderBy
        ? [desc(searchRank)]
        : [sortDirection(orderByColumn)];

      if (orderBy !== 'createdAt') {
        sortExpressions.push(desc(postsTable.createdAt));
      }

      const commentsCountCondition = minCommentsCount !== undefined
        ? gte(commentsCount, minCommentsCount)
        : undefined;

      const matchingPosts = db
        .select({ id: postsTable.id })
        .from(postsTable)
        .innerJoin(usersTable, eq(postsTable.userId, usersTable.id))
        .leftJoin(commentsTable, eq(postsTable.id, commentsTable.postId))
        .where(searchCondition)
        .groupBy(postsTable.id)
        .having(commentsCountCondition)
        .as('matchingPosts');

      const postsQuery = db
        .select({
          ...getTableColumns(postsTable),
          author: {
            id: usersTable.id,
            username: usersTable.username
          },
          commentsCount: commentsCount.as('commentsCount')
        })
        .from(postsTable)
        .innerJoin(usersTable, eq(postsTable.userId, usersTable.id))
        .leftJoin(commentsTable, eq(postsTable.id, commentsTable.postId))
        .where(searchCondition)
        .groupBy(postsTable.id, usersTable.id)
        .having(commentsCountCondition)
        .orderBy(...sortExpressions)
        .limit(pageSize)
        .offset(offset);

      const totalQuery = db
        .select({
          total: count()
        })
        .from(matchingPosts);

      const [posts, totalResult] = await Promise.all([postsQuery, totalQuery]);
      const total = totalResult[0]?.total ?? 0;
      const totalPages = Math.ceil(total / pageSize);

      return GetPostsResultSchema.parse({
        data: posts,
        page,
        pageSize,
        total,
        totalPages
      });
    }
  };
}
