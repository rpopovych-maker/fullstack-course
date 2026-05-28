import type { NodePgDatabase } from 'drizzle-orm/node-postgres';

export interface ITransactionManager {
  execute<T>(runnable: (ctx: {
    rollback: () => Promise<void>
    tx: NodePgDatabase
  }) => Promise<T>): Promise<T>
}