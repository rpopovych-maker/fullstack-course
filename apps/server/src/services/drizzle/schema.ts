import { uuid, pgTable, varchar, timestamp, text, index, primaryKey, jsonb } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const usersTable = pgTable('users', {
  id: uuid().primaryKey().default(sql`uuid_generate_v4()`),
  subId: uuid().notNull().unique(),
  role: varchar({ length: 20 }).notNull(),
  email: text().notNull().unique(),
  username: varchar({ length: 255 }).notNull().unique(),
  bannedAt: timestamp(),
  deletedAt: timestamp(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().$onUpdate(() => new Date()).notNull()
}, (t) => [
  index('users_username_trgm_idx').using('gin', t.username.op('gin_trgm_ops')),
  index('users_email_trgm_idx').using('gin', t.email.op('gin_trgm_ops'))
]);

export const invitesTable = pgTable('invites', {
  id: uuid().primaryKey().default(sql`uuid_generate_v4()`),
  subId: uuid().notNull().unique(),
  email: text().notNull().unique(),
  status: varchar({ length: 20 }).notNull(),
  invitedByUserId: uuid().references(() => usersTable.id, { onDelete: 'set null' }),
  sentAt: timestamp().notNull(),
  resentAt: timestamp(),
  acceptedAt: timestamp(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().$onUpdate(() => new Date()).notNull()
}, (t) => [
  index('invites_email_trgm_idx').using('gin', t.email.op('gin_trgm_ops'))
]);

export const postsTable = pgTable('posts', {
  id: uuid().primaryKey().default(sql`uuid_generate_v4()`),
  userId: uuid().notNull().references(() => usersTable.id, { onDelete: 'cascade' }),
  title: varchar({ length: 255 }).notNull(),
  description: text(),
  deletedAt: timestamp(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().$onUpdate(() => new Date()).notNull()
}, (t) => [
  index('posts_title_trgm_idx').using('gin', t.title.op('gin_trgm_ops')),
  index('posts_description_trgm_idx').using('gin', t.description.op('gin_trgm_ops'))
]);

export const commentsTable = pgTable('comments', {
  id: uuid().primaryKey().default(sql`uuid_generate_v4()`),
  userId: uuid().notNull().references(() => usersTable.id, { onDelete: 'cascade' }),
  postId: uuid().notNull().references(() => postsTable.id, { onDelete: 'cascade' }),
  text: varchar({ length: 1000 }).notNull(),
  deletedAt: timestamp(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().$onUpdate(() => new Date()).notNull()
}, (t) => [
  index('comments_post_created_id_idx').on(t.postId, t.createdAt.desc(), t.id.asc())
]);

export const tagsTable = pgTable('tags', {
  id: uuid().primaryKey().default(sql`uuid_generate_v4()`),
  name: varchar({ length: 100 }).unique().notNull(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().$onUpdate(() => new Date()).notNull()
}, (t) => [
  index('tags_name_trgm_idx').using('gin', t.name.op('gin_trgm_ops'))
]);

export const postToTagTable = pgTable('post_tags', {
  postId: uuid().notNull().references(() => postsTable.id, { onDelete: 'cascade' }),
  tagId: uuid().notNull().references(() => tagsTable.id, { onDelete: 'cascade' }),
  createdAt: timestamp().defaultNow().notNull()
}, (t) => [
  primaryKey({ columns: [t.postId, t.tagId] })
]);

export const archivesTable = pgTable('archives', {
  id: uuid().primaryKey().default(sql`uuid_generate_v4()`),
  entityType: varchar({ length: 20 }).notNull(),
  originalEntityId: uuid().notNull().unique(),
  data: jsonb().notNull(),
  archivedAt: timestamp().defaultNow().notNull()
}, (t) => [
  index('archives_entity_idx').on(t.entityType, t.originalEntityId)
]);
