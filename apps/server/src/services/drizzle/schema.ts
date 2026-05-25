import { uuid, pgTable, varchar, timestamp, text, index } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const usersTable = pgTable('users', {
  id: uuid().primaryKey().default(sql`uuid_generate_v4()`),
  subId: uuid().notNull().unique(),
  role: varchar({ length: 20 }).notNull(),
  email: text().notNull().unique(),
  username: varchar({ length: 255 }).notNull().unique(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().$onUpdate(() => new Date()).notNull()
});

export const postsTable = pgTable('posts', {
  id: uuid()
    .primaryKey()
    .default(sql`uuid_generate_v4()`),
  userId: uuid()
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
  title: varchar({ length: 255 }).notNull(),
  description: text(),
  status: varchar({ length: 20 }),
  createdAt: timestamp().defaultNow(),
  updatedAt: timestamp()
    .defaultNow()
    .$onUpdate(() => new Date())
}, (t) => [
  index('posts_title_trgm_idx').using('gin', t.title.op('gin_trgm_ops')),
  index('posts_description_trgm_idx').using('gin', t.description.op('gin_trgm_ops'))
]);

export const commentsTable = pgTable('comments', {
  id: uuid()
    .primaryKey()
    .default(sql`uuid_generate_v4()`),
  userId: uuid()
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
  postId: uuid()
    .notNull()
    .references(() => postsTable.id, { onDelete: 'cascade' }),
  text: varchar({ length: 1000 }).notNull(),
  createdAt: timestamp().defaultNow(),
  updatedAt: timestamp()
    .defaultNow()
    .$onUpdate(() => new Date())
}, (t) => [
  index('comments_post_created_id_idx').on(
    t.postId,
    t.createdAt.desc(),
    t.id.asc()
  )
]);
