import { IRepos } from 'src/repos';
import { IUUIDService } from 'src/services/uuid';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { ITransactionManager } from './ITransaction';
import { IdentityService } from 'src/types/services/IdentityService';
import { User } from './user/User';
import { IdentityUser } from './identity/IdentityUser';

// set context type
declare module 'fastify' {
  interface FastifyInstance {
    uuid: IUUIDService;
    db: NodePgDatabase;
    repos: IRepos;
    transactionManager: ITransactionManager;
    identityService: IdentityService;
  }

  interface FastifyRequest {
    identityUser: IdentityUser;
    user: User;
  }

  interface FastifyContextConfig {
    skipAuth?: boolean;
    skipUserLookup?: boolean;
  }
}