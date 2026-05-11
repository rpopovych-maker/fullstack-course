import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { HealthMetrics } from 'src/types/HealthMetrics';
import { ITransactionManager } from 'src/types/ITransaction';

export function getDb(opts : {
  databaseUrl: string,
  logsEnabled: boolean
}) {
  const db = drizzle({
    casing: 'snake_case',
    logger: opts.logsEnabled,
    connection: {
      connectionString: opts.databaseUrl,
      ssl: false
    }
  });
  return db;
}

export async function dbHealthCheck(db: NodePgDatabase): Promise<HealthMetrics> {
  const healthMetric: HealthMetrics = {
    isOk: false,
    serviceName: 'postgres'
  };

  try {
    const res: {rows: {sum: number}[]} = await db.execute('select 1+1 as sum;');
    healthMetric.isOk = res.rows[0].sum === 2;
  } catch (error) {
    // Log the error instead of adding it to the response
    healthMetric.errorMessage = error;
  }
  return healthMetric;
}

export function getTransactionManager(db: NodePgDatabase): ITransactionManager {
  return {
    async execute(runnable) {
      return await db.transaction(async tx => {
        return await runnable({
          rollback: () => tx.rollback(),
          sharedTx: tx
        });
      });  
    }  
  };
}
