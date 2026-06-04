import { and, asc, count, countDistinct, desc, eq, getTableColumns, gte, ilike, inArray, isNull, or, sql } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { IPostRepo } from 'src/types/post/IPostRepo';
import { commentsTable, postsTable, postToTagTable, tagsTable, usersTable } from 'src/services/drizzle/schema';
import { GetPostsResultSchema } from 'src/types/post/GetPostsResult';
import { PostWithAuthorSchema } from 'src/types/post/PostWithAuthor';
import { Tag } from 'src/types/tag/Tag';
import { PostSchema } from 'src/types/post/Post';

export function getPostRepo(db: NodePgDatabase): IPostRepo {
  return {
    async softDeletePostsByUserId(userId, deletedAt, tx) {
      return (tx ?? db)
        .update(postsTable)
        .set({ deletedAt })
        .where(and(
          isNull(postsTable.deletedAt),
          eq(postsTable.userId, userId)
        ));
    },

    async softDeletePost(postId, deletedAt, tx) {
      const posts = await (tx ?? db)
        .update(postsTable)
        .set({ deletedAt })
        .where(and(eq(postsTable.id, postId), isNull(postsTable.deletedAt)))
        .returning();
      
      return posts.length > 0 ? PostSchema.parse(posts[0]) : null;
    },

    async getPostOwner(postId) {
      const posts = await db
        .select({ userId: postsTable.userId })
        .from(postsTable)
        .where(and(eq(postsTable.id, postId), isNull(postsTable.deletedAt)));

      return posts.length > 0 ? posts[0].userId : null;
    },

    async createPost(data, tx) {
      const [post] = await (tx ?? db)
        .insert(postsTable)
        .values(data)
        .returning();

      return PostSchema.parse(post);
    },

    async updatePostById(postId, data, tx) {
      const [post] = await (tx ?? db)
        .update(postsTable)
        .set(data)
        .where(and(eq(postsTable.id, postId), isNull(postsTable.deletedAt)))
        .returning();
      
      if (!post) {
        return null;
      }

      return PostSchema.parse(post);
    },

    async getPostById(id: string) {
      const [post] = await db
        .select({
          ...getTableColumns(postsTable),
          author: {
            id: usersTable.id,
            username: usersTable.username
          }
        })
        .from(postsTable)
        .innerJoin(usersTable, eq(postsTable.userId, usersTable.id))
        .where(and(eq(postsTable.id, id), isNull(postsTable.deletedAt)));
      
      if (!post) {
        return null;
      }
      
      const tags = await db
        .select(getTableColumns(tagsTable))
        .from(postToTagTable)
        .innerJoin(tagsTable, eq(tagsTable.id, postToTagTable.tagId))
        .where(eq(postToTagTable.postId, id));

      return PostWithAuthorSchema.parse({
        ...post,
        tags
      });
    },

    async getPosts({ page, pageSize, search, orderBy, order, minCommentsCount, tagIds }) {
      const offset = (page - 1) * pageSize;
      const commentsCount = countDistinct(commentsTable.id);

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
      
      const tagIdsCondition = tagIds?.length
        ? inArray(postToTagTable.tagId, tagIds)
        : undefined;

      const matchingPosts = db
        .select({ id: postsTable.id })
        .from(postsTable)
        .innerJoin(usersTable, eq(postsTable.userId, usersTable.id))
        .leftJoin(
          commentsTable,
          and(
            eq(postsTable.id, commentsTable.postId),
            isNull(commentsTable.deletedAt)
          )
        )
        .leftJoin(postToTagTable, eq(postToTagTable.postId, postsTable.id))
        .where(and(searchCondition, tagIdsCondition, isNull(postsTable.deletedAt)))
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
        .leftJoin(
          commentsTable,
          and(
            eq(postsTable.id, commentsTable.postId),
            isNull(commentsTable.deletedAt)
          )
        )
        .leftJoin(postToTagTable, eq(postToTagTable.postId, postsTable.id))
        .where(and(searchCondition, tagIdsCondition, isNull(postsTable.deletedAt)))
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

      const postIds = posts.map(p => p.id);

      const postTags = postIds.length
        ? await db
          .select({
            postId: postToTagTable.postId,
            tag: getTableColumns(tagsTable)
          })
          .from(postToTagTable)
          .innerJoin(tagsTable, eq(postToTagTable.tagId, tagsTable.id))
          .where(inArray(postToTagTable.postId, postIds))
        : [];
      
      const postTagsMap = new Map<string, Tag[]>();
      
      for (const postTag of postTags) {
        const tags = postTagsMap.get(postTag.postId) ?? [];
        tags.push(postTag.tag);
        postTagsMap.set(postTag.postId, tags);
      }

      const postWithTags = posts.map(p => ({
        ...p,
        tags: postTagsMap.get(p.id) ?? []
      }));

      const total = totalResult[0]?.total ?? 0;
      const totalPages = Math.ceil(total / pageSize);

      return GetPostsResultSchema.parse({
        data: postWithTags,
        page,
        pageSize,
        total,
        totalPages
      });
    }
  };
}
