import { sql } from 'drizzle-orm';
import { SelectedFields } from 'drizzle-orm/pg-core';
import { SelectResultFields } from 'drizzle-orm/query-builders/select.types';

export function jsonBuildObject<T extends SelectedFields>(shape: T) {
  const entries = Object.entries(shape).flatMap(([key, value]) => [
    sql.raw(`'${key}'`),
    sql`${value}`
  ]);

  return sql<SelectResultFields<T>>`jsonb_build_object(${sql.join(entries, sql.raw(','))})`;
}

export function jsonAggBuildObject<T extends SelectedFields>(
  shape: T,
  idColumn: keyof T = 'id' as keyof T
) {
  return sql<SelectResultFields<T>[]>`coalesce(
    jsonb_agg(DISTINCT ${jsonBuildObject(shape)}) FILTER (WHERE ${shape[idColumn]} IS NOT NULL),
    '[]'::jsonb
  )`;
}
